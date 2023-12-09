const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(cors())
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.acqlwci.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const donnerCollection = client.db('bloodDonation').collection('bookings')
    const detailsCollection = client.db('bloodDonation').collection('donorDetails')
   

// donorDetails
app.post('/donors',async(req,res)=>{
  const donor = req.body
  const result = await detailsCollection.insertOne(donor);
  res.send(result)
})


    // bookings
    app.post('/bookings',async(req,res)=>{
        const booking = req.body
        console.log(booking);
        const result = await donnerCollection.insertOne(booking);
        res.send(result)
    })

    app.get('/bookings',async(req,res)=>{
        console.log(req.query.email);
        let query = {};
        if(req.query?.email){
          query = {email:req.query.email}
        }
        const cursor = donnerCollection.find(query);
        const result = await cursor.toArray();
        res.send(result)
    })

    app.patch('/bookings/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)}
      const updateDoc ={
        $set:{
          pending: false
        }
      }
      const result = await donnerCollection.updateOne(filter,updateDoc)
      res.send(result) 
    })

    app.patch('/unblock/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)}
      const updateDoc ={
        $set:{
          pending: false
        }
      }
      const result = await donnerCollection.updateOne(filter,updateDoc)
      res.send(result) 
    })

    app.patch('/block/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)}
      const updateDoc ={
        $set:{
          pending: true
        }
      }
      const result = await donnerCollection.updateOne(filter,updateDoc)
      res.send(result) 
    })

    app.patch('/volunteer/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)}
      const updateDoc ={
        $set:{
         role : 'volunteer'
        }
      }
      const result = await donnerCollection.updateOne(filter,updateDoc)
      res.send(result) 
    })

    app.delete('/bookings/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await donnerCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('Blood in running')
})

app.listen(port,()=>{
    console.log(`Blood donation server is running on port ${port}`);
})