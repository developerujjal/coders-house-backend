const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const routes = require('./routes/routes');
const { connectDB } = require('./connectDB');
const port = process.env.PORT || 5000;



//middleware
app.use(express.json())

// Connect to MongoDB and start the server
const startServer = async () => {
    try {
        await connectDB(); // ✅ Wait for the database connection to be established

        // Routes
        app.use('/api', routes);



        // // Default route
        // app.get('/', (req, res) => {
        //     res.send('Coder House');
        // });

        // // Start the server
        // app.listen(port, () => {
        //     console.log(`🚀 Server running on port ${port}`);
        // });

    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        process.exit(1); // Exit the process if the database connection fails
    }
};

// Start the application
startServer();




// Default route
app.get('/', (req, res) => {
    res.send('Coder House');
});


// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});