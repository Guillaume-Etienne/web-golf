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

// 4. FORMULAIRE DE CONTACT (page /contact/) ---------------------------------------
// Réglages dans le HTML du formulaire (voir AGENTS.md) :
//  - action : adresse du service qui reçoit les messages (Google Forms ou autre) ;
//  - data-google-entries : correspondance « nom du champ → entry.XXXX » de Google Forms.
const contactForm = document.querySelector("[data-contact-form]");
if (contactForm) setupContactForm(contactForm);

function setupContactForm(form) {
  const status = form.querySelector("[data-form-status]");
  const submitButton = form.querySelector('[type="submit"]');
  const fields = [...form.querySelectorAll("input, select, textarea")];

  // 4.1 Prestation présélectionnée depuis un lien (ex. /contact/?prestation=carte-verte)
  //     Le lien utilise le data-slug de l'option (la valeur envoyée reste le libellé lisible).
  const wanted = new URLSearchParams(location.search).get("prestation");
  const option = wanted && form.querySelector(`option[data-slug="${CSS.escape(wanted)}"]`);
  if (option) option.selected = true;

  // 4.2 Erreurs accessibles : aria-invalid suit l'état visuel :user-invalid,
  // et le message d'erreur (id dans data-error) n'est relié au champ que s'il est affiché.
  const linkError = (field, shown) => {
    const errorId = field.dataset.error;
    if (!errorId) return;
    const ids = (field.getAttribute("aria-describedby") || "").split(/\s+/).filter((id) => id && id !== errorId);
    if (shown) ids.push(errorId);
    if (ids.length) field.setAttribute("aria-describedby", ids.join(" "));
    else field.removeAttribute("aria-describedby");
  };

  // Une seule zone d'annonce pour la page, lue un instant après la sortie du champ.
  const announcer = document.createElement("div");
  announcer.setAttribute("aria-live", "polite");
  announcer.className = "visually-hidden";
  document.body.append(announcer);
  let announceTimer;
  const announced = new WeakSet();

  const syncAria = (field, announce = false) => {
    if (!field.matches?.("input, select, textarea")) return;
    const invalid = field.matches(":user-invalid");
    field.setAttribute("aria-invalid", String(invalid));
    linkError(field, invalid);
    if (invalid && announce && !announced.has(field)) {
      const error = document.getElementById(field.dataset.error);
      if (error) {
        clearTimeout(announceTimer);
        announcer.textContent = "";
        announceTimer = setTimeout(() => { announcer.textContent = error.textContent.trim(); }, 500);
      }
      announced.add(field);
    }
    if (!invalid) announced.delete(field);
  };

  fields.forEach((field) => syncAria(field));
  form.addEventListener("blur", (e) => syncAria(e.target, true), true);
  form.addEventListener("input", (e) => syncAria(e.target));
  form.addEventListener("change", (e) => syncAria(e.target, true));
  // Envoi refusé par le navigateur : il place lui-même le curseur sur le premier champ en erreur.
  form.addEventListener("invalid", (e) => { announced.add(e.target); syncAria(e.target); }, true);

  const showStatus = (state, message) => {
    status.dataset.state = state;
    status.textContent = message;
  };

  // 4.3 Envoi (déclenché seulement si tous les champs sont valides)
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);

    // Champ piège rempli = robot : on fait semblant que tout va bien, sans rien envoyer.
    if (data.get("site_web")) {
      form.reset();
      showStatus("success", "Merci, votre demande a bien été envoyée.");
      return;
    }
    data.delete("site_web");

    if (form.action.includes("VOTRE_ID")) {
      showStatus("error", "Le formulaire n'est pas encore activé. Appelez-moi au 06 08 03 41 94.");
      return;
    }

    const isGoogleForm = new URL(form.action).hostname === "docs.google.com";
    let body = data;
    if (isGoogleForm) {
      // Google Forms attend ses propres noms de champs (entry.XXXX).
      const entries = JSON.parse(form.dataset.googleEntries || "{}");
      body = new FormData();
      for (const [name, value] of data) body.append(entries[name] ?? name, value);
    }

    submitButton.disabled = true; // évite un double envoi
    showStatus("pending", "Envoi en cours…");
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body,
        // Google Forms ne renvoie pas de réponse lisible : envoi « no-cors ».
        ...(isGoogleForm ? { mode: "no-cors" } : { headers: { Accept: "application/json" } }),
      });
      if (!isGoogleForm && !response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      fields.forEach((field) => syncAria(field));
      showStatus("success", "Merci, votre demande a bien été envoyée. Je vous recontacte rapidement pour organiser la séance.");
    } catch {
      showStatus("error", "L'envoi n'a pas abouti. Réessayez dans un instant ou appelez-moi au 06 08 03 41 94.");
    } finally {
      submitButton.disabled = false;
    }
  });
}
