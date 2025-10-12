const graphModel = require('../models/graphModel');

/*
 * DEPRECATED: The createNode function is no longer needed for creating users.
 * User creation is now handled by the '/register' endpoint in your auth routes,
 * which correctly handles password hashing and email uniqueness.
 *
 * exports.createNode = async (req, res) => { ... };
 */


/**
 * Controller to get all nodes with a specific label.
 * This remains a public endpoint.
 */
exports.getNodesByLabel = async (req, res) => {
    const { label } = req.params;

    try {
        const nodes = await graphModel.findNodesByLabel(label);
        res.status(200).json(nodes);
    } catch (error) {
        console.error(`Error fetching nodes with label ${label}:`, error);
        res.status(500).json({ error: `Failed to fetch nodes with label ${label}.` });
    }
};

/**
 * Controller to get all nodes in the graph.
 * This remains a public endpoint.
 */
exports.getAllNodes = async (req, res) => {
    try {
        const nodes = await graphModel.findAllNodes();
        res.status(200).json(nodes);
    } catch (error) {
        console.error('Error fetching all nodes:', error);
        res.status(500).json({ error: 'Failed to fetch all nodes.' });
    }
};
