'use strict';
function decrypt() {
    const key = document.getElementsByName('key')[0].value.toUpperCase();
    const message = document.getElementsByName('text')[0].value.toUpperCase();
    const encrypt = document.getElementsByName('encrypt')[0].checked;
    const decrypted = _decrypt(message, key, encrypt ? -1 : 1);
    document.querySelector('#result').innerHTML = decrypted;
}

function _decrypt(message, key, direction) {
    const re = new RegExp('[^A-Za-z]','g');
    const charA = 'A'.charCodeAt(0);
    const keyArray = [];
    for (let i=0; i < key.length; ++i) {
        if (key[i].match(re) !== null) { continue; }
        keyArray.push(key.charCodeAt(i) - charA);
    }
    const decrypted = [];
    let index = 0;
    for (let i=0; i < message.length; ++i) {
        if (message[i].match(re)) {
            // non-alpha goes straight to decrypted unprocessed.
            decrypted.push(message.charCodeAt(i));
            continue;
        }
        let messageChar = message.charCodeAt(i) - charA;
        let keyChar = keyArray[(index++) % keyArray.length];
        // +26 keeps negative numbers from generating weird character codes
        const decryptedChar = ((messageChar + direction * keyChar + 26) % 26) + charA;
        decrypted.push(decryptedChar);
    }
    // apply goes from an array to a ... list of arguments
    return String.fromCharCode.apply(String, decrypted);
}
