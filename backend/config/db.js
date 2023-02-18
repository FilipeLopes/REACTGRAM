const mongoose = require("mongoose");

// Connection
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

const conn = async () => {
    try {
        const dbConn = await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.mz62zxz.mongodb.net/?retryWrites=true&w=majority`);
        console.log("Connected on DB");
        return dbConn;
    } catch (error) {
        console.log(error);
    }
};

conn();

module.exports = conn;