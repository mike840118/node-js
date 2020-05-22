const express = require('express');
const db = require(__dirname + '/db_connect2');

const router = express.Router();

router.get('/list', (req, res)=>{

    db.query("SELECT * FROM address_book LIMIT 2")
        .then(([results, fields])=>{
            res.json(results);
        })
})

module.exports = router;