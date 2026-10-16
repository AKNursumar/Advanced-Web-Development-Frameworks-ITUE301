/**
 * Local CI Workflow Simulator
 * Replicates the exact steps executed inside GitHub Actions ubuntu-latest runner
 */
const { execSync } = require('child_process');

console.log('================================================================');
console.log('   PRACTICAL 12: GITHUB ACTIONS LOCAL WORKFLOW SIMULATOR');
console.log('   Author: Abdulkadir Nursumar (AK Nursumar)');
console.log('================================================================\n');

function runStep(name, command) {
  console.log(`\n▶ [CI Step] ${name}`);
  console.log(`  Executing: ${command}`);
  const startTime = Date.now();
  try {
    const output = execSync(command, { stdio: 'inherit' });
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✔ [Passed] ${name} completed in ${elapsed}s`);
    return true;
  } catch (error) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`✖ [Failed] ${name} exited with error in ${elapsed}s`);
    return false;
  }
}

const steps = [
  { name: '1. Check Node.js and npm versions', command: 'node -v && npm -v' },
  { name: '2. Static Code Linting', command: 'npm run lint' },
  { name: '3. Automated Integration Tests', command: 'npm test' }
];

let allPassed = true;
for (const step of steps) {
  const ok = runStep(step.name, step.command);
  if (!ok) {
    allPassed = false;
    break;
  }
}

console.log('\n================================================================');
if (allPassed) {
  console.log('   OVERALL CI STATUS: ✔ GREEN / PASSING (All workflow jobs succeeded)');
} else {
  console.log('   OVERALL CI STATUS: ✖ RED / FAILING (Workflow stopped on error)');
}
console.log('================================================================');

process.exit(allPassed ? 0 : 1);
