const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
router.use(bodyParser.json());
const db = require("../db");
const app = express();
const ip = require('ip'); // Import the 'ip' library


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

app.get('/test', async function(req, res){
  console.log(process.env.username)
  console.log('1')
  console.log(db)
const promise= db.promise()
    console.log('11')

console.log(promise)
var sql = "SELECT * FROM candidates"
try {
const [rows,field] = await promise.execute(sql)
  
  console.log('1111')
  console.log(rows,field)
} catch(e){
console.error(e)
}
console.log('111')

res.send(rows)
 });

router.get("/", (req, res) => {
  const q = "SELECT * FROM candidates";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
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
    const userAgent = req.headers['user-agent'];
    const clientIP = ip.address();

    const checkQuery = 'SELECT * FROM votes WHERE userAgent = ? AND clientip = ?';
    const updateQuery = "UPDATE candidates SET votes = votes + 1 WHERE id = ?";
    const userAgentQuery = "INSERT INTO votes (candidate_id, userAgent, clientip, isvote) VALUES (?,?,?,?)";

    db.beginTransaction((err) => {
        if (err) return res.json({error: err.message});
        
        db.query(checkQuery, [userAgent, clientIP], (err, results) => {
            if (err) {
                return db.rollback(() => {
                    res.json({error: err.message});
                });
            }

            if (results.length > 0) {
                return res.json({message: "the user agent already voted"});
            }

            if(results.length == 0){
                db.query(updateQuery, [candidateId], (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            res.json({error: err.message});
                        });
                    }
                    db.query(userAgentQuery,[candidateId, userAgent, clientIP,1], (err, result) => {
                        if (err) {
                            return db.rollback(() => {
                                res.json({error: err.message});
                            });
                        }
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.json({error: err.message});
                                });
                            }
                            return res.json({message: "Votes incremented successfully"});
                        });
                    });
                });
            }
        });
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
