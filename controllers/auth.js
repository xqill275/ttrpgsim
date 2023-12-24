// auth.js controller
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = async (req, res) => {
    console.log(req.body);
    const { username, email, password, confirmPassword } = req.body;
    
    // Check if email is already in use
    db.query('SELECT Email FROM users WHERE Email = ?', [email], async (error, emailResults) => {
        if (error) {
            console.log(error);
            return res.render('login-register', {
                message: 'Error checking email availability'
            });
        }

        if (emailResults.length > 0) {
            return res.render('login-register', {
                message: 'That email is already in use'
            });
        }

        // Check if username is already in use
        db.query('SELECT UserName FROM users WHERE UserName = ?', [username], async (error, usernameResults) => {
            if (error) {
                console.log(error);
                return res.render('login-register', {
                    message: 'Error checking username availability'
                });
            }

            if (usernameResults.length > 0) {
                return res.render('login-register', {
                    message: 'That username is already in use'
                });
            }

            // If email and username are available, proceed with registration
            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);

            db.query('INSERT INTO users SET ?', { UserName: username, Email: email, Password: hashedPassword }, (error, registrationResults) => {
                if (error) {
                    console.log(error);
                    return res.render('login-register', {
                        message: 'Error registering user'
                    });
                } else {
                    console.log(registrationResults);
                    return res.render('login-register', {
                        message: 'User registered'
                    });
                }
            });
        });
    });
};


exports.login = async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE UserName = ?', [username], async (error, results) => {
        if (error) {
            console.log(error);
            return res.render('login-register', {
                message: 'Error during login'
            });
        }

        // Check if results is defined and not an empty array
        if (results && results.length > 0) {
            const isPasswordValid = await bcrypt.compare(password, results[0].Password);

            if (isPasswordValid) {
                // set cookie to userid
                console.log(results[0].id);

                const token = jwt.sign({ userId: results[0].id, UserName: results[0].UserName }, process.env.JWT_SECRET, {
                    expiresIn: '1h' // You can adjust the expiration time as needed
                });
        
                // Set the JWT token as a cookie
                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Set to true in production if using HTTPS
                    maxAge: 3600000, // 1 hour in milliseconds
                    sameSite: 'strict' // Adjust based on your requirements
                });
                // Password is correct, handle login success
                res.redirect('/dashboard');
            } else {
                // Password is incorrect, handle login failure
                return res.render('login-register', {
                    message: 'Invalid email or password'
                });
            }
        } else {
            // Handle the case where no user with the given username was found
            return res.render('login-register', {
                message: 'Invalid email or password'
            });
        }
    });
};


exports.logout = (req, res) => {
    // Clear the cookie containing the JWT
    // redirect to home page
    const token = req.cookies.jwt;
    res.cookie('jwt', token, {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production', // Set to true in production if using HTTPS
        sameSite: 'strict' // Adjust based on your requirements
    });
    res.redirect('/');
}

