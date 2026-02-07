import chalk from 'chalk';

// Palette: "Low Saturation Fluorescent Sage"
// L1: #ccffcc (Top/Faint)
// L2: #99ff99 (Mid/Body)
// L3: #66ff66 (Bot/Accent)

const G1 = chalk.hex('#ccffcc').bold;
const G2 = chalk.hex('#99ff99').bold;
const G3 = chalk.hex('#66ff66').bold;

export const BANNER = `
${G1('  ___  ____  _____ _   _ ____    _    ____ ')}  ${G1(' _____')}
${G1(' / _ \\|  _ \\| ____| \\ | / ___|  / \\  / ___|')}  ${G1('| ____|')}
${G2('| | | | |_) |  _| |  \\| \\___ \\ / _ \\ | |  _ ')}  ${G2('|  _|  ')}
${G2('| |_| |  __/| |___| |\\  |___) / ___ \\| |_| |')}  ${G2('| |___ ')}
${G3(' \\___/|_|   |_____|_| \\_|____/_/   \\_\\____|')}  ${G3('|_____|')}
`;

export const LOGO_TEXT = `
${chalk.gray("   OPENSAG")}${G3("E")} ${chalk.gray(">>> COGNITIVE KERNEL")}
`;
