'use strict';

let ctl = require('sysctlx');

function parseEnableResponse(raw) {
	return raw === '' || raw.match(/created symlink/i) !== null;
}

function parseDisableResponse(raw) {
	return raw === '' || raw.match(/removed/i) !== null;
}

function sendError(response, message) {
	response.status(400);
	response.send(message);
}
function sendOk(response) {
	response.status(200);
	response.json({result: true});
}

exports.enableService = function (request, response) {
	let service = request.params.service;
	ctl.enable(service).then(function (result) {
		console.log(result);
		if (parseEnableResponse(result)) {
			sendOk(response);
		} else {
			sendError(response, 'Unable to enable service!');
		}
	});
};

exports.disableService = function (request, response) {
	let service = request.params.service;
	ctl.disable(service).then(function (result) {
		console.log(result);
		if (parseDisableResponse(result)) {
			sendOk(response);
		} else {
			sendError(response, 'Unable to disable service!');
		}
	});
};

exports.startService = function (request, response) {
	let service = request.params.service;
	ctl.start(service).then(function (result) {
		sendOk(response);
	});
};

exports.stopService = function (request, response) {
	let service = request.params.service;
	ctl.stop(service).then(function (result) {
		sendOk(response);
	});
};

exports.restartService = function (request, response) {
	let service = request.params.service;
	ctl.restart(service).then(function (result) {
		sendOk(response);
	});
};

exports.getServiceStatus = function (request, response) {
	let service = request.params.service;
	ctl.status(service).then(function (status) {
		if (status) {
			response.json(status);
		} else {
			sendError(response, 'Unknown service \'' + service + '\'');
		}
	}).catch(function (err) {
		sendError(response, err);
	});
};
exports.listService = function (request, response) {
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
  
		  const detailedInfoCmd = `systemctl show ${unit} --no-pager --property=LoadState,ActiveState,Description,SubState,UnitFileState,ActiveEnterTimestamp,MainPID`;
		  exec(detailedInfoCmd, (detailError, detailStdout, detailStderr) => {
			if (detailError) {
			  console.error(`Error getting detailed info for ${unit}`);
			  console.error(detailStderr);
			} else {
			  const [loaded, activeState, desc, subState, unitFileState, activeEnterTimestamp, mainPID] = detailStdout.trim().split(/\n/);
  
			  const unitInfo = {
				name: unit,
				description: desc.split('=')[1],
				loaded: loaded.split('=')[1] === 'loaded',
				file: unitFileState.split('=')[1],
				startup: activeState.split('=')[1],
				props: {
				  preset: subState.split('=')[1],
				},
				active: activeState.split('=')[1],
				started: new Date(parseInt(activeEnterTimestamp.split('=')[1]) * 1000).toISOString(),
				pid: mainPID.split('=')[1],
				raw: detailStdout.trim(),
			  };
  
			  unitsList.push(unitInfo);
			}
  
			// Print the JSON result when all units are processed
			if (unitsList.length === lines.length) {
			  response.json(JSON.stringify(unitsList, null, 2))
			}
		  });
		});
	  }
	});
};