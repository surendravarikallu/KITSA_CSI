import app from "../server/index";

export default async (req: any, res: any) => {
    // Rely on the app already being populated by server/index.ts 
    // since we changed it to export `app` directly and it initializes routes on import
    return app(req, res);
};
