const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./util/DbConnection");
const app = express();
const PORT = 3000

dbConnection();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173", // Change this to match your frontend URL
    credentials: true
}));

const authuser = require("./router/AuthRouter")

app.use("/user", authuser);

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})