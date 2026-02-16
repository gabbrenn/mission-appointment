"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = void 0;
const common_schema_1 = require("./common.schema");
const auth_schema_1 = require("./auth.schema");
const user_schema_1 = require("./user.schema");
const department_schema_1 = require("./department.schema");
const missionType_schema_1 = require("./missionType.schema");
exports.schemas = {
    ...common_schema_1.commonSchemas,
    ...auth_schema_1.authSchemas,
    ...user_schema_1.userSchemas,
    ...department_schema_1.departmentSchemas,
    ...missionType_schema_1.missionTypeSchemas,
};
