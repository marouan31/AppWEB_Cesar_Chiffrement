document.getElementById('chiffre_btn').addEventListener("click", chiffre);
// Sur frappe up de clavier, 
document.getElementById("chiffre_frm").addEventListener("keyup", function (evt) {
    if (evt && evt.keyCode == 13) {
        document.getElementById('chiffre_btn').click();
    }
    return false;
});


function chiffre() {
    const bouton = document.getElementById('chiffre_btn');
    const champSaisieMsg = document.getElementById("saisie_msg");
    const champSaisieCode = document.getElementById("saisie_code");
    const resultat = document.getElementById("chiffre_resultat");

    // désactive le bouton le temps de faire le travail
    bouton.removeEventListener("click", chiffre);
    bouton.classList.add("inactif");

    let intSaisi = parseInt(champSaisieCode.value, 10);  // Un entier valide ou NaN !

    if (estValide(intSaisi)) {
        resultat.classList.remove("erreur");
        resultat.innerHTML = 'La phrase devient une fois chiffrée :<br>' + chiffreFromFrancais(champSaisieMsg.value, intSaisi);
    } else {
        resultat.classList.add("erreur");
        resultat.innerHTML = "Le code doit être un entier entre 0 et 25 !";
    }
    // Fin du travail, restauration du contexte
    bouton.classList.remove("inactif");
    bouton.addEventListener("click", chiffre);
    return true;
}

function estValide(saisie) {
    return Number.isInteger(saisie) && saisie >= 0 && saisie <= 25;
}

// Traitement du déchiffrage
document.getElementById('dechiffre_btn').addEventListener("click", dechiffre);

function dechiffre() {
    const bouton = document.getElementById('dechiffre_btn');
    const champSaisieMsg = document.getElementById("saisie_msg");
    const resultat = document.getElementById("dechiffre_resultat");

    // désactive le bouton le temps de faire le travail
    bouton.removeEventListener("click", dechiffre);
    bouton.classList.add("inactif");

    resultat.classList.remove("erreur");
    resultat.innerHTML = 'Déchiffrements proposés (les plus probables en premier) :<br>' + dechiffreFromNimporte(champSaisieMsg.value);

    // Fin du travail, restauration du contexte
    bouton.classList.remove("inactif");
    bouton.addEventListener("click", dechiffre);
    return true;
}