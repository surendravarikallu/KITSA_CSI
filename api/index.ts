import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let isReady = false;

// Initialize routes asynchronously but map the requests to it
const init = async () => {
    if (!isReady) {
        try {
            // We pass a dummy server just to satisfy the function signature
            // Since Vercel Serverless handles the HTTP server part
            const mockServer: any = {
                listen: () => { },
                on: () => { },
                close: () => { },
            };
            await registerRoutes(mockServer, app);
            isReady = true;
        } catch (err) {
            console.error("Failed to initialize Vercel serverless application:", err);
            throw err;
        }
    }
};

export default async (req: any, res: any) => {
    await init();
    return app(req, res);
};
