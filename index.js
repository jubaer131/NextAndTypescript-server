const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 8000


// Middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8dssgfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(process.env.DB_USER)
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

const protfoliocollection = client.db("pictech").collection("protfolio")
const blogpostcollection = client.db("pictech").collection("blogpost")

app.get("/saaspicprotfolio", async (req,res)=>{
    const result = await protfoliocollection.find().toArray();
    res.send(result);
});

app.get("/detail", async (req,res)=>{
  const result = await blogpostcollection.find().toArray();
  res.send(result);
});

 app.get('/blogpost', async (req, res) => {
  const search = req.query.search;
  const size = parseInt(req.query.size) || 5; 
  const page = parseInt(req.query.page) - 1; 
  let query = {};
 
  if (search) {
    query = {
      title1: { $regex: search, $options: 'i' } // Case-insensitive search
    };
  }
  try {
    const result = await blogpostcollection.find(query).skip(page*size ).limit(size).toArray();
    res.send(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/paginationcount', async(req,res)=>{
  const count = await blogpostcollection.countDocuments();
  res.send({count})
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



app.get('/', (req, res) => {
  res.send('Hello  developer!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})