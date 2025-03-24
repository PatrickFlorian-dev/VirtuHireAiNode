import swaggerJsdoc from 'swagger-jsdoc';
import YAML from 'yamljs';
import path from 'path';
import { glob } from 'glob';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'VirtuHire AI API',
        version: '1.0.0',
        description: 'API documentation for VirtuHireAi Auth, CRUD endpoints (Insert, Read, Update, Delete), and other misc endpoints',
    },
    servers: [
        {
            url: 'http://localhost:5000',
            description: 'Local dev server',
        },
    ],
    components: {},
    paths: {},
};

// 🔄 Auto-load all YAMLs from `/docs/paths`
const pathFiles = glob.sync(path.resolve('./docs/paths/*.yaml'));
pathFiles.forEach((file) => {
    const doc = YAML.load(file);
    swaggerDefinition.paths = { ...swaggerDefinition.paths, ...doc };
});

// Auto-load tags.yaml
const tagsFile = path.resolve('./docs/tags.yaml');
const tagsDoc = YAML.load(tagsFile);
swaggerDefinition.tags = tagsDoc.tags;

const options = {
    swaggerDefinition,
    apis: [], 
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
