const express = require('express');
const router = express.Router();
router.get('/admin2/:action?/:id?',(req,res)=>{
    const obj = {
        ...req.params,
        baseUrl: req.baseUrl,
        url:req.url,
        data : res.locals.memberData
    }
    res.json(obj);
    
});
module.exports = router;

