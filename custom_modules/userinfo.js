var Hashids    = require("hashids"),
    randomName = require('node-random-name');

var hashids = new Hashids('Perpetue');
var genres = ["male", "female"];

function generateUser(ip){
    ip = ip.split(".").join("").split(":")[0]; //limpa os pontos e dois pontos do IP para transformar em int com sucesso.
    var ipHash = hashids.encode(parseInt(ip));
    var genre = genres[parseInt(ip[8])%2];
    var name = randomName({gender: genre, seed: ipHash});
    return {
        name: name,
        genre: genre,
        ipHash: ipHash
    }
}

module.exports = {
    generateUser: generateUser
}