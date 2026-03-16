import * as fs from 'fs';
import path from 'path';

async function globalTeardown() {
  console.log('Running global teardown...');

  // Clean up authentication state (optional)
  const authFile = path.join(__dirname, '.auth', 'taqelah-user.json');
  if (fs.existsSync(authFile)) {
    // Uncomment to delete auth file after tests
    // fs.unlinkSync(authFile);
    console.log('Auth file preserved for debugging');
  }

  console.log('Global teardown completed');
}

export default globalTeardown;