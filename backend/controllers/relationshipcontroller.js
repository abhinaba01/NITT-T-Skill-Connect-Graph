// controllers/relationshipController.js

const graphModel = require('../models/graphModel');

/**
 * MODIFIED: Controller to create an 'OFFERS' relationship.
 * This is a protected action. The relationship is created for the currently logged-in user.
 */
exports.createOffersRelationship = async (req, res) => {
    // User info is securely taken from the authMiddleware, not the request body.
    const { name: nodeName, role: nodeLabel } = req.user;
    const { serviceName } = req.body;

    if (!serviceName) {
        return res.status(400).json({ error: 'serviceName is required.' });
    }

    try {
        const result = await graphModel.createRelationship(
            // Use the authenticated user's details for the 'from' node.
            { label: nodeLabel, property: 'name', value: nodeName },
            { label: 'Service', property: 'name', value: serviceName },
            'OFFERS'
        );
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating OFFERS relationship:', error);
        res.status(500).json({ error: 'Failed to create OFFERS relationship.' });
    }
};

/**
 * MODIFIED: Controller to create a 'USES' relationship.
 * This is a protected action. The relationship is created for the currently logged-in user.
 */
exports.createUsesRelationship = async (req, res) => {
    // User info is securely taken from the authMiddleware.
    const { name: nodeName, role: nodeLabel } = req.user;
    const { serviceName } = req.body;

    if (!serviceName) {
        return res.status(400).json({ error: 'serviceName is required.' });
    }

    try {
        const result = await graphModel.createRelationship(
            // Use the authenticated user's details for the 'from' node.
            { label: nodeLabel, property: 'name', value: nodeName },
            { label: 'Service', property: 'name', value: serviceName },
            'USES'
        );
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating USES relationship:', error);
        res.status(500).json({ error: 'Failed to create USES relationship.' });
    }
};
