import chalk from 'chalk';
import { BANNER, LOGO_TEXT } from './tui/art.js';
import { CognitiveRouter } from './router.js';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const WIDTH = 60;
const H_LINE = '═'.repeat(WIDTH);

// Center alignment helper
const getPadding = () => {
    const cols = process.stdout.columns || 80;
    const pad = Math.max(0, Math.floor((cols - WIDTH) / 2));
    return ' '.repeat(pad);
};

let PAD = getPadding(); // Calculate once at start

const BORDER_COLOR = chalk.hex('#99ff99'); // Level 2 (Mid)
const TOP_BORDER = () => PAD + BORDER_COLOR(`╔${H_LINE}╗`);
const BOT_BORDER = () => PAD + BORDER_COLOR(`╚${H_LINE}╝`);
const DIVIDER = () => PAD + BORDER_COLOR(`╠${H_LINE}╣`);

function printCenteredLine(text: string) {
    // Prints text inside the border, centered-ish or left-aligned with padding
    // We'll stick to left-aligned inside the box for readability, but the BOX itself is centered.
    console.log(PAD + BORDER_COLOR('║ ') + text);
}

async function bootSequence() {
    console.clear();
    PAD = getPadding(); // Recalculate on boot

    console.log(TOP_BORDER());

    // Split banner into lines and pad each
    const bannerLines = BANNER.split('\n');
    for (const line of bannerLines) {
        if (line.trim()) console.log(PAD + line);
    }

    console.log(PAD + BORDER_COLOR('║ ') + LOGO_TEXT.trim());
    console.log(PAD + BORDER_COLOR('║ ') + chalk.gray('   v1.0.0 | Velonlabs Distributed Systems'));
    console.log(DIVIDER());

    await sleep(800);

    const checks = [
        "CORE MODULE",
        "ORACLE ENGINE",
        "ROUTING TABLE",
        "AS2 PROTOCOL"
    ];

    for (const check of checks) {
        process.stdout.write(PAD + BORDER_COLOR('║ ') + chalk.gray(`   [CHECK] ${check.padEnd(20, '.')} `));
        await sleep(300);
        console.log(chalk.hex('#66ff66').bold('OK')); // Level 3 (High)
        await sleep(200);
    }

    console.log(PAD + BORDER_COLOR('║ '));
    console.log(PAD + BORDER_COLOR('║ ') + chalk.gray('   INITIALIZING NEURAL LINK...'));
    await sleep(1000);
    console.log(PAD + BORDER_COLOR('║ ') + chalk.hex('#66ff66')('   SYSTEM ONLINE.'));
    console.log(BOT_BORDER());
}

async function main() {
    await bootSequence();

    const router = CognitiveRouter.getInstance();

    const scenarios = [
        "Hi, how are you today?",
        "Write a Python script to see if a number is prime.",
        "Explain the difference between quantum entanglement.",
        "I have a race condition in my Rust tokio runtime...",
        "What's the capital of France?",
    ];

    let i = 0;
    while (true) {
        const prompt = scenarios[i % scenarios.length];

        console.log('');
        console.log(TOP_BORDER());
        console.log(PAD + BORDER_COLOR('║ ') + chalk.gray(`[${new Date().toLocaleTimeString()}] INCOMING SIGNAL:`));
        console.log(PAD + BORDER_COLOR('║ ') + chalk.white(`"${prompt}"`));
        console.log(DIVIDER());

        await sleep(600);

        const decision = await router.route(prompt);
        const score = decision.judgment?.complexity || '?';

        let tierColor = chalk.hex('#66ff66'); // Level 3
        if (decision.tier === 'standard') tierColor = chalk.cyan;
        if (decision.tier === 'deep') tierColor = chalk.magenta;

        console.log(PAD + BORDER_COLOR('║ ') + chalk.gray(`> ANALYSIS: `) + chalk.yellow(`Complexity ${score}/10`));
        console.log(PAD + BORDER_COLOR('║ ') + chalk.gray(`> ROUTING : `) + tierColor.bold(`${decision.tier.toUpperCase()}`) + chalk.gray(` -> ${decision.model}`));
        console.log(BOT_BORDER());

        i++;
        await sleep(3000);
    }
}

main().catch(console.error);
