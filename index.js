const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// Middleware для парсинга JSON и URL-encoded данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Подключение к MongoDB
mongoose.connect('mongodb://mongo:27017/userdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Создание схемы и модели для пользователя
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  age: Number,
});

const User = mongoose.model('User', userSchema);

// Отображение страницы со списком пользователей
app.get('/', async (req, res) => {
  const users = await User.find();
  res.render('index', { users });
});

// Создание пользователя
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.redirect('/');
  } catch (error) {
    res.status(400).send(error);
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
