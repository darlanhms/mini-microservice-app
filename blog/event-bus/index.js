const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express();

app.use(bodyParser.json());
app.use(cors());

const events = [];

app.post('/events', async (req, res) => {
    const event = req.body;

    console.log('event received', event);

    events.push(event);

    axios.post('http://posts-clusterip-srv:4000/events', event).catch(err => { });
    axios.post('http://comments-srv:4001/events', event).catch(err => { });
    axios.post('http://query-srv:4002/events', event).catch(err => { });
    axios.post('http://moderation-srv:4003/events', event).catch(err => { });

    return res.send({ status: 'OK' })
})

app.get("/events", (req, res) => {
    return res.send(events)
})


app.listen(4005, () => {
    console.log("event bus service listening on port 4005")
})