const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { use } = require('./routes/auth');

dotenv.config({ path: './.env' });

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure EJS as the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Route to handle authentication (assuming it's defined in './routes/auth')
app.use('/auth', require('./routes/auth'));

app.use('/campaign', require('./routes/campaign'));

// Listen for requests on port 3000
app.listen(3000, () => {
    console.log('Listening for requests on port 3000');
});

// Function to log IP address, timestamp, and requested URL
function log(req, res) {
    console.log(req.ip + ' ' + new Date().toLocaleString() + ' ' + req.url);
}

// Handle GET requests for the root URL
app.get('/', (req, res) => {
    const token = req.cookies.jwt;
    var username;
    if (token != undefined) {
        loggedIn = true;
        jwt.verify(token,  process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                return res.redirect('/');
            } else {
                console.log("we are here")
                return username = decodedToken.UserName;
                console.log(username);
            }
        }
        );
    } else {
        loggedIn = false;
        username = '';
    }
    console.log(username);
    // Render 'index.ejs' from the 'views' folder
    res.render('index', { loggedIn, username });
    // Log the request details
    log(req, res);
});

app.get('/dashboard', (req, res) => {
    // Retrieve the JWT token from the request cookies
    const token = req.cookies.jwt;
    console.log(token);

    // Verify the JWT token
    jwt.verify(token,  process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            // Token is invalid, handle accordingly (e.g., redirect to login)
            return res.redirect('/login-register');
        } else {
            // Token is valid, you can access user information in decodedToken
            console.log(decodedToken);
            const userId = decodedToken.userId;
            const username = decodedToken.UserName;

            // Render 'dashboard.ejs' and pass user information or perform actions
            res.render('dashboard', { userId, username });
            console.log(userId);
            console.log(username);
        }
    });

    // Log the request details
    log(req, res);
});
app.get('/login-register', (req, res) => {
    // Render 'login-register.ejs' from the 'views' folder
    res.render('login-register');
    // Log the request details
    log(req, res);
});

// Handle 404 errors by rendering '404.ejs' from the 'views' folder
app.use((req, res) => {
    res.status(404).render('404');
    // Log the request details
    log(req, res);
});
