const { execSync } = require('child_process');

function listRunningServices() {
  try {
    // Get a list of all running systemd services
    const runningServices = execSync('ps axo comm | grep -E \'^\\[?[^\\[]\'').toString().trim().split('\n');

    // Loop through each running service
    runningServices.forEach((service) => {
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
    // Get basic information
    const name = execSync(`systemctl show -p Id -p Description -p LoadState -p FragmentPath --value ${serviceName}`).toString().trim();

    // Get detailed information
    const details = execSync(`systemctl show --no-page --value ${serviceName}`).toString().trim();

    // Extract specific details
    const loaded = execSync(`systemctl show --no-page --value --property=LoadState ${serviceName}`).toString().trim() === 'loaded';
    const file = execSync(`systemctl show --no-page --value --property=FragmentPath ${serviceName}`).toString().trim();
    const startup = execSync(`systemctl is-enabled ${serviceName}`).toString().trim().toLowerCase();
    const preset = execSync(`systemctl show --no-page --value --property=SubState ${serviceName}`).toString().trim();

    // Get status, started time, and PID
    const status = execSync(`systemctl is-active ${serviceName}`).toString().trim();
    const started = execSync(`systemctl show --no-page --value --property=ActiveEnterTimestamp ${serviceName}`).toString().trim();
    const pid = execSync(`systemctl show --no-page --value --property=MainPID ${serviceName}`).toString().trim();

    // Get raw message
    const raw = execSync(`systemctl show --no-page --value ${serviceName}`).toString().trim();

    // Format the output
    const output = {
      name,
      description: name.split(' ').slice(1).join(' '),
      loaded,
      file,
      startup,
      props: {
        preset,
      },
      status,
      started: started ? new Date(parseInt(started) * 1000).toISOString() : null,
      pid,
      raw,
    };

    return output;
  } catch (error) {
    console.error(`Error fetching information for ${serviceName}: ${error.message}`);
    return null;
  }
}

// List all running services
listRunningServices();
