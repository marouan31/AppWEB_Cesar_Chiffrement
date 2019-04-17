"use strict";
/**
 * Outils de manipulation du code de César (chiffrement par décalage caractère par caractère).
 * 
 * Jeu de caractères suportés : français
 * @see https://fr.wikipedia.org/wiki/Chiffrement_par_d%C3%A9calage
 */
// const assert = require('../modules/assert');


/**
 * Retourne chiffré (en minuscules) le message fourni avec le code.
 * 
 * Chaque caractère du message original est remplacé par le caractère qui se trouve à une distance et un sens fixés
 * dans le jeu de caractères latin.
 * Si le décalage fourni est positif, on se déplace vers les caractères suivants, vers les précédents sinon.
 * 
 * Le jeu de caractères du message à chiffrer est l'alphabet français (42 lettres) "abcdefghijklmnopqrstuvwxyzàâéèêëîïôùûüÿ".
 * Tout autre caractère ne sera pas chiffré.
 * Le jeu de caractères du message chiffré est l'alphabet latin (26 lettres) "abcdefghijklmnopqrstuvwxyz".
 * Dans ce qui suit j'entends par latin pur une string dont tout caractère est dans l'alphabet (donc pas d'espace, etc.).
 *
 * @param {string} message - Le message original à chiffrer.
 * @param {number} decalage - Le décalage à appliquer, un entier positif ou négatif.
 * @returns {string} le message chiffré.
 * @see https://fr.wikipedia.org/wiki/Alphabet_fran%C3%A7ais
 * @author V. Britelle
 */
function chiffreFromFrancais(msg, decalage) {

    if (typeof decalage !== 'number') {
        throw new TypeError('Le décalage doit être un number');
    }
    if (!Number.isInteger(decalage) || Math.abs(decalage) > Number.MAX_SAFE_INTEGER) {
        throw new RangeError('Le décalage doit être un entier possible en JavaScript');
    }
    return chiffreFromLatinPur(francaisToLatinPur(msg), decalage);
}


/**
 * Retourne le message fourni en caractères latins après chiffrement 
 * par décalage dans le même alphabet.
 *
 * @param {*} msg - Le message (en caractères latins purs) à chiffrer
 * @param {*} decalage - La distance vers le caractère chiffrant
 * @returns {string} Le message chiffré (peut être '')
 * @author V. Britelle
 */
function chiffreFromLatinPur(msg, decalage) {
    decalage = decalage % 26; // Modulo par sécurité, pas la peine de promener un grand
    let msgOut = '';
    for (let i = 0; i < msg.length; i++) {
        msgOut += decaleCharLatin(msg.charAt(i), decalage);
    }
    return msgOut;
}


/**
 * Retourne le message (alphabet français) transcrit dans l'alphabet latin minuscule.
 * Note : Il n'y a plus aucun caractère hors alphabet latin (plus d'espace, etc.)!
 * @param {string} msg - Le message fourni en alphabet français maj ou min avec autres caractères (point, espace...)
 * @returns {string} Le message transcrit en alphabet latin minuscule sans autre symbole.
 * @author V. Britelle
 */
function francaisToLatinPur(msg) {
    let msgOut = '';
    for (let i = 0; i < msg.length; i++) {
        msgOut += latiniseChar(msg.charAt(i)); // Ajout charactère(s) équivalent(s)
    }
    return msgOut;
}


/**
 * Retourne le caractère latin fourni après décalage à la distance donnée (positive ou négative)
 *
 * @param {string} c - Le caractère latin de départ
 * @param {string} distance - Un entier positif ou négatif
 * @return {string} Le caractère à la distance donnée 
 */
function decaleCharLatin(c, distance) {
    // Le 26 permet de gérer les décalages négatifs car -1 % 26 vaut -1 ! alors que 26-1 % 26 vaut bien 25 !
    return String.fromCharCode(((26 + rangDansAlphabetLatin(c) - 1 + distance) % 26) + 'a'.codePointAt(0));
}


/**
 * Retourne le rang du caractère de l'alphabet latin fourni (maj ou min)
 *
 * @param {string} c - un caractère de l'alphabet latin pur [a-z]
 * @returns {number} le rang (1-26) du caractère
 */
function rangDansAlphabetLatin(c) {
    return c.toLowerCase().codePointAt(0) - 'a'.codePointAt(0) + 1;
}


/**
 * Retourne (en minuscule) une string de caractère de l'alphabet latin
 * correspondant à un caractère de l'alphabet français.
 * Retourne '' si le caractère fourni est hors alphabet français.
 * 
 * Les lettres accentuées (à, â, é, è, ê, ë, î, ï, ô, ù, û, ü, ÿ) seront remplacées en leur équivalent sans accent.
 * Le ç sera remplacé par c.
 * Les ligatures (æ, œ) seront remplacées par la paire de caractères correspondante.
 *
 * @param {string} s - un caractère à latiniser
 * @returns {string} le caractère équivalent de l'alphabet latin ou '' si pas d'équivalent.
 * @author V. Britelle 
 */
