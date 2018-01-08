module.exports = {
    maxMsgLength: 100,
    maxReports: 15,
    mongo: {
        url: process.env.DBHOST || "mongodb://localhost/perpetue"
    }
}