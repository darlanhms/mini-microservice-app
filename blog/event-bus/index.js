const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/events', async (req, res) => {
    const event = req.body;

    console.log('event received', event);

    axios.post('http://localhost:4000/events', event).catch(err => { });
    axios.post('http://localhost:4001/events', event).catch(err => { });
    axios.post('http://localhost:4002/events', event).catch(err => { });
    axios.post('http://localhost:4003/events', event).catch(err => { });

    return res.send({ status: 'OK' })
})


app.listen(4005, () => {
    console.log("event bus service listening on port 4005")
})