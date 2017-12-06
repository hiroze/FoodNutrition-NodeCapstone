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
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/v1/items', (req, res) =>{
  res.json(data);
});

app.get('/v1/items/:id', (req, res) =>{
  res.json(data[req.params.id]);
});

app.post('/v1/items', jsonParser, (req,res) => {
  //incoming input from user
  //save to db here
  //db validation error persists
  const emptyStr = "";
  const requiredFields = ['name', 'servingSize', 'fat', 'carbs', 'protein'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];

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
      return res.status(400).send(msg);
    }
    if (req.body.fat < 0 || req.body.fat === null || req.body.fat === emptyStr ) {
      const msg = 'Fat cannot be empty or negative.';
      return res.status(400).send(msg);
    }
    if (req.body.carbs < 0 || req.body.carbs === null || req.body.carbs === emptyStr ) {
      const msg = 'Carbs cannot be empty or negative.';
      return res.status(400).send(msg);
    }
    if (req.body.protein < 0 || req.body.protein === null || req.body.protein === emptyStr ) {
      const msg = 'Protein cannot be empty or negative.';
      return res.status(400).send(msg);
    }

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
    .then(item => res.status(201).json(item.apiRepr()))
    .catch(err => { 
      console.log(err); 
      res.status(500).send({error:'Internal server error'}); 
    });
 
});


// app.get('/', (req, res) => { 
//   res.sendFile(__dirname + '/index.html');
//   console.log(res+'test'); 
// });


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

// if (require.main === module) { 
//   app.listen(process.env.PORT || 8080, function () { 
//     console.info(`App listening on ${this.address().port}`); 
//   }); 
// }

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };