const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const routes = require('./routes/routes');
const ConnectDB = require('./connectDB');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;




//middleware
const options = {
    origin: ['http://localhost:5173'],
    credentials: true,
    optionalSuccessStatus: 200
};



app.use(cors(options));
// app.use(express.json());
app.use(express.json({ limit: '8mb' }));  /// For send large file into database
app.use(cookieParser());
app.use('/storage', express.static('storage')); // For get the image from storage folder;




ConnectDB();

// Routes
app.use('/api', routes);


// Default route
app.get('/', (req, res) => {
    res.send('Coder House');
});


// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});