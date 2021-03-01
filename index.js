const express = require('express');
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const db = require('./db')

const app = express();


nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(bodyParser.json());

app.get('/bins/:bins', async(req, res) => {
  let doc = await db.findBin(req.params.bins)
  res.render('index.html', {text: doc['text']})
})

app.get('/', async(req, res) => {
  res.render('index.html', {text: ''})
})

app.post('/upload', async(req, res) => {
  let hash = await db.addBin(req.body['data'])
  res.send('{"id": "'+hash+'"}')
});

app.listen(3000, () => {
  console.log('server started');
});
