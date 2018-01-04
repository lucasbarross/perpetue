module.exports = {
    maxMsgLength: 100,
    maxReports: 15,
    mongo: {
        url: process.env.DBHOST || "mongodb://perpetue:leaveyourmessagetotheworld@ds237947.mlab.com:37947/perpetue" || "mongodb://localhost/perpetue"
    }
}