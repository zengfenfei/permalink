let fs = require('fs')
let crypto = require('crypto')

let rcUrl = process.argv[2]

let encryption = crypto.publicEncrypt(fs.readFileSync('./data/rsa-key.pub'), Buffer.from(rcUrl));
console.log(encryption.toString('base64'))