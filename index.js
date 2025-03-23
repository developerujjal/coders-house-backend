const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const routes = require('./routes/routes');
const ConnectDB = require('./connectDB');
const cookieParser = require('cookie-parser');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const server = createServer(app);
const port = process.env.PORT || 5000;


const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})


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


//SOCKET IO LOGIC

io.on('connection', (socket) => {
console.log("new Connection", socket.id)
})


// Start the server
server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});