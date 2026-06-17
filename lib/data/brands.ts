import seed from "./drinks.seed.json";

export type Brand = {
  id: string;
  name: string;
  note: string;
};

const brandNotes: Record<string, string> = {
  "coca-cola": "Cola und Varianten",
  "fanta": "Limonaden",
  "sprite": "Zitrone/Limette",
  "mezzo-mix": "Cola-Mix",
  "fuze-tea": "Eistee",
  "vio": "Limo und Schorle",
  "lift": "Schorlen",
  "red-bull": "Energy Drinks",
  "fritz-kola": "Kola, Limo und Schorle",
  "bionade": "Bio-Limonaden",
  "gaffel": "Fassbrause",
  "club-mate": "Mate",
  "pepsi": "Cola und Cola-Mix",
  "monster": "Energy Drinks",
  "effect": "Energy Drinks",
  "capri-sun": "Fruchtsaftgetränke",
  "hohes-c": "Säfte",
  "granini": "Säfte und Nektare",
  "valensina": "Säfte",
  "rockstar": "Energy Drinks",
  "mio-mio": "Mate und Limonaden",
  "almdudler": "Kräuterlimonaden",
  "lipton": "Eistees",
  "pfanner": "Eistees und Säfte",
  "arizona": "Eistees",
  "durstloescher": "Fruchtsaftgetränke",
  "orangina": "Orangenlimonaden",
  "chocomel": "Milchgetränke",
  "mueller": "Milchgetränke",
  "freeway": "Softdrinks",
  "ja": "Handelsmarke",
  "river": "Softdrinks",
  "paulaner": "Spezi und Limonaden",
  "goenrgy": "Energy Drinks",
  "afri": "Cola",
};

export const brands: Brand[] = seed.brands.map((brand) => ({
  ...brand,
  note: brandNotes[brand.id] ?? "Getränkemarke",
}));

export const brandById = Object.fromEntries(brands.map((brand) => [brand.id, brand]));
