const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const routes = require('./routes/routes');
const ConnectDB = require('./connectDB')
const port = process.env.PORT || 5000;




//middleware
const options = {
    origin: ['http://localhost:5173'],
    // credentials: true,
    optionalSuccessStatus: 200
};

app.use(cors(options));
app.use(express.json());



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