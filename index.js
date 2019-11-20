const express = require("express");
const app = express();
const databaseActions = require("./utils/db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config.json");

/////constants that include upload-address, generated uid-url for imageaddress in database
/// multer as predfined api with method use for middlewear.
const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static("./public"));
app.use(express.json());

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { title, desc, username } = req.body;
    const imageURL = `${s3Url}/${req.file.filename}`;

    databaseActions
        .uploadImages(imageURL, username, title, desc)
        .then(result => {
            res.json({
                image: result.rows[0],
                success: true
            });
            console.log(result.rows[0]);
        })
        .catch(err => {
            console.log("it didnt upload (post-handler index.js)");
            res.json({ success: false });
        });
});

app.get("/images:param", (req, res) => {
    databaseActions
        .getImages()
        .then(results => {
            res.json(results.rows);
        })
        .catch(err => console.log("wrong db query"));
});

app.post("/image", (req, res) => {
    console.log("look for dta from components.js", req.body.params.id);
    databaseActions
        .getImage(req.body.params.id)
        .then(results => {
            res.json(results.rows[0]);
        })
        .catch(err => console.log("wrong db query for imagemodal"));
});

app.listen(8080, () => console.log("imageboard awake"));
