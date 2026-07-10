import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type Options = {
  date: string;
  out: string;
  apiKey?: string;
  organizationId?: string;
  channelId?: string;
  publicBaseUrl?: string;
  limit?: number;
  dryRun: boolean;
  listChannels: boolean;
  queue: boolean;
  allowReposts: boolean;
};

type GeneratedPost = {
  filename: string;
  caption: string;
  drinkIds?: string[];
};

type BufferPostRecord = {
  filename: string;
  postId: string;
  channelId: string;
  imageUrl: string;
  createdAt: string;
  mode: "draft" | "queue";
};

const apiUrl = "https://api.buffer.com";

async function main() {
  await loadEnvFiles();

  const options = parseArgs(process.argv.slice(2));

  if (options.listChannels) {
    await listChannels(options);
    return;
  }

  const posts = await readGeneratedPosts(options.out);
  const publishedPath = path.join(options.out, "buffer-posts.json");
  const existing = await readBufferRecords(publishedPath);
  const done = new Set(existing.map((post) => post.filename));
  const selected = posts
    .filter((post) => options.allowReposts || !done.has(post.filename))
    .slice(0, options.limit ?? posts.length);

  if (!selected.length) {
    console.log("No new posts to send to Buffer.");
    return;
  }

  const publicBaseUrl = requireValue(options.publicBaseUrl, "SOCIAL_PUBLIC_BASE_URL oder --public-base-url fehlt.");
  const apiKey = options.dryRun ? undefined : requireValue(options.apiKey, "BUFFER_API_KEY oder --api-key fehlt.");
  const channelId = options.dryRun ? options.channelId : requireValue(options.channelId, "BUFFER_INSTAGRAM_CHANNEL_ID, BUFFER_CHANNEL_ID oder --channel fehlt.");

  const nextRecords: BufferPostRecord[] = [...existing];

  for (const post of selected) {
    const imageUrl = joinUrl(publicBaseUrl, post.filename);

    if (options.dryRun) {
      console.log(`[dry-run] ${post.filename}`);
      if (channelId) console.log(`channel: ${channelId}`);
      console.log(imageUrl);
      console.log(post.caption);
      continue;
    }

    const selectedChannelId = requireValue(channelId, "BUFFER_INSTAGRAM_CHANNEL_ID, BUFFER_CHANNEL_ID oder --channel fehlt.");
    const result = await createBufferPost({
      apiKey: requireValue(apiKey, "BUFFER_API_KEY oder --api-key fehlt."),
      channelId: selectedChannelId,
      text: post.caption,
      imageUrl,
      saveToDraft: !options.queue,
    });

    nextRecords.push({
      filename: post.filename,
      postId: result.post.id,
      channelId: selectedChannelId,
      imageUrl,
      createdAt: new Date().toISOString(),
      mode: options.queue ? "queue" : "draft",
    });

    console.log(`${options.queue ? "Queued" : "Drafted"} ${post.filename}: ${result.post.id}`);
  }

  if (!options.dryRun) {
    await writeJson(publishedPath, nextRecords);
  }
}

