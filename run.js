const sysctlx = require('sysctlx');

async function listRunningServices() {
  try {
    // Run systemctl command to list all running services
    const result = await sysctlx.systemctl('list-units', '--type=service', '--state=running', '--plain', '--all', '--no-pager', '--json');

    try {
      // Parse the JSON result
      const services = JSON.parse(result);

      // Display the list of running services
      console.log('Running Services:');
      services.forEach(service => {
        console.log(`- ${service[0]}`);
      });
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      console.log('Raw Output:', result);
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
