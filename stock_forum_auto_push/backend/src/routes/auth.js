const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { models } = require('../models');
const xss = require('xss');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

router.post('/register', async (req,res)=>{
    const { name, email, password } = req.body;
    if(!email || !password) return res.status(400).json({ error: 'missing fields' });
    const exists = await models.User.findOne({ where: { email } });
    if(exists) return res.status(400).json({ error: 'email exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await models.User.create({ name: xss(name), email, password_hash: hash });
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.post('/login', async (req,res)=>{
    const { email, password } = req.body;
    const user = await models.User.findOne({ where: { email } });
    if(!user) return res.status(400).json({ error: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if(!ok) return res.status(400).json({ error: 'invalid credentials' });
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// OAuth placeholders
router.get('/oauth/google', (req,res)=> res.json({ msg:'implement oauth via passport with GOOGLE_CLIENT_ID/SECRET' }));
router.get('/oauth/facebook', (req,res)=> res.json({ msg:'implement oauth via passport with FACEBOOK_APP_ID/SECRET' }));

module.exports = router;
