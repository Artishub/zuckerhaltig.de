import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Info } from "lucide-react";
import { categoryPageHref } from "@/lib/category-landing-pages";
import { featuredDrinkEditorial, type FeaturedDrinkComparison, type FeaturedDrinkPackageNote } from "@/lib/content/featured-drinks";
import { brandById } from "@/lib/data/brands";
import { categoryById } from "@/lib/data/categories";
import { canonicalPackageDrinkId, drinks, packageEnergyKcal, productFamilyDrinks, sugarCubes, totalSugarGrams, uniqueProductRepresentatives, type Drink } from "@/lib/data/drinks";
import { brandPageHref } from "@/lib/featured-brand-pages";
import { isSearchIndexableDrink, searchIndexableDrinkIds } from "@/lib/seo-index";
import { drinkPageHref, drinkRedirectTarget, removedDrinkRedirects, sizeAnchor } from "@/lib/page-routing";
import { correctionMailto, siteUrl } from "@/lib/site";
import { drinkFacts, type DrinkFact } from "@/lib/drink-facts";
import { dailySugarShare, dgeSugarConsensusUrl, swapAlternatives } from "@/lib/sugar-context";
import { SugarCubesGraphic } from "@/components/sugar-cubes-graphic";
import { SwapCalculator, type SwapOption } from "@/components/swap-calculator";
import styles from "./drink-detail.module.css";

type PageProps = {
  params: Promise<{ drinkId: string; locale: string }>;
};

