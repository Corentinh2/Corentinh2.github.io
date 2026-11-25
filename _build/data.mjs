// Données "techniques" des écuries (indépendantes de la langue).
// Les textes sont dans i18n/fr.mjs et i18n/en.mjs.
// engine : paramètres du son synthétisé (cylindres, turbo, régime max, hybride)
// cmp    : données du comparateur

export const SITE_URL = "https://corentinh2.github.io";
export const RACE_2027 = "2027-06-12T16:00:00+02:00";

export const teams = [
  { slug: "toyota", file: "Toyota.html", name: "Toyota", car: "TR010 Hybrid", color: "#ff2b3d", number: "7", type: "LMH", grid: true,
    img: "toyota-1", gallery: ["toyota-2", "toyota-3", "toyota-1"], link: "https://toyotagazooracing.com/wec/",
    engine: { cyl: 6, turbo: true, rpm: 9000, hybrid: true },
    cmp: { engine: "V6 biturbo", litres: 3.5, cyl: 6, turbo: true, hybrid: true, wins: 6, debut: 2021 } },
  { slug: "ferrari", file: "Ferrari.html", name: "Ferrari", car: "499P", color: "#ff3b1f", number: "51", type: "LMH", grid: true,
    img: "ferrari-3", gallery: ["ferrari-1", "ferrari-2", "ferrari-3"], link: "https://www.ferrari.com/en-EN/hypercar",
    engine: { cyl: 6, turbo: true, rpm: 9500, hybrid: true },
    cmp: { engine: "V6 biturbo", litres: 3.0, cyl: 6, turbo: true, hybrid: true, wins: 12, debut: 2023 } },
  { slug: "bmw", file: "BMW.html", name: "BMW", car: "M Hybrid V8", color: "#3d8bff", number: "20", type: "LMDh", grid: true, isNew: true,
    img: null, gallery: [], link: "https://www.bmw-m.com/",
    engine: { cyl: 8, turbo: true, rpm: 8500, hybrid: true },
    cmp: { engine: "V8 biturbo", litres: 4.0, cyl: 8, turbo: true, hybrid: true, wins: 1, debut: 2024 } },
  { slug: "cadillac", file: "Cadillac.html", name: "Cadillac", car: "V-Series.R", color: "#e6b84a", number: "12", type: "LMDh", grid: true,
    img: "cadillac-3", gallery: ["cadillac-1", "cadillac-2", "cadillac-3"], link: "https://www.cadillac.com/",
    engine: { cyl: 8, turbo: false, rpm: 8000, hybrid: true },
    cmp: { engine: "V8", litres: 5.5, cyl: 8, turbo: false, hybrid: true, wins: 0, debut: 2023 } },
  { slug: "peugeot", file: "Peugeot.html", name: "Peugeot", car: "9X8", color: "#c6f432", number: "93", type: "LMH", grid: true,
    img: "peugeot-1", gallery: ["peugeot-1", "peugeot-2", "peugeot-3"], link: "https://www.peugeot.fr/",
    engine: { cyl: 6, turbo: true, rpm: 9000, hybrid: true },
    cmp: { engine: "V6 biturbo", litres: 2.6, cyl: 6, turbo: true, hybrid: true, wins: 3, debut: 2023 } },
  { slug: "alpine", file: "Alpine.html", name: "Alpine", car: "A424", color: "#4f8dff", number: "36", type: "LMDh", grid: true, isNew: true,
    img: null, gallery: [], link: "https://www.alpinecars.com/",
    engine: { cyl: 6, turbo: true, rpm: 8500, hybrid: true },
    cmp: { engine: "V6 turbo", litres: 3.4, cyl: 6, turbo: true, hybrid: true, wins: 1, debut: 2024 } },
  { slug: "aston", file: "AstonMartin.html", name: "Aston Martin", car: "Valkyrie", color: "#2fd3a0", number: "007", type: "LMH", grid: true, isNew: true,
    img: null, gallery: [], link: "https://www.astonmartin.com/",
    engine: { cyl: 12, turbo: false, rpm: 11000, hybrid: false },
    cmp: { engine: "V12", litres: 6.5, cyl: 12, turbo: false, hybrid: false, wins: 1, debut: 2025 } },
  { slug: "genesis", file: "Genesis.html", name: "Genesis", car: "GMR-001", color: "#ff7a2f", number: "19", type: "LMDh", grid: true, isNew: true,
    img: null, gallery: [], link: "https://www.genesis.com/",
    engine: { cyl: 8, turbo: true, rpm: 8500, hybrid: true },
    cmp: { engine: "V8 turbo", litres: 3.2, cyl: 8, turbo: true, hybrid: true, wins: 0, debut: 2026 } },
  { slug: "porsche", file: "Porsche.html", name: "Porsche", car: "963", color: "#ff3347", number: "6", type: "LMDh", grid: false,
    img: "porsche-1", gallery: ["porsche-1", "porsche-2"], link: "https://motorsports.porsche.com/international/en/category/cars/lmdh-prototype-963",
    engine: { cyl: 8, turbo: true, rpm: 8500, hybrid: true },
    cmp: { engine: "V8 biturbo", litres: 4.6, cyl: 8, turbo: true, hybrid: true, wins: 19, debut: 2023 } },
  { slug: "glickenhaus", file: "Glickenhaus.html", name: "Glickenhaus", car: "SCG 007 LMH", color: "#34c1f0", number: "708", type: "LMH", grid: false, archive: true,
    img: "glickenhaus-3", gallery: ["glickenhaus-1", "glickenhaus-2", "glickenhaus-3"], link: "https://www.glickenhausracing.com/",
    engine: { cyl: 8, turbo: true, rpm: 8000, hybrid: false },
    cmp: { engine: "V8 biturbo", litres: 3.5, cyl: 8, turbo: true, hybrid: false, wins: 0, debut: 2021 } },
];

export const archivesExtra = [
  { key: "lamborghini", name: "Lamborghini", car: "SC63", color: "#ffc21a" },
  { key: "isotta", name: "Isotta Fraschini", car: "Tipo 6 LMH Competizione", color: "#c2185b" },
];

export const board = [
  ["Porsche", 19, "#ff3347"], ["Audi", 13, "#bfc6d4"], ["Ferrari", 12, "#ff3b1f"], ["Jaguar", 7, "#2fd3a0"],
  ["Bentley", 6, "#7fb069"], ["Toyota", 6, "#ff2b3d"], ["Ford", 4, "#3d8bff"], ["Peugeot", 3, "#c6f432"],
];

// Pages "outils" (hors écuries), dans l'ordre du menu
export const pages = ["index", "Circuit", "Comprendre", "Histoire", "Pilotes", "Comparateur", "Quiz", "Archives", "me_contacter"];
