const { SerialPort, ReadlineParser } = require('serialport');
const { exec } = require("child_process");
const port = new SerialPort({ path: 'COM3', baudRate: 9600 })
const parser = new ReadlineParser()

const handleRequest = (a) => {
	console.log(
	{
		a
	})
	
	if(a.toLowerCase().includes("cmd")){
		const cmd = a.substring(a.indexOf('<')+1, a.indexOf('>'));
		if(cmd.length){
			exec(cmd, (error, stdout, stderr) => {
				if (error) {
					// console.log(`Error: ${error.message}`);
					port.write(`Error: ${error.message}\n`)
					return;
				}
				if (stderr) {
					// console.log(`Stderr: ${stderr}`);
					port.write(`Stderr: ${stderr}\n`)
					return;
				}
				port.write(`Stdout: ${stdout}\n`)
				// console.log(`Stdout: ${stdout}`);
			});
		}
	}
	if(a.toLowerCase().startsWith("ip")){
		exec("ipconfig", (error, stdout, stderr) => {
			if (error) {
				// console.log(`Error: ${error.message}`);
				port.write(`Error: ${error.message}\n`)
				return;
			}
			if (stderr) {
				// console.log(`Stderr: ${stderr}`);
				port.write(`Stderr: ${stderr}\n`)
				return;
			}
			port.write(`Stdout: ${stdout}\n`)
			// console.log(`Stdout: ${stdout}`);
		});
	}
}


port.pipe(parser)
parser.on('data', handleRequest)
port.write('ROBOT PLEASE RESPOND\n')


