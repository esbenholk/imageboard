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
    const { title, description, username } = req.body;
    const imageURL = `${s3Url}/${req.file.filename}`;
    console.log(description);
    databaseActions
        .uploadImages(imageURL, username, title, description)
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

app.post("/commenting", (req, res) => {
    databaseActions
        .comment(req.body.comment, req.body.username, req.body.userid)
        .then(result => {
            res.json({
                comment: result.rows[0],
                success: true
            });
            console.log(result.rows[0]);
        })
        .catch(err => console.log(err));
});

app.get("/images", (req, res) => {
    databaseActions
        .getImages()
        .then(results => {
            res.json(results.rows);
        })
        .catch(err => console.log("wrong db query"));
});
app.get("/moreimages/:imageid", (req, res) => {
    console.log(req.params.imageid);
    databaseActions
        .getMoreImages(req.params.imageid)
        .then(results => {
            console.log("getting images where id is less than...", results);
            res.json(results.rows);
        })
        .catch(err => console.log("not getting images from db"));
});
app.get("/:id", (req, res) => {
    Promise.all([
        databaseActions.getImage(req.params.id),
        databaseActions.getComments(req.params.id),
        databaseActions.getAmountImages()
    ])
        .then(results => {
            if (results[0].rowCount == 0) {
                res.json({
                    error: true
                });
            } else {
                res.json({
                    image: results[0].rows[0],
                    comments: results[1].rows,
                    totalImageAmount: results[2].rows.length
                });
            }
        })
        .catch(err => console.log("wrong db query for imagemodal"));
});

app.listen(8080, () => console.log("imageboard awake"));
