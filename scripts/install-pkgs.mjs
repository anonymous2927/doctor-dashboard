const { execSync } = require('child_process');

const packages = [
  'next@15.1.6',
  'lucide-react',
  'sonner',
  'date-fns',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  '@radix-ui/react-slot',
  '@radix-ui/react-avatar',
  '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-label',
  '@radix-ui/react-select',
  '@radix-ui/react-separator',
  '@radix-ui/react-switch',
  '@radix-ui/react-tabs',
];

for (const pkg of packages) {
  try {
    console.log(`Installing ${pkg}...`);
    execSync(`npm install ${pkg} --no-audit --no-fund`, { 
      stdio: 'pipe', 
      timeout: 120000,
      cwd: process.cwd()
    });
    console.log(`  ✓ ${pkg} installed`);
  } catch (e) {
    console.log(`  ✗ ${pkg} failed: ${e.message?.slice(0, 100)}`);
  }
}

console.log('\nDone!');
