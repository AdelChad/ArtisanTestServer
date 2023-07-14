require('dotenv').config();
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URL);
const express = require('express');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors())

let response
client.connect();
console.log('Conenction OK!');
const db = client.db('ArtisanTest')
const collection = db.collection('phones')

app.use('/create', (req, res) => {
    create(req.body.newPhone).then((resultat) => {
        res.send(resultat)
    })
})

app.use('/read', (req, res) => {
    read().then((resultat) => {
        res.send(resultat)
    })
})

app.use('/findone', (req, res) => {
    readOne(req.body.url).then((resultat) => {
        res.send(resultat)
    })
})

app.use('/update', (req, res) => {
    update(req.body.newPhone).then((resultat) => {
        res.send(resultat)
    })
})
app.use('/delet', (req, res) => {
    delet(req.body.id).then((resultat) => {
        res.send(resultat)
    })
})

const create = async function(config) {
    console.log(config._id);
    try {
        const inster = await collection.insertMany([
            { "_id" : config._id, "name" : config.name, "type" : config.type, "price" : config.price, "rating" : config.rate,"warranty_years" : config.warranty_years, "available" : config.available },
        ])
    } catch (e) { throw e;}

    return response
}

const read = async function() {
    const read = (await collection.find()).toArray()
    response = await read

    return response
}

const readOne = async function(id) {
    const finalId = parseInt(Object.values(id)[0])
    const finded = (await collection.findOne({ _id: finalId }))
    response = await finded

    return response
}

const update = async function(phone) {
    try {
        const price = parseInt(phone.price)
        const filter = { _id: phone._id };
        const updateDoc = {
            $set: {
                name: phone.name,
                type: phone.type,
                price: price,
                rate: phone.rate,
                warranty_years: phone.warranty_years,
                available: phone.available
            },
        };
        const options = { upsert: true };
        const update = collection.updateOne(filter, updateDoc, options);
    } catch (e) { throw e;}

    return response
}

const delet = async function(config) {
    try {
        const delet = await collection.deleteOne({ _id: config })
    } catch (e) { throw e;} 

    return "delete complite"
}

app.listen(5000, () => {
    console.log(`Server started at http://localhost:5000`);
})