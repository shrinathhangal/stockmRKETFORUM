const express = require('express');
const router = express.Router();
const { models } = require('../models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const marked = require('marked');
const xss = require('xss');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

const uploadDir = path.join(__dirname,'..','..','uploads');
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive:true });
const storage = multer.diskStorage({ destination: uploadDir, filename: (req,file,cb)=> cb(null, Date.now()+'_'+file.originalname) });
const upload = multer({ storage });

function auth(req,res,next){
    const hdr = req.headers.authorization;
    if(!hdr) return res.status(401).json({ error:'missing token' });
    try{ const token = hdr.replace('Bearer ',''); req.user = jwt.verify(token, JWT_SECRET); next(); }catch(e){ return res.status(401).json({ error:'invalid token' }); }
}

router.post('/', auth, upload.array('files', 6), async (req,res)=>{
    const { title, body, category, tags } = req.body;
    const safeBody = xss(body || '');
    const post = await models.Post.create({ title: xss(title), body: safeBody, category, tickers: JSON.stringify([]), tags });
    req.io.emit('new_post', post);
    res.json(post);
});

router.get('/', async (req,res)=>{
    const q = req.query.q || '';
    const where = q ? { [Op.or]: [{ title: { [Op.like]: '%' + q + '%' } }, { body: { [Op.like]: '%' + q + '%' } }] } : {};
    const posts = await models.Post.findAll({ where, include: [{ model: models.User, attributes: ['id','name','avatar_url'] }], order: [['createdAt','DESC']] });
    res.json(posts);
});

router.get('/:id', async (req,res)=>{
    const post = await models.Post.findByPk(req.params.id, { include: [{ model: models.User, attributes:['id','name','avatar_url'] }, { model: models.Comment }] });
    if(!post) return res.status(404).json({ error: 'not found' });
    res.json(post);
});

router.post('/:id/comments', auth, async (req,res)=>{
    const { body, parent_id } = req.body;
    const post = await models.Post.findByPk(req.params.id);
    if(!post) return res.status(404).json({ error:'post not found' });
    const comment = await models.Comment.create({ body: xss(body), parent_id: parent_id||null, PostId: post.id, UserId: req.user.id });
    req.io.emit('new_comment', { post_id: post.id, comment });
    res.json(comment);
});

router.post('/:id/vote', auth, async (req,res)=>{
    const { value } = req.body;
    const post = await models.Post.findByPk(req.params.id);
    if(!post) return res.status(404).json({ error:'post not found' });
    await models.Vote.create({ value: value?1:-1, PostId: post.id, UserId: req.user.id });
    res.json({ ok:true });
});

router.post('/:id/report', auth, async (req,res)=>{
    const { reason } = req.body;
    await models.Report.create({ reason, target_type: 'post', target_id: req.params.id });
    res.json({ ok:true });
});

module.exports = router;
