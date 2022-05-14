const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {}

app.get('/posts', async (req, res) => {
    return res.json(posts);
})

app.post('/events', async (req, res) => {
    const event = req.body;

    switch(event.type) {
        case 'PostCreated':
            posts[event.data.id] = {...event.data, comments: []};
            break;
        case 'CommentCreated':
            posts[event.data.postId].comments.push(event.data)
            break;
        default:
            break;
    }

    return res.send({ status: 'OK' })
})


app.listen(4002, () => {
    console.log("query service listening on port 4002")
})