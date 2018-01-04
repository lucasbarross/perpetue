var Hashids    = require("hashids"),
    randomName = require('node-random-name');

var hashids = new Hashids('Perpetue');
var genres = ["male", "female"];

function generateUser(ip){
    ip = ip.replace(".", "");
    ip = ip.replace(":", "");
    console.log(ip);
    let ipHash = hashids.encode(parseInt(ip));
    console.log("After hashid, in user module: " + ipHash);
    let genre = genres[parseInt(ip[8])%2];
    let name = randomName({gender: genre, seed: ipHash});
    return {
        name: name,
        genre: genre,
        ipHash: ipHash
    }
}

module.exports = {
    generateUser: generateUser
}