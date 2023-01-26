const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')

dotenv.config();

const app = express()
app.use(cors())
app.use(bodyParser.json())

const { Schema } = mongoose;
const productsSchema = new Schema({
    imgUrl: { type: String },
    categories: { type: String },
    title: { type: String },
    price: { type: String }
});
const Products = mongoose.model('products', productsSchema);


app.get('/', (req, res) => {
    res.send('Hello World!')
})


//Get All products
app.get("/products", (req, res) => {
    Products.find({}, (err, docs) => {
        if (!err) {
            res.send(docs);
        }
        else {
            res.status(404).json({ message: err });
        }
    });
});

//Get by id
app.get("/products/:id", (req, res) => {
    const { id } = req.params;
    Products.findById(id, (err, docs) => {
        if (!err) {
            res.send(docs);
        }
        else {
            res.status(500).json({ message: err });
        }
    });
});


//Delete
app.delete("/products/:id", (req, res) => {
    const { id } = req.params;
    Products.findByIdAndDelete(id, (err, docs) => {
        if (!err) {
            res.send("Deleted!");
        }
        else {
            res.status(404).json({ message: err });
        }
    });
});


//ADD
app.post("/products", (req, res) => {
    const products = new Products({
        imgUrl: req.body.imgUrl,
        categories: req.body.categories,
        title: req.body.title,
        price: req.body.price
    });
    products.save();
    res.send({ message: "Created!" })
});

///
const PORT = process.env.PORT;
const url = process.env.CONNECTION_URL.replace(
    "<password>",
    process.env.PASSWORD
);
mongoose.set('strictQuery', false);
mongoose.connect(url, (err) => {
    if (!err) {
        console.log("DB connect");
        app.listen(PORT, () => {
            console.log("Server start");
        });
    }
})
