const process = require('process');

const re = new RegExp('[^A-Za-z]','g');
let base = 2;
let direction = 1;
while (process.argv[base][0] === '-') {
    switch(process.argv[base][1]) {
        case 'e': direction = -1; console.log('encrypting'); break;
        case 'd': direction = 1; console.log('decrypting'); break;
        case 'h': direction = 0; console.log('hamming'); break;
        case 'k': direction = 2; console.log('keysize'); break;
    }
    ++base;
}
var key = process.argv[base];
var message = process.argv[base + 1];

if (direction === 0) {
    console.log('hamming distance ' + hammingDistance(key, message));
    process.exit(0);
}

key = key.toUpperCase().replace(re, '');
message = message.toUpperCase();

if (direction === 2) {
    const counts = [];
    for (keysize = 1; keysize < Math.floor(message.length/2); ++keysize) {
        counts[keysize-1] = { keysize: keysize, 
                              distance: hammingDistance(
                                message.slice(0, keysize), 
                                message.slice(keysize, keysize*2)
                              )/keysize
                            };
    }
    counts.sort((a,b) => {
        return a.distance - b.distance;
    });
    console.log('counts ' + JSON.stringify(counts));
    counts.forEach(item => {
        const keysize = item.keysize;
        const frequencies = charFrequency(message, keysize);
        console.log('keysize ' + keysize + ' letter frequencies ' + JSON.stringify(frequencies));
        console.log("\n\n");
    });
}

const charA = 'A'.charCodeAt(0);
const keyArray = [];
for (let i=0; i < key.length; ++i) {
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
    const messageChar = message.charCodeAt(i) - charA;
    const keyChar = keyArray[index];
    index = (index + 1) % keyArray.length;
    // +26 keeps negative numbers from generating weird character codes
    const decryptedChar = ((messageChar + direction * keyChar + 26) % 26) + charA;
    decrypted.push(decryptedChar);
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
    if (str1.length !== str2.length) {
        console.log('str1 length '+str1.length);
        console.log('str2 length '+str2.length);
        // strings need to be equal length
        return -1;
    }
    count = 0;
    for (var i=0; i < str1.length; ++i) {
        count += countBits(str1.charCodeAt(i) ^ str2.charCodeAt(i));
    }
    return count;
}

function charFrequency(message, skip) {
    const counts = {};
    for (var i=0; i < message.length; i += skip) {
        const charcode = message[i];
        counts[charcode] ? counts[charcode]++ : counts[charcode] = 1;
    }
    const result = [];
    Object.keys(counts).forEach(key => {
        result.push({charcode: key, count: counts[key]});
    });
    return result.sort((a,b) => {
        return b.count - a.count;
    });
}

// apply goes from an array to a ... list of arguments
console.log('decrypted '+String.fromCharCode.apply(String, decrypted));
