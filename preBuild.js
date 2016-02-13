var fs = require('fs');

var exec = require('child_process').exec;

console.log ('Checking if "nw-builder" installed globally..');
function checkModule(){
	exec('npm list nw-builder -g', function (error, stdout, stderr) {
		if (error !== null || stderr != "") {
			if (stdout!="") console.log('output: '+stdout);
			if (stderr!="") console.log('error: '+stderr);
			if (error!=null) console.log('execution error: '+error);
			console.log('"nw-builder" not found\nInstalling now...');
			exec('npm install nw-builder -g', function (error, stdout, stderr) {
				if (stdout!="") console.log('output: '+stdout);
				if (stderr!="") console.log('error: '+stderr);
				if (error!=null) console.log('execution error: '+error);
				else checkModule();
			});
		} else {
			buildapp();
		}
	});
}
function buildapp(){
	console.log('"nw-builder" installed!\nBuilding App Now...');
}
checkModule();