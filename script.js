'use strict';
function decrypt() {
    const key = document.getElementsByName('key')[0].value.toUpperCase();
    const message = document.getElementsByName('text')[0].value.toUpperCase();
    const encrypt = document.getElementsByName('encrypt')[0].checked;
    const decrypted = _decrypt(message, key, encrypt ? -1 : 1);
    document.querySelector('#result').innerHTML = decrypted;
}

function countBits(number) {
    var count = 0;
    while (number) {
        number &= (number - 1);
        ++count;
    }
    return count;
}

function hammingDistance(str1, str2) {
    if (str1.length != str2.length) {
        // strings need to be equal length
        return -1;
    }
    count = 0;
    for (var i=0; i < str1.length; ++i) {
        count += countBits(str1.charCodeAt(i) ^ str2.charCodeAt(i));
    }
    return count;
}

function _decrypt(message, key, direction) {
    const re = new RegExp('[^A-Za-z]','g');
    const charA = 'A'.charCodeAt(0);
    const keyArray = [];
    for (var i=0; i < key.length; ++i) {
        if (key[i].match(re) !== null) { continue; }
        keyArray.push(key.charCodeAt(i) - charA);
    }
    const decrypted = [];
    var index = 0;
    for (var i=0; i < message.length; ++i) {
        if (message[i].match(re)) {
            // non-alpha goes straight to decrypted unprocessed.
            decrypted.push(message.charCodeAt(i));
            continue;
        }
        var messageChar = message.charCodeAt(i) - charA;
        var keyChar = keyArray[(index++) % keyArray.length];
        // +26 keeps negative numbers from generating weird character codes
        const decryptedChar = ((messageChar + direction * keyChar + 26) % 26) + charA;
        decrypted.push(decryptedChar);
    }
    // apply goes from an array to a ... list of arguments
    return String.fromCharCode.apply(String, decrypted);
}


