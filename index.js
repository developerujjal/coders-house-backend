const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
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