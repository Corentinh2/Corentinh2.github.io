# 24 Heures du Mans : les hypercars

Site consacré aux hypercars des 24 Heures du Mans, du centenaire de 2023 à l'édition 2026,
en français et en anglais. En ligne sur https://corentinh2.github.io/

## Ce que contient le site

| Page | Contenu |
| --- | --- |
| `index.html` | Accueil : compte à rebours 2027, chiffres clés, palmarès, nouveautés, écuries, classement |
| `Toyota.html` … | Une page par écurie, avec le son moteur synthétisé |
| `Circuit.html` | Carte animée du circuit, chrono, vitesse et virages |
| `Comprendre.html` | Catégories, LMH/LMDh, BoP, pilotes, drapeaux, voyants |
| `Histoire.html` | Frise de 1923 à 2026 |
| `Pilotes.html` | Équipages vainqueurs et recordmen |
| `Comparateur.html` | Deux hypercars face à face |
| `Quiz.html` | 12 questions avec score |
| `Archives.html`, `me_contacter.html`, `404.html`, `offline.html` | Pages annexes |
| `en/` | Version anglaise de toutes les pages |

Autres fonctions : thème clair/sombre, mode hors connexion (`sw.js`), installable comme une application
(`manifest.webmanifest`), référencement (`sitemap.xml`, `robots.txt`, image de partage `assets/img/og.jpg`).

## Modifier le site

**Les pages HTML sont générées : ne les modifie pas à la main**, sinon la version française
et la version anglaise ne seront plus identiques. Modifie plutôt :

- `_build/i18n/fr.mjs` et `_build/i18n/en.mjs` pour les textes ;
- `_build/data.mjs` pour les données (écuries, couleurs, moteurs, photos) ;
- `_build/build.mjs` pour la structure des pages ;
- `assets/css/style.css` et `assets/js/` pour le style et les animations.

Puis régénère le site (il faut [Node.js](https://nodejs.org/)) :

```
node _build/build.mjs
```

Le dossier `_build/` n'est pas publié par GitHub Pages.

## Ajouter des photos

Place l'image (idéalement en `.webp`, 1600 px de large maximum) dans `assets/img/`, puis indique son nom
dans `_build/data.mjs` (`img` pour l'en-tête, `gallery` pour la galerie) et régénère le site.
Pense à citer l'auteur et la licence si la photo vient de Wikimedia Commons.

## Tester en local

```
python -m http.server 8000
```
puis ouvrir http://localhost:8000
