// crudRepository.js
import { models } from "../models/index.js";
import redisClient from '../config/redisClient.js';
import { Op } from 'sequelize';

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
const crudRead = async ({ tableName, query = {}, username, recordsLeft = null, lastId = null }) => {
    const model = getModel(tableName);
    const cacheKey = `${username}_${tableName}`;
    const existingCache = await redisClient.get(cacheKey);

    // If cache exists, and it's the first request (no pagination), return the entire cache
    if (existingCache && recordsLeft === null && lastId === null) {
        const cachedData = JSON.parse(existingCache);
        return {
            data: cachedData,
            recordsLeft: null,
            lastId: null
        };
    }

    const where = { ...query };

    const limit = 500;

    // If lastId exists, it means we're paginating, and we need to calculate the offset
    let offset = 0;
    if (lastId !== null) {
        offset = lastId; // The offset will be the lastId, as we're starting from the next record after lastId
    }

    // Fetch the next set of records using OFFSET and LIMIT
    const result = await model.findAll({
        where,
        limit,
        offset,
        order: [['id', 'ASC']],
    });

    const mapped = result.map((r) => r.toJSON());
    const lastFetchedId = mapped.length > 0 ? mapped[mapped.length - 1].id : null;

    // Calculate the total count of records (needed to calculate recordsLeft)
    const totalCount = await model.count({ where });

    // If recordsLeft is null, check for the cache to append data
    let combinedData = mapped;
    if (recordsLeft !== null) {
        // Fetch the data from cache and append the new batch of results
        if (existingCache) {
            const cachedData = JSON.parse(existingCache);
            combinedData = [...cachedData, ...mapped]; // Append new results
        }
    }

    // Update the cache with the combined data (after appending)
    await redisClient.set(cacheKey, JSON.stringify(combinedData), { EX: 60 * 30 }); // Cache for 30 minutes

    // Calculate remaining records to be fetched based on totalCount
    let totalRecordsLeft = totalCount - combinedData.length;

    // If we're not appending any more records, ensure `recordsLeft` is properly set
    if (recordsLeft === null) {
        totalRecordsLeft = totalCount - mapped.length; // Subtract fetched records if this is the first batch
    }

    // Ensure recordsLeft doesn't go below 0
    totalRecordsLeft = totalRecordsLeft > 0 ? totalRecordsLeft : 0;

    return {
        data: mapped, // Only return the new batch of 500 results
        recordsLeft: totalRecordsLeft, // Return the remaining records count
        lastId: lastFetchedId, // Return the lastId for pagination
    };
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
