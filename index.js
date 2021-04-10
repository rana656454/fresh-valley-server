
const express = require('express')
const ObjectId = require('mongodb').ObjectId; 
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 8000

app.use(cors())
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('Hello World!ranafdfd')
})


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqi99.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    
  const productsCollection = client.db("freshvalley").collection("products");
  const ordersCollcection = client.db("freshvalley").collection("custormerOrders");
  // perform actions on the collection object

  app.post('/addproduct',(req,res)=>{
    const product = req.body
    console.log("new product",product)
    productsCollection.insertOne(product)
    .then(resp=>{
      console.log('add',resp.insertedCount)
      res.send(resp.insertedCount>0)
    })

  })



  app.post('/addorder',(req,res) =>{
    const order = req.body
   // console.log(order)
    ordersCollcection.insertOne(order)
    .then(result =>{
        
        res.send(result.insertedCount>0);
      
    })
     
  })
  
  
  app.post('/productsbyIds',(req,res)=>{
    const productKeys = req.body
    //console.log(productKeys)
    //const o_id = new ObjectId(productKeys);
    const mongoIds = productKeys.map(id => new ObjectId.ObjectID(id));

    productsCollection.find({ _id : { $in : mongoIds } })
    .toArray((err,documents)=>{
      res.send(documents)
      
    })

})

app.delete('/deleteproduct/:id',(req,res)=>{
  console.log(req.params.id)
  const id = new ObjectId.ObjectID(req.params.id)
  console.log('delete this',id)
  productsCollection.findOneAndDelete({_id:id})
  .then(documents=>{res.send(documents)})
}) 


app.get('/customerorders/:email',(req,res) =>{
  ordersCollcection.find({email:req.params.email})
  .toArray((err,documents)=>{
    res.send(documents[0])
  })
})


  app.get('/products',(req,res)=>{
    productsCollection.find()
    .toArray((err,products)=>{
      res.send(products)
    })
  })
    
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
