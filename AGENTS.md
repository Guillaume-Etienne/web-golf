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
index.html                       Accueil
enseignant/index.html            L'enseignant (parcours, diplômes, masterclasses, méthode)
cours-et-tarifs/index.html       Cours & tarifs (leçons, parcours, stages, perfectionnement, conditions)
escapades-et-sejours/index.html  Escapades & séjours
contact/index.html               Contact (téléphone + formulaire)
mentions-legales/index.html      Mentions légales, données personnelles, crédits photos
404.html                         Page « introuvable »
assets/css/style.css             LA feuille de style (unique, commentée, avec sommaire)
assets/js/main.js                Petits comportements (menu, en-tête, formulaire de contact)
assets/js/vendor/                Polyfill popover (anciens navigateurs uniquement)
assets/fonts/                    Polices hébergées sur le site (Cormorant Garamond, Manrope)
assets/img/                      Images (plusieurs tailles et formats par image) + CREDITS.md
.htaccess                        Serveur Apache : redirections des anciennes adresses, 404, cache
robots.txt, sitemap.xml          Référencement
```

Une page = un dossier contenant `index.html`, pour des adresses propres (`/contact/`).
Tous les chemins commencent par `/` (ex. `/assets/css/style.css`).

## Prévisualiser en local

Les chemins en `/...` nécessitent un petit serveur (un double-clic sur le fichier ne suffit pas) :

```
npx serve .
```

Puis ouvrir l'adresse indiquée. Toujours vérifier sur une largeur de téléphone (≈ 390 px) ET d'ordinateur.

## À compléter avant la mise en ligne

- **Mentions légales** : tout ce qui est surligné en jaune (`<mark class="todo">`) : statut, adresse, SIRET,
  e-mail, hébergeur, service de formulaire, durée de conservation des données.
- **Formulaire de contact** : à relier à Google Forms (voir plus bas). Tant que ce n'est pas fait,
  il affiche « Le formulaire n'est pas encore activé » et invite à téléphoner.
- **À faire valider par Dominique** (signalé par un commentaire dans le HTML) :
  - tarif et organisation de la formation carte verte (repris de l'affiche 2019) ;
  - destinations des escapades (affiche 2019) et descriptions des deux formules de séjours ;
  - citation de Dave Pelz sur l'accueil ;
  - tarifs du stage petit jeu (absents de l'ancien site : la page renvoie vers le formulaire).
- **Photos** : remplacer les photos Unsplash, en priorité le portrait de Dominique.

## Modifications courantes

### Changer un tarif
Les tarifs apparaissent à **plusieurs endroits** ; les mettre tous à jour :
1. `cours-et-tarifs/index.html` : tableaux des leçons et des parcours, encadré carte verte
2. `index.html` : cartes de la section « Prestations » (prix « Dès … »)
3. `index.html` : encadré « Tarifs » de la section « Réservation »
4. `index.html` : `"priceRange"` dans le bloc JSON-LD du `<head>`
5. `cours-et-tarifs/index.html` : description (`<meta name="description">`) qui cite « dès 60 € »

Écrire les prix avec une espace insécable : `60&nbsp;€`. Mettre à jour la saison (« Saison 2026 »).
Dans les tableaux, chaque cellule de prix garde son attribut `data-label` (libellé affiché sur mobile).

### Ajouter une page
1. Créer `nom-de-la-page/index.html` en copiant une page intérieure (ex. `contact/index.html`).
2. Garder à l'identique : `<head>` (adapter `<title>`, `description`, `canonical`, `og:*`), en-tête,
   pied de page, barre `.mobile-cta`.
3. Seule la page d'accueil a `data-variant="overlay"` sur `<header class="site-header">`
   (en-tête transparent au-dessus de la grande photo). Les autres pages ne l'ont pas.
4. Placer `aria-current="page"` sur le lien du menu correspondant à la page.
5. Ajouter la page à `sitemap.xml` et, si besoin, au menu et au pied de page **de toutes les pages**
   (l'en-tête et le pied de page sont copiés dans chaque fichier).

### Composants disponibles (classes CSS)
- `page-hero section-dark` : bandeau de titre vert en haut des pages intérieures.
- `section`, `section-alt` (fond crème), `section-dark` (fond vert) : sections de page.
- `split` : deux colonnes (texte + image, texte + tableau) qui passent l'une sous l'autre sur mobile.
- `feature-grid` (+ `--numbered`, `--wide`, `--thirds`) : grille de petites cartes.
- `table-wrapper` + `price-table price-table--stack` : tableau de prix qui devient des fiches sur mobile.
- `accordion` : questions/réponses dépliables (éléments `<details>` natifs).
- `cta-simple` : appel à l'action centré en bas de page.
- `btn btn-primary | btn-dark | btn-ghost | btn-outline` (+ `btn-small`, `btn-large`) : boutons.
- `reveal` : apparition douce au défilement (facultatif).

### Relier le formulaire de contact (Google Forms)
1. Créer un Google Form avec 6 questions de type **« Réponse courte »** (ou « Paragraphe » pour le message) :
   Nom, E-mail, Téléphone, Prestation, Niveau, Message.
2. Dans Google Forms : menu ⋮ → « Obtenir le lien prérempli », remplir chaque question, « Obtenir le lien ».
   Le lien contient l'identifiant du formulaire (`/forms/d/e/XXXX/`) et un `entry.NNNN` par question.
3. Dans `contact/index.html`, sur la balise `<form>` :
   - `action` : remplacer `VOTRE_ID_DE_FORMULAIRE` par l'identifiant (garder `/formResponse` à la fin) ;
   - `data-google-entries` : remplacer chaque `entry.000000000X` par le bon numéro.
4. Tester un envoi : la réponse doit apparaître dans l'onglet « Réponses » du Google Form.

Autre service (Formspree, Web3Forms…) : mettre son adresse dans `action` ; `main.js` envoie alors les champs
avec leurs noms (`nom`, `email`, `telephone`, `prestation`, `niveau`, `message`) et attend une réponse JSON.

Lien direct vers le formulaire avec une prestation présélectionnée : `/contact/?prestation=carte-verte`
(valeurs possibles : attributs `data-slug` des `<option>` du formulaire).

### Remplacer ou ajouter une photo
Chaque photo existe en plusieurs tailles et formats, nommés `nom-LARGEUR.format` :
- `.avif` et `.webp` (formats légers) pour chaque largeur, plus un `.jpg` de secours.
- Les balises `<picture>` des pages montrent quelles largeurs sont attendues.

Exemple avec ffmpeg, à partir d'une photo source `portrait.jpg` :
```
ffmpeg -i portrait.jpg -vf "scale=800:-2" -q:v 3 enseignant-800.jpg
ffmpeg -i portrait.jpg -vf "scale=800:-2" -quality 70 enseignant-800.webp
ffmpeg -i portrait.jpg -vf "scale=800:-2" -c:v libaom-av1 -still-picture 1 -crf 32 enseignant-800.avif
```
Respecter le cadrage attendu (ex. portrait 4:5 pour `enseignant-*`, 4:3 pour les cartes) et
garder les attributs `width`/`height` de la balise `<img>` cohérents avec ce ratio.

Règles :
- La grande photo du haut de l'accueil garde `fetchpriority="high"` et **jamais** `loading="lazy"`.
- Toutes les autres images ont `loading="lazy"`.
- Photo décorative : `alt=""`. Photo qui apporte une information : `alt` descriptif.
- Mettre à jour `assets/img/CREDITS.md` (et la page mentions légales) pour toute photo d'un tiers.

### Changer les couleurs ou les polices
Tout est dans les variables en haut de `assets/css/style.css` (section 2). Ne pas écrire de couleur
en dur ailleurs : réutiliser `var(--green-800)`, `var(--brass-light)`, etc.
Ne pas utiliser le raccourci CSS `font:` : il réinitialise les chiffres alignés de la police Cormorant.

## Règles à respecter

- **Photos** : celles du site sont des photos libres temporaires (Unsplash). Ne **jamais** utiliser la
  photo d'une autre personne en la présentant comme Dominique.
- **Avis clients** : la section témoignages de l'accueil est prête mais commentée. N'y mettre que de vrais
  avis, avec l'accord des élèves. Ne jamais en inventer.
- **Accessibilité** : un seul `<h1>` par page, titres dans l'ordre (h2 puis h3 puis h4), textes alternatifs,
  liens et boutons explicites. Les effets d'animation restent facultatifs et respectent
  le réglage « réduire les animations ».
- **Pas de librairie** (jQuery, Bootstrap, librairies d'animation…) : les besoins sont couverts par le
  navigateur. Les effets récents (animations au défilement, transitions de page) sont des bonus :
  le site doit rester lisible et utilisable sans eux.
- **Pas d'appel à des services tiers au chargement** (Google Fonts, CDN…) sans raison : RGPD et rapidité.

## Mise en ligne

Hébergement statique (aucun serveur d'application nécessaire). Déploiement prévu par GitHub Actions
ou par envoi FTP : à documenter ici une fois choisi.

- **Hébergement Apache** (OVH, o2switch, Ionos…) : `.htaccess` gère déjà les redirections 301 des
  anciennes adresses WordPress (`/accueil/...`), la page 404, la compression et le cache.
  Une fois le certificat SSL actif, décommenter le bloc « Forcer HTTPS et le www ».
- **Netlify / Cloudflare Pages** : `.htaccess` est ignoré ; recréer les mêmes redirections dans un
  fichier `_redirects` (même liste que dans `.htaccess`).
- Après la mise en ligne : déclarer `https://www.dominiquetavernini.fr/sitemap.xml` dans Google Search Console.
