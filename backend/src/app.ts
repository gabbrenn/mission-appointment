import express from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import userRoutes from "./routes/user.routes";
import missionType from "./routes/missiontype.routes";
import missionRoutes from "./routes/mission.routes";
import departmentRoutes from "./routes/department.routes";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import { requestResponseLogger } from "./middleware/requestResponseLogger";
import { authenticate } from "./middleware/auth";
import { upload } from "./middleware/upload.middleware";

const app = express();

// CORS configuration - Allow frontend to access the API
app.use(cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(requestResponseLogger);

// Serve static uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Mission Assignment System API",
}));

// Routes
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

// File upload endpoint
app.post("/api/upload", authenticate, upload.single("file"), (req: any, res) => {
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

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mission-type",missionType);
app.use("/api/missions", missionRoutes);
app.use("/api/departments", departmentRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;

