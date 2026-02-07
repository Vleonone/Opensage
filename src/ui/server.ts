import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class InsightServer {
    private app;
    private httpServer;
    private io;
    private port = 3000;

    constructor() {
        this.app = express();
        this.httpServer = createServer(this.app);
        this.io = new Server(this.httpServer);

        // Serve static files
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    start() {
        this.httpServer.listen(this.port, () => {
            console.log(`\n🚀 OpenSage Insight GUI running at http://localhost:${this.port}`);
            console.log(`   (Pixelated/Cyberpunk Theme Active)\n`);
        });
    }

    broadcast(event: string, data: any) {
        this.io.emit(event, data);
    }
}

// Singleton instance
export const insightServer = new InsightServer();
