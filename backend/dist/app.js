"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const missiontype_routes_1 = __importDefault(require("./routes/missiontype.routes"));
const mission_routes_1 = __importDefault(require("./routes/mission.routes"));
const department_routes_1 = __importDefault(require("./routes/department.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const requestResponseLogger_1 = require("./middleware/requestResponseLogger");
const auth_1 = require("./middleware/auth");
const upload_middleware_1 = require("./middleware/upload.middleware");
const app = (0, express_1.default)();
// CORS configuration - Allow frontend to access the API
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express_1.default.json());
app.use(requestResponseLogger_1.requestResponseLogger);
// Serve static uploaded files
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
// Swagger documentation
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Mission Assignment System API",
}));
// Routes
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});
// File upload endpoint
app.post("/api/upload", auth_1.authenticate, upload_middleware_1.upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const filePath = `/uploads/${req.file.filename}`;
    res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        data: { filePath }
    });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/mission-type", missiontype_routes_1.default);
app.use("/api/missions", mission_routes_1.default);
app.use("/api/departments", department_routes_1.default);
// Error handler (must be last)
app.use(errorHandler_1.errorHandler);
exports.default = app;
