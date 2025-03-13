// models/userCollection.js
const { connectDB } = require('../connectDB');

async function getUserCollection() {
    const db = await connectDB();
    const collection = db.collection('users');
    return collection;
}

module.exports = getUserCollection;
