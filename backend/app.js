const express = require('express');

const app = express();

const helmet = require('helmet');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const cardRouter = require('./routes/cards');

const userRouter = require('./routes/users');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '60db84193688413faf2a5208',
  };

  next();
});

app.use('/', cardRouter);

app.use('/', userRouter);

app.get('*', (req, res) => {
  res.status(404);
  res.send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
