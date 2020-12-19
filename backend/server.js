const express = require('express');
let mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.connect(
  'mongodb://localhost:27017/contact',
  function (err, response) {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to Database');
    }
  }
);

const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

let Schema = mongoose.Schema;
let UsersSchema = new Schema(
  {
    name: { type: String },
    mobile: { type: String },
  },
  { versionKey: false }
);

let model = mongoose.model('users', UsersSchema, 'users');

app.post('/api/SaveUser', function (req, res) {
  let mod = new model(req.body);
  mod.save(function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send({ data: 'Record has been Inserted.' });
    }
  });
});

app.post('/api/UpdateUser', function (req, res) {
  console.log(req.body);
  model.findByIdAndUpdate(
    req.body._id,
    { name: req.body.name, mobile: req.body.mobile },
    function (err, data) {
      if (err) {
        res.send(err);
      } else {
        res.send({ data: 'Record has been Updated.' });
      }
    }
  );
});

app.post('/api/deleteUser', function (req, res) {
  model.remove({ _id: req.body.id }, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send({ data: 'Record has been Deleted.' });
    }
  });
});

app.get('/api/getUser', function (req, res) {
  model.find({}, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

app.listen(8080, function () {
  console.log('app listening on port 8080');
});