function latiniseChar(c) {
    let s = c.toLowerCase();
    if (['à', 'â'].indexOf(s) !== -1) { s = 'a'; }
    else if (['é', 'è', 'ê', 'ë'].indexOf(s) !== -1) { s = 'e'; }
    else if (['î', 'ï'].indexOf(s) !== -1) { s = 'i'; }
    else if (['ô'].indexOf(s) !== -1) { s = 'o'; }
    else if (['ù', 'û', 'ü'].indexOf(s) !== -1) { s = 'u'; }
    else if (['ÿ'].indexOf(s) !== -1) { s = 'y'; }
    else if (['ç'].indexOf(s) !== -1) { s = 'c'; }
    else if (['æ'].indexOf(s) !== -1) { s = 'ae'; }
    else if (['œ'].indexOf(s) !== -1) { s = 'oe'; }
    else if (s < 'a' || s > 'z') { s = ''; }
    return s;
}


/**
 * Déchiffre le message fourni avec tous les codes possibles
 * retourne une string qui liste les propositions de déchiffrage du plus probable au moins probable.
 * 
 * @param {string} msg - Le message d'origine, string quelconque
 * @return {Array} un tableau d'objets avec 2 propriétés : msg et note. Plus la note est élevée plus l'objet a des chances de représenter le déchiffrage corret
 */
function dechiffreFromNimporte(msg) {

    // transcrit le Nimporte en alphabet latin par sécurité
    msg = francaisToLatinPur(msg);

    let table = new Array(26);

    // Pour les codes possible (de 1 à 25)
    for (let code = 0; code < 26; code++) {
        // Le message est déchiffré avec le code
        let msgProposition = dechiffreFromLatinPur(msg, code);
        // Une note est associée au déchiffrage (lié à une langue)
        table[code] = {
            msg: msgProposition,
            note: noteFrancais(msgProposition, code),
            code: code
        };
    }
    // Tri par note décroissante
    let t = table.sort(function (a, b) { return b.note - a.note; });
    // Construction de la string retournée
    let ret = '';
    for (let m of t) {
        ret += m.msg + '<br>';
    }
    return ret;
}


function dechiffreFromLatinPur(msg, code) {
    return chiffreFromLatinPur(msg, -code);
}

/**
 * Heuristique simple (iste?)
 * Affectation d'un poids correspondant à la proba d'occurence des lettres majeures
 * e a s i n t r
 * @see https://fr.wikipedia.org/wiki/Fr%C3%A9quence_d%27apparition_des_lettres_en_fran%C3%A7ais
 */
function noteFrancais(msg) {
    let nbOccurCar = new Array(26); // Compte les occurences de la lettre 0-25 a-z
    let laNote = 0;
    let freqLettreFrancais = [711, 114, 318, 367, 1210, 111, 123, 111, 659, 34,
        29, 496, 262, 639, 502, 249, 65, 607, 651, 592, 449, 111, 17, 38, 46, 15];

    nbOccurCar.fill(0);
    for (let i = 0; i < msg.length; i++) {
        nbOccurCar[rangDansAlphabetLatin(msg.charAt(i)) - 1] += 1;
    }

    for (let i = 0; i < 26; i++) {
        laNote += nbOccurCar[i] * freqLettreFrancais[i];
    }
    return laNote;
}

// testNoteFrancais();
// function testNoteFrancais() {
//     let t = 1;
//     assert.isTrue(t++, noteFrancais('e') === 1210);
//     assert.isTrue(t++, noteFrancais('ee') === 2420);
//     assert.isTrue(t++, noteFrancais('easi') === 3231);
// }

// testChiffreFromFrancais();
// function testChiffreFromFrancais() {
//     let t = 1;
//     assert.isTrue(t++, chiffreFromFrancais('œæŒÆàâéèêëîïôùûüÿç', 0) === 'oeaeoeaeaaeeeeiiouuuyc');
//     assert.isTrue(t++, chiffreFromFrancais('abcdefghijklmnopqrstuvwxyz', 1) === 'bcdefghijklmnopqrstuvwxyza');
//     assert.isTrue(t++, chiffreFromLatinPur('abcdefghijklmnopqrstuvwxyz', -1) === 'zabcdefghijklmnopqrstuvwxy');
//     assert.isTrue(t++, chiffreFromLatinPur('abcdefghijklmnopqrstuvwxyz', 26) === 'abcdefghijklmnopqrstuvwxyz');
//     assert.isTrue(t++, chiffreFromLatinPur('abcdefghijklmnopqrstuvwxyz', -26) === 'abcdefghijklmnopqrstuvwxyz');
//     assert.isTrue(t++, chiffreFromFrancais('', 0) === '');
//     assert.isTrue(t++, chiffreFromFrancais(' ./-_{})([]\n', 0) === '');
// }

