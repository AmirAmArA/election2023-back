const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
router.use(bodyParser.json());
const db = require("../db");
const app = express();

app.use(cors());

router.get("/", (req, res) => {
  const q = "SELECT * FROM citys";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

router.get("/:city", (req, res) => {
  const city = req.params.city;
  const q = "SELECT * FROM citys WHERE cityname = ?";
  db.query(q, [city], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

router.post("/", (req, res) => {
  const q = "INSERT INTO citys (`cityname`,`votes`) VALUES (?, ?)";
  const values = [req.body.cityname, req.body.votes];
  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("success");
  });
});

router.put("/:id", (req, res) => {
  const cityId = req.params.id;
  const { cityname, votes } = req.body;
  const updateQuery = "UPDATE citys SET cityname = ?, votes = ? WHERE id = ?";
  const values = [cityname, votes, cityId];

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      return res.json(err);
    }

    if (result.affectedRows === 0) {
      return res.json({ message: "City not found" });
    }

    return res.json({ message: "City updated successfully" });
  });
});

router.put("/citysvotes/:id", (req, res) => {
  const candidateId = req.params.id;
  const updateQuery = "UPDATE citys SET votes = votes + 1 WHERE id = ?";
  db.query(updateQuery, [candidateId], (err, result) => {
    if (err) {
      return res.json(err);
    }
    return res.json({ message: "Votes incremented successfully" });
  });
});

router.delete("/:id", (req, res) => {
  const cityId = req.params.id;
  const deleteQuery = "DELETE FROM citys WHERE id = ?";

  db.query(deleteQuery, [cityId], (err, result) => {
    if (err) {
      return res.json(err);
    }

    if (result.affectedRows === 0) {
      return res.json({ message: "City not found" });
    }

    return res.json({ message: "City deleted successfully" });
  });
});

module.exports = router;
