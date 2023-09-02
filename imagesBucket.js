const AWS = require('aws-sdk');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() }); // Store the file in memory

const spacesEndpoint = new AWS.Endpoint('https://fra1.digitaloceanspaces.com/ads');
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.ACCESS_KEY_SPACES,
    secretAccessKey: process.env.SECRET_KEY_SPACES
});


module.exports = {s3, upload}