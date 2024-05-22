//create web server
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');
//read file
const comments = require('./comments.json');
//parse data
app.use(express.json());
//static file
app.use(express.static('public'));
//routes
app.get('/comments', (req, res) => {
  res.json(comments);
});

app.post('/comments', (req, res) => {
  comments.push(req.body);
  fs.writeFile('comments.json', JSON.stringify(comments), (err) => {
    if (err) {
      res.status(500).send('An error occurred');
    } else {
      res.send('Comment added');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Path: comments.json
[]

// Path: index.html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Comments</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <h1>Comments</h1>
    <form id="form">
      <label for="comment">Comment:</label>
      <input type="text" id="comment" name="comment" required />
      <input type="submit" value="Submit" />
    </form>
    <ul id="comments"></ul>
    <script src="comments.js"></script>
  </body>
</html>

// Path: comments.js
const form = document.getElementById('form');
const comments = document.getElementById('comments');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const response = await fetch('/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  if (response.ok) {
    form.reset();
    const comment = await response.text();
    const li = document.createElement('li');
    li.textContent = comment;
    comments.appendChild(li);
  }
});

async function getComments() {
  const response = await fetch('/comments');
  const data = await response.json();
  for (const comment of data) {
    const li = document.createElement('li');