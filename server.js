'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { PORT, DATABASE_URL } = require('./config');

mongoose.Promise = global.Promise;

//__dirname???
app.use(express.static('public'));
app.listen(process.env.PORT || 8080);

let server;

const runServer = () =>
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