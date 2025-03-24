// crudRepository.js
import { models } from "../models/index.js";

// Define your unique fields for validation
const uniqueConstraints = {
    Company: ['companyName'],
    User: ['username', 'email'],
};

const getModel = (tableName) => {
    const model = models[tableName];
    if (!model) {
        throw new Error(`Model "${tableName}" does not exist.`);
    }
    return model;
};

// CREATE
const crudInsert = async (insertPayload) => {
    const { tableName, data } = insertPayload;
    const model = getModel(tableName);

    // Unique check for Company.companyName or User.username
    if (tableName === 'User' && data.username) {
        const exists = await model.findOne({ where: { username: data.username } });
        if (exists) {
            throw new Error(`User with username '${data.username}' already exists.`);
        }
    }

    if (tableName === 'Company' && data.companyName) {
        const exists = await model.findOne({ where: { companyName: data.companyName } });
        if (exists) {
            throw new Error(`Company with name '${data.companyName}' already exists.`);
        }
    }

    const instance = await model.create(data);
    return instance.toJSON();
};

// READ
const crudRead = async ({ tableName, query = {} }) => {
    const model = getModel(tableName);
    const data = await model.findAll({ where: query });
    return data.map((d) => d.toJSON());
};

// UPDATE
const crudUpdate = async ({ tableName, query = {}, updateData }) => {
    const model = getModel(tableName);
    const [updated] = await model.update(updateData, { where: query });
    return updated;
};

// DELETE
const crudDelete = async ({ tableName, query = {} }) => {
    const model = getModel(tableName);
    const deleted = await model.destroy({ where: query });
    return deleted;
};

export { crudInsert, crudRead, crudUpdate, crudDelete };
