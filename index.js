const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vl9uy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 5000;

app.use(cors());
app.use(express.json());
// console.log(uri)

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const eventCollection = client.db("freshDale").collection("products");

  app.get('/events', (req, res) => {
    eventCollection.find()
      .toArray((err, items) => {
        res.send(items)
        // console.log('from database', items)
      })
  })

  app.post('/addEvents', (req, res) => {
    const newEvent = req.body;
    console.log('adding new event: ', newEvent)
    eventCollection.insertOne(newEvent)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })



  const infoCollection = client.db("freshDale").collection("userInfos");
  app.get('/orders', (req, res) => {
    // console.log(req.query.email)
    infoCollection.find({email:req.query.email})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


  app.post('/addOrders', (req, res) => {
    const newBooking = req.body;
    infoCollection.insertOne(newBooking)
      .then(result => {
        // console.log(result)
        res.send(result.insertedCount > 0)
      })
    console.log(newBooking);
  })


  // app.delete('deleteEvent/:id', (req, res) => {
  //   const id = ObjectID(req.params.id);
  //   console.log('delete this', id);
  //   eventCollection.findOneAndDelete({ _id: id })
  //     .then(documents => res.send(!!documents.value))
  // })
  // console.log("Database Success");


});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})