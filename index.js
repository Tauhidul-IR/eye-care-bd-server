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
        doctorBookingsCollection = client.db('Eye-care-bd').collection('doctorBookings');


        //all doctors
        app.get('/allDoctors', async (req, res) => {
            const date = req.query.date;
            console.log(date);
            const query = {};
            const doctors = await doctorsCollection.find(query).toArray();
            const bookingQuery = {
                appointmentDate: date
            }
            const alreadyBooked = await doctorBookingsCollection.find(bookingQuery).toArray()
            doctors.forEach(doctor => {
                doctorBooked = alreadyBooked.filter(book => book.doctorName === doctor.name)
                const bookedSlots = doctorBooked.map(book => book.slot)
                const remainingSlots = doctor.slots.filter(slot => !bookedSlots.includes(slot))
                doctor.slots = remainingSlots;
                console.log(date, doctor.name, remainingSlots.length);
            })
            res.send(doctors)
        })


        //Show 3 doctors
        app.get('/show3Doctors', async (req, res) => {
            const query = {};
            const doctor = await doctorsCollection.find(query).limit(3).toArray();
            res.send(doctor)
        })


        //doctor booking appointment
        app.post('/bookingDoctor', async (req, res) => {
            const booking = req.body
            const query = {
                appointmentDate: booking.appointmentDate,
                email: booking.email,
                doctorName: booking.doctorName
            }

            const alreadyBooked = await doctorBookingsCollection.find(query).toArray();

            if (alreadyBooked.length) {
                const message = `You already have a booking on ${booking.appointmentDate}`
                return res.send({ acknowledged: false, message })
            }
            const result = await doctorBookingsCollection.insertOne(booking);
            res.send(result);
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