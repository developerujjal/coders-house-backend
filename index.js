const express = require('express');
require('dotenv').config()
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const routes = require('./routes/routes');

//middleware
app.use(express.json())

app.use('/api', routes);


app.get('/', (req, res) => {
    res.send("Coder House")
})

app.listen(port, () => {
    console.log(`Server open by ${port}`)
})