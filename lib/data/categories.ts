import seed from "./drinks.seed.json";

export type DrinkCategory = {
  id: string;
  name: string;
  description: string;
  color: string;
};

const categoryMeta: Record<string, Pick<DrinkCategory, "description" | "color">> = {
  "softdrink": {
    "description": "Kohlensäurehaltige Süßgetränke und Limonaden.",
    "color": "#1a1a1a"
  },
  "cola": {
    "description": "Cola-Klassiker, Varianten und zuckerfreie Rezepturen.",
    "color": "#1a1a1a"
  },
  "cola-mix": {
    "description": "Cola-Orangen-Mischgetränke.",
    "color": "#5c5045"
  },
  "orange-limo": {
    "description": "Orangenlimonaden und fruchtige Varianten.",
    "color": "#ffb84d"
  },
  "lemon-lime": {
    "description": "Zitrone-, Limette- und klare Limonaden.",
    "color": "#989898"
  },
  "iced-tea": {
    "description": "Eistees mit Zucker, Süßstoffen oder Fruchtgeschmack.",
    "color": "#6f6f6f"
  },
  "bio-limo": {
    "description": "Bio-Limonaden und natürliche Limo-Varianten.",
    "color": "#d89a2b"
  },
  "schorle": {
    "description": "Fruchtschorlen und verdünnte Saftgetränke.",
    "color": "#b18a44"
  },
  "energy": {
    "description": "Energy Drinks und koffeinhaltige Editionen.",
    "color": "#ffb84d"
  },
  "mate": {
    "description": "Mate-Getränke mit Koffein und Zucker.",
    "color": "#8f8f8f"
  },
  "fassbrause": {
    "description": "Fassbrausen und regionale Limonaden.",
    "color": "#a47c40"
  },
  "juice": {
    "description": "Säfte mit natürlichem Fruchtzucker.",
    "color": "#d89a2b"
  },
  "juice-drink": {
    "description": "Fruchtsaftgetränke und Trinkpäckchen.",
    "color": "#b18a44"
  },
  "milk-drink": {
    "description": "Milchmischgetränke, Kakao und trinkfertige Kaffeevarianten.",
    "color": "#8f8f8f"
  }
};

export const categories: DrinkCategory[] = seed.categories.map((category) => ({
  ...category,
  description: categoryMeta[category.id]?.description ?? "Getränkekategorie.",
  color: categoryMeta[category.id]?.color ?? "#838383",
}));

export const categoryById = Object.fromEntries(categories.map((category) => [category.id, category]));
