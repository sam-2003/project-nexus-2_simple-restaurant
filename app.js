const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');

// Use body-parser and flash
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

// Use express-session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Global variables for flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

// Register handle
app.post('/register', (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    let errors = [];

    // Check required fields
    if (!name || !email || !password || !confirm_password) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check passwords match
    if (password !== confirm_password) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            confirm_password
        });
    } else {
        // Validation passed
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) throw err;

            // Check if email exists
            User.findOne({ email: email }).then(user => {
                if (user) {
                    // User exists
                    errors.push({ msg: 'Email is already registered' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        confirm_password
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword
                    });

                    newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('/login');
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            });
        });
    }
});

// Login handle
app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout handle
app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

// Start server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});