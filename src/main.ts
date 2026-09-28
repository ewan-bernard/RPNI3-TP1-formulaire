import "./style.css";

const tabTitresEtapes: string[] = [
  "Choix du don",
  "Coordonnées",
  "Paiement",
  "Résumé"
];

let intIndexEtape: number = 0;
let tabEtapes: HTMLElement[] = [];
let btnPrecedent: HTMLButtonElement | null = null;
let btnSuivant: HTMLButtonElement | null = null;
let btnSoumettre: HTMLButtonElement | null = null;

// fonc recap don
function actualiserRecapDon(): void {
  const champMontant = document.querySelector<HTMLInputElement>("#montant");
  const radioFrequence = document.querySelector<HTMLInputElement>("input[name='typeDon']:checked");
  const zoneRecap = document.querySelector<HTMLElement>("#recapDonLive");
  const conteneurMontant = document.querySelector<HTMLElement>("#conteneurMontant");
  const iconeErreur = document.querySelector<HTMLElement>("#iconeErreurMontant");
  const texteErreur = document.querySelector<HTMLElement>("#erreurMontant");

  const intMontant = Number(champMontant?.value || 0);
  const strSuffixe = radioFrequence?.value === "mensuel" ? " / mois" : "";

  if (intMontant < 5) {
    conteneurMontant?.classList.add("border-red-500");
    iconeErreur?.classList.remove("hidden");
    texteErreur?.classList.remove("hidden");
  } else {
    conteneurMontant?.classList.remove("border-red-500");
    iconeErreur?.classList.add("hidden");
    texteErreur?.classList.add("hidden");
  }

  if (zoneRecap) {
    zoneRecap.textContent = `${intMontant} $${strSuffixe}`;
  }
}

// fonc de validation erreurs
function validerChamp(champ: HTMLInputElement | HTMLSelectElement): boolean {
  const strValeur = champ.value.trim();
  const spanErreur = champ.parentElement?.querySelector(".erreur") as HTMLElement | null;

  let strMessage = "";

  if (champ.required && strValeur === "") {
    strMessage = "Ce champ est obligatoire.";
  } else if ("pattern" in champ && champ.pattern && strValeur !== "") {
    const objRegex = new RegExp(champ.pattern);
    if (!objRegex.test(strValeur)) {
      strMessage = "Format invalide.";
    }
  }

  if (champ.id === "montant" && Number(strValeur) < 5) {
    strMessage = "Veuillez indiquer un montant supérieur ou égal à 5,00$.";
  }

  if (strMessage !== "") {
    if (spanErreur) spanErreur.textContent = strMessage;
    champ.classList.add("champ-erreur");
    champ.setAttribute("aria-invalid", "true");
    return false;
  } else {
    if (spanErreur) spanErreur.textContent = "";
    champ.classList.remove("champ-erreur");
    champ.removeAttribute("aria-invalid");
    return true;
  }
}

// valider etape
function validerEtape(): boolean {
  const etapeCourante = tabEtapes[intIndexEtape];
  const tabChamps = etapeCourante.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select");
  let blnValide = true;

  tabChamps.forEach((champ) => {
    if (champ instanceof HTMLInputElement && champ.type === "radio" && !champ.checked) {
      return;
    }
    if (!validerChamp(champ)) {
      blnValide = false;
    }
  });

  return blnValide;
}

// resumer final
function actualiserResumeFinal(): void {
  const zoneRecapLive = document.querySelector<HTMLElement>("#recapDonLive");
  const prenom = document.querySelector<HTMLInputElement>("#prenom")?.value || "";
  const nom = document.querySelector<HTMLInputElement>("#nom")?.value || "";
  const courriel = document.querySelector<HTMLInputElement>("#courriel")?.value || "";
  const carte = document.querySelector<HTMLInputElement>("#carte")?.value || "";
  const typeCarte = document.querySelector<HTMLInputElement>("input[name='typeCarte']:checked")?.value || "Carte";

  const elRecap = document.querySelector("#recapDonFinal");
  const elNom = document.querySelector("#recapNomFinal");
  const elCourriel = document.querySelector("#recapCourrielFinal");
  const elCarte = document.querySelector("#recapCarteFinal");

  if (elRecap && zoneRecapLive) elRecap.textContent = zoneRecapLive.textContent;
  if (elNom) elNom.textContent = `${prenom} ${nom}`.trim() || "—";
  if (elCourriel) elCourriel.textContent = courriel || "—";
  if (elCarte) {
    const fin = carte.replace(/\s+/g, "").slice(-4) || "••••";
    elCarte.textContent = `${typeCarte} se terminant par ${fin}`;
  }
}

