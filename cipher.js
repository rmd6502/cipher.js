const process = require('process');

const re = new RegExp('[^A-Za-z]','g');
let base = 2;
let direction = 1;
while (process.argv[base][0] === '-') {
    ++base;
    switch(process.argv[base][1]) {
        case 'e': direction = -1; break;
        case 'd': direction = 1; break;
    }
}
const key = process.argv[base].replace(re, '').toUpperCase();
const message = process.argv[base + 1].replace(re, '').toUpperCase();

const charA = 'A'.charCodeAt(0);
const keyArray = [];
for (let i=0; i < key.length; ++i) {
    keyArray.push(key.charCodeAt(i) - charA);
}

const decrypted = [];
for (let i=0; i < message.length; ++i) {
    // +26 keeps negative numbers from generating weird character codes
    const messageChar = message.charCodeAt(i) - charA;
    const keyChar = keyArray[i % keyArray.length];
    const decryptedChar = ((messageChar + direction * keyChar + 26) % 26) + charA;
    decrypted.push(decryptedChar);
}
// apply goes from an array to a ... list of arguments
console.log('decrypted '+String.fromCharCode.apply(String, decrypted));
