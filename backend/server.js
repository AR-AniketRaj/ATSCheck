const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("ATS Backend Running");
});

app.listen(5000, () => {
    console.log("Server Running");
});