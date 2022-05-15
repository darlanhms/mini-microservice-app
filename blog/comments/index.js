const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors')
const { randomBytes } = require('crypto')
const axios = require('axios')

const app = express();

app.use(bodyParser.json());
app.use(cors());


const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
    return res.send(commentsByPostId[req.params.id] || []);
})

app.post("/posts/:id/comments", async (req, res) => {
    const commentId = randomBytes(4).toString('hex');

    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    const newComment = {
        id: commentId,
        content,
        status: 'pending'
    }

    commentsByPostId[req.params.id] = [...comments, newComment];

    await axios.post("http://localhost:4005/events", {
        type: 'CommentCreated',
        data: {
            ...newComment,
            postId: req.params.id,
        }
    })

    return res.status(201).send(comments);
})

app.post("/events", async (req, res) => {
    const { type, data } = req.body;

    if (type === 'CommentModerated') {
        const { postId, id, status } = data;

        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => comment.id === id);

        comment.status = status;

        await axios.post("http://localhost:4005/events", {
            type: 'CommentUpdated', 
            data: {...comment, postId}
        });
    }

    return res.status(200).send();
})


app.listen(4001, () => {
    console.log("comments service listening on port 4001")
})