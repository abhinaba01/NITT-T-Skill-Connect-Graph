// routes/api.js

const express = require('express');
const router = express.Router();

// Import all the controllers
const nodeController = require('../controllers/nodecontroller');
const serviceController = require('../controllers/servicecontroller');
const relationshipController = require('../controllers/relationshipcontroller');

// Import the authentication middleware
const auth = require('../middleware/auth'); 

// --- Node Routes ---
// These are public and do not require a user to be logged in.
router.get('/nodes/:label', nodeController.getNodesByLabel);
router.get('/nodes', nodeController.getAllNodes);

// --- Service Routes ---
// Creating a service requires a user to be logged in.
router.post('/services', auth, serviceController.createService);
// Getting and searching for services are public actions.
router.get('/services', serviceController.getAllServices);
router.get('/services/search/:name', serviceController.searchService);

// --- Relationship Routes ---
// Creating 'OFFERS' and 'USES' relationships requires a user to be logged in.
// This is where the functions from your relationshipController are linked.
router.post('/relationships/offers', auth, relationshipController.createOffersRelationship);
router.post('/relationships/uses', auth, relationshipController.createUsesRelationship);

module.exports = router;