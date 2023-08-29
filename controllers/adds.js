const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
router.use(bodyParser.json());
const db = require("../db");
const app = express();
app.use(cors());

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

router.post("/addadd", (req, res) => {
  const q = "INSERT INTO adds (`addtype`,`addimg`,`addtime`, `addcity`) VALUES (?, ? ,?,?)";
  const values = [req.body.addtype, req.body.addimg, req.body.addtime, req.body.addcity];
  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("success");
  });
});

router.put("/:add_id", (req, res) => {
  const addId = req.params.add_id;
  const values = [req.body.addtype, req.body.addimg, addId];
  const updateQuery = "UPDATE adds SET addtype = ?, addimg = ? WHERE idadd = ?";

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
