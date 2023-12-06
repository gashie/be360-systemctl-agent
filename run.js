const sysctlx = require('sysctlx');

async function listRunningServices() {
  try {
    // Run systemctl command to list all running services in plain text
    const result = await sysctlx.systemctl('list-units', '--type=service', '--state=running', '--plain', '--all', '--no-pager');

    // Split the output into lines
    const lines = result.split('\n');

    // Display the list of running services with additional details
    console.log('Running Services:');
    for (const line of lines) {
      // Skip empty lines
      if (!line.trim()) continue;

      // Split the line into columns
      const columns = line.split(/\s+/);

      // Extract relevant information
      const unit = columns[0];
      const description = columns.slice(4).join(' ');

      // Display information
      console.log(`Unit: ${unit}`);
      console.log(`  Description: ${description}`);
      console.log('---');
    }
  } catch (error) {
    // Ignore errors related to init.scope
    if (!error.stderr.includes('Failed to get unit file state for init.scope: No such file or directory')) {
      console.error('Error running systemctl command:', error);
    }
  }
}

// Call the function to list running services
listRunningServices();
