import { test, expect } from '@playwright/test';

/**
 * Auth Setup Test File
 * This file is executed by the 'setup-auth' project before all other tests run.
 * It triggers the global setup and verifies authentication was successful.
 *
 * Important: This is NOT a regular test file - it runs once per worker pool
 * before any other tests execute.
 */

test.describe('🔐 Global Auth Setup', () => {
  test('should complete authentication and create storage states', async () => {
    // This test verifies that global setup completed successfully
    // by checking that auth storage files were created
    
    const fs = require('fs');
    const path = require('path');

    // Verify storage state files exist
    // The global setup creates .auth in the tests directory (config.rootDir/tests/.auth)
    const authDir = path.join(__dirname, '../.auth');
    const stdUserStoragePath = path.join(authDir, 'saucedemo-standard-user.json');

    expect(fs.existsSync(stdUserStoragePath)).toBeTruthy();
    
    console.log('✅ Auth setup verified - storage states ready for tests');
  });
});
