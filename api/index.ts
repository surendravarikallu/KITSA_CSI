import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let isReady = false;

const init = async () => {
    if (!isReady) {
        try {
            const mockServer: any = {
                listen: () => { },
                on: () => { },
                close: () => { },
            };
            await registerRoutes(mockServer, app);
            isReady = true;
        } catch (err) {
            console.error("[CRITICAL] Failed to initialize Vercel serverless application:", err);
            // Don't throw here, let it pass so the request handler can return the 500 with details
        }
    }
};

export default async (req: any, res: any) => {
    try {
        await init();
        if (!isReady) {
            return res.status(500).json({
                error: "Initialization failed",
                details: "Check Vercel Function Logs for [CRITICAL] tags."
            });
        }
        return app(req, res);
    } catch (err: any) {
        console.error("[CRITICAL] Request handling error:", err);
        return res.status(500).json({
            error: "Internal Server Error",
            message: err.message,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined
        });
    }
};
