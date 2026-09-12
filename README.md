# Les Évadés — site internet

Site statique (HTML/CSS/JS, aucune dépendance ni build) pour le restaurant
**Les Évadés**, bouchon lyonnais situé 4 rue du Palais de Justice, 69005 Lyon.

## Contenu du dépôt

```
index.html              Accueil
carte.html               Menu complet, avec allergènes par plat
allergies.html            Page dédiée allergies/intolérances + FAQ
acces.html                Adresse, plan, transports, horaires
reservation.html          Contact / réservation
mentions-legales.html     Mentions légales (modèle à compléter)
robots.txt / sitemap.xml  Référencement technique
assets/css/style.css      Design (couleurs, typographie, composants)
assets/js/main.js         Menu mobile, mise en avant du jour courant
assets/js/allergy-checker.js  Moteur du filtre allergènes
assets/img/favicon.svg    Favicon
```

## ⚠️ À faire avant la mise en ligne

1. **Vérifier les allergènes.** Les allergènes indiqués plat par plat
   (`data-allergens` + texte visible dans `carte.html`) ont été déduits des
   intitulés et ingrédients de la carte fournie, pas d'une fiche technique
   officielle. **Faites relire cette liste par la cuisine avant publication**,
   et mettez-la à jour à chaque changement de recette ou de fournisseur.
2. **Ajouter vos photos.** Aucune photo n'est utilisée : le design repose
   sur la typographie et la couleur pour rester net sans images. Pour ajouter
   des photos (façade, plats), il suffit d'insérer un `<img>` classique dans
   le HTML ou une `background-image` dans `style.css` — aucune classe
   spéciale n'est requise.
3. **Compléter les mentions légales** (`mentions-legales.html`) : forme
   juridique, SIRET, hébergeur.
4. **Mettre à jour les URLs SEO** : `sitemap.xml`, les balises
   `<link rel="canonical">` et `og:url` utilisent `https://www.lesevades-restaurant.fr/`
   — à ajuster si le nom de domaine change.
5. **Vérifier les coordonnées GPS** dans les données structurées
   (`index.html`, bloc `geo`) : elles sont approximatives, à ajuster avec
   les coordonnées précises (Google Maps → clic droit → coordonnées).

## Le moteur d'allergies

- Un bouton flottant « ⚠️ Allergies ? » est injecté sur toutes les pages
  (`assets/js/allergy-checker.js`). Il ouvre une fenêtre listant les 14
  allergènes réglementaires européens.
- Sur `carte.html`, chaque plat est une balise
  `<article class="dish" data-allergens="lait,gluten">`. Le script compare
  les allergènes cochés à cet attribut et ajoute un badge « Compatible »
  (vert) ou « À éviter » (orange) sur chaque plat.
- Le choix du visiteur est mémorisé dans le `localStorage` du navigateur
  (aucune donnée envoyée au restaurant ni à un tiers) et peut être partagé
  via un lien `carte.html?allergenes=lait,gluten`.
- **Pour ajouter/modifier un plat** : dupliquez un bloc `<article class="dish">`
  dans `carte.html`, en renseignant son `data-allergens` (codes possibles :
  `gluten, crustaces, oeufs, poissons, arachides, soja, lait,
  fruits-a-coque, celeri, moutarde, sesame, sulfites, lupin, mollusques`)
  et le texte visible « Allergènes : … ».
- Un avertissement rappelle partout que ces informations sont indicatives
  et ne remplacent pas un échange avec l'équipe en salle — comme c'est déjà
  la pratique du restaurant (liste officielle disponible sur demande).

## SEO mis en place

- Balises title/description uniques par page, ciblant des requêtes locales
  (« restaurant Vieux-Lyon », « bouchon lyonnais Lyon 5 », « allergies
  restaurant Vieux-Lyon »…).
- Données structurées `schema.org/Restaurant` (adresse, horaires, téléphone,
  menu) sur l'accueil, `schema.org/Menu` sur la carte et `schema.org/FAQPage`
  sur la page allergies (susceptible d'apparaître en extrait enrichi Google).
- `sitemap.xml` + `robots.txt`.
- HTML sémantique, un seul `<h1>` par page, attributs `alt`/ARIA, contraste
  conforme, site 100 % utilisable au clavier.
- Aucune dépendance JS lourde : chargement rapide (bon pour le Core Web
  Vitals, donc pour le classement Google).

## Déploiement

Le site est 100 % statique : il peut être déposé tel quel chez n'importe
quel hébergeur (OVH, o2switch, Netlify, GitHub Pages…), sans build ni
serveur applicatif. Il suffit de copier l'ensemble des fichiers à la racine
du domaine `lesevades-restaurant.fr`.

## Tester en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```
