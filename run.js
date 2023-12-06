const { exec } = require('child_process');


// Function to list units and convert to JSON
function listUnits() {
  const cmd = 'systemctl list-units --no-legend';
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error('Error listing units');
      console.error(stderr);
    } else {
      const lines = stdout.trim().split('\n');
      const unitsList = [];

      lines.forEach((line) => {
        const [unit, load, active, sub, description] = line.split(/\s+/);
        unitsList.push({ unit, load, active, sub, description });
      });

      console.log(JSON.stringify(unitsList, null, 2));
    }
  });
}

listUnits();
