const express = require("express");
const { s3, upload } = require("../imagesBucket")
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
router.use(bodyParser.json());
const db = require("../db");
const app = express();
app.use(cors());

const spacesEndpoint = 'https://election23.fra1.digitaloceanspaces.com';

router.get("/", (req, res) => {
  const q = "SELECT * FROM adds";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

router.get("/:addtype", (req, res) => {
  const addType = req.params.addtype; // Get the add type from the URL parameter

  const q = "SELECT * FROM adds WHERE addtype = ?";

  db.query(q, [addType], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

router.get("/addcity", (req, res) => {
  const addcity = req.body.addcity; // Get the add type from the URL parameter

  const q = "SELECT * FROM adds WHERE addcity = ?";

  db.query(q, [addcity], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

router.post("/addadd", upload.single('image'), async (req, res) => {
  const file = req.file;

  const params = {
    Bucket: 'election23',
    Key: Date.now() + file.originalname,
    Body: file.buffer, // this could be a stream, buffer, etc.
    ACL: 'public-read'   // if you want the image to be publicly accessible
  };

  try {
    await s3.putObject(params).promise();

    const imageUrl = `${spacesEndpoint}/ads/${params.Key}`;
    // Store imageUrl in your MySQL database...
    const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const q = "INSERT INTO adds (`addtype`,`addimg`,`addtime`, `addcity`) VALUES (?, ? ,?,?)";
    const values = [req.body.addtype, imageUrl, currentTimestamp, req.body.addcity];
    db.query(q, values, (err, data) => {
      if (err) return res.json(err);
      return res.json({ success: true, imageUrl });

    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/:add_id", (req, res) => {
  const addId = req.params.add_id;
  const values = [req.body.addtype, req.body.addcity, req.body.addimg, addId];
  const updateQuery = "UPDATE adds SET addtype = ?,addcity=?, addimg = ? WHERE idadd = ?";

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      return res.json(err);
    }

    if (result.affectedRows === 0) {
      return res.json({ message: "Add not found" });
    }

    return res.json({ message: "Add updated successfully" });
  });
});

router.delete("/:id", (req, res) => {
  const addId = req.params.id;
  const deleteQuery = "DELETE FROM adds WHERE id = ?";

  db.query(deleteQuery, [addId], (err, result) => {
    if (err) {
      return res.json(err);
    }

    if (result.affectedRows === 0) {
      return res.json({ message: "Add not found" });
    }

    return res.json({ message: "Add deleted successfully" });
  });
});

module.exports = router;
