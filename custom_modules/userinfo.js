var Hashids    = require("hashids"),
    randomName = require('node-random-name');

var hashids = new Hashids('Perpetue');
var genres = ["male", "female"];

function generateUser(ip){
    let ipHash = hashids.encode(parseInt(ip));
    let genre = genres[parseInt(ip[4])%2];
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