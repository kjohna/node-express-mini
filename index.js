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
server.post('/api/users', (req, res) => {
  const user = req.body;

  if (!user.name || !user.bio) {
    res.status(400).json({ success: false, errorMessage: "Please provide name and bio for the user." });
    return;
  }

  db.insert(user)
    .then( userID => {
      res.status(201).json({ success: true, userID});
    })
    .catch(() => {
      res.status(500).json({ success: false, error: "There was an error while saving the user to the database" });
    });
});

// GET - return all users
server.get('/api/users', (req, res) => {
  db.find()
  .then(users => {
    res.status(200).json({ success: true, users: users});
  })
  .catch(err => {
    res.status(500).json({ success: false, error: "The users information could not be retrieved." });
  });
});

// GET - return user matching id
server.get('/api/users/:id', (req, res) => {
  // console.log(req.params);
  const userId = req.params.id;

  db.findById(userId)
    .then(user => {
      if (user.length === 0) {
        res.status(404).json({ success: false, message: "The user with the specified ID does not exist." });
      } else {
        res.status(200).json({ success: true, message: user });
      }
    })
    .catch( err => {
      res.status(500).json({ success: false, error: "The user information could not be retrieved." });
    });
});

// DELETE - remove user matching id
server.delete('/api/users/:id', (req, res) =>{
  const userId = req.params.id;

  db.remove(userId)
    .then(removed => {
      console.log('removed: ', removed);
      if (removed === 0) {
        res.status(404).json({ success: false, message: "The user with the specified ID does not exist." }).end();
      } else {
        res.status(200).end();
      }
    })
    .catch( err => {
      res.status(500).json({ success: false, error: "The user could not be removed" });
    });
});

// config port
server.listen(5000, () => {
  console.log('\n** Server listening on port 5000 **\n');
});;