// testChiffreFromLatinPur();
// function testChiffreFromLatinPur() {
//     let t = 1;
//     assert.isTrue(t++, chiffreFromLatinPur('abcdefghijklmnopqrstuvwxyz', -1) === 'zabcdefghijklmnopqrstuvwxy');
//     assert.isTrue(t++, chiffreFromLatinPur('abcdefghijklmnopqrstuvwxyz', 1) === 'bcdefghijklmnopqrstuvwxyza');
//     assert.isTrue(t++, chiffreFromLatinPur('a', 1) === 'b');
//     assert.isTrue(t++, chiffreFromLatinPur('b', 1) === 'c');
// }

// testFrancaisToLatinPur();
// function testFrancaisToLatinPur() {
//     let t = 1;
//     assert.isTrue(t++, francaisToLatinPur('œæŒÆ') === 'oeaeoeae');
//     assert.isTrue(t++, francaisToLatinPur('àâéèêëîïôùûüÿ') === 'aaeeeeiiouuuy');
//     assert.isTrue(t++, francaisToLatinPur(' .-\n') === '');
//     assert.isTrue(t++, francaisToLatinPur('') === '');
// }

// testDecaleCharLatin();
// function testDecaleCharLatin() {
//     let t = 1;
//     assert.isTrue(t++, decaleCharLatin('a', 1) === 'b');
//     assert.isTrue(t++, decaleCharLatin('a', 26) === 'a');
//     assert.isTrue(t++, decaleCharLatin('z', 1) === 'a');
//     assert.isTrue(t++, decaleCharLatin('a', -1) === 'z');
//     assert.isTrue(t++, decaleCharLatin('a', -26) === 'a');
//     assert.isTrue(t++, decaleCharLatin('z', -1) === 'y');
// }

// testLatiniseChar();
// function testLatiniseChar() {
//     let t = 1;
//     assert.isTrue(t++, latiniseChar('a') === 'a');
//     assert.isTrue(t++, latiniseChar('A') === 'a');
//     assert.isTrue(t++, latiniseChar(' ') === '');
//     assert.isTrue(t++, latiniseChar('.') === '');
//     assert.isTrue(t++, latiniseChar('à') === 'a');
//     assert.isTrue(t++, latiniseChar('â') === 'a');
//     assert.isTrue(t++, latiniseChar('é') === 'e');
//     assert.isTrue(t++, latiniseChar('è') === 'e');
//     assert.isTrue(t++, latiniseChar('ê') === 'e');
//     assert.isTrue(t++, latiniseChar('ë') === 'e');
//     assert.isTrue(t++, latiniseChar('î') === 'i');
//     assert.isTrue(t++, latiniseChar('ï') === 'i');
//     assert.isTrue(t++, latiniseChar('ô') === 'o');
//     assert.isTrue(t++, latiniseChar('ù') === 'u');
//     assert.isTrue(t++, latiniseChar('û') === 'u');
//     assert.isTrue(t++, latiniseChar('ü') === 'u');
//     assert.isTrue(t++, latiniseChar('ÿ') === 'y');
//     assert.isTrue(t++, latiniseChar('ç') === 'c');
//     assert.isTrue(t++, latiniseChar('æ') === 'ae');
//     assert.isTrue(t++, latiniseChar('œ') === 'oe');
//     assert.isTrue(t++, latiniseChar('') === '');
// }

// testRangDansAlphabetLatin();
// function testRangDansAlphabetLatin() {
//     let t = 1;
//     assert.isTrue(t++, rangDansAlphabetLatin('a') === 1);
//     assert.isTrue(t++, rangDansAlphabetLatin('b') === 2);
//     assert.isTrue(t++, rangDansAlphabetLatin('z') === 26);
// }

// console.log(dechiffreFromLatinPur('a', 1));
// console.log(dechiffreFromLatinPur('a', 2));
// console.log(dechiffreFromLatinPur('a', 3));
// testDechiffreFromLatinPur();
// function testDechiffreFromLatinPur() {
//     let t = 1;
//     assert.isTrue(t++, dechiffreFromLatinPur('abcdefghijklmnopqrstuvwxyz', 1) === 'zabcdefghijklmnopqrstuvwxy');
//     assert.isTrue(t++, dechiffreFromLatinPur('abcdefghijklmnopqrstuvwxyz', -1) === 'bcdefghijklmnopqrstuvwxyza');
//     assert.isTrue(t++, dechiffreFromLatinPur('a', 1) === 'z');
//     assert.isTrue(t++, dechiffreFromLatinPur('b', 1) === 'a');
//     assert.isTrue(t++, dechiffreFromLatinPur('c', 1) === 'b');
//     assert.isTrue(t++, dechiffreFromLatinPur('z', 1) === 'y');
// }

