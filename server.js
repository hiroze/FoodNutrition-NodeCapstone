'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { PORT, DATABASE_URL } = require('./config');
const FoodNutrition  = require('./db/models');
const data = require('./db/seed-data');

mongoose.Promise = global.Promise;

//__dirname???
// app.use(express.static('public'));

app.use(express.static('public'));


app.use(bodyParser.json());

app.get('/v1/items', (req, res) => {
  
  FoodNutrition
    .find({})
    .then(items => {
      res.status(200).json(items.map(item => item.apiRepr()));
    });
});

app.get('/v1/items/:id', jsonParser, (req, res) =>{
  
  FoodNutrition
    .findById(req.params.id)
    .then(item => {
      res.status(200).json(item.apiRepr());
    });
});

app.post('/v1/items', jsonParser, (req,res) => {

  const requiredFields = ['name', 'servingSize', 'fat', 'carbs', 'protein'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      let message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  FoodNutrition
    .create({
      name: req.body.name,
      servingSize: req.body.servingSize,
      fat: req.body.fat,
      carbs: req.body.carbs,
      protein: req.body.protein,
    })
    .then(item => res.status(201).json(item.apiRepr()));

 
});

app.delete('/v1/items/:id', (req, res) => {
  FoodNutrition 
    .findByIdAndRemove(req.params.id)
    .then(res.status(204).end())
    .catch(err => res.status(500).send('Something went wrong.'));
});


let server;

const runServer = (db = DATABASE_URL, PORT = 8080) =>
{
  return new Promise((resolve, reject) => {
    mongoose.connect(db, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
 
};

const closeServer = () => {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });

};

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };