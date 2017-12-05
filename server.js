'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const { PORT, DATABASE_URL } = require('./config');
const data = require('./db/seed-data')

mongoose.Promise = global.Promise;

//__dirname???
app.use(express.static('public'));

app.get('/v1/items', (req, res) =>{
  res.json(data);
});

app.get('/v1/items/:id', (req, res) =>{
  res.json(data[req.params.id]);
});

app.post('/v1/items', (req,res) => {
  console.log(req.body); //incoming input from user
  //save to db here
  res.json(req.body);
});


// app.get('/', (req, res) => { 
//   res.sendFile(__dirname + '/index.html');
//   console.log(res+'test'); 
// });


let server;

const runServer = (DATABASE_URL, PORT = 8080) =>
{
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, { useMongoClient: true }, err => {
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
  app.listen(process.env.PORT || 8080, function () { 
    console.info(`App listening on ${this.address().port}`); 
  }); 
}

module.exports = { app, runServer, closeServer };