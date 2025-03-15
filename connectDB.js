require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log(uri)

const mongooseOptions = {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    },
};



async function ConnectDB() {
    try {
        // Connect to MongoDB
        await mongoose.connect(uri, mongooseOptions);
        console.log('Connected to MongoDB Atlas');

        // Handle connection events
        const db = mongoose.connection;

        db.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        db.once('open', () => {
            console.log('MongoDB connection is open');
        });

        // db.on('disconnected', () => {
        //     console.log('MongoDB disconnected');
        // });

        // Return the connection object
        return db;

    } catch (err) {
        console.error('Error connecting to MongoDB Atlas:', err);
    }
}


module.exports = ConnectDB;



// const { MongoClient, ServerApiVersion } = require('mongodb');
// require('dotenv').config();

// let client;
// let db;


// async function connectDB() {
//     if (db) {
//         return db;
//     }
//     try {
//         const uri = process.env.MONGODB_URI;
//         client = new MongoClient(uri, {
//             serverApi: {
//                 version: ServerApiVersion.v1,
//                 strict: true,
//                 deprecationErrors: true,
//             }
//         });

//         await client.connect();
//         console.log("✅ MongoDB Connected!");

//         db = client.db('coderHouse');
//         return db;
//     } catch (error) {
//         console.error("Failed to connect to MongoDB:", error);
//     }
// }


// module.exports = { connectDB };