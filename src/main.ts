import "./style.css";

let intIndexEtape: number = 0;
let tabEtapes: HTMLElement[] = [];
let btnPrecedent: HTMLButtonElement | null = null;
let btnSuivant: HTMLButtonElement | null = null;
let btnSoumettre: HTMLButtonElement | null = null;


function initialiser(): void {
  const form = document.querySelector<HTMLFormElement>("#formDon");
  if (!form) return;


  document.body.classList.add("js");
  form.setAttribute("novalidate", "true");

 
  tabEtapes = Array.from(document.querySelectorAll<HTMLElement>(".etape"));
  btnPrecedent = document.querySelector<HTMLButtonElement>("#btnPrecedent");
  btnSuivant = document.querySelector<HTMLButtonElement>("#btnSuivant");
  btnSoumettre = document.querySelector<HTMLButtonElement>("#btnSoumettre");


  btnPrecedent?.addEventListener("click", () => naviguerEtape(-1));
  btnSuivant?.addEventListener("click", () => naviguerEtape(1));


  intIndexEtape = 0;
  afficherEtape();
}

function naviguerEtape(intDirection: number): void {
  const intNouveau = intIndexEtape + intDirection;
  if (intNouveau >= 0 && intNouveau < tabEtapes.length) {
    intIndexEtape = intNouveau;
    afficherEtape();
  }
}


function afficherEtape(): void {

  tabEtapes.forEach((el, index) => {
    el.classList.toggle("active", index === intIndexEtape);
  });


  if (btnPrecedent) {
    btnPrecedent.style.display = (intIndexEtape === 0) ? "none" : "inline-block";
  }


  const isDerniere = intIndexEtape === tabEtapes.length - 1;
  if (btnSuivant && btnSoumettre) {
    btnSuivant.style.display = isDerniere ? "none" : "inline-block";
    btnSoumettre.style.display = isDerniere ? "inline-block" : "none";
  }
}

document.addEventListener("DOMContentLoaded", initialiser);