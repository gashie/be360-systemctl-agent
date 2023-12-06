const { execSync } = require('child_process');

function listRunningServices() {
  try {
    // Get a list of all running systemd services
    const runningServices = execSync('ps axo comm | grep -E \'^\\[?[^\\[]\'').toString().trim().split('\n');

    // Loop through each running service
    runningServices.forEach((service) => {
      // Add a debug statement to print the service name
      console.log(`Processing service: ${service}`);

      // Filter out invalid unit names
      if (!service.match(/[^A-Za-z0-9_-]/)) {
        const serviceInfo = getServiceInfo(service);
        if (serviceInfo) {
          console.log(JSON.stringify(serviceInfo, null, 2));
        }
      }
    });
  } catch (error) {
    console.error(`Error listing running services: ${error.message}`);
  }
}

function getServiceInfo(serviceName) {
  try {
    // Add a debug statement to print the service name
    console.log(`Fetching information for service: ${serviceName}`);

    // Rest of the function remains unchanged
    // ...
  } catch (error) {
    console.error(`Error fetching information for ${serviceName}: ${error.message}`);
    return null;
  }
}

// List all running services
listRunningServices();
