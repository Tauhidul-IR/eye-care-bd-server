const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

//eye-care-User
//eye-care-UserBD

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gmypbo8.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        doctorsCollection = client.db('Eye-care-bd').collection('allDoctors');
        servicesCollection = client.db('Eye-care-bd').collection('services');


        //all doctors
        app.get('/allDoctors', async (req, res) => {
            const query = {};
            const doctor = await doctorsCollection.find(query).toArray();
            res.send(doctor)
        })
        //Show 3 doctors
        app.get('/show3Doctors', async (req, res) => {
            const query = {};
            const doctor = await doctorsCollection.find(query).limit(3).toArray();
            res.send(doctor)
        })
    }
    finally {

    }

}
run().catch(error => console.log(error))











app.get('/', async (req, res) => {
    res.send('Eye care BD server is Running');
})
app.listen(port, () => {
    console.log(`Server Running on port ${port}`);
})