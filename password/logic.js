const words = data; // data is read in via html
const joiners = '-.,:;+';

function generate() {
    let capitalize = document.getElementById("capitalize").checked; // use uppercase letters
    let numbers = document.getElementById("numbers").checked; // add numbers
    let wordCount = 3; // how many parts are in the password, currently fixed
    // console.log(capitalize, numbers);

    let password = [];

    for (let i = 0; i < wordCount; i++) {
        let word = randomChoice(words);
        password.push(word);
    }

    if (capitalize) {
        let pos = randomInteger(password.length - 1);
        password[pos] = wordCapitalize(password[pos]);
    }

    if (numbers) {
        let pos = randomInteger(password.length - 1);
        password[pos] = wordAddNumber(password[pos]);
    }

    let joiner = randomChoice(joiners);
    password = password.join(joiner);

    const resultElement = document.getElementById("result");
    resultElement.innerText = password;
}

function randomInteger(max) {
    // return a random integer between 0 and max (inclusive)
    max = max + 1;
    return Math.floor(Math.random() * max);
}

function randomChoice(list) {
    const index = list.length - 1;
    return list[randomInteger(index)];
}

function wordCapitalize(word, force = false) {
    // use a random capitalization on a given string

    let cmd = randomChoice([
        "toUpperCase",
        "capitalize"
    ])

    switch (cmd) {
        case "toUpperCase":
            return word.toUpperCase();
        case "capitalize":
            return word.charAt(0).toUpperCase() + word.slice(1);
    }
}

function wordAddNumber(word) {
    // randomly return only number, number + word, word + number
    let num = randomInteger(99).toString();
    if (randomInteger(1) && word === word.toLowerCase()) {
        // do not numberize a word which has been capitalized
        // just num
        return num;
    }
    if (randomInteger(1)) {
        // num before word
        return num + word;
    }
    // num after word
    return word + num;
}