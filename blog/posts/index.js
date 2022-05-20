const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors')
const { randomBytes } = require('crypto')
const axios = require('axios')

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
    return res.send(posts);
})

app.post("/posts", async (req, res) => {
    const id = randomBytes(4).toString('hex');

    const { title } = req.body;

    posts[id] = {
        id,
        title,
    }

    await axios.post("http://event-bus-srv:4005/events", {
        type: 'PostCreated',
        data: posts[id]
    })

    return res.status(201).send(posts[id]);
})

app.post("/events", (req, res) => {
    return res.status(200).send();
})

app.listen(4000, () => {
    console.log("posts service listening on port 4000")
})