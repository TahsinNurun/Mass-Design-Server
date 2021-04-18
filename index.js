const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mbvce.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const app = express()

app.use(express.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) =>{
    res.send("hello I am working")
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("massDesign").collection("services");
  const ordersCollection = client.db("massDesign").collection("orders");
  const reviewsCollection = client.db("massDesign").collection("reviews");
  const adminsCollection = client.db("massDesign").collection("admins");
  console.log('database connected successfully');

//  code for loading data from database
  app.get('/services', (req, res) =>{
      servicesCollection.find()
      .toArray((err,items) =>{
          res.send(items);
        //   console.log('from database', items);
      })
  })

// service add code by admin
  app.post('/addService', (req, res) =>{
      const newService = req.body;
      console.log('adding new service', newService);
      servicesCollection.insertOne(newService)
      .then(result => {
          console.log('inserted count', result.insertedCount);
          res.send(result.insertedCount > 0);
          
      })     
  })

// service del code by admin
  app.delete('/delete/:id', (req,res) => {
      const id = req.params.id;
      servicesCollection.deleteOne({_id: ObjectID(req.params.id)})
      .then( (result) => {
          console.log(result)
      })
  })

// review add code by customer
  app.post('/addReview', (req,res) =>{
      const newReview = req.body;
      console.log('adding new review:', newReview);
      reviewsCollection.insertOne(newReview)
      .then(result => {
          console.log('inserted count',result.insertedCount);
          res.send(result.insertedCount > 0)
      })
  })

  //  code for loading review data from database
  app.get('/reviews', (req, res) =>{
    reviewsCollection.find()
    .toArray((err,items) =>{
        res.send(items);
    })
})

// order add code by customer
app.post('/addOrder', (req,res) =>{
  const newOrder = req.body;
  console.log('adding new review:', newOrder);
  ordersCollection.insertOne(newOrder)
  .then(result => {
      console.log('inserted count',result.insertedCount);
      res.send(result.insertedCount > 0)
  })
})

//  code for loading order data from database

app.get('/orders', (req, res) =>{
  console.log(req.query.email);
  ordersCollection.find({email: req.query.email})
  .toArray((err,items) =>{
      res.send(items);
  })
})

// admin add code by admin
app.post('/addAdmin', (req, res) =>{
  const newAdmin = req.body;
  console.log('adding new Admin', newAdmin);
  adminsCollection.insertOne(newAdmin)
  .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0);
      
  })     
})

});


app.listen(process.env.PORT || port)