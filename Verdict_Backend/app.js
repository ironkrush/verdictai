require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./util/DbConnection");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Routes
const authuser = require("./router/AuthRouter");
app.use("/user", authuser);

// Start server
dbConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
});
