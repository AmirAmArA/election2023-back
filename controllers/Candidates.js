const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
router.use(bodyParser.json());
const db = require("../db");
const app = express();

app.use(cors());

router.get("/:city", (req, res) => {
  const city = req.params.city; // Get the add type from the URL parameter
  const q = "SELECT * FROM candidates WHERE city = ?";
  db.query(q, [city], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

router.get("/", (req, res) => {
  const test = "hello test";
  // const q = "SELECT * FROM candidates";
  // db.query(q, (err, data) => {
  //   if (err) return res.json(err);
  //   return res.json(data);
  // });
  return res.status(200).json(test);
});

router.post("/addCandidates", (req, res) => {
  const q1 = "SELECT * FROM candidates WHERE name = ? AND city = ?";
  var f = 0;
  db.query(q1, [req.body.name, req.body.city], (err, data) => {
    if (err) {
      return err;
    } else {
      if (data.length == 0) {
        const q =
          "INSERT INTO candidates (`name`,`votes`,`city`) VALUES (?, ?, ?)";
        const values = [req.body.name, req.body.votes, req.body.city];
        db.query(q, values, (err, data) => {
          if (err) return res.json(err);
          return res.json(data);
        });
      } else {
        console.log("Candidate already exists");
      }
    }
  });
});

router.put("/:id", (req, res) => {
  const candidateId = req.params.id;
  const updateQuery = "UPDATE candidates SET votes = votes + 1 WHERE id = ?";
  db.query(updateQuery, [candidateId], (err, result) => {
    if (err) {
      return res.json(err);
    }
    return res.json({ message: "Votes incremented successfully" });
  });
});

router.delete("/:id", (req, res) => {
  const candidateId = req.params.id;
  const deleteQuery = "DELETE FROM candidates WHERE id = ?";

  db.query(deleteQuery, [candidateId], (err, result) => {
    if (err) {
      return res.json(err);
    }

    if (result.affectedRows === 0) {
      return res.json({ message: "Candidate not found" });
    }

    return res.json({ message: "Candidate deleted successfully" });
  });
});

module.exports = router;
