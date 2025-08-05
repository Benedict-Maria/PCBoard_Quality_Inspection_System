const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/upload',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','upload.html'))
})

module.exports = router;

