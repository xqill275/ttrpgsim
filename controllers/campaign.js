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

// when we get here just say campaign created to the screen

exports.createCampaign = async (req, res) => {
    console.log(req.body);
    const { campaignName, campaignDescription, campaignSystem, campaignStartDate } = req.body;
    const token = req.cookies.jwt;
    const userId = await getID(token);
    console.log(userId);

    db.query('INSERT INTO campaign SET ?', { campaign_creatorID: userId, campaign_name: campaignName, campaign_description: campaignDescription, campaign_system: campaignSystem, campaign_date: campaignStartDate }, (error, campaignResults) => {
        if (error) {
            console.log(error);
            return res.render('create-campaign', {
                message: 'Error creating campaign'
            });
        } else {
            console.log(campaignResults);
            // if all goes well, redirect to dashboard with message campaign created
            res.redirect('/dashboard');
        }
    }
    )

}; 

exports.getCampaigns = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const userId = await getID(token);

        db.query('SELECT * FROM campaign WHERE campaign_creatorID = ?', [userId], (error, campaignResults) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: 'Error getting campaign' });
            } else {
                // Convert the circular structure to a non-circular one
                const campaigns = JSON.parse(JSON.stringify(campaignResults));
                res.json(campaigns);
            }
        });
    } catch (error) {
        console.error('Error getting campaigns:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.deleteCampaign = async (req, res) => {
    try {
        const { campaignId } = req.body;
        const token = req.cookies.jwt;
        const userId = await getID(token);

        db.query('DELETE FROM campaign WHERE campaign_id = ? AND campaign_creatorID = ?', [campaignId, userId], (error, campaignResults) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: 'Error deleting campaign' });
            } else {
                // return ok
                res.json({ ok: true });
            }
        });
    } catch (error) {
        console.error('Error deleting campaign:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


function getID(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(decodedToken);
                resolve(decodedToken.userId);
            }
        });
    });
}
