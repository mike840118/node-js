const express = require('express');
const db = require(__dirname + '/db_connect2');

const router = express.Router();

router.get('/list', (req, res)=>{

    db.query("SELECT * FROM address_book LIMIT 10")
        .then(([rows])=>{
            res.render('address-book/list', { rows });
        })
})

module.exports = router;