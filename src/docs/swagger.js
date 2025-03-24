import swaggerJsdoc from 'swagger-jsdoc';
import YAML from 'yamljs';
import path from 'path';
import { glob } from 'glob';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Dynamic CRUD API',
        version: '1.0.0',
        description: 'API documentation for dynamic CRUD endpoints (Insert, Read, Update, Delete)',
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

const options = {
    swaggerDefinition,
    apis: [], 
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
