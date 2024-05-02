const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(dirname, 'templates'));

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the public folder
app.use(express.static(path.join(dirname, 'public')));

// Set up routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(Server running on port ${port});
});