function actualiserProgression(): void {
  const segments = document.querySelectorAll("#barreProgression > li");
  segments.forEach((seg, idx) => {
    if (idx <= intIndexEtape) {
      seg.className = "h-1 rounded-full bg-black transition-colors";
      seg.setAttribute("aria-current", "step");
    } else {
      seg.className = "h-1 rounded-full bg-neutral-200 transition-colors";
      seg.removeAttribute("aria-current");
    }
  });

  const labelEtape = document.querySelector("#labelEtape");
  const etapesRestantes = document.querySelector("#etapesRestantes");
  const intRestantes = tabEtapes.length - 1 - intIndexEtape;

  if (labelEtape) labelEtape.textContent = tabTitresEtapes[intIndexEtape] || "";
  if (etapesRestantes) {
    etapesRestantes.textContent = intRestantes > 0 ? `${intRestantes} étape${intRestantes > 1 ? "s" : ""} restante${intRestantes > 1 ? "s" : ""}` : "Dernière étape";
  }
}

function naviguerEtape(intDirection: number): void {
  if (intDirection === 1 && !validerEtape()) {
    return;
  }

  const intNouveau = intIndexEtape + intDirection;
  if (intNouveau >= 0 && intNouveau < tabEtapes.length) {
    intIndexEtape = intNouveau;
    if (intIndexEtape === tabEtapes.length - 1) {
      actualiserResumeFinal();
    }
    afficherEtape();
  }
}

function afficherEtape(): void {
  tabEtapes.forEach((el, index) => {
    el.classList.toggle("active", index === intIndexEtape);
  });

  actualiserProgression();

  if (btnPrecedent) {
    btnPrecedent.classList.toggle("opacity-30", intIndexEtape === 0);
    btnPrecedent.classList.toggle("cursor-not-allowed", intIndexEtape === 0);
    if (intIndexEtape === 0) {
      btnPrecedent.setAttribute("aria-disabled", "true");
    } else {
      btnPrecedent.removeAttribute("aria-disabled");
    }
  }

  const blnEstDerniere = intIndexEtape === tabEtapes.length - 1;
  if (btnSuivant && btnSoumettre) {
    btnSuivant.style.display = blnEstDerniere ? "none" : "block";
    btnSoumettre.style.display = blnEstDerniere ? "block" : "none";
  }
}

// fonc d'initialisation
function initialiser(): void {
  const form = document.querySelector<HTMLFormElement>("#formDon");
  if (!form) return;

  document.body.classList.add("js");
  form.setAttribute("novalidate", "true");

  tabEtapes = Array.from(document.querySelectorAll<HTMLElement>(".etape"));
  btnPrecedent = document.querySelector<HTMLButtonElement>("#btnPrecedent");
  btnSuivant = document.querySelector<HTMLButtonElement>("#btnSuivant");
  btnSoumettre = document.querySelector<HTMLButtonElement>("#btnSoumettre");

  btnPrecedent?.addEventListener("click", () => {
    if (intIndexEtape > 0) naviguerEtape(-1);
  });
  btnSuivant?.addEventListener("click", () => naviguerEtape(1));

  document.querySelectorAll<HTMLInputElement>("input[name='typeDon']").forEach((radio) => {
    radio.addEventListener("change", () => {
      document.querySelectorAll("input[name='typeDon']").forEach((r) => {
        const li = r.closest("li");
        const coche = (r as HTMLInputElement).checked;
        li?.classList.toggle("border-neutral-900", coche);
        li?.classList.toggle("border-neutral-200", !coche);
      });
      actualiserRecapDon();
    });
  });


  document.querySelectorAll<HTMLInputElement>("input[name='montantFixe']").forEach((radio) => {
    radio.addEventListener("change", () => {
      document.querySelectorAll("input[name='montantFixe']").forEach((r) => {
        const li = r.closest("li");
        const coche = (r as HTMLInputElement).checked;
        li?.classList.toggle("border-neutral-900", coche);
        li?.classList.toggle("border-neutral-200", !coche);
      });

      const champMontant = document.querySelector<HTMLInputElement>("#montant");
      if (champMontant && radio.value !== "autre") {
        champMontant.value = radio.value;
      }
      actualiserRecapDon();
    });
  });


  const champMontant = document.querySelector<HTMLInputElement>("#montant");
  champMontant?.addEventListener("input", actualiserRecapDon);

  document.querySelectorAll<HTMLInputElement | HTMLSelectElement>("#formDon input, #formDon select").forEach((champ) => {
    champ.addEventListener("blur", () => validerChamp(champ));
  });

  intIndexEtape = 0;
  actualiserRecapDon();
  afficherEtape();
}

document.addEventListener("DOMContentLoaded", initialiser);