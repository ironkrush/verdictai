const mongoose = require("mongoose"); // Corrected spelling of "mongoose"
// const uri = "mongodb+srv://VerdictAI:4BRIOlCSsOvvMs9z@cluster0.xcyh1.mongodb.net/VerdictAI";
const uri = "mongodb+srv://anagh0106:nMYDSCNmmp89XBRr@cluster0.bnc2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const dbConnection = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Database Connection Established Successfully!");
    } catch (err) {
        console.error("Database Connection Error:", err);
    }
};

module.exports = { dbConnection };