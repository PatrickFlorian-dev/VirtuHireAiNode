import * as repo from "../repositories/crudRepository.js";

const crudInsert = async (payload) => await repo.crudInsert(payload);
const crudRead = async (payload) => await repo.crudRead(payload);
const crudUpdate = async (payload) => await repo.crudUpdate(payload);
const crudDelete = async (payload) => await repo.crudDelete(payload);

export { crudInsert, crudRead, crudUpdate, crudDelete };
