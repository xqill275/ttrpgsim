const express = require('express');
const campaignController = require('../controllers/campaign');
const router = express.Router();

// create-campaign route

router.post('/create-campaign', campaignController.createCampaign);

// get-campaign route
router.get('/get-campaigns', campaignController.getCampaigns);

router.delete('/delete-campaign', campaignController.deleteCampaign)


module.exports = router;