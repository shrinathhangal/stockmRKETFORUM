require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const tickerRoutes = require('./routes/tickers');

const PORT = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const apiLimiter = rateLimit({ windowMs: 15*60*1000, max: 200 });
app.use('/api/', apiLimiter);

app.use((req,res,next)=>{ req.io = io; next(); });

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tickers', tickerRoutes);

app.get('/api/health', (req,res)=> res.json({ ok:true }));

io.on('connection', socket => {
    console.log('socket connected', socket.id);
    socket.on('subscribe_ticker', (symbol)=> socket.join('ticker:' + symbol));
});

async function start(){ await sequelize.sync(); server.listen(PORT, ()=> console.log('Server listening on', PORT)); }
start();
