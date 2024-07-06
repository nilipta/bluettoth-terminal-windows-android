const { SerialPort, ReadlineParser } = require('serialport');
const { exec } = require("child_process");
let port;

try{
	port = new SerialPort({ path: 'COM4', baudRate: 9600 })
}catch(e){
	const list = SerialPort.list();
	console.log({list})
}

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



 process.on('uncaughtException', async function(err) {
      // handle the error safely
	  const list = await SerialPort.list();
	console.log({list})
	const comportObj = list.find(x=>x.friendlyName.toLowerCase().includes('bluetooth'));
	const comportnameStr = comportObj?.path;
	
	if(!comportnameStr)
	{
		process.exit(1);		
	}
	/* {
      path: 'COM3',
      manufacturer: 'Microsoft',
      serialNumber: undefined,
      pnpId: 'BTHENUM\\{00001101-0000-1000-8000-00805F9B34FB}_LOCALMFG&0000\\7&2B6A6B63&0&000000000000_00000000',
      locationId: undefined,
      friendlyName: 'Standard Serial over Bluetooth link (COM3)',
      vendorId: undefined,
      productId: undefined
    } */
      console.log(err)
	  port = new SerialPort({ path: comportnameStr, baudRate: 9600 })
	  port.pipe(parser)
	  parser.on('data', handleRequest)
  })



port.pipe(parser)
parser.on('data', handleRequest)
port.write('ROBOT PLEASE RESPOND\n')


