import { CognitiveRouter } from "../src/router.js";

async function main() {
    console.log("🚀 Initializing OpenSage Cognitive Router...");

    // Initialize
    const router = CognitiveRouter.getInstance();

    // Test Case 1: Simple Phatic (Hello)
    const prompt1 = "Hello, are you there?";
    console.log(`\n📝 Analyzing Prompt: "${prompt1}"`);

    // In a real run, this would hit the Local Oracle (Ollama)
    // For this demo, we assume the Oracle is running or we mock it if offline.
    const result1 = await router.route(prompt1);

    console.log("✅ Routing Decision:");
    console.log(JSON.stringify(result1, null, 2));

    // Test Case 2: Complex Coding
    const prompt2 = "Refactor this React class component to a functional hook with useEffect.";
    console.log(`\n📝 Analyzing Prompt: "${prompt2}"`);

    const result2 = await router.route(prompt2);
    console.log("✅ Routing Decision:");
    console.log(JSON.stringify(result2, null, 2));
}

main().catch(console.error);
