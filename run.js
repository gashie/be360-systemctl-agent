const { exec } = require('child_process');

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
            console.log('====================================');
            console.log(line);
            console.log('====================================');
          const [unit, load, active, sub, description] = line.split(/\s+/);
          unitsList.push({ unit, load, active, sub, description });
        });
  
        console.log(JSON.stringify(unitsList, null, 2));
      }
    });
  }
  
  listUnits();