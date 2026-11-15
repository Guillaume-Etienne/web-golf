# Site de Dominique Tavernini · Enseignant de golf

Guide pour toute personne ou assistant IA qui modifie ce site. À lire avant chaque modification.

## En bref

- Site vitrine de **Dominique Tavernini**, enseignant de golf, membre PGA France, dans le Var.
- Domaine : https://www.dominiquetavernini.fr/
- **HTML, CSS et JavaScript standards.** Aucun framework, aucune compilation, aucune dépendance npm.
  Ce qui est dans le dossier est exactement ce qui est mis en ligne.
- Langue du site : français. Ton : professionnel et chaleureux ; Dominique parle à la 1re personne (« je »).

## Structure

```
index.html                  Accueil
enseignant/index.html       L'enseignant (à créer)
cours-et-tarifs/index.html  Cours & tarifs (à créer)
escapades-et-sejours/       Escapades & séjours (à créer)
contact/index.html          Contact (à créer)
mentions-legales/           Mentions légales + crédits photos (à créer)
assets/css/style.css        LA feuille de style (unique, commentée, avec sommaire)
assets/js/main.js           Petits comportements (menu, en-tête)
assets/js/vendor/           Polyfill popover (anciens navigateurs uniquement)
assets/fonts/               Polices hébergées sur le site (Cormorant Garamond, Manrope)
assets/img/                 Images (plusieurs tailles et formats par image)
```

Une page = un dossier contenant `index.html`, pour des adresses propres (`/contact/`).
Tous les chemins commencent par `/` (ex. `/assets/css/style.css`).

## Prévisualiser en local

Les chemins en `/...` nécessitent un petit serveur (un double-clic sur le fichier ne suffit pas) :

```
npx serve .
```

Puis ouvrir l'adresse indiquée. Toujours vérifier sur une largeur de téléphone (≈ 390 px) ET d'ordinateur.

## Modifications courantes

### Changer un tarif
Les tarifs apparaissent à **plusieurs endroits** ; les mettre tous à jour :
1. `index.html` : cartes de la section « Prestations » (prix « Dès … »)
2. `index.html` : encadré « Tarifs » de la section « Réservation »
3. `cours-et-tarifs/index.html` (quand la page existera)
4. `index.html` : `"priceRange"` dans le bloc JSON-LD du `<head>`

Écrire les prix avec une espace insécable : `60&nbsp;€`. Mettre à jour la saison (« Saison 2026 »).

### Ajouter une page
1. Créer `nom-de-la-page/index.html` en copiant `index.html`.
2. Garder à l'identique : `<head>` (adapter `<title>`, `description`, `canonical`, `og:*`), en-tête, pied de page, barre `.mobile-cta`.
3. Sur une page **sans grande photo en haut**, retirer `data-variant="overlay"` de `<header class="site-header">`.
4. Déplacer `aria-current="page"` sur le lien du menu correspondant à la nouvelle page.
5. Si l'en-tête ou le pied de page change, le modifier **dans toutes les pages** (ils sont copiés dans chacune).

### Remplacer ou ajouter une photo
Chaque photo existe en plusieurs tailles et formats, nommés `nom-LARGEUR.format` :
- `.avif` et `.webp` (formats légers) pour chaque largeur, plus un `.jpg` de secours.
- Les balises `<picture>` de `index.html` montrent quelles largeurs sont attendues.

Exemple avec ffmpeg, à partir d'une photo source `portrait.jpg` :
```
ffmpeg -i portrait.jpg -vf "scale=800:-2" -q:v 3 enseignant-800.jpg
ffmpeg -i portrait.jpg -vf "scale=800:-2" -quality 70 enseignant-800.webp
ffmpeg -i portrait.jpg -vf "scale=800:-2" -c:v libaom-av1 -still-picture 1 -crf 32 enseignant-800.avif
```
Respecter le cadrage attendu (ex. portrait 4:5 pour `enseignant-*`, 4:3 pour les cartes) et
garder les attributs `width`/`height` de la balise `<img>` cohérents avec ce ratio.

Règles :
- La grande photo du haut garde `fetchpriority="high"` et **jamais** `loading="lazy"`.
- Toutes les autres images ont `loading="lazy"`.
- Photo décorative : `alt=""`. Photo qui apporte une information : `alt` descriptif.
- Mettre à jour `assets/img/CREDITS.md` (et la page mentions légales) pour toute photo d'un tiers.

### Changer les couleurs ou les polices
Tout est dans les variables en haut de `assets/css/style.css` (section 2). Ne pas écrire de couleur
en dur ailleurs : réutiliser `var(--green-800)`, `var(--brass-light)`, etc.

## Règles à respecter

- **Photos** : celles du site sont des photos libres temporaires (Unsplash). Ne **jamais** utiliser la
  photo d'une autre personne en la présentant comme Dominique. Le portrait est à remplacer (commentaire dans `index.html`).
- **Avis clients** : la section témoignages est prête mais commentée. N'y mettre que de vrais avis,
  avec l'accord des élèves. Ne jamais en inventer.
- **Accessibilité** : un seul `<h1>` par page, titres dans l'ordre (h2 puis h3), textes alternatifs,
  liens et boutons explicites. Les effets d'animation restent facultatifs et respectent
  le réglage « réduire les animations ».
- **Pas de librairie** (jQuery, Bootstrap, librairies d'animation…) : les besoins sont couverts par le
  navigateur. Les effets récents (animations au défilement, transitions de page) sont des bonus :
  le site doit rester lisible et utilisable sans eux.
- **Pas d'appel à des services tiers au chargement** (Google Fonts, CDN…) sans raison : RGPD et rapidité.
- Le **formulaire de contact** passera par un service externe (Google Forms ou équivalent) : à intégrer sur `/contact/`.

## Mise en ligne

Hébergement statique (aucun serveur d'application nécessaire). Déploiement prévu par GitHub Actions
ou par envoi FTP : à documenter ici une fois choisi.
Prévoir des redirections 301 depuis les anciennes adresses WordPress
(ex. `/accueil/qui-suis-je/` → `/enseignant/`, `/accueil/prestations-et-tarifs/` → `/cours-et-tarifs/`,
`/accueil/contact/` → `/contact/`).
