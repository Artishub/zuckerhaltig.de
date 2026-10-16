import { calculatePackageSugar, calculateSugarCubes, drinks, type Drink } from "@/lib/data/drinks";

// Search result title, meta description and opening sentence for pages with many impressions but few clicks
// (Search Console, 16.10.2026). Every number is read from the drink data, so the snippet stays correct when a value changes.

export type SearchSnippet = { title: string; description: string; lead?: string };

const number = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });
const g = (value: number) => `${number.format(value)} g`;

function drink(id: string): Drink {
  const found = drinks.find((item) => item.id === id);
  if (!found) throw new Error(`search-snippets: ${id} fehlt in den Daten`);
  return found;
}

function per500(item: Drink) {
  return calculatePackageSugar(item.sugarPer100Ml, 500);
}

function cubes(grams: number) {
  return Math.round(calculateSugarCubes(grams));
}

const articleSnippets: Record<string, () => SearchSnippet> = {
  "cola-zero-light-und-klassisch": () => {
    const zero = drink("coca-cola-zero-sugar-500");
    const light = drink("coca-cola-light-500");
    const classic = drink("coca-cola-classic-500");
    return {
      title: `Cola Zero: ${g(zero.sugarPer100Ml)} Zucker. Light und Classic im Vergleich`,
      description: `Coca-Cola Zero und Light haben ${g(zero.sugarPer100Ml)} Zucker pro 100 ml, Classic ${g(classic.sugarPer100Ml)}. In 500 ml Classic stecken ${g(per500(classic))}, rund ${cubes(per500(classic))} Zuckerwürfel.`,
      lead: `Coca-Cola Zero und Coca-Cola Light haben ${g(zero.sugarPer100Ml)} Zucker pro 100 ml${light.sugarPer100Ml === zero.sugarPer100Ml ? "" : ` und ${g(light.sugarPer100Ml)}`}. Coca-Cola Classic hat ${g(classic.sugarPer100Ml)}, eine 500-ml-Flasche also ${g(per500(classic))}.`,
    };
  },
  "bekannte-softdrinks-im-zuckervergleich": () => {
    const cola = drink("coca-cola-classic-500");
    const fanta = drink("fanta-orange-500");
    const sprite = drink("sprite-500");
    const spezi = drink("paulaner-spezi-500");
    const pepsi = drink("pepsi-500");
    return {
      title: `Zucker in Softdrinks: Cola ${g(cola.sugarPer100Ml)}, Fanta ${g(fanta.sugarPer100Ml)}, Sprite ${g(sprite.sugarPer100Ml)}`,
      description: `Pro 100 ml: Coca-Cola ${g(cola.sugarPer100Ml)}, Paulaner Spezi ${g(spezi.sugarPer100Ml)}, Sprite ${g(sprite.sugarPer100Ml)}, Fanta ${g(fanta.sugarPer100Ml)}, Pepsi ${g(pepsi.sugarPer100Ml)}. In 500 ml Cola stecken ${g(per500(cola))} Zucker.`,
      lead: `Pro 100 ml hat Coca-Cola ${g(cola.sugarPer100Ml)} Zucker, Paulaner Spezi ${g(spezi.sugarPer100Ml)}, Sprite ${g(sprite.sugarPer100Ml)}, Fanta Orange ${g(fanta.sugarPer100Ml)} und Pepsi ${g(pepsi.sugarPer100Ml)}. In einer 500-ml-Flasche Cola sind das ${g(per500(cola))}.`,
    };
  },
};

const brandSnippets: Record<string, () => SearchSnippet> = {
  fanta: () => {
    const orange = drink("fanta-orange-500");
    const free = drink("fanta-orange-ohne-zucker-500");
    return {
      title: `Fanta Zucker: Orange ${g(orange.sugarPer100Ml)}, ohne Zucker ${g(free.sugarPer100Ml)} pro 100 ml`,
      description: `Fanta Orange hat ${g(orange.sugarPer100Ml)} Zucker pro 100 ml, eine 500-ml-Flasche ${g(per500(orange))}. Fanta Orange ohne Zucker: ${g(free.sugarPer100Ml)}. Alle Sorten mit Packungsgröße und Quelle.`,
      lead: `Fanta Orange hat ${g(orange.sugarPer100Ml)} Zucker pro 100 ml, in einer 500-ml-Flasche sind das ${g(per500(orange))}. Fanta Orange ohne Zucker liegt bei ${g(free.sugarPer100Ml)}.`,
    };
  },
};

const drinkSnippets: Record<string, () => SearchSnippet> = {
  "spezi-original-500": () => {
    const spezi = drink("spezi-original-500");
    const paulaner = drink("paulaner-spezi-500");
    return {
      title: `Spezi Original: ${g(spezi.sugarPer100Ml)} Zucker pro 100 ml, ${g(per500(spezi))} in 0,5 l`,
      description: `Spezi Original hat ${g(spezi.sugarPer100Ml)} Zucker pro 100 ml, eine 500-ml-Flasche ${g(per500(spezi))}, rund ${cubes(per500(spezi))} Zuckerwürfel. Paulaner Spezi: ${g(paulaner.sugarPer100Ml)}. Quelle: ${spezi.source}.`,
    };
  },
};

export const articleSnippet = (slug: string) => articleSnippets[slug]?.() ?? null;
export const brandSnippet = (brandId: string) => brandSnippets[brandId]?.() ?? null;
export const drinkSnippet = (drinkId: string) => drinkSnippets[drinkId]?.() ?? null;

export const snippetKeys = {
  articles: Object.keys(articleSnippets),
  brands: Object.keys(brandSnippets),
  drinks: Object.keys(drinkSnippets),
};
