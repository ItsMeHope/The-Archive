// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const port = 3001;

app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('Error : JWT_SECRET isn\'t defined in .env');
  process.exit(1);
}

mongoose.connect('mongodb://localhost:27017/archive_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error, couldn\'t connect to MongoDB :', err));

const categorySchema = new mongoose.Schema({
  name: String
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    }
  }
});

const itemSchema = new mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    title: { type: String, required: true },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      validate: {
        validator: Number.isFinite,
        message: '{VALUE} n’est pas une note valide'
      }
    },
    image: { type: String },
    description: { type: String },
    releaseYear: { type: Number },
    timesCompleted: { type: Number, default: 0, min: 0 },
    review: { type: String }
  }, {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      }
    }
  });

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.password;
      return ret;
    }
  }
});

const Category = mongoose.model('Category', categorySchema);
const Item = mongoose.model('Item', itemSchema);
const User = mongoose.model('User', userSchema);

// Middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Accès non autorisé : Token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide ou expiré' });
    }
    req.user = user;
    next();
  });
}

// GET
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/categories/:id/items', async (req, res) => {
  try {
    const items = await Item.find({ categoryId: req.params.id });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST
app.post('/categories', authenticateToken, async (req, res) => {
  try {
    const category = new Category({ name: req.body.name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/categories/:id/items', authenticateToken, async (req, res) => {
    try {
      const item = new Item({
        categoryId: req.params.id,
        title: req.body.title,
        rating: req.body.rating,
        image: req.body.image,
        description: req.body.description,
        releaseYear: req.body.releaseYear,
        timesCompleted: req.body.timesCompleted,
        review: req.body.review
      });
      await item.save();
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// AUTH
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Connection succeed',
      user: { id: user.id, username: user.username },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});