function parseArgs(args: string[]): Options {
  const date = today();
  const options: Options = {
    date,
    out: path.resolve("social", date),
    apiKey: process.env.BUFFER_API_KEY,
    organizationId: process.env.BUFFER_ORGANIZATION_ID,
    channelId: process.env.BUFFER_INSTAGRAM_CHANNEL_ID ?? process.env.BUFFER_CHANNEL_ID,
    publicBaseUrl: process.env.SOCIAL_PUBLIC_BASE_URL,
    dryRun: false,
    listChannels: false,
    queue: false,
    allowReposts: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (arg === "--list-channels") {
      options.listChannels = true;
      continue;
    }
    if (arg === "--queue") {
      options.queue = true;
      continue;
    }
    if (arg === "--allow-reposts") {
      options.allowReposts = true;
      continue;
    }

    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Fehlender Wert für ${arg}`);
    }

    if (arg === "--date") {
      options.date = value;
      options.out = path.resolve("social", value);
    } else if (arg === "--out") options.out = path.resolve(value);
    else if (arg === "--api-key") options.apiKey = value;
    else if (arg === "--organization") options.organizationId = value;
    else if (arg === "--channel") options.channelId = value;
    else if (arg === "--public-base-url") options.publicBaseUrl = value;
    else if (arg === "--limit") options.limit = parsePositiveInt(value, "--limit");
    else throw new Error(`Unbekannte Option: ${arg}`);

    index += 1;
  }

  if (options.publicBaseUrl) {
    options.publicBaseUrl = options.publicBaseUrl.replace("{date}", options.date);
  }

  return options;
}

async function listChannels(options: Options) {
  const apiKey = requireValue(options.apiKey, "BUFFER_API_KEY oder --api-key fehlt.");
  const organizationId = options.organizationId ?? await firstOrganizationId(apiKey);
  const data = await bufferGraphql<{
    channels: Array<{
      id: string;
      name: string;
      displayName: string;
      service: string;
      isQueuePaused: boolean;
    }>;
  }>(apiKey, `
    query GetChannels {
      channels(input: { organizationId: "${escapeGraphqlString(organizationId)}" }) {
        id
        name
        displayName
        service
        isQueuePaused
      }
    }
  `);

  for (const channel of data.channels) {
    console.log(`${channel.id} | ${channel.service} | ${channel.displayName || channel.name} | paused: ${channel.isQueuePaused}`);
  }
}

async function firstOrganizationId(apiKey: string) {
  const data = await bufferGraphql<{
    account: { organizations: Array<{ id: string; name: string }> };
  }>(apiKey, `
    query GetOrganizations {
      account {
        organizations {
          id
          name
        }
      }
    }
  `);

  const organization = data.account.organizations[0];
  if (!organization) {
    throw new Error("Kein Buffer-Workspace gefunden. Setze BUFFER_ORGANIZATION_ID manuell.");
  }

  return organization.id;
}

async function createBufferPost(input: {
  apiKey: string;
  channelId: string;
  text: string;
  imageUrl: string;
  saveToDraft: boolean;
}) {
  const data = await bufferGraphql<{
    createPost:
      | { post: { id: string; text: string }; message?: never }
      | { message: string; post?: never };
  }>(input.apiKey, `
    mutation CreatePost {
      createPost(
        input: {
          text: "${escapeGraphqlString(input.text)}"
          channelId: "${escapeGraphqlString(input.channelId)}"
          schedulingType: automatic
          mode: addToQueue
          saveToDraft: ${input.saveToDraft}
          source: "zuckerhaltig-social"
          aiAssisted: false
          assets: [
            {
              image: {
                url: "${escapeGraphqlString(input.imageUrl)}"
                metadata: {
                  altText: "Zucker-Check Infografik von Zuckerhaltig.de"
                  dimensions: { width: 1080, height: 1350 }
                }
              }
            }
          ]
        }
      ) {
        ... on PostActionSuccess {
          post {
            id
            text
          }
        }
        ... on MutationError {
          message
        }
      }
    }
  `);

  if ("message" in data.createPost) {
    throw new Error(data.createPost.message);
  }

  return data.createPost;
}

async function bufferGraphql<T>(apiKey: string, query: string) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const payload = await response.json() as { data?: T; errors?: Array<{ message: string }> };

  if (!response.ok) {
    throw new Error(`Buffer API HTTP ${response.status}`);
  }
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }
  if (!payload.data) {
    throw new Error("Buffer API returned no data.");
  }

  return payload.data;
}

async function readGeneratedPosts(outDir: string) {
  const postsPath = path.join(outDir, "posts.json");
  if (!existsSync(postsPath)) {
    throw new Error(`${postsPath} fehlt. Erst npm run social:generate ausführen.`);
  }

  return JSON.parse(await readFile(postsPath, "utf8")) as GeneratedPost[];
}

async function readBufferRecords(filePath: string) {
  if (!existsSync(filePath)) return [];
  return JSON.parse(await readFile(filePath, "utf8")) as BufferPostRecord[];
}

async function writeJson(filePath: string, value: unknown) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    const filePath = path.resolve(file);
    if (!existsSync(filePath)) continue;

    const content = await readFile(filePath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
    }
  }
}

function joinUrl(base: string, filename: string) {
  return `${base.replace(/\/+$/, "")}/${encodeURIComponent(filename)}`;
}

function today() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function parsePositiveInt(value: string, flag: string) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${flag} muss eine positive Zahl sein.`);
  }
  return parsed;
}

function requireValue(value: string | undefined, message: string) {
  if (!value) throw new Error(message);
  return value;
}

function escapeGraphqlString(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, "\\\"")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
