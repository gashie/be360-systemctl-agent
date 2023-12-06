const { execSync } = require('child_process');

function listRunningServices() {
  try {
    // Get a list of all running systemd services
    const runningServices = execSync('ps axo comm | grep -E \'^\\[?[^\\[]\'').toString().trim().split('\n');

    // Define invalid entries that should be excluded
    const invalidEntries = ['COMMAND', 'kthreadd', 'rcu_gp', 'rcu_par_gp', 'slub_flushwq', 'netns', 'kworker/0:0H-events_highpri', 'mm_percpu_wq'];

    // Loop through each running service
    runningServices.forEach((service) => {
      // Skip processing invalid entries
      if (invalidEntries.includes(service)) {
        return;
      }

      // Filter out invalid unit names
      if (!service.match(/^[A-Za-z0-9_-]+$/)) {
        // Skip processing invalid entries
        return;
      }

      const serviceInfo = getServiceInfo(service);
      if (serviceInfo) {
        console.log(JSON.stringify(serviceInfo, null, 2));
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
// Rest of the script remains unchanged
// ...

// Call the function to list all running services
listRunningServices();
