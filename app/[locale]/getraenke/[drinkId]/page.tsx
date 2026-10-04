import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
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
import { averageSugarPer100Ml, categoryPeers, dailySugarShare, dgeSugarConsensusUrl, lowSugarMaxPer100Ml, sugarFreeMaxPer100Ml, sugarLevel, swapAlternatives } from "@/lib/sugar-context";
import { scaleMax } from "@/lib/drink-summary";
import { SugarCubesGraphic } from "@/components/sugar-cubes-graphic";
import { SwapCalculator, type SwapOption } from "@/components/swap-calculator";
import { LevelBadge } from "@/components/ui/level-badge";
import { SugarScale } from "@/components/ui/sugar-scale";
import ui from "@/components/ui/ui.module.css";
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
  const categoryAverage = averageSugarPer100Ml(categoryPeers(drink));
  const comparison = comparisonLink(drink);
  const nextLinks = [
    knowledgeLink(drink),
    ...(comparison ? [comparison] : []),
    ...(categoryHref ? [{ href: categoryHref, label: `${categoryName} vergleichen` }] : []),
    ...(brandLink ? [brandLink] : []),
  ];

  return (
    <main className={ui.page}>
      <nav aria-label="Brotkrumen" className={ui.crumbs}>
        <Link href="/de">Startseite</Link><span aria-hidden="true">/</span>
        <Link href="/de/getraenke">Getränke</Link><span aria-hidden="true">/</span>
        {categoryHref ? <><Link href={categoryHref}>{categoryName}</Link><span aria-hidden="true">/</span></> : null}
        <span aria-current="page">{drink.name}</span>
      </nav>

      <section className={ui.factHero}>
        <div>
          <p className={styles.meta}>{brandName} · {categoryName} · {sizeLabel(drink)}</p>
          <h1 className={styles.title}>Wie viel Zucker hat {drink.name} in {sizeLabel(drink)}?</h1>
          <p className={ui.answer}>{answerText(drink)}</p>
          <p className={ui.heroSource}><LevelBadge level={sugarLevel(drink.sugarPer100Ml)} /><span>Quelle: {drink.source}</span></p>
        </div>
        <div className={ui.factCard}>
          <p>{sizeLabel(drink)}</p>
          <strong>{formatOptionalNumber(totalSugar)}<span>g Zucker</span></strong>
          <SugarCubesGraphic cubes={cubes} sizeMl={drink.sizeMl} className={styles.cubesGraphic} />
          <dl>
            <div><dt>pro 100 ml</dt><dd>{formatNumber(drink.sugarPer100Ml)} g</dd></div>
            <div><dt>Zuckerwürfel</dt><dd>{formatOptionalNumber(cubes)}</dd></div>
            <div><dt>Energie</dt><dd>{energy === null ? "/" : `${formatNumber(Math.round(energy))} kcal`}</dd></div>
          </dl>
          {dailyShare !== null && <p className={styles.dailyShare}>{dailyShare} % von 50 g, der DGE-Orientierung für freien Zucker am Tag</p>}
        </div>
      </section>

      {swapOptions.length > 0 && (
        <section className={ui.section} aria-labelledby="swap-title">
          <div className={ui.sectionHead}><h2 id="swap-title">Weniger Zucker, gleicher Geschmack</h2></div>
          <SwapCalculator drinkName={drink.name} sugarPer100Ml={drink.sugarPer100Ml} sizeMl={drink.sizeMl} options={swapOptions} />
        </section>
      )}

      <section className={ui.section} aria-labelledby="drink-facts-title">
        <div className={ui.sectionHead}><h2 id="drink-facts-title">Ist das viel?</h2></div>
        <div className={ui.card}>
          <SugarScale value={drink.sugarPer100Ml} average={categoryAverage} categoryName={categoryName} max={scaleMax()} freeMax={sugarFreeMaxPer100Ml} lowMax={lowSugarMaxPer100Ml} />
        </div>
        <DrinkFactsList facts={facts} isSugarFree={drink.sugarPer100Ml <= 0.5} categoryName={categoryName} categoryHref={categoryHref} />
      </section>

      {family.length > 1 && <PackageSizes drinks={family} currentId={drink.id} lead={sizesFact?.text ?? null} />}

      {isPublicDrink && editorial && (editorial.points.length > 0 || editorial.packageNote) && (
        <section className={ui.section} aria-labelledby="featured-editorial-title">
          <div className={ui.sectionHead}><h2 id="featured-editorial-title">Hinweise zum Wert</h2></div>
          {editorial.packageNote && <PackageNote note={editorial.packageNote} />}
          {editorial.points.length > 0 && (
            <div className={styles.points}>
              {editorial.points.map((point) => (
                <article key={point.title}>
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {isPublicDrink && editorial?.comparison && <FeaturedDrinkComparison comparison={editorial.comparison} currentDrinkId={drink.id} />}

      <section className={`${ui.section} ${ui.split}`}>
        {drink.nutritionPer100Ml ? (
          <div className={ui.label}>
            <h2>Nährwerte</h2>
            <p className={ui.labelSub}>pro 100 ml</p>
            <table>
              <tbody>
                <tr><th scope="row">Energie</th><td>{formatNumber(drink.nutritionPer100Ml.energyKj)} kJ / {formatNumber(drink.nutritionPer100Ml.energyKcal)} kcal</td></tr>
                <tr><th scope="row">Fett</th><td>{formatNumber(drink.nutritionPer100Ml.fat)} g</td></tr>
                <tr><th scope="row">Kohlenhydrate</th><td>{formatNumber(drink.nutritionPer100Ml.carbohydrates)} g</td></tr>
                <tr className={ui.labelStrong}><th scope="row">davon Zucker</th><td>{formatNumber(drink.sugarPer100Ml)} g</td></tr>
                <tr><th scope="row">Eiweiß</th><td>{formatNumber(drink.nutritionPer100Ml.protein)} g</td></tr>
                <tr><th scope="row">Salz</th><td>{formatNumber(drink.nutritionPer100Ml.salt)} g</td></tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className={ui.label}>
            <h2>Nährwerte</h2>
            <p className={ui.labelSub}>pro 100 ml</p>
            <table>
              <tbody>
                <tr className={ui.labelStrong}><th scope="row">Zucker</th><td>{formatNumber(drink.sugarPer100Ml)} g</td></tr>
              </tbody>
            </table>
          </div>
        )}
        <aside className={`${ui.card} ${ui.source}`} aria-labelledby="source-title">
          <h2 id="source-title">Quelle</h2>
          <p>{drink.source}</p>
          <dl>
            <div><dt>Status</dt><dd>{verificationLabel(drink.verificationStatus)}</dd></div>
            {drink.lastCheckedAt && <div><dt>Geprüft</dt><dd>{formatDate(drink.lastCheckedAt)}</dd></div>}
            {totalSugar !== null && drink.sizeMl && <div><dt>Rechenweg</dt><dd>{formatNumber(drink.sugarPer100Ml)} g × {drink.sizeMl} ml / 100 = {formatNumber(totalSugar)} g</dd></div>}
          </dl>
          <a href={drink.sourceUrl} target="_blank" rel="noreferrer">Quelle öffnen <ExternalLink size={14} aria-hidden="true" /></a>
          <a href={correctionMailto(`Wert prüfen: ${drink.name} ${sizeLabel(drink)}`)}>Wert falsch? Hinweis senden</a>
          <Link href="/de/ueber">So prüfen wir die Daten</Link>
        </aside>
      </section>

      {similar.length > 0 && (
        <section className={ui.section} aria-labelledby="similar-title">
          <div className={ui.sectionHead}>
            <h2 id="similar-title">Ähnlich viel Zucker</h2>
            {categoryHref && <Link href={categoryHref}>{categoryName} vergleichen <ArrowRight size={15} aria-hidden="true" /></Link>}
          </div>
          <ul className={`${ui.card} ${ui.compactList}`}>
            {similar.map((item) => (
              <li key={item.id}>
                <Link href={drinkPageHref(item)}>
                  <span><strong>{item.name}</strong><small>{brandById[item.brandId]?.name ?? "Marke"} · {sizeLabel(item)}</small></span>
                  <span className={ui.num}>{formatNumber(item.sugarPer100Ml)} g / 100 ml</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {isPublicDrink && faqs.length > 0 && (
        <section className={ui.section} aria-labelledby="faq-title">
          <div className={ui.sectionHead}><h2 id="faq-title">Fragen zu {drink.name}</h2></div>
          <div className={styles.faq}>
            {faqs.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
          </div>
        </section>
      )}

      <nav aria-label="Weiter vergleichen" className={ui.section}>
        <ul className={ui.chipList}>
          {nextLinks.map((link) => (
            <li key={link.href}><Link href={link.href}>{link.label} <ArrowRight size={14} aria-hidden="true" /></Link></li>
          ))}
        </ul>
      </nav>

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

function PackageSizes({ drinks, currentId, lead }: { drinks: Drink[]; currentId: string; lead: string | null }) {
  return (
    <section className={ui.section} aria-labelledby="package-sizes-title">
      <div className={ui.sectionHead}><h2 id="package-sizes-title">Zucker nach Packungsgröße</h2></div>
      {lead && <p className={ui.sectionLead}>{lead}</p>}
      <div className={`${ui.card} ${ui.tableWrap}`}>
        <table className={ui.table}>
          <thead>
            <tr>
              <th scope="col">Packung</th>
              <th scope="col" className={ui.num}>Zucker</th>
              <th scope="col" className={ui.num}>Würfel</th>
              <th scope="col" className={ui.num}>Energie</th>
            </tr>
          </thead>
          <tbody>
            {drinks.map((drink) => {
              const href = drinkPageHref(drink);
              const isCurrent = drink.id === currentId;
              const linksAway = !isCurrent && !href.includes("#");
              return (
                <tr key={drink.id} id={sizeAnchor(drink)} className={isCurrent ? ui.currentRow : styles.sizeRow} aria-current={isCurrent ? "true" : undefined}>
                  <th scope="row">{linksAway ? <Link href={href}>{sizeLabel(drink)}</Link> : sizeLabel(drink)}</th>
                  <td className={ui.num}>{formatOptionalGrams(totalSugarGrams(drink))}</td>
                  <td className={ui.num}>{formatOptionalNumber(sugarCubes(drink))}</td>
                  <td className={ui.num}>{formatOptionalKcal(packageEnergyKcal(drink))}</td>
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
    <section className={ui.section} aria-labelledby="featured-comparison-title">
      <div className={ui.sectionHead}><h2 id="featured-comparison-title">{comparison.title}</h2></div>
      <div className={`${ui.card} ${ui.tableWrap}`}>
        <table className={ui.table}>
          <thead>
            <tr>
              <th scope="col">Getränk</th>
              <th scope="col" className={ui.num}>pro 100 ml</th>
              <th scope="col" className={ui.num}>pro Packung</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isCurrent = canonicalPackageDrinkId(item) === currentDrinkId;
              return (
                <tr key={item.id} className={isCurrent ? ui.currentRow : undefined}>
                  <th scope="row">
                    {isCurrent
                      ? <span className={ui.tableName}><strong>{item.name}</strong><small>{brandById[item.brandId]?.name ?? "Marke"} · {sizeLabel(item)} · diese Seite</small></span>
                      : <Link href={drinkPageHref(item)} className={ui.tableName}><strong>{item.name}</strong><small>{brandById[item.brandId]?.name ?? "Marke"} · {sizeLabel(item)}</small></Link>}
                  </th>
                  <td className={ui.num}>{formatNumber(item.sugarPer100Ml)} g</td>
                  <td className={ui.num}>{formatOptionalGrams(totalSugarGrams(item))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PackageNote({ note }: { note: FeaturedDrinkPackageNote }) {
  return (
    <aside className={styles.packageNote} aria-label={note.label}>
      <div>
        <p>{note.label}</p>
        <strong>{note.value}</strong>
      </div>
      <div>
        <p>{note.text}</p>
        <a href={note.sourceUrl} target="_blank" rel="noreferrer">Herstellerangabe öffnen <ExternalLink size={14} aria-hidden="true" /></a>
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

function DrinkFactsList({ facts, isSugarFree, categoryName, categoryHref }: { facts: DrinkFact[]; isSugarFree: boolean; categoryName: string; categoryHref: string | null }) {
  const shown = facts.filter((fact) => fact.id !== "sizes");
  if (!shown.length) return null;
  const sweetenerLinkFact = shown.some((fact) => fact.id === "original") ? "original" : shown[0].id;

  return (
    <ul className={ui.contextList}>
      {shown.map((fact) => (
        <li key={fact.id}>
          <strong>{fact.label}</strong>
          <span>{fact.text}</span>
          <span className={styles.factLinks}>
            {fact.href && <Link href={fact.href}>{fact.linkLabel}</Link>}
            {fact.id === "category-rank" && categoryHref && <Link href={categoryHref}>{categoryName} vergleichen</Link>}
            {fact.id === "daily" && <a href={dgeSugarConsensusUrl} target="_blank" rel="noreferrer">DGE-Konsensuspapier <ExternalLink size={13} aria-hidden="true" /></a>}
            {isSugarFree && fact.id === sweetenerLinkFact && <Link href="/de/wissen/suessstoffe-aspartam-zuckerfreie-getraenke">Süßstoffe einordnen</Link>}
          </span>
        </li>
      ))}
    </ul>
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
  if (drink.categoryId === "energy") return { href: "/de/wissen/energy-drinks-zucker-vergleichen", label: "Zucker in Energy Drinks" };
  if (drink.categoryId === "cola" || drink.categoryId === "cola-mix") {
    return drink.sugarPer100Ml <= 0.5
      ? { href: "/de/wissen/cola-zero-light-und-klassisch", label: "Cola Zero oder Light" }
      : { href: "/de/wissen/cola-zucker-pro-100ml", label: "Zucker in Cola" };
  }
  if (drink.categoryId === "juice") return { href: "/de/wissen/saft-ist-nicht-automatisch-zuckerarm", label: "Zucker in Saft" };
  if (drink.categoryId === "iced-tea") return { href: "/de/wissen/eistee-zucker-im-alltag", label: "Zucker in Eistee" };
  if (drink.sugarPer100Ml <= 1) return { href: "/de/wissen/zuckerfreie-getraenke-in-der-datenbank", label: "Zuckerfreie Getränke" };
  return { href: "/de/wissen/zucker-pro-100ml-verstehen", label: "Zucker pro 100 ml einordnen" };
}

function comparisonLink(drink: Drink) {
  if (drink.brandId === "fanta" || drink.brandId === "sprite") return { href: "/de/vergleiche/fanta-vs-sprite-zucker", label: "Fanta und Sprite vergleichen" };
  if (drink.categoryId === "cola-mix") return { href: "/de/vergleiche/spezi-vs-mezzo-mix-zucker", label: "Spezi und Mezzo Mix vergleichen" };
  return null;
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
  return new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}
