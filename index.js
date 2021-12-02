const express = require('express');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3yghf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const userCollection = client.db(`${process.env.DB_NAME}`).collection("userCollection");
    const sellerCollection = client.db(`${process.env.DB_NAME}`).collection("sellerCollection");
    const adminCollection = client.db(`${process.env.DB_NAME}`).collection("adminCollection");
      app.get('/admin', (req, res) => {
        const userEmail = req.query.email;
        adminCollection.find({ email: userEmail })
            .toArray((err, result) => res.send(result))
      })
      app.get('/seller', (req, res) => {
        const userEmail = req.query.email;
        sellerCollection.find({ email: userEmail })
            .toArray((err, result) => res.send(result))
      })
      app.get('/user', (req, res) => {
        const userEmail = req.query.email;
        userCollection.find({ email: userEmail })
            .toArray((err, result) => res.send(result))
      })
      app.post('/addEmail', (req, res) => {
        const addShipment = req.body
        adminCollection.insertOne(addShipment)
            .then(result => res.send(result.acknowledged))
      })
      app.post('/addNewUser', (req, res) => {
        const addShipment = req.body
        userCollection.insertOne(addShipment)
            .then(result => res.send(result.acknowledged))
      })
      app.patch('/submitMoney', (req, res) =>{
        const userEmail = req.query.email
        console.log(req.body)
        console.log(userEmail)
        userCollection.updateOne({email: userEmail},
        {
          $set: {phone: req.body.phone, 
            sellerId: req.body.sellerId,
            transectionId: req.body.transectionId,
        }
        })
        .then(result =>{
          res.send(result.acknowledged)
        })
        })
        app.post('/addNewSeller', (req, res) => {
          const addShipment = req.body
          sellerCollection.insertOne(addShipment)
              .then(result => res.send(result.acknowledged))
        })
        app.get('/sellerInfo', (req, res) => {
          sellerCollection.find()
          .toArray((err, documents) => {
            res.send(documents)
          })
        })
        app.get('/allUser', (req, res) => {
          userCollection.find()
          .toArray((err, documents) => {
            res.send(documents)
          })
        })
        app.patch('/payUpdate', (req, res) =>{
          const userId = req.query.id
          console.log(req.body)
          console.log(req.body.pay)
          sellerCollection.updateOne({_id: ObjectId(userId)},
          {
            $set: {
              pay: req.body.pay,
          }
          })
          .then(result =>{
            res.send(result.acknowledged)
          })
          })
          app.patch('/approveUser', (req, res) =>{
            const userId = req.query.id
            console.log(req.body)
            console.log(req.body.buy)
            userCollection.updateOne({_id: ObjectId(userId)},
            {
              $set: {
                buy: req.body.buy,
            }
            })
            .then(result =>{
              res.send(result.acknowledged)
            })
            })
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port);