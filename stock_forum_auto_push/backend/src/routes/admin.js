const express = require('express');
const router = express.Router();
const { models } = require('../models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
function adminAuth(req,res,next){
    const hdr = req.headers.authorization;
    if(!hdr) return res.status(401).json({ error:'missing token' });
    try{ const user = jwt.verify(hdr.replace('Bearer ',''), JWT_SECRET); if(user.role!=='admin') return res.status(403).json({ error:'forbidden' }); req.user = user; next(); }catch(e){ return res.status(401).json({ error:'invalid token' }); }
}

router.get('/reports', adminAuth, async (req,res)=>{
    const reports = await models.Report.findAll({ order:[['createdAt','DESC']] });
    res.json(reports);
});

router.delete('/post/:id', adminAuth, async (req,res)=>{
    const post = await models.Post.findByPk(req.params.id);
    if(!post) return res.status(404).json({ error:'not found' });
    await post.destroy();
    res.json({ ok:true });
});

router.post('/ban/:id', adminAuth, async (req,res)=>{
    const user = await models.User.findByPk(req.params.id);
    if(!user) return res.status(404).json({ error:'not found' });
    user.role = 'banned'; await user.save();
    res.json({ ok:true });
});

module.exports = router;
