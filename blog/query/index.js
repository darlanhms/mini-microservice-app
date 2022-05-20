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

const handlePostCreatedEvent = (data) => {
    posts[data.id] = {
        ...data,
        comments: []
    };
}

const handleCommentCreatedEvent = (data) => {
    posts[data.postId].comments.push(data)
}

const handleCommentUpdatedEvent = (data) => {
    const post = posts[data.postId];

    const comment = post.comments.find(comment => comment.id === data.id);

    comment.content = data.content;
    comment.status = data.status;
}

const handleEvent = (event) => {
    const { type, data } = event;

    switch (type) {
        case 'PostCreated':
            handlePostCreatedEvent(data)
            break;
        case 'CommentCreated':
            handleCommentCreatedEvent(data)
            break;
        case 'CommentUpdated':
            handleCommentUpdatedEvent(data)
            break;
        default:
            break;
    }
}

app.post('/events', async (req, res) => {
    const event = req.body;

    handleEvent(event);

    return res.send({ status: 'OK' })
})


app.listen(4002, async () => {
    console.log("query service listening on port 4002")

    try {
        const { data: events } = await axios.get("http://event-bus-srv:4005/events");

        for (let event of events) {
            console.log("Processing event:", event.type);

            handleEvent(event)
        }
    } catch (error) {
        console.log("Error when getting events " + error);
    }
})