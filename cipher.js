const process = require('process');

const re = new RegExp('[^A-Za-z]','g');
const key = process.argv[2].replace(re, '').toUpperCase();
const message = process.argv[3].replace(re, '').toUpperCase();

const charA = 'A'.charCodeAt(0);
const keyArray = [];
for (let i=0; i < key.length; ++i) {
    keyArray.push(key.charCodeAt(i) - charA);
}

const decrypted = [];
for (let i=0; i < message.length; ++i) {
    // +26 keeps negative numbers from generating weird character codes
    decrypted.push(((message.charCodeAt(i) - charA + keyArray[i % keyArray.length] + 26) % 26) + charA);
}
// apply goes from an array to a ... list of arguments
console.log('decrypted '+String.fromCharCode.apply(String, decrypted));
