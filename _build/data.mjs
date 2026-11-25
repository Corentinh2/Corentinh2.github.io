// Données "techniques" des écuries (indépendantes de la langue).
// Les textes sont dans i18n/fr.mjs et i18n/en.mjs.
// engine : paramètres du son synthétisé (cylindres, turbo, régime max, hybride)
// cmp    : données du comparateur

export const SITE_URL = "https://corentinh2.github.io";
export const RACE_2027 = "2027-06-12T16:00:00+02:00";

export const teams = [
  { slug: "toyota", file: "Toyota.html", name: "Toyota", car: "TR010 Hybrid", color: "#ff2b3d", number: "7", type: "LMH", grid: true,
    img: "toyota-26-7", gallery: ["toyota-26-7", "toyota-26-8", "toyota-1", "toyota-2", "toyota-3"], link: "https://toyotagazooracing.com/wec/",
    engine: { cyl: 6, turbo: true, rpm: 9000, hybrid: true },
    cmp: { engine: "V6 biturbo", litres: 3.5, cyl: 6, turbo: true, hybrid: true, wins: 6, debut: 2021 } },
  { slug: "ferrari", file: "Ferrari.html", name: "Ferrari", car: "499P", color: "#ff3b1f", number: "51", type: "LMH", grid: true,
    img: "ferrari-26-51", gallery: ["ferrari-25-win", "ferrari-26-83", "ferrari-26-51", "ferrari-3", "ferrari-1", "ferrari-2"], link: "https://www.ferrari.com/en-EN/hypercar",
    engine: { cyl: 6, turbo: true, rpm: 9500, hybrid: true },
    cmp: { engine: "V6 biturbo", litres: 3.0, cyl: 6, turbo: true, hybrid: true, wins: 12, debut: 2023 } },
  { slug: "bmw", file: "BMW.html", name: "BMW", car: "M Hybrid V8", color: "#3d8bff", number: "20", type: "LMDh", grid: true, isNew: true,
    img: "bmw-26-20", gallery: ["bmw-26-20", "bmw-26-15", "bmw-artcar"], link: "https://www.bmw-m.com/",
    engine: { cyl: 8, turbo: true, rpm: 8500, hybrid: true },
    cmp: { engine: "V8 biturbo", litres: 4.0, cyl: 8, turbo: true, hybrid: true, wins: 1, debut: 2024 } },
  { slug: "cadillac", file: "Cadillac.html", name: "Cadillac", car: "V-Series.R", color: "#e6b84a", number: "12", type: "LMDh", grid: true,
    img: "cadillac-26-12n", gallery: ["cadillac-26-12n", "cadillac-26-38", "cadillac-3", "cadillac-1", "cadillac-2"], link: "https://www.cadillac.com/",
    engine: { cyl: 8, turbo: false, rpm: 8000, hybrid: true },
    cmp: { engine: "V8", litres: 5.5, cyl: 8, turbo: false, hybrid: true, wins: 0, debut: 2023 } },
  { slug: "peugeot", file: "Peugeot.html", name: "Peugeot", car: "9X8", color: "#c6f432", number: "93", type: "LMH", grid: true,
    img: "peugeot-26-94", gallery: ["peugeot-26-94", "peugeot-26-93", "peugeot-1", "peugeot-2", "peugeot-3"], link: "https://www.peugeot.fr/",
    engine: { cyl: 6, turbo: true, rpm: 9000, hybrid: true },
    cmp: { engine: "V6 biturbo", litres: 2.6, cyl: 6, turbo: true, hybrid: true, wins: 3, debut: 2023 } },
  { slug: "alpine", file: "Alpine.html", name: "Alpine", car: "A424", color: "#4f8dff", number: "36", type: "LMDh", grid: true, isNew: true,
    img: "alpine-26-36", gallery: ["alpine-26-36", "alpine-26-35", "alpine-front"], link: "https://www.alpinecars.com/",
    engine: { cyl: 6, turbo: true, rpm: 8500, hybrid: true },
    cmp: { engine: "V6 turbo", litres: 3.4, cyl: 6, turbo: true, hybrid: true, wins: 1, debut: 2024 } },
  { slug: "aston", file: "AstonMartin.html", name: "Aston Martin", car: "Valkyrie", color: "#2fd3a0", number: "007", type: "LMH", grid: true, isNew: true,
    img: "aston-26-007", gallery: ["aston-26-007", "aston-26-009", "aston-studio"], link: "https://www.astonmartin.com/",
    engine: { cyl: 12, turbo: false, rpm: 11000, hybrid: false },
    cmp: { engine: "V12", litres: 6.5, cyl: 12, turbo: false, hybrid: false, wins: 1, debut: 2025 } },
  { slug: "genesis", file: "Genesis.html", name: "Genesis", car: "GMR-001", color: "#ff7a2f", number: "19", type: "LMDh", grid: true, isNew: true,
    img: "genesis-26-19", gallery: ["genesis-26-19", "genesis-26-17", "genesis-model"], link: "https://www.genesis.com/",
    engine: { cyl: 8, turbo: true, rpm: 8500, hybrid: true },
    cmp: { engine: "V8 turbo", litres: 3.2, cyl: 8, turbo: true, hybrid: true, wins: 0, debut: 2026 } },
  { slug: "porsche", file: "Porsche.html", name: "Porsche", car: "963", color: "#ff3347", number: "6", type: "LMDh", grid: false,
    img: "porsche-23-6", gallery: ["porsche-23-6", "porsche-6", "porsche-1", "porsche-2"], link: "https://motorsports.porsche.com/international/en/category/cars/lmdh-prototype-963",
    engine: { cyl: 8, turbo: true, rpm: 8500, hybrid: true },
    cmp: { engine: "V8 biturbo", litres: 4.6, cyl: 8, turbo: true, hybrid: true, wins: 19, debut: 2023 } },
  { slug: "glickenhaus", file: "Glickenhaus.html", name: "Glickenhaus", car: "SCG 007 LMH", color: "#34c1f0", number: "708", type: "LMH", grid: false, archive: true,
    img: "glickenhaus-3", gallery: ["glickenhaus-1", "glickenhaus-2", "glickenhaus-3"], link: "https://www.glickenhausracing.com/",
    engine: { cyl: 8, turbo: true, rpm: 8000, hybrid: false },
    cmp: { engine: "V8 biturbo", litres: 3.5, cyl: 8, turbo: true, hybrid: false, wins: 0, debut: 2021 } },
];

