// implement your API here

const express = require('express');
const db = require('./data/db.js');

const server = express();

server.use(express.json());

// routes
server.get('/', (req, res) => {
  res.send('<h2>Server says Hello</h2>');
});

// POST - create a user with request body
server.post('/users', (req, res) => {
  const user = req.body;

  if (!user.name || !user.bio) {
    res.status(400).json({ success: false, errorMessage: "Please provide name and bio for the user." });
  }

  db.insert(user)
    .then( userID => {
      res.status(201).json({ success: true, userID});
    })
    .catch(() => {
      res.status(500).json({ success: false, error: "There was an error while saving the user to the database" });
    });
});


// config port
server.listen(5000, () => {
  console.log('\n** Server listening on port 5000 **\n');
});;