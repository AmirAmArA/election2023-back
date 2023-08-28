const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
const cors = require('cors');
router.use(bodyParser.json());
const  db  = require('../db');
const ip = require('ip'); // Import the 'ip' library
const cron = require('node-cron');
const app = express();

// Use cors middleware
app.use(cors());


router.get('/', (req, res) => {
    const userAgent = req.headers['user-agent'];
    console.log(req.ip)
    res.json({
      userAgent: userAgent,
      clientIP: req.ip,
    });
  });

  router.get('/votes/:Clientip', (req, res) => {
    const Clientip = req.params.Clientip; // Get the candidate ID from the URL parameter
    const selectQuery = 'SELECT * FROM votes WHERE clientip = ?';
  
    db.query(selectQuery, [Clientip], (err, result) => {
      if (err) {
        return res.json(err);
      }
  
      return res.json(result);
    });
  });

  router.post('/votes/:id', (req, res) => {
    const candidate_id = req.params.id;
    const userAgent = req.headers['user-agent'];
    const clientIP = ip.address();
  
    // Check if the user has voted before
    const checkQuery = 'SELECT * FROM votes WHERE userAgent = ? AND clientip = ?';
    db.query(checkQuery, [userAgent, clientIP], (err, results) => {
      if (err) {
        return res.json(err);
      }
  
      if (results.length > 0) {
        return res.json(results);
      }
  
      const insertQuery = 'INSERT INTO votes (candidate_id, userAgent, clientip, isvote) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [candidate_id, userAgent, clientIP, true], (err, result) => {
        if (err) {
          return res.json(err);
        }
        return res.json(result);
      });
    });
  });
  
  cron.schedule('59 23 * * *', () => {
    const deleteQuery = 'DELETE FROM votes';
  
    db.query(deleteQuery, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        console.log('All information in "votes" table deleted.');
      }
    });
  });

module.exports = router;
