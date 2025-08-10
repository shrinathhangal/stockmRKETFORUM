const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const dbFile = process.env.DATABASE_FILE || path.join(__dirname,'..','data','database.sqlite');
const sequelize = new Sequelize({ dialect: 'sqlite', storage: dbFile, logging: false });

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    password_hash: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    reputation: { type: DataTypes.INTEGER, defaultValue: 0 },
    badges: { type: DataTypes.TEXT, defaultValue: '[]' },
    avatar_url: { type: DataTypes.STRING }
});

const Post = sequelize.define('Post', {
    id: { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true },
    title: { type: DataTypes.STRING },
    body: { type: DataTypes.TEXT('long') },
    category: { type: DataTypes.STRING },
    tickers: { type: DataTypes.TEXT, defaultValue: '[]' },
    pinned: { type: DataTypes.BOOLEAN, defaultValue: false },
    locked: { type: DataTypes.BOOLEAN, defaultValue: false },
    tags: { type: DataTypes.STRING }
});

const Comment = sequelize.define('Comment', {
    id: { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true },
    body: { type: DataTypes.TEXT('long') },
    parent_id: { type: DataTypes.INTEGER, allowNull: true }
});

const Vote = sequelize.define('Vote', { id:{ type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true }, value: { type: DataTypes.INTEGER } });
const Watchlist = sequelize.define('Watchlist', { id:{ type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true }, name: { type: DataTypes.STRING }, symbols: { type: DataTypes.TEXT, defaultValue: '[]' } });
const Ticker = sequelize.define('Ticker', { id:{ type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true }, symbol: { type: DataTypes.STRING }, name: { type: DataTypes.STRING }, price: { type: DataTypes.FLOAT, defaultValue:0 }, change: { type: DataTypes.FLOAT, defaultValue:0 }, updated_at: { type: DataTypes.DATE } });
const Report = sequelize.define('Report', { id:{ type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true }, reason: { type: DataTypes.STRING }, target_type: { type: DataTypes.STRING }, target_id: { type: DataTypes.INTEGER } });

User.hasMany(Post); Post.belongsTo(User);
User.hasMany(Comment); Comment.belongsTo(User);
Post.hasMany(Comment); Comment.belongsTo(Post);
User.hasMany(Watchlist); Watchlist.belongsTo(User);
Post.hasMany(Vote); Vote.belongsTo(Post);
User.hasMany(Vote); Vote.belongsTo(User);

module.exports = { sequelize, models: { User, Post, Comment, Vote, Watchlist, Ticker, Report } };
