const express = require('express');
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;

const app = express();


nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(bodyParser.json());

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
 
let client
let coll

async function connect() {
  client = await MongoClient.connect(process.env.url, { useNewUrlParser: true, useUnifiedTopology: true })
  coll = client.db('main').collection('main')
}

connect()

app.get('/', (req, res) => {
  res.render('index.html')
});

app.get('/bins/:bins', (req, res) => {
  let binId = req.params.bins
  console.log(binId)
  coll.findOne({"id": binId}, function(err, result) {
    if (err) throw err;
    console.log(result['text'])
    res.render('bins.njk', {text: result['text']})
  })
})


app.post('/upload', (req, res) => {
  let body = req.body
  let id = makeid(8)
  coll.insertOne({
    "text": body['data'],
    'id': id
  })
  res.send('{"id": "'+id+'"}')
});

app.listen(3000, () => {
  console.log('server started');
});