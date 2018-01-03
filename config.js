module.exports = {
    maxMsgLength: 100,
    maxReports: 1,
    mongo: {
        url: process.env.DBHOST || "mongodb://localhost/perpetue"
    }
}