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

// Configure CORS for localhost & production
const allowedOrigins = [
  "http://localhost:5173",
  // "https://your-live-domain.com", // Add your production frontend URL
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "8mb" })); // For sending large files into the database
app.use(cookieParser());
app.use("/storage", express.static("storage")); // Serve images from the "storage" folder

// Connect to Database
ConnectDB();

// Routes
app.use("/api", routes);

// Default route
app.get("/", (req, res) => {
  res.send("Coder House");
});

// SOCKET.IO LOGIC
const socketUserMapping = {};

io.on("connection", (socket) => {
  console.log("New Connection:", socket.id);

  // Handle user joining a room
  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    socketUserMapping[socket.id] = user;

    // Ensure roomId exists before accessing it
    const clients = io.sockets.adapter.rooms.get(roomId)
      ? Array.from(io.sockets.adapter.rooms.get(roomId))
      : [];

    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user,
      });

      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMapping[clientId] || {}, // Safe access
      });
    });

    socket.join(roomId);
    console.log(`User ${user?.id} joined room: ${roomId}`);
  });

  // Handle relay ICE candidates
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate,
    });
  });

  // Handle relay SDP (session description)
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription,
    });
  });

  // Handle user leaving a room
  const leaveRoom = ({ roomId }) => {
    const clients = io.sockets.adapter.rooms.get(roomId)
      ? Array.from(io.sockets.adapter.rooms.get(roomId))
      : [];

    clients.forEach((clientId) => {
      // Notify other clients in the room that this user is leaving
      io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
        peerId: socket.id,
        userId: socketUserMapping[socket.id]?.id, // Safe access
      });

      // Notify the user leaving that they should remove other peers
      socket.emit(ACTIONS.REMOVE_PEER, {
        peerId: clientId,
        userId: socketUserMapping[clientId]?.id, // Safe access
      });
    });

    // Leave the room and clean up the user mapping
    socket.leave(roomId);
    delete socketUserMapping[socket.id];
    console.log(`User ${socket.id} left room: ${roomId}`);
  };

  // Event listener for user leaving a room explicitly
  socket.on(ACTIONS.LEAVE, leaveRoom);


  // Event listener for user disconnection (this can be for automatic cleanup on disconnect)
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Call the leaveRoom function when the user disconnects (assuming they were in a room)
    Object.keys(socket.rooms).forEach((roomId) => {
      leaveRoom({ roomId });
    });

    
    // Clean up the user mapping when the socket disconnects
    delete socketUserMapping[socket.id];
  });

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
