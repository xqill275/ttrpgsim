// auth.js controller
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = async (req, res) => {
    console.log(req.body);
    const { username, email, password, confirmPassword } = req.body;
    db.query('SELECT Email FROM users WHERE Email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render('login-register', {
                message: 'That email is already in use'
            });
        } else if (password !== confirmPassword) {
            return res.render('login-register', {
                message: 'Passwords do not match'
            });
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        db.query('INSERT INTO users SET ?', { UserName: username, Email: email, Password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('login-register', {
                    message: 'User registered'
                });
            }
        });
    });
};

exports.login = async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE UserName = ?', [username], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length === 0) {
            return res.render('login-register', {
                message: 'Invalid email or password'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, results[0].Password);

        if (isPasswordValid) {
            // Password is correct, handle login success
            return res.render('dashboard', {
                user: results[0] // You can customize this based on your needs
            });
        } else {
            // Password is incorrect, handle login failure
            return res.render('login-register', {
                message: 'Invalid email or password'
            });
        }
    });
};
