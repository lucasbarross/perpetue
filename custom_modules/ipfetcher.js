module.exports = {
    getIp: function(req){
        var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
        ip = ip.split(".").join("").split(":")[0];
        return ip;            
    }
}