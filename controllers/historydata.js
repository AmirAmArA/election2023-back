const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
router.use(bodyParser.json());
const  db  = require('../db');
const cron = require('node-cron');

router.post('/by-date-and-city', (req, res) => {
    const date = req.body.date; // e.g. "2023-07-20"
    const cityName = req.body.city;

    if(!date || !cityName) {
        return res.status(400).json({ message: "Please provide both date and city name in the body." });
    }

    const q = "SELECT * FROM historydata WHERE datedata = ? AND candidatecity = ?";
    db.query(q, [date, cityName], (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    });
});


cron.schedule('38 17 * * *', () => {
    console.log('cron job started')
  const insertQuery = 'INSERT INTO historydata (candidatesid, candidatesname, candidatesvotes, datedata, candidatecity) VALUES (?, ?, ?, ?, ?)';
  const q = "SELECT * FROM candidates";

  db.query(q, (err, data) => {
    if (err) {
      console.error(err);
      return; // Don't continue if there's an error
    }
    
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate()); // No need to add 1 day here
    const formattedDate = currentDate.toISOString().slice(0, 10); // Format to 'YYYY-MM-DD'
    
    for (let i = 0; i < data.length; i++) {
      const values = [data[i].id, data[i].name, data[i].votes, formattedDate, data[i].city];
      
      const updateQuery = 'UPDATE candidates SET votes = 0 WHERE id = ?';
      db.query(updateQuery, [data[i].id], (err, result) => {
        if (err) {
          console.error(err);
        }
        // Don't return a response here
      });

      db.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error(err);
        }
      });
    }
  });
});




  module.exports = router;
