// https://www.airpair.com/node.js/posts/top-10-mistakes-node-developers-make
const express = require('express');
const ExpressCache = require('express-cache-middleware');
const cacheManager = require('cache-manager');

var firebase = require('firebase');


const config = require('../config');
const broadcasting = require('./controllers/broadcasting');

var firebase = firebase.initializeApp(config.firebaseConfig);

const PORT = process.env.PORT || 3000;

const caching = cacheManager.caching({
    store: 'memory',
    max: 10000,
    ttl: 3600,
});
const cacheMiddleware = new ExpressCache(caching);

const app = express();
// cacheMiddleware.attach(app);

app.listen(PORT, () => {
    /* eslint-disable no-console */
    console.info('Server started in port 3000');
    /* eslint-enable no-console */
});

app.use((req, res, next) => {
  if (!req.query.token) {
      res.status(401).json({ status: 401, error: 'Unauthorized'});
  }
  if (req.query.user && req.query.pass) {
        firebase.auth().signInWithEmailAndPassword(req.query.user, req.query.pass)
          .then(function(result) {
              console.log('!!!!!!!!!!', result.user.uid);
            // result.user.tenantId should be ‘TENANT_PROJECT_ID’.
          }).catch(function(error) {
            console.log('ERROR', error);
          });
  }
  next();
});

app.get('/broadcasting', async (req, res) => {
    res.json(await broadcasting.index());
});

app.get('/broadcasting/:day', async (req, res) => {
    res.json(await broadcasting.show(req.params.day));
});
