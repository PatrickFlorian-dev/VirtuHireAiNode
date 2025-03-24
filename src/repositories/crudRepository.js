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
    const { tableName, ...data } = insertPayload;
    const model = getModel(tableName);

    // Check for unique constraint
    const uniqueFields = uniqueConstraints[tableName];
    if (uniqueFields) {
        const where = {};
        uniqueFields.forEach((field) => {
            if (data[field]) {
                where[field] = data[field];
            }
        });

        const existing = await model.findOne({ where });
        if (existing) {
            throw new Error(`${tableName} already exists with the provided unique fields.`);
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
