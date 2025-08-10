const express = require('express');
const router = express.Router();
const { models } = require('../models');

router.get('/', async (req,res)=>{
    const tickers = await models.Ticker.findAll({ order:[['updated_at','DESC']] });
    res.json(tickers);
});

module.exports = router;
