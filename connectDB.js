const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

let client;
let db;


async function connectDB() {
    if (db) {
        return db;
    }
    try {
        const uri = process.env.MONGODB_URI;
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        await client.connect();
        console.log("✅ MongoDB Connected!");

        db = client.db('coderHouse');
        return db;
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}


module.exports = { connectDB };


// async function connectDB() {
//     if (!client) {
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
//     }
//     return db;
// }