export const archivesExtra = [
  { key: "lamborghini", name: "Lamborghini", car: "SC63", color: "#ffc21a", img: "lamborghini" },
  { key: "isotta", name: "Isotta Fraschini", car: "Tipo 6 LMH Competizione", color: "#c2185b", img: "isotta" },
];

export const board = [
  ["Porsche", 19, "#ff3347"], ["Audi", 13, "#bfc6d4"], ["Ferrari", 12, "#ff3b1f"], ["Jaguar", 7, "#2fd3a0"],
  ["Bentley", 6, "#7fb069"], ["Toyota", 6, "#ff2b3d"], ["Ford", 4, "#3d8bff"], ["Peugeot", 3, "#c6f432"],
];

// Pages "outils" (hors écuries), dans l'ordre du menu
export const pages = ["index", "Circuit", "Comprendre", "Histoire", "Pilotes", "Comparateur", "Quiz", "Archives", "me_contacter"];

// Compteur de visites GoatCounter (respectueux de la vie privée).
// Crée un compte gratuit sur https://www.goatcounter.com puis indique ton code ici
// (par exemple "corentin" pour https://corentin.goatcounter.com), et régénère le site.
export const GOATCOUNTER = "";

// Images des pages Histoire, Pilotes et Comprendre
export const historyImages = { 1924: "histo-bentley", 1955: "histo-jaguar", 1966: "histo-ford", 1970: "histo-porsche917", 1978: "histo-alpine", 1991: "histo-mazda", 2009: "histo-peugeot908", 2013: "histo-audi", 2018: "histo-toyota", 2023: "ferrari-3", 2026: "toyota-26-7" };
export const crewImages = { 2023: "pilotes-2023", 2024: "pilotes-2024", 2025: "p-kubica", 2026: "pilotes-2026" };
export const driverImages = { "Kamui Kobayashi": "p-kobayashi", "Nyck de Vries": "p-devries", "Mike Conway": "p-conway", "Alessandro Pier Guidi": "p-pierguidi", "Antonio Fuoco": "p-fuoco" };
export const classImages = ["toyota-26-7", "lmp2", "lmgt3"];

// Résultats (équipages indiqués seulement quand ils sont vérifiés)
export const results = {
  2026: { overall: [["Toyota", "#ff2b3d", "TR010 Hybrid n°7", "Conway · Kobayashi · de Vries"], ["BMW", "#3d8bff", "M Hybrid V8 n°20", "Frijns · Rast · van der Linde"], ["Toyota", "#ff2b3d", "TR010 Hybrid n°8", "Buemi · Hartley · Hirakawa"], ["Cadillac", "#e6b84a", "V-Series.R n°12", "Delétraz · Stevens · Nato"], ["Ferrari", "#ff3b1f", "499P n°51", ""]],
          classes: [["LMP2", "#3d8bff", "Inter Europol Competition", "Oreca 07 n°43"], ["LMGT3", "#ff9f1a", "TF Sport", "Corvette Z06 LMGT3.R n°33"]] },
  2025: { overall: [["Ferrari", "#ff3b1f", "499P n°83 (AF Corse)", "Kubica · Ye · Hanson"], ["Porsche", "#ff3347", "963 n°6", ""], ["Ferrari", "#ff3b1f", "499P n°51", "Pier Guidi · Calado · Giovinazzi"]],
          classes: [["LMP2", "#3d8bff", "Inter Europol Competition", "Oreca 07 n°43"], ["LMGT3", "#ff9f1a", "Manthey 1st Phorm", "Porsche 911 GT3 R n°92 · Lietz · Hardwick · Pera"]] },
  2024: { overall: [["Ferrari", "#ff3b1f", "499P n°50", "Fuoco · Molina · Nielsen"], ["Toyota", "#ff2b3d", "GR010 Hybrid n°7", ""], ["Ferrari", "#ff3b1f", "499P n°51", "Pier Guidi · Calado · Giovinazzi"]],
          classes: [["LMP2", "#3d8bff", "United Autosports", "Oreca 07 n°22 · Jarvis · Garg · Siegel"], ["LMGT3", "#ff9f1a", "Manthey EMA", "Porsche 911 GT3 R n°91 · Lietz · Schuring · Shahin"]] },
  2023: { overall: [["Ferrari", "#ff3b1f", "499P n°51", "Pier Guidi · Calado · Giovinazzi"], ["Toyota", "#ff2b3d", "GR010 Hybrid n°8", "Buemi · Hartley · Hirakawa"], ["Cadillac", "#e6b84a", "V-Series.R n°2", "Bamber · Lynn · Westbrook"]],
          classes: [["LMP2", "#3d8bff", "Inter Europol Competition", "Oreca 07 n°34 · Śmiechowski · Costa · Scherer"], ["GTE Am", "#2fd3a0", "Corvette Racing", "Corvette C8.R n°33 · Keating · Varrone · Catsburg"]] },
};
