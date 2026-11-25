# 24 Heures du Mans : les hypercars

Site consacré aux hypercars des 24 Heures du Mans, du centenaire de 2023 à l'édition 2026.
En ligne sur https://corentinh2.github.io/

## Structure

```
index.html            Accueil : chiffres clés, palmarès, nouveautés, écuries, classement
Toyota.html …         Une page par écurie (Toyota, Ferrari, BMW, Cadillac, Peugeot,
                      Alpine, AstonMartin, Genesis, Porsche, Glickenhaus)
Archives.html         Écuries absentes en 2026
me_contacter.html     Contact
404.html              Page d'erreur (« Sortie de piste »)
assets/css/style.css  Feuille de style commune (couleur d'accent : --accent sur <body>)
assets/js/main.js     Animations : apparition au défilement, compteurs, cartes 3D,
                      parallaxe, menu mobile, galerie plein écran
assets/img/           Photos au format WebP + silhouette.svg (voiture de remplacement)
```

## Ajouter des photos

Les pages BMW, Alpine, Aston Martin et Genesis affichent une silhouette en attendant de vraies photos.
Pour en ajouter une, place l'image (idéalement en `.webp`, 1600 px de large maximum) dans `assets/img/`,
puis remplace le bloc `<div class="silhouette">…</div>` par une balise `<img>` dans l'en-tête de la page
et ajoute une section galerie en copiant celle de `Toyota.html`.

## Tester en local

```
python -m http.server 8000
```
puis ouvrir http://localhost:8000
