const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const app = express();

//middleware
app.use(cors());
app.use(express.json());






const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dfhki.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('organicBdDb');
        const productsCollection = database.collection('products');
        const featuredCollection = database.collection('featuredProducts');



        //GET API for all products
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
        });

        //GET API for top products
        app.get('/featuredProducts', async (req, res) => {
            const cursor = featuredCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
        });


        //POST API for add a product
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productsCollection.insertOne(newProduct);
            res.json(result);
        });





    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello!! From ORGANIC BD SERVER SIDE");
});

app.listen(port, () => {
    console.log("Listening from port:", port);
});