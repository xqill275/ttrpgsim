const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');

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

// Route to handle authentication (assuming it's defined in './routes/auth')
app.use('/auth', require('./routes/auth'));

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
    // Render 'index.ejs' from the 'views' folder
    res.render('index');
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
