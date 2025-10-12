const driver = require('../config/neo4j');

/**
 * Creates a new node in the database.
 * @param {string} label - The label for the new node (e.g., 'Student', 'Service').
 * @param {object} properties - An object containing the properties for the new node.
 * @returns {Promise<object>} A promise that resolves to the properties of the created node.
 */
const createNode = async (label, properties) => {
    const session = driver.session();
    try {
        // Using parameters helps prevent Cypher injection attacks.
        const result = await session.run(
            `CREATE (n:${label} $props) RETURN n`,
            { props: properties }
        );
        return result.records[0].get('n').properties;
    } finally {
        await session.close();
    }
};

/**
 * Finds all nodes with a specific label.
 * @param {string} label - The label of the nodes to find.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of node properties.
 */
const findNodesByLabel = async (label) => {
    const session = driver.session();
    try {
        const result = await session.run(`MATCH (n:${label}) RETURN n`);
        return result.records.map(record => record.get('n').properties);
    } finally {
        await session.close();
    }
};

/**
 * NEW: Finds all nodes in the entire graph.
 * Be cautious using this on very large databases.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of all node properties.
 */
const findAllNodes = async () => {
    const session = driver.session();
    try {
        const result = await session.run(`MATCH (n) RETURN n`);
        // We add labels to the properties for more context
        return result.records.map(record => {
            const node = record.get('n');
            return {
                ...node.properties,
                labels: node.labels
            };
        });
    } finally {
        await session.close();
    }
};

/**
 * Creates a directional relationship between two existing nodes.
 * @param {object} fromNode - The starting node of the relationship.
 * @param {object} toNode - The ending node of the relationship.
 * @param {string} relationshipType - The type of the relationship (e.g., 'OFFERS', 'USES').
 * @returns {Promise<object>} A promise that resolves to an object confirming the relationship type.
 */
const createRelationship = async (fromNode, toNode, relationshipType) => {
    const session = driver.session();
    const { label: fromLabel, property: fromProperty, value: fromValue } = fromNode;
    const { label: toLabel, property: toProperty, value: toValue } = toNode;

    try {
        const result = await session.run(
            `MATCH (a:${fromLabel} {${fromProperty}: $fromValue}), (b:${toLabel} {${toProperty}: $toValue})
             CREATE (a)-[r:${relationshipType}]->(b)
             RETURN type(r)`,
            { fromValue, toValue }
        );
        return { relationship: result.records[0].get('type(r)') };
    } finally {
        await session.close();
    }
};

/**
 * Finds a service by name and all the nodes that offer that service.
 * @param {string} serviceName - The name of the service to search for.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of objects, each containing a provider and the service.
 */
const findServiceAndProviders = async (serviceName) => {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (provider)-[:OFFERS]->(s:Service)
             WHERE toLower(s.name) CONTAINS toLower($serviceName)
             RETURN provider.name AS providerName, labels(provider)[0] AS providerRole, s.name AS serviceName`,
            { serviceName }
        );
        return result.records.map(record => ({
            provider: record.get('providerName'),
            role: record.get('providerRole'),
            service: record.get('serviceName')
        }));
    } finally {
        await session.close();
    }
};

/**
 * Finds a single user by their email address.
 * This is used for registration checks, login, and fetching user profiles.
 * @param {string} email - The email of the user to find.
 * @returns {Promise<object|null>} A promise that resolves to the user object (with properties and role) or null if not found.
 */
const findUserByEmail = async (email) => {
    const session = driver.session();
    try {
        const result = await session.run(
            'MATCH (u {email: $email}) RETURN u, labels(u) AS labels LIMIT 1',
            { email }
        );

        if (result.records.length === 0) {
            return null; // Return null if no user is found
        }

        const record = result.records[0];
        const node = record.get('u').properties;
        const labels = record.get('labels');
        const role = labels && labels.length ? labels[0] : 'User';

        return {
            ...node, // Contains name, email, and password hash
            role: role
        };
    } finally {
        await session.close();
    }
};

module.exports = {
    createNode,
    findNodesByLabel,
    findAllNodes, // <-- Add the new function to exports
    createRelationship,
    findServiceAndProviders,
    findUserByEmail
};

