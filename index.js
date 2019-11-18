const express = require("express");
const app = express();
const databaseActions = require("./utils/db.js");

app.use(express.static("./public"));

app.get("/images", (req, res) => {
    // let images = [];
    databaseActions
        .getImages()
        .then(results => {
            res.json(results.rows);
        })
        .catch(err => console.log("wrong db query"));
});

app.listen(8080, () => console.log("imageboard awake"));
