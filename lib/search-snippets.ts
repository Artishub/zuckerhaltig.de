import { calculatePackageSugar, calculateSugarCubes, drinks, type Drink } from "@/lib/data/drinks";
import { lowSugarMaxPer100Ml, sugarFreeMaxPer100Ml } from "@/lib/sugar-context";

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

function perSize(item: Drink, ml: number) {
  return calculatePackageSugar(item.sugarPer100Ml, ml);
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

Object.assign(articleSnippets, {
  "cola-zucker-pro-100ml": () => {
    const cola = drink("coca-cola-classic-500");
    const liter = perSize(cola, 1000);
    return {
      title: `Cola Zucker: ${g(cola.sugarPer100Ml)} pro 100 ml, ${g(liter)} im Liter`,
      description: `Coca-Cola Classic hat ${g(cola.sugarPer100Ml)} Zucker pro 100 ml: ${g(perSize(cola, 330))} in der 330-ml-Dose, ${g(per500(cola))} in 0,5 l und ${g(liter)} im Liter, rund ${cubes(liter)} Zuckerwürfel.`,
      lead: `Coca-Cola Classic hat ${g(cola.sugarPer100Ml)} Zucker pro 100 ml. Eine 330-ml-Dose enthält ${g(perSize(cola, 330))}, eine 500-ml-Flasche ${g(per500(cola))} und ein Liter ${g(liter)}, das sind rund ${cubes(liter)} Zuckerwürfel.`,
    };
  },
  "zucker-pro-100ml-verstehen": () => {
    const cola = drink("coca-cola-classic-500");
    const fanta = drink("fanta-orange-500");
    return {
      title: `Zucker pro 100 ml: Was ist viel? Ab ${g(lowSugarMaxPer100Ml)} nicht zuckerarm`,
      description: `Bis ${g(sugarFreeMaxPer100Ml)} Zucker pro 100 ml gilt als zuckerfrei, bis ${g(lowSugarMaxPer100Ml)} als zuckerarm. Coca-Cola hat ${g(cola.sugarPer100Ml)}, Fanta Orange ${g(fanta.sugarPer100Ml)}. So vergleichst du Getränke.`,
      lead: `Bis ${g(sugarFreeMaxPer100Ml)} Zucker pro 100 ml darf ein Getränk „zuckerfrei“ heißen, bis ${g(lowSugarMaxPer100Ml)} „zuckerarm“. Coca-Cola Classic liegt bei ${g(cola.sugarPer100Ml)}, Fanta Orange bei ${g(fanta.sugarPer100Ml)}.`,
    };
  },
  "energy-drinks-zucker-vergleichen": () => {
    const redBull = drink("red-bull-energy-drink-250");
    const monster = drink("monster-energy-original-500");
    const ultra = drink("monster-ultra-white-500");
    return {
      title: `Energy Drink Zucker: Red Bull ${g(redBull.sugarPer100Ml)}, Monster ${g(monster.sugarPer100Ml)} pro 100 ml`,
      description: `Red Bull hat ${g(redBull.sugarPer100Ml)} Zucker pro 100 ml, die 250-ml-Dose ${g(perSize(redBull, 250))}. Monster Energy Original: ${g(monster.sugarPer100Ml)}, in 500 ml ${g(per500(monster))}. Monster Ultra White: ${g(ultra.sugarPer100Ml)}.`,
      lead: `Red Bull hat ${g(redBull.sugarPer100Ml)} Zucker pro 100 ml, in der 250-ml-Dose also ${g(perSize(redBull, 250))}. Monster Energy Original hat ${g(monster.sugarPer100Ml)}, die 500-ml-Dose ${g(per500(monster))}.`,
    };
  },
  "eistee-zucker-im-alltag": () => {
    const lipton = drink("lipton-ice-tea-zitrone-500");
    const fuze = drink("fuze-tea-pfirsich-330");
    return {
      title: `Eistee Zucker: Lipton Zitrone ${g(lipton.sugarPer100Ml)}, Fuze Tea ${g(fuze.sugarPer100Ml)} pro 100 ml`,
      description: `Lipton Ice Tea Zitrone hat ${g(lipton.sugarPer100Ml)} Zucker pro 100 ml, Fuze Tea Pfirsich ${g(fuze.sugarPer100Ml)}. Eine 1,5-l-Flasche Fuze Tea Pfirsich kommt so auf ${g(perSize(fuze, 1500))}.`,
      lead: `Lipton Ice Tea Zitrone hat ${g(lipton.sugarPer100Ml)} Zucker pro 100 ml, Fuze Tea Pfirsich ${g(fuze.sugarPer100Ml)}. In 500 ml sind das ${g(per500(lipton))} beziehungsweise ${g(per500(fuze))}.`,
    };
  },
  "saft-ist-nicht-automatisch-zuckerarm": () => {
    const juice = drink("hohes-c-orange-1000");
    const cola = drink("coca-cola-classic-500");
    return {
      title: `Saft und Zucker: Orangensaft ${g(juice.sugarPer100Ml)}, Cola ${g(cola.sugarPer100Ml)} pro 100 ml`,
      description: `hohes C Orange hat ${g(juice.sugarPer100Ml)} Zucker pro 100 ml, Coca-Cola ${g(cola.sugarPer100Ml)}. Ein 250-ml-Glas Orangensaft bringt ${g(perSize(juice, 250))} Zucker, so viel wie ${cubes(perSize(juice, 250))} Würfel.`,
      lead: `hohes C Orange hat ${g(juice.sugarPer100Ml)} Zucker pro 100 ml, Coca-Cola Classic ${g(cola.sugarPer100Ml)}. Ein 250-ml-Glas Orangensaft enthält damit ${g(perSize(juice, 250))} Zucker.`,
    };
  },
} satisfies Record<string, () => SearchSnippet>);

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

Object.assign(brandSnippets, {
  sprite: () => {
    const sprite = drink("sprite-500");
    const zero = drink("sprite-zero-sugar-330");
    return {
      title: `Sprite Zucker: ${g(sprite.sugarPer100Ml)} pro 100 ml, Sprite Zero ${g(zero.sugarPer100Ml)}`,
      description: `Sprite hat ${g(sprite.sugarPer100Ml)} Zucker pro 100 ml, eine 500-ml-Flasche ${g(per500(sprite))}, rund ${cubes(per500(sprite))} Zuckerwürfel. Sprite Zero Sugar: ${g(zero.sugarPer100Ml)}. Alle Sorten mit Quelle.`,
      lead: `Sprite hat ${g(sprite.sugarPer100Ml)} Zucker pro 100 ml, in einer 500-ml-Flasche sind das ${g(per500(sprite))}. Sprite Zero Sugar hat ${g(zero.sugarPer100Ml)}.`,
    };
  },
  paulaner: () => {
    const spezi = drink("paulaner-spezi-500");
    const zero = drink("paulaner-spezi-zero-500");
    return {
      title: `Paulaner Zucker: Spezi ${g(spezi.sugarPer100Ml)}, Spezi Zero ${g(zero.sugarPer100Ml)} pro 100 ml`,
      description: `Paulaner Spezi hat ${g(spezi.sugarPer100Ml)} Zucker pro 100 ml, eine 500-ml-Flasche ${g(per500(spezi))}. Spezi Zero: ${g(zero.sugarPer100Ml)}. Dazu Paulaner Limo und Cola mit Quelle.`,
      lead: `Paulaner Spezi hat ${g(spezi.sugarPer100Ml)} Zucker pro 100 ml, in einer 500-ml-Flasche sind das ${g(per500(spezi))}. Paulaner Spezi Zero liegt bei ${g(zero.sugarPer100Ml)}.`,
    };
  },
  "vita-cola": () => {
    const original = drink("vita-cola-original-1000");
    const pur = drink("vita-cola-pur-1000");
    const free = drink("vita-cola-original-zuckerfrei-1000");
    return {
      title: `Vita Cola Zucker: Original ${g(original.sugarPer100Ml)}, Pur ${g(pur.sugarPer100Ml)} pro 100 ml`,
      description: `VITA COLA Original hat ${g(original.sugarPer100Ml)} Zucker pro 100 ml, ein Liter ${g(perSize(original, 1000))}. VITA COLA Pur: ${g(pur.sugarPer100Ml)}, zuckerfrei: ${g(free.sugarPer100Ml)}. Alle Sorten mit Quelle.`,
      lead: `VITA COLA Original hat ${g(original.sugarPer100Ml)} Zucker pro 100 ml, eine 1-Liter-Flasche also ${g(perSize(original, 1000))}. VITA COLA Pur hat ${g(pur.sugarPer100Ml)}, die zuckerfreien Sorten ${g(free.sugarPer100Ml)}.`,
    };
  },
} satisfies Record<string, () => SearchSnippet>);

// Comparison pages already open with the answer; only the search snippet changes.
const comparisonSnippets: Record<string, () => SearchSnippet> = {
  "fanta-vs-sprite-zucker": () => {
    const fanta = drink("fanta-orange-500");
    const sprite = drink("sprite-500");
    return {
      title: `Fanta vs. Sprite: ${g(fanta.sugarPer100Ml)} und ${g(sprite.sugarPer100Ml)} Zucker pro 100 ml`,
      description: `Fanta Orange hat ${g(fanta.sugarPer100Ml)} Zucker pro 100 ml, Sprite ${g(sprite.sugarPer100Ml)}. In 500 ml sind das ${g(per500(fanta))} und ${g(per500(sprite))}. Alle Sorten beider Marken im Vergleich.`,
    };
  },
  "red-bull-vs-monster-zucker": () => {
    const redBull = drink("red-bull-energy-drink-250");
    const monster = drink("monster-energy-original-500");
    const same = redBull.sugarPer100Ml === monster.sugarPer100Ml;
    return {
      title: same
        ? `Red Bull vs. Monster: je ${g(redBull.sugarPer100Ml)} Zucker pro 100 ml`
        : `Red Bull vs. Monster: ${g(redBull.sugarPer100Ml)} und ${g(monster.sugarPer100Ml)} Zucker pro 100 ml`,
      description: `Red Bull hat ${g(redBull.sugarPer100Ml)} Zucker pro 100 ml, Monster Energy ${g(monster.sugarPer100Ml)}. Die 250-ml-Dose Red Bull hat ${g(perSize(redBull, 250))}, die 500-ml-Dose Monster ${g(per500(monster))}.`,
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
export const comparisonSnippet = (slug: string) => comparisonSnippets[slug]?.() ?? null;

export const snippetKeys = {
  articles: Object.keys(articleSnippets),
  brands: Object.keys(brandSnippets),
  drinks: Object.keys(drinkSnippets),
  comparisons: Object.keys(comparisonSnippets),
};
