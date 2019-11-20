DROP TABLE IF EXISTS comments;


CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    comment VARCHAR NOT NULL,
    imageId INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
