var request = require("request");

function valid_captcha(captchaResponse, ip){
    return new Promise((resolve, reject) => {
        if(captchaResponse == undefined || captchaResponse == "" || captchaResponse == null){
            reject(Error("Captcha is empty."));
        }
        
        var secretKey = "6LeQFT4UAAAAAG1ZiBSZOdNuY5gkF8SK-2CClcuY";
        var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?" + 
        "secret=" + secretKey + 
        "&response=" + captchaResponse + 
        "&remoteip=" + ip;

        request(verificationUrl, function(error, response, body){
            body = JSON.parse(body);
            if(error){
                reject(error);
            } else if (body.success != undefined && body.success){
                resolve();
            } else {
                reject(Error("Error validating captcha."));
            }
        })
    })
}

module.exports = {
    valid_captcha: valid_captcha
};