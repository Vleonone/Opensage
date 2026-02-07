import { CognitiveRouter } from "./router.js";
import { insightServer } from "./ui/server.js";

async function main() {
    // 1. Start GUI Server
    insightServer.start();

    const router = CognitiveRouter.getInstance();

    console.log("Waiting for browser to connect...");
    console.log("Please open http://localhost:3000");

    // Simulate traffic loop
    const scenarios = [
        "Hi, how are you today?", // Reflex
        "Write a Python script to scrape a website using BeautifulSoup.", // Standard
        "Explain the difference between quantum entanglement and superposition.", // Standard/Deep
        "I have a race condition in my Rust tokio runtime, here is the stack trace...", // Deep
        "What's the capital of France?", // Reflex
    ];

    let i = 0;
    setInterval(async () => {
        const prompt = scenarios[i % scenarios.length];
        console.log(`\n[Simulating] User: "${prompt}"`);

        await router.route(prompt);

        i++;
    }, 3000); // Every 3 seconds
}

main().catch(console.error);
