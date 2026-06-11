import seed from "./drinks.seed.json";

export type Brand = {
  id: string;
  name: string;
  note: string;
  logoUrl: string;
};

const brandMeta: Record<string, Pick<Brand, "note" | "logoUrl">> = {
  "coca-cola": {
    "note": "Cola und Varianten",
    "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg"
  },
  "fanta": {
    "note": "Limonaden",
    "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c2/Fanta_2023.svg"
  },
  "sprite": {
    "note": "Zitrone/Limette",
    "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Sprite_2022.svg"
  },
  "mezzo-mix": {
    "note": "Cola-Mix",
    "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/9/90/Logo_of_Mezzo_Mix.svg"
  },
  "fuze-tea": {
    "note": "Eistee",
    "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/1/16/Fuze-tea-logo.svg"
  },
  "vio": {
    "note": "Limo und Schorle",
    "logoUrl": "https://www.google.com/s2/favicons?domain=vio.de&sz=128"
  },
  "lift": {
    "note": "Schorlen",
    "logoUrl": "https://www.google.com/s2/favicons?domain=lift-apfelschorle.de&sz=128"
  },
  "red-bull": {
    "note": "Energy Drinks",
    "logoUrl": "https://www.google.com/s2/favicons?domain=redbull.com&sz=128"
  },
  "fritz-kola": {
    "note": "Kola, Limo und Schorle",
    "logoUrl": "https://www.google.com/s2/favicons?domain=fritz-kola.com&sz=128"
  },
  "bionade": {
    "note": "Bio-Limonaden",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bionade.de&sz=128"
  },
  "gaffel": {
    "note": "Fassbrause",
    "logoUrl": "https://www.google.com/s2/favicons?domain=gaffel.de&sz=128"
  },
  "club-mate": {
    "note": "Mate",
    "logoUrl": "https://www.google.com/s2/favicons?domain=club-mate.de&sz=128"
  },
  "pepsi": {
    "note": "Cola und Cola-Mix",
    "logoUrl": "https://www.google.com/s2/favicons?domain=pepsi.com&sz=128"
  },
  "monster": {
    "note": "Energy Drinks",
    "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Logo_Monster_Energy.webp"
  },
  "effect": {
    "note": "Energy Drinks",
    "logoUrl": "https://www.google.com/s2/favicons?domain=effect-energy.com&sz=128"
  },
  "capri-sun": {
    "note": "Fruchtsaftgetränke",
    "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Capri-Sun_logo.svg"
  },
  "hohes-c": {
    "note": "Säfte",
    "logoUrl": "https://www.google.com/s2/favicons?domain=hohes-c.de&sz=128"
  },
  "granini": {
    "note": "Säfte und Nektare",
    "logoUrl": "https://www.google.com/s2/favicons?domain=granini.de&sz=128"
  },
  "valensina": {
    "note": "Säfte",
    "logoUrl": "https://www.google.com/s2/favicons?domain=valensina.de&sz=128"
  },
  "rockstar": {
    "note": "Energy Drinks",
    "logoUrl": "https://www.google.com/s2/favicons?domain=rockstarenergy.com&sz=128"
  },
  "mio-mio": {
    "note": "Mate und Limonaden",
    "logoUrl": "https://www.google.com/s2/favicons?domain=mio-mio.com&sz=128"
  },
  "almdudler": {
    "note": "Kraeuterlimonaden",
    "logoUrl": "https://www.google.com/s2/favicons?domain=almdudler.com&sz=128"
  },
  "lipton": {
    "note": "Eistees",
    "logoUrl": "https://www.google.com/s2/favicons?domain=lipton.com&sz=128"
  },
  "pfanner": {
    "note": "Eistees und Saefte",
    "logoUrl": "https://www.google.com/s2/favicons?domain=pfanner.com&sz=128"
  },
  "arizona": {
    "note": "Eistees",
    "logoUrl": "https://www.google.com/s2/favicons?domain=drinkarizona.com&sz=128"
  },
  "durstloescher": {
    "note": "Fruchtsaftgetraenke",
    "logoUrl": "https://www.google.com/s2/favicons?domain=durstloescher.de&sz=128"
  },
  "orangina": {
    "note": "Orangenlimonaden",
    "logoUrl": "https://www.google.com/s2/favicons?domain=orangina.eu&sz=128"
  },
  "chocomel": {
    "note": "Milchgetraenke",
    "logoUrl": "https://www.google.com/s2/favicons?domain=chocomel.com&sz=128"
  },
  "mueller": {
    "note": "Milchgetraenke",
    "logoUrl": "https://www.google.com/s2/favicons?domain=muellermilch.de&sz=128"
  },
  "freeway": {
    "note": "Softdrinks",
    "logoUrl": "https://www.google.com/s2/favicons?domain=lidl.de&sz=128"
  },
  "ja": {
    "note": "Handelsmarke",
    "logoUrl": "https://www.google.com/s2/favicons?domain=rewe.de&sz=128"
  },
  "river": {
    "note": "Softdrinks",
    "logoUrl": "https://www.google.com/s2/favicons?domain=aldi-sued.de&sz=128"
  },
  "paulaner": {
    "note": "Spezi und Limonaden",
    "logoUrl": "https://www.google.com/s2/favicons?domain=paulaner.de&sz=128"
  },
  "goenrgy": {
    "note": "Energy Drinks",
    "logoUrl": "https://www.google.com/s2/favicons?domain=goenrgy.de&sz=128"
  },
  "afri": {
    "note": "Cola",
    "logoUrl": "https://www.google.com/s2/favicons?domain=afri.de&sz=128"
  }
};

export const brands: Brand[] = seed.brands.map((brand) => ({
  ...brand,
  note: brandMeta[brand.id]?.note ?? "Getränkemarke",
  logoUrl: brandMeta[brand.id]?.logoUrl ?? "",
}));

export const brandById = Object.fromEntries(brands.map((brand) => [brand.id, brand]));
