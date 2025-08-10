const express = require('express');
const router = express.Router();
const { models } = require('../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const xss = require('xss');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const uploadDir = path.join(__dirname,'..','..','uploads');
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive:true });
const storage = multer.diskStorage({ destination: uploadDir, filename: (req,file,cb)=> cb(null, Date.now()+'_'+file.originalname) });
const upload = multer({ storage });

function auth(req,res,next){
    const hdr = req.headers.authorization;
    if(!hdr) return res.status(401).json({ error:'missing token' });
    try{ req.user = jwt.verify(hdr.replace('Bearer ',''), JWT_SECRET); next(); }catch(e){ return res.status(401).json({ error:'invalid token' }); }
}

router.get('/me', auth, async (req,res)=>{
    const user = await models.User.findByPk(req.user.id, { attributes: ['id','name','email','role','reputation','badges','avatar_url'] });
    res.json(user);
});

router.post('/me/avatar', auth, upload.single('avatar'), async (req,res)=>{
    const user = await models.User.findByPk(req.user.id);
    user.avatar_url = '/uploads/' + req.file.filename;
    await user.save();
    res.json({ avatar_url: user.avatar_url });
});

router.get('/:id', async (req,res)=>{
    const user = await models.User.findByPk(req.params.id, { attributes: ['id','name','reputation','badges','avatar_url'] });
    if(!user) return res.status(404).json({ error:'not found' });
    res.json(user);
});

module.exports = router;
