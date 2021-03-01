var crypto = require("crypto-js");
const MongoClient = require('mongodb').MongoClient

module.exports = {addBin, findBin}

let client
let coll

async function connect() {
  client = await MongoClient.connect(process.env.url, { useNewUrlParser: true, useUnifiedTopology: true })
  coll = client.db('main').collection('main')
}

connect()

async function addBin(text) {
  let hash = crypto.SHA256(text).toString(crypto.enc.Hex)
  await coll.insertOne({
    id: hash,
    text: text
  })
  return hash
}

async function findBin(h) {
  const result = await coll.findOne({ id: h })
  return result
}
