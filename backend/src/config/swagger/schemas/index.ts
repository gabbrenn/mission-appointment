import { commonSchemas } from "./common.schema";
import { authSchemas } from "./auth.schema";
import { userSchemas } from "./user.schema";
import { departmentSchemas } from "./department.schema";
import { missionTypeSchemas } from "./missionType.schema";

export const schemas = {
    ...commonSchemas,
    ...authSchemas,
    ...userSchemas,
    ...departmentSchemas,
    ...missionTypeSchemas,
};
