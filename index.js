const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const routes = require("./routes/routes");
const ConnectDB = require("./connectDB");
const cookieParser = require("cookie-parser");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const ACTIONS = require("./actions");

const server = createServer(app);
const port = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

//middleware
const options = {
  origin: ["http://localhost:5173"],
  credentials: true,
  optionalSuccessStatus: 200,
};

app.use(cors(options));
// app.use(express.json());
app.use(express.json({ limit: "8mb" })); /// For send large file into database
app.use(cookieParser());
app.use("/storage", express.static("storage")); // For get the image from storage folder;

ConnectDB();

// Routes
app.use("/api", routes);

// Default route
app.get("/", (req, res) => {
  res.send("Coder House");
});

//SOCKET IO LOGIC

const socketUserMapping = {};

io.on("connection", (socket) => {
  console.log("new Connection", socket.id);

  // from client send a object
  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    // ACTIONS.JOIN = 'join'
    socketUserMapping[socket.id] = user;

    //new Map
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    // 
    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user
      });
    });

    socket.emit(ACTIONS.ADD_PEER, {
      peerId: clientId,
      createOffer: true,
      user: socketUserMapping[clientId]
    });

    socket.join(roomId);

    console.log(clients);
  });


  //handle relay ice
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate
    })
  })


  //handle relay sdp(session description)
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription
    })
  })


  


});



// Start the server
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});






/* 

Socket IO Part: 


const socketUserMapping = new Map(); // Use a Map instead of an object

io.on("connection", (socket) => {
  console.log("New Connection:", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    socketUserMapping.set(socket.id, user); // Store user with socket ID

    socket.join(roomId); // ✅ Join the room FIRST

    // Get all clients in the room (except the newly joined user)
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    // Notify existing clients about the new peer
    socket.to(roomId).emit(ACTIONS.ADD_PEER, {
      newPeer: user,
      socketId: socket.id,
    });

    // Notify the new user about existing clients
    clients.forEach((clientId) => {
      socket.emit(ACTIONS.ADD_PEER, {
        newPeer: socketUserMapping.get(clientId), // Get user details
        socketId: clientId,
      });
    });

    console.log(`User ${user.name} joined room: ${roomId}`);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    const user = socketUserMapping.get(socket.id);
    if (user) {
      console.log(`User ${user.name} disconnected`);

      // Remove user from mapping
      socketUserMapping.delete(socket.id);

      // Notify all clients in the same room
      socket.broadcast.emit(ACTIONS.REMOVE_PEER, { socketId: socket.id });
    }
  });
});



*/
