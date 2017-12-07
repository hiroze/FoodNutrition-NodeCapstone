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

app.use(express.static('public'));


app.use(bodyParser.json());

// ===== GET =====
app.get('/v1/items', (req, res) => {
  FoodNutrition
    .find()
    .then(result => {
      res.json(result.map(item => item.apiRepr()));
    })
});
// ===== GET by ID =====
app.get('/v1/items/:id', (req, res) =>{
  FoodNutrition
    .findById(req.params.id)
    .then(result => {
      res.json(result.apiRepr());
    });
});
// ===== POST =====
app.post('/v1/items', jsonParser, (req,res) => {

  const emptyStr = "";
  const requiredFields = ['name', 'servingSize', 'fat', 'carbs', 'protein'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    // if (req.body.name == undefined) {
    //   return res.status(400).json({message: 'name required'});
    // }

    if (req.body.name.length === 0) {
      const msg = 'Name cannot be empty';
      return res.status(400).send(msg);
    }

    if (Number(req.body.name)) {
      const msg = 'Name must contain letters';
      return res.status(400).send(msg);
}

    if (req.body.servingSize < 0 || req.body.servingSize === null || req.body.servingSize === emptyStr ) {
      const msg = 'Serving size cannot be empty or negative.';
      return res.status(400).send({error: msg});
      
    }

    if (req.body.fat < 0 || req.body.fat === null || req.body.fat === emptyStr ) {
      const msg = 'Fat cannot be empty or negative.';
      return res.status(400).send({message: msg});
    }
    if (req.body.carbs < 0 || req.body.carbs === null || req.body.carbs === emptyStr ) {
      const msg = 'Carbs cannot be empty or negative.';
      return res.status(400).send({message: msg});
    }
    if (req.body.protein < 0 || req.body.protein === null || req.body.protein === emptyStr ) {
      const msg = 'Protein cannot be empty or negative.';
      return res.status(400).send({message: msg});
    }

    if (!(field in req.body)) {
      let message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send({message: message});
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
    .then(item => res.status(201).json(item.apiRepr()))
    .catch(err => { 
      console.log(err); 
      res.status(500).send({error:'Internal server error'}); 
    });
 
});

// ===== PUT =====
app.put('/v1/items/:id', jsonParser, (req,res) => {
//checks if id and body match
console.log(req.body)
  const emptyStr = "";
  if ((req.params.id) !== req.body.id) {
    const msg = `Request id ${req.params.id} and request body id ${req.body.id} must match.` ;
    res.status(400).json({message: msg});
  }
  if (req.body.name === emptyStr) {
    res.status(400).send('Name cannot be empty');
  }
  //add validation for null and negative numbers

  const edited = {};
  const editableItems = ['name', 'servingSize', 'fat', 'carbs', 'protein'];
  editableItems.forEach(function(item) {
    if (item in req.body) {
      edited[item] = req.body[item];
    }
    console.log(edited);
    
  });
  FoodNutrition
    .findByIdAndUpdate(req.params.id, {$set: edited}, {new: true})
    //send back updated data  with a json object
    //updated to ok status
    .then(editedItem => res.status(200).json(editedItem.apiRepr()))
    .catch(err => { 
      console.log(err); 
      res.status(500).send({error:'Internal server error'}); 
    });

});

app.delete('/v1/items/:id', (req, res) => {
  FoodNutrition 
    .findByIdAndRemove(req.params.id)
    .then(res.status(204).end())
    .catch(err => res.status(500).send('Something went wrong.'));
});


let server;

const runServer = (db = DATABASE_URL, port=PORT) =>
{
  return new Promise((resolve, reject) => {
    mongoose.connect(db, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
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