export function generateStaticParams() {
  return searchIndexableDrinkIds.map((drinkId) => ({ drinkId }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { drinkId } = await params;
  const drink = drinks.find((item) => item.id === drinkId);

  if (!drink) {
    return { title: "Getränk nicht gefunden" };
  }

  const canonicalId = canonicalPackageDrinkId(drink);
  const canonicalDrink = drinks.find((item) => item.id === canonicalId) ?? drink;
  const brandName = brandById[canonicalDrink.brandId]?.name ?? "Unbekannte Marke";
  const family = productFamilyDrinks(canonicalDrink);
  const title = metaTitle(canonicalDrink);
  const description = metaDescription(canonicalDrink, brandName, family);
  const canonicalUrl = `${siteUrl}/de/getraenke/${canonicalId}`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `/de/getraenke/${canonicalId}`,
    },
    ...(!isSearchIndexableDrink(canonicalDrink) && {
      robots: {
        index: false,
        follow: true,
      },
    }),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Zuckerhaltig.de",
      locale: "de_DE",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function DrinkDetailPage({ params }: PageProps) {
  const { drinkId } = await params;
  const drink = drinks.find((item) => item.id === drinkId);

  if (!drink) {
    const removedTarget = removedDrinkRedirects[drinkId];
    if (removedTarget) permanentRedirect(removedTarget);
    notFound();
  }

  const canonicalId = canonicalPackageDrinkId(drink);
  // Duplicate ids jump straight to the final page (recipe page or size anchor), never through a chain.
  if (canonicalId !== drink.id) permanentRedirect(drinkPageHref(drink));
  const redirectTarget = drinkRedirectTarget(drink);
  if (redirectTarget) permanentRedirect(redirectTarget);

  const brandName = brandById[drink.brandId]?.name ?? "Unbekannte Marke";
  const categoryName = categoryById[drink.categoryId]?.name ?? "Getränk";
  const family = productFamilyDrinks(drink);
  const totalSugar = totalSugarGrams(drink);
  const cubes = sugarCubes(drink);
  const energy = packageEnergyKcal(drink);
  const editorial = featuredDrinkEditorial[drink.id];
  const isPublicDrink = isSearchIndexableDrink(drink);
  const similar = editorial ? [] : similarDrinks(drink);
  const faqs = isPublicDrink ? editorial?.faq ?? [] : [];
  const facts = drinkFacts(drink);
  const dailyShare = totalSugar !== null && drink.sugarPer100Ml > 0.5 && drink.categoryId !== "milk-drink" ? dailySugarShare(totalSugar) : null;
  const swapOptions: SwapOption[] = drink.sugarPer100Ml > 0.5 ? swapAlternatives(drink).map((item) => ({
    id: item.id,
    name: item.name,
    brand: brandById[item.brandId]?.name ?? "",
    sugarPer100Ml: item.sugarPer100Ml,
    href: drinkPageHref(item),
    compareHref: `/de/getraenke/vergleich?drinks=${drink.id},${canonicalPackageDrinkId(item)}`,
  })) : [];
  const sizesFact = facts.find((fact) => fact.id === "sizes");
  const brandHref = brandPageHref(drink.brandId);
  const brandLink = drink.id === "paulaner-spezi-500"
    ? { href: "/de/marken/spezi", label: "Spezi-Produkte vergleichen" }
    : brandHref
      ? { href: brandHref, label: `Alle ${brandName}-Getränke` }
      : null;
  const categoryHref = categoryPageHref(drink.categoryId);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-2 text-sm text-slate">
          <Link href="/de">Startseite</Link><span aria-hidden="true">/</span>
          <Link href="/de/getraenke">Getränke</Link><span aria-hidden="true">/</span>
          {categoryHref ? <><Link href={categoryHref}>{categoryName}</Link><span aria-hidden="true">/</span></> : null}
          <span aria-current="page">{drink.name}</span>
        </nav>
        <Link href="/de/getraenke" className={styles.back}><ArrowLeft size={16} /> Zur Getränkesuche</Link>
        <div className={styles.heroGrid}>
          <div>
            <p className={styles.category}>{categoryName} · {sizeLabel(drink)}</p>
            <h1>Wie viel Zucker hat {drink.name} in {sizeLabel(drink)}?</h1>
            <p className={styles.summary}>{answerText(drink)}</p>
            <p className={styles.sourceLine}><Info size={15} /> Quelle: {drink.source}</p>
          </div>
          <div className={styles.sugarPanel}>
            <p>{brandName}</p>
            <div><strong>{formatOptionalNumber(totalSugar)}</strong><span>g Zucker</span></div>
            <div className={styles.cubeSummary}>
              <p>pro {sizeLabel(drink)} · {formatOptionalNumber(cubes)} Zuckerwürfel</p>
              <SugarCubesGraphic cubes={cubes} sizeMl={drink.sizeMl} className={styles.cubesGraphic} />
              {dailyShare !== null && <p className={styles.dailyShare}>{dailyShare} % von 50 g, der DGE-Orientierung für freien Zucker am Tag</p>}
            </div>
          </div>
        </div>
      </section>

      {swapOptions.length > 0 && (
        <section className={styles.swap} aria-labelledby="swap-title">
          <div className={styles.swapLead}>
            <p className={styles.category}>Tauschen</p>
            <h2 id="swap-title">Weniger Zucker, gleicher Geschmack</h2>
          </div>
          <SwapCalculator drinkName={drink.name} sugarPer100Ml={drink.sugarPer100Ml} sizeMl={drink.sizeMl} options={swapOptions} />
        </section>
      )}

      <section className={styles.facts} aria-label={`Werte für ${drink.name}`}>
        <Nutrient label="Zucker pro 100 ml" value={`${formatNumber(drink.sugarPer100Ml)} g`} highlight />
        <Nutrient label={`Zucker pro ${sizeLabel(drink)}`} value={formatOptionalGrams(totalSugar)} highlight />
        <Nutrient label="Zuckerwürfel" value={formatOptionalNumber(cubes)} />
        <Nutrient label="Energie pro Packung" value={energy === null ? "/" : `${formatNumber(Math.round(energy))} kcal`} />
      </section>

      <DrinkFactsBlock facts={facts} isSugarFree={drink.sugarPer100Ml <= 0.5} categoryName={categoryName} categoryHref={categoryHref} />

      {family.length > 1 && <PackageSizes drinks={family} currentId={drink.id} lead={sizesFact?.text ?? null} />}

      {isPublicDrink && editorial && (
        <section className={styles.editorial} aria-labelledby="featured-editorial-title">
          <div className={styles.editorialLead}>
            <p className={styles.category}>Einordnung</p>
            <h2 id="featured-editorial-title">{editorial.title}</h2>
            <p>{editorial.intro}</p>
          </div>
          <div className={styles.editorialPoints}>
            {editorial.points.map((point) => (
              <article key={point.title}>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {isPublicDrink && editorial?.packageNote && <PackageNote note={editorial.packageNote} />}

      {isPublicDrink && editorial?.comparison && <FeaturedDrinkComparison comparison={editorial.comparison} currentDrinkId={drink.id} />}

      <section className={styles.contentGrid}>
        <div className={styles.nutrition}>
          <p className={styles.category}>Nährwerte</p>
          <h2>Pro 100 ml</h2>
          <div className={styles.nutrientGrid}>
            <Nutrient label="Energie" value={drink.nutritionPer100Ml ? `${formatNumber(drink.nutritionPer100Ml.energyKcal)} kcal / ${formatNumber(drink.nutritionPer100Ml.energyKj)} kJ` : "/"} />
            <Nutrient label="Kohlenhydrate" value={drink.nutritionPer100Ml ? `${formatNumber(drink.nutritionPer100Ml.carbohydrates)} g` : "/"} />
            <Nutrient label="davon Zucker" value={`${formatNumber(drink.sugarPer100Ml)} g`} />
            <Nutrient label="Fett" value={drink.nutritionPer100Ml ? `${formatNumber(drink.nutritionPer100Ml.fat)} g` : "/"} />
            <Nutrient label="Eiweiß" value={drink.nutritionPer100Ml ? `${formatNumber(drink.nutritionPer100Ml.protein)} g` : "/"} />
            <Nutrient label="Salz" value={drink.nutritionPer100Ml ? `${formatNumber(drink.nutritionPer100Ml.salt)} g` : "/"} />
          </div>
        </div>
        <aside className={styles.sourceCard}>
          <p className={styles.category}>Datenquelle</p>
          <h2>Nachprüfbar.</h2>
          <p>{drink.source}</p>
          {totalSugar !== null && drink.sizeMl && (
            <p className={styles.formula}><strong>Rechenweg:</strong> {formatNumber(drink.sugarPer100Ml)} g × {drink.sizeMl} ml / 100 = {formatNumber(totalSugar)} g Zucker</p>
          )}
          <p className={styles.checked}>
            {verificationLabel(drink.verificationStatus)}
            {drink.lastCheckedAt ? ` · Zuletzt geprüft: ${formatDate(drink.lastCheckedAt)}` : ""}
          </p>
          <a href={drink.sourceUrl} target="_blank" rel="noreferrer">Quelle öffnen <ExternalLink size={16} /></a>
          <a href={correctionMailto(`Wert prüfen: ${drink.name} ${sizeLabel(drink)}`)}>Wert falsch? Hinweis senden <ArrowRight size={16} /></a>
          <Link href="/de/ueber" className={styles.knowledge}>So prüfen wir die Daten <ArrowRight size={16} /></Link>
        </aside>
      </section>

      {similar.length > 0 && (
        <section className={styles.compare}>
          <div><h2>Ähnliche Getränke.</h2></div>
          <div className={styles.related}>
            {similar.map((item) => {
              const similarBrand = brandById[item.brandId]?.name ?? "Marke";
              return <Link key={item.id} href={drinkPageHref(item)}><span>{similarBrand}</span><strong>{item.name.replace(`${similarBrand} `, "")}</strong><b>{formatNumber(item.sugarPer100Ml)} g / 100 ml</b><ArrowRight size={16} /></Link>;
            })}
          </div>
        </section>
      )}

      {!isPublicDrink && (
        <nav aria-label="Weiter vergleichen" className={styles.nextLinks}>
          <Link href="/de/getraenke" className={styles.knowledge}>Alle Getränke vergleichen <ArrowRight size={16} /></Link>
          {categoryHref && <Link href={categoryHref} className={styles.knowledge}>{categoryName} vergleichen <ArrowRight size={16} /></Link>}
          {brandLink && <Link href={brandLink.href} className={styles.knowledge}>{brandLink.label} <ArrowRight size={16} /></Link>}
        </nav>
      )}

      {isPublicDrink && <section className={styles.faq}>
        <p className={styles.category}>Fragen und Antworten</p>
        <h2>FAQ zu {drink.name}</h2>
        <div>
          {faqs.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
        </div>
        <div className={styles.knowledgeLinks}>
          <Link href={knowledgeLink(drink)} className={styles.knowledge}>Passendes Wissen lesen <ArrowRight size={16} /></Link>
          {comparisonLink(drink) && <Link href={comparisonLink(drink)!} className={styles.knowledge}>Fanta und Sprite vergleichen <ArrowRight size={16} /></Link>}
          {categoryHref && <Link href={categoryHref} className={styles.knowledge}>{categoryName} vergleichen <ArrowRight size={16} /></Link>}
          {brandLink && <Link href={brandLink.href} className={styles.knowledge}>{brandLink.label} <ArrowRight size={16} /></Link>}
        </div>
      </section>}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd(drink),
            ...(isPublicDrink ? [productJsonLd(drink, brandName, categoryName)] : []),
          ]),
        }}
      />
    </main>
  );
}

function Nutrient({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-md border border-ash bg-paper p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate">{label}</p>
      <p className={`mt-2 tabular-nums ${highlight ? "text-2xl font-semibold" : "text-lg font-semibold"}`}>{value}</p>
    </div>
  );
}

function PackageSizes({ drinks, currentId, lead }: { drinks: Drink[]; currentId: string; lead: string | null }) {
  return (
    <section className={styles.packages} aria-labelledby="package-sizes-title">
      <div>
        <h2 id="package-sizes-title">Zucker nach Packungsgröße</h2>
        {lead && <p>{lead}</p>}
      </div>
      <div className={styles.sizeTableWrap}>
        <table className={styles.sizeTable}>
          <thead>
            <tr>
              <th scope="col">Packung</th>
              <th scope="col">Zucker</th>
              <th scope="col">Würfel</th>
              <th scope="col">Energie</th>
            </tr>
          </thead>
          <tbody>
            {drinks.map((drink) => {
              const href = drinkPageHref(drink);
              const isCurrent = drink.id === currentId;
              const linksAway = !isCurrent && !href.includes("#");
              return (
                <tr key={drink.id} id={sizeAnchor(drink)} className={isCurrent ? styles.sizeCurrent : undefined} aria-current={isCurrent ? "true" : undefined}>
                  <th scope="row">
                    {linksAway ? <Link href={href} className="underline decoration-ash underline-offset-4 hover:decoration-marigold">{sizeLabel(drink)}</Link> : sizeLabel(drink)}
                  </th>
                  <td>{formatOptionalGrams(totalSugarGrams(drink))}</td>
                  <td>{formatOptionalNumber(sugarCubes(drink))}</td>
                  <td>{formatOptionalKcal(packageEnergyKcal(drink))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FeaturedDrinkComparison({ comparison, currentDrinkId }: { comparison: FeaturedDrinkComparison; currentDrinkId: string }) {
  const items = comparison.drinkIds
    .map((id) => drinks.find((drink) => drink.id === id))
    .filter((drink): drink is Drink => Boolean(drink))
    .filter((drink, index, all) => all.findIndex((item) => canonicalPackageDrinkId(item) === canonicalPackageDrinkId(drink)) === index);

  if (!items.length) return null;

  return (
    <section className={styles.editorialComparison} aria-labelledby="featured-comparison-title">
      <div className={styles.editorialComparisonLead}>
        <p className={styles.category}>Direkter Vergleich</p>
        <h2 id="featured-comparison-title">{comparison.title}</h2>
        <p>{comparison.intro}</p>
      </div>
      <ul className={styles.editorialComparisonGrid}>
        {items.map((item) => {
          const itemBrand = brandById[item.brandId]?.name ?? "Marke";
          const isCurrent = canonicalPackageDrinkId(item) === currentDrinkId;
          return (
            <li key={item.id} className={isCurrent ? styles.editorialComparisonCardCurrent : styles.editorialComparisonCard}>
              <div>
                <p className={styles.category}>{itemBrand} · {sizeLabel(item)}</p>
                <h3><Link href={drinkPageHref(item)}>{item.name}</Link></h3>
                {isCurrent && <span className={styles.currentLabel}>Diese Seite</span>}
              </div>
              <dl className={styles.editorialComparisonFacts}>
                <div><dt>Zucker / 100 ml</dt><dd>{formatNumber(item.sugarPer100Ml)} g</dd></div>
                <div><dt>Pro Packung</dt><dd>{formatOptionalGrams(totalSugarGrams(item))}</dd></div>
              </dl>
              <Link href={drinkPageHref(item)} className={styles.editorialComparisonLink}>Details <ArrowRight size={15} /></Link>
            </li>
          );
        })}
      </ul>
      {comparison.note && <p className={styles.editorialComparisonNote}>{comparison.note}</p>}
    </section>
  );
}

function PackageNote({ note }: { note: FeaturedDrinkPackageNote }) {
  return (
    <aside className={styles.packageNote} aria-label={note.label}>
      <div>
        <p className={styles.category}>{note.label}</p>
        <p className={styles.packageNoteValue}>{note.value}</p>
      </div>
      <div>
        <p>{note.text}</p>
        <a href={note.sourceUrl} target="_blank" rel="noreferrer">Herstellerangabe öffnen <ExternalLink size={15} /></a>
      </div>
    </aside>
  );
}

function similarDrinks(drink: Drink) {
  const currentCanonicalId = canonicalPackageDrinkId(drink);

  return uniqueProductRepresentatives(
    drinks.filter((item) => (
      item.categoryId === drink.categoryId &&
      canonicalPackageDrinkId(item) !== currentCanonicalId &&
      item.name !== drink.name
    )),
  )
    .sort((a, b) => Math.abs(a.sugarPer100Ml - drink.sugarPer100Ml) - Math.abs(b.sugarPer100Ml - drink.sugarPer100Ml))
    .slice(0, 4);
}


function metaTitle(drink: Drink) {
  const sugar = `${formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml`;
  if (priorityProductIds.has(drink.id)) return `${shortenTitleName(drink.name)}: ${sugar} (${sizeLabel(drink)})`;
  return `${shortenTitleName(drink.name)} ${sizeLabel(drink)}: ${sugar}`;
}

const priorityProductIds = new Set([
  "coca-cola-classic-500",
  "fanta-orange-500",
  "paulaner-spezi-500",
  "sprite-500",
  "red-bull-energy-drink-250",
]);

function metaDescription(drink: Drink, brandName: string, family: Drink[]) {
  const totalSugar = totalSugarGrams(drink);
  const packagePart = drink.sizeMl && totalSugar !== null
    ? ` In ${drink.sizeMl} ml stecken rechnerisch ${formatNumber(totalSugar)} g.`
    : "";
  const familyPart = family.length > 1 ? ` Vergleiche ${family.length} Packungsgrößen.` : "";
  const editorial = featuredDrinkEditorial[drink.id];
  if (editorial) return `${editorial.metaDescription} Quelle: ${drink.source}.`;
  return `${drink.name} von ${brandName} enthält ${formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml.${packagePart}${familyPart} Mit Nährwerten und Zuckerwürfeln. Quelle: ${drink.source}.`;
}

function shortenTitleName(name: string) {
  const normalized = name
    .replace(/\bThe\s+/gi, "")
    .replace(/\bEnergy Drink\b/gi, "Energy")
    .replace(/\bohne Zucker\b/gi, "Zero")
    .replace(/\bZero Sugar\b/gi, "Zero")
    .replace(/\s+/g, " ")
    .trim();
  const maxNameLength = 38;
  if (normalized.length <= maxNameLength) return normalized;
  const shortened = normalized.slice(0, maxNameLength + 1).trim();
  const wordBoundary = shortened.lastIndexOf(" ");
  return wordBoundary >= 22 ? shortened.slice(0, wordBoundary) : shortened.slice(0, maxNameLength);
}

function answerText(drink: Drink) {
  const totalSugar = totalSugarGrams(drink);
  const cubes = sugarCubes(drink);
  const answer = `${drink.name} hat ${formatNumber(drink.sugarPer100Ml)} g Zucker pro 100 ml.`;
  if (totalSugar === null || cubes === null || !drink.sizeMl) return answer;
  return `${answer} Eine ${drink.sizeMl}-ml-Packung enthält ${formatNumber(totalSugar)} g Zucker, das sind etwa ${formatNumber(cubes)} Zuckerwürfel.`;
}

function DrinkFactsBlock({ facts, isSugarFree, categoryName, categoryHref }: { facts: DrinkFact[]; isSugarFree: boolean; categoryName: string; categoryHref: string | null }) {
  const shown = facts.filter((fact) => fact.id !== "sizes");
  if (!shown.length) return null;
  const sweetenerLinkFact = shown.some((fact) => fact.id === "original") ? "original" : shown[0].id;

  return (
    <section className={styles.context} aria-labelledby="drink-facts-title">
      <div className={styles.contextLead}>
        <p className={styles.category}>Einordnung</p>
        <h2 id="drink-facts-title">Wie viel ist das?</h2>
      </div>
      <div className={styles.contextGrid}>
        {shown.map((fact) => (
          <article key={fact.id}>
            <h3>{fact.label}</h3>
            <p>{fact.text}</p>
            {fact.href && <Link href={fact.href}>{fact.linkLabel} <ArrowRight size={15} /></Link>}
            {fact.id === "category-rank" && categoryHref && <Link href={categoryHref}>{categoryName} vergleichen <ArrowRight size={15} /></Link>}
            {fact.id === "daily" && <a href={dgeSugarConsensusUrl} target="_blank" rel="noreferrer">Konsensuspapier der DGE öffnen <ExternalLink size={15} /></a>}
            {isSugarFree && fact.id === sweetenerLinkFact && <Link href="/de/wissen/suessstoffe-aspartam-zuckerfreie-getraenke">Süßstoffe einordnen <ArrowRight size={15} /></Link>}
          </article>
        ))}
      </div>
    </section>
  );
}

function verificationLabel(status: Drink["verificationStatus"]) {
  if (status === "manufacturer_verified") return "Herstellerangabe geprüft";
  if (status === "retailer_verified") return "Händlerangabe geprüft";
  if (status === "manufacturer_or_retailer_verified") return "Hersteller- oder Händlerangabe geprüft";
  if (status === "manufacturer_verified_needs_field_check") return "Herstellerquelle, einzelne Felder offen";
  if (status === "needs_label_check") return "Quelle vorhanden, Etikett noch prüfen";
  return "Importquelle, noch nicht verifiziert";
}

function knowledgeLink(drink: Drink) {
  if (drink.categoryId === "energy") return "/de/wissen/energy-drinks-zucker-vergleichen";
  if (drink.categoryId === "cola" || drink.categoryId === "cola-mix") {
    return drink.sugarPer100Ml <= 0.5
      ? "/de/wissen/cola-zero-light-und-klassisch"
      : "/de/wissen/cola-zucker-pro-100ml";
  }
  if (drink.categoryId === "juice") return "/de/wissen/saft-ist-nicht-automatisch-zuckerarm";
  if (drink.categoryId === "iced-tea") return "/de/wissen/eistee-zucker-im-alltag";
  if (drink.sugarPer100Ml <= 1) return "/de/wissen/zuckerfreie-getraenke-in-der-datenbank";
  return "/de/wissen/zucker-pro-100ml-verstehen";
}

function comparisonLink(drink: Drink) {
  return drink.brandId === "fanta" || drink.brandId === "sprite"
    ? "/de/vergleiche/fanta-vs-sprite-zucker"
    : null;
}

function breadcrumbJsonLd(drink: Drink) {
  const category = categoryById[drink.categoryId];
  const categoryHref = categoryPageHref(drink.categoryId);
  const crumbs = [
    { name: "Startseite", item: `${siteUrl}/de` },
    { name: "Getränke", item: `${siteUrl}/de/getraenke` },
    ...(category && categoryHref ? [{ name: category.name, item: `${siteUrl}${categoryHref}` }] : []),
    { name: `${drink.name} ${sizeLabel(drink)}`, item: `${siteUrl}/de/getraenke/${canonicalPackageDrinkId(drink)}` },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      ...crumb,
    })),
  };
}

function productJsonLd(drink: Drink, brandName: string, categoryName: string) {
  const properties = [
    {
      "@type": "PropertyValue",
      name: "Zucker pro 100 ml",
      value: `${formatNumber(drink.sugarPer100Ml)} g`,
    },
    ...(drink.sizeMl && totalSugarGrams(drink) !== null ? [{
      "@type": "PropertyValue",
      name: "Zucker pro Packung",
      value: `${formatNumber(totalSugarGrams(drink)!)} g`,
    }] : []),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${drink.name} ${sizeLabel(drink)}`,
    description: metaDescription(drink, brandName, productFamilyDrinks(drink)),
    category: categoryName,
    brand: { "@type": "Brand", name: brandName },
    url: `${siteUrl}/de/getraenke/${canonicalPackageDrinkId(drink)}`,
    additionalProperty: properties,
  };
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value);
}

function formatOptionalNumber(value: number | null) {
  return value === null ? "/" : formatNumber(value);
}

function formatOptionalKcal(value: number | null) {
  return value === null ? "/" : `${formatNumber(Math.round(value))} kcal`;
}

function formatOptionalGrams(value: number | null) {
  return value === null ? "/" : `${formatNumber(value)} g`;
}

function sizeLabel(drink: Drink) {
  return drink.sizeMl ? `${drink.sizeMl} ml` : "/";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE").format(new Date(value));
}
