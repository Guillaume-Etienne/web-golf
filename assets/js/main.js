/**
 * main.js : les quelques comportements du site (aucune librairie).
 * Chargé avec type="module" : il s'exécute après la lecture de la page.
 *
 * 1. Polyfill « popover » : uniquement pour les navigateurs trop anciens.
 * 2. Navigation : liens en ligne s'ils tiennent, sinon bouton « Menu ».
 * 3. En-tête masqué en descendant : secours pour les navigateurs
 *    qui ne savent pas le faire en CSS (voir style.css §6).
 */

// 1. POLYFILL POPOVER -----------------------------------------------------------
// Le menu mobile utilise l'attribut HTML « popover ». Le polyfill n'est chargé
// que si le navigateur ne le connaît pas.
if (!Object.hasOwn(HTMLElement.prototype, "popover")) {
  await import("./vendor/popover-polyfill-0.7.3.min.js");
}

const header = document.querySelector(".site-header");
const headerInner = header?.querySelector(".header-inner");
const menu = document.getElementById("site-menu");

// 2. NAVIGATION ----------------------------------------------------------------
// Pas de largeur d'écran codée en dur : on mesure si la ligne (logo + liens)
// tient. Si oui, classe « is-wide » (liens en ligne) ; sinon menu déroulant.
// Ajouter un lien ou agrandir le texte déplace automatiquement la bascule.
function isPopoverOpen(element) {
  try {
    return element.matches(":popover-open");
  } catch {
    return element.classList.contains(":popover-open"); // navigateurs avec polyfill
  }
}

if (header && headerInner && menu) {
  let lastHeaderWidth = 0;

  const updateNavLayout = () => {
    const width = header.clientWidth;
    const isWide = header.classList.contains("is-wide");

    // Menu replié : on ne remesure que si l'en-tête s'est élargi
    // (évite de faire clignoter la mise en page à chaque redimensionnement).
    if (!isWide && width <= lastHeaderWidth) {
      lastHeaderWidth = width;
      return;
    }
    lastHeaderWidth = width;

    const wasOpen = isPopoverOpen(menu);

    // Mesure : on affiche la ligne complète, puis on vérifie qu'elle tient.
    header.classList.add("is-measuring", "is-wide");
    menu.removeAttribute("popover");
    const fits = headerInner.scrollWidth <= headerInner.clientWidth;

    if (!fits) {
      header.classList.remove("is-wide");
      menu.setAttribute("popover", "auto");
      if (wasOpen) menu.showPopover();
    }

    requestAnimationFrame(() => header.classList.remove("is-measuring"));
  };

  const observer = new ResizeObserver(updateNavLayout);
  observer.observe(header);
  observer.observe(menu);
}

// 3. EN-TÊTE MASQUÉ EN DESCENDANT (secours) -------------------------------------
// Les navigateurs récents le font en CSS (« scroll-state »). Pour les autres,
// on ajoute la classe « is-hidden » quand on descend, on la retire en remontant.
if (header && !CSS.supports("container-type", "scroll-state")) {
  let lastY = scrollY;

  addEventListener(
    "scroll",
    () => {
      // Bornage : l'effet « élastique » en haut/bas de page ne doit pas inverser le sens.
      const y = Math.max(0, Math.min(scrollY, document.documentElement.scrollHeight - innerHeight));
      if (y === lastY) return;
      header.classList.toggle("is-hidden", y > lastY && y > header.offsetHeight);
      lastY = y;
    },
    { passive: true },
  );
}
