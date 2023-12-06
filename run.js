const { exec } = require('child_process');

async function listRunningServices() {
  try {
    // Run systemctl command to list all running services
    const result = await exec('systemctl list-units --type=service --state=running --no-pager --plain');

    // Split the output into lines
    const lines = result.stdout.split('\n');

    // Display detailed information for each running service
    for (const line of lines) {
      // Skip empty lines
      if (!line.trim()) continue;

      // Extract service name
      const serviceName = line.trim();

      // Run systemctl status for the service
      const statusResult = await exec(`systemctl status ${serviceName}`);

      // Display the detailed information including the raw message
      console.log(statusResult.stdout);
      console.log('---');
    }
  } catch (error) {
    console.error('Error running systemctl command:', error);
  }
}

// Call the function to list running services
listRunningServices();
