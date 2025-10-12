// controllers/serviceController.js

const graphModel = require('../models/graphModel');

/**
 * MODIFIED: Controller to create a new service node.
 * This is a protected action that requires authentication.
 * The identity of the user creating the service is taken from the JWT in req.user.
 */
exports.createService = async (req, res) => {
    const { name, description } = req.body;
    // The user's name is securely obtained from the auth token.
    const creator = req.user.name;

    if (!name) {
        return res.status(400).json({ error: 'Service name is required.' });
    }

    // You can optionally store who created the service for tracking purposes.
    const properties = { name, description: description || '', createdBy: creator };

    try {
        const result = await graphModel.createNode('Service', properties);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Failed to create service.' });
    }
};

/**
 * Controller to get all service nodes.
 * This remains a public endpoint, no authentication required.
 */
exports.getAllServices = async (req, res) => {
    try {
        const services = await graphModel.findNodesByLabel('Service');
        res.status(200).json(services);
    } catch (error)
    {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Failed to fetch services.' });
    }
};

/**
 * Controller to search for a service and find who offers it.
 * This remains a public endpoint, no authentication required.
 */
exports.searchService = async (req, res) => {
    const { name } = req.params;

    if (!name) {
        return res.status(400).json({ error: 'Service name is required for searching.' });
    }

    try {
        const results = await graphModel.findServiceAndProviders(name);
        if (results.length === 0) {
            return res.status(404).json({ message: 'No providers found for this service.' });
        }
        res.status(200).json(results);
    } catch (error) {
        console.error(`Error searching for service ${name}:`, error);
        res.status(500).json({ error: `Failed to search for service ${name}.` });
    }
};