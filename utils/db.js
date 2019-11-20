var spicedPg = require("spiced-pg");
var database = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.comment = function(comment, username, imageId) {
    return database.query(
        `INSERT INTO comments (comment, username, imageId) VALUES ($1,$2,$3) RETURNING *`,
        [comment, username, imageId]
    );
};

module.exports.getImages = function() {
    return database.query(`SELECT * FROM images`);
};
module.exports.getImage = function(id) {
    return database.query(`SELECT * FROM images WHERE id=$1`, [id]);
};

module.exports.getComments = function(id) {
    return database.query(`SELECT * FROM comments WHERE imageId=$1`, [id]);
};

module.exports.uploadImages = function(url, username, title, description) {
    return database.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1,$2,$3,$4) RETURNING *`,
        [url, username, title, description]
    );
};
