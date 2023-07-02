try {
	var { existsSync, writeFileSync, removeSync, mkdirSync, copySync, readdirSync, createWriteStream } = require("fs-extra"),
			axios = require("axios"),
			extract = require("extract-zip"),
			exec = require('child_process').exec;
} catch { return console.error("[!] Currently you have not installed packages that support updating, enter cmd/terminal 'npm install --save fs-extra axios extract-zip child_process'"); }

try {
	var configValue = require("./config.json");
	console.log("config file found");
}
catch (error) {
if (error) return console.log("The bot's config file was not found!");
}

(async () => {
	try {
		console.log("====== PLEASE DO NOT TURN OFF THIS CMD/TERMINAL UNTIL UPDATE COMPLETED ======");
		await backup(configValue);
		await clone();
		await clean();
        await unzip();
		await install();
		await modules();
		await finish(configValue);
	} catch (e) { console.log(e) }
})();

async function backup(configValue) {
	console.log('-> Deleting old backups');
	removeSync(process.cwd() + '/tmp');
	console.log('-> Backing up data');
	mkdirSync(process.cwd() + '/tmp');
    mkdirSync(process.cwd() + "/tmp/main")
	if (existsSync('./ChatBot')) copySync('./ChatBot', './tmp/ChatBot');
	if (existsSync(`./${configValue.APPSTATEPATH}`)) copySync(`./${configValue.APPSTATEPATH}`, `./tmp/${configValue.APPSTATEPATH}`);
	if (existsSync('./config.json')) copySync('./config.json', './tmp/config.json');
	if (existsSync(`./includes/${configValue.DATABASE.sqlite.storage}`)) copySync(`./includes/${configValue.DATABASE.sqlite.storage}`, `./tmp/${configValue.DATABASE.sqlite.storage}`);
}

async function clean() {
	console.log('-> Deleting the old version');
	readdirSync('.').forEach(item => { if (item != 'tmp') removeSync(item); });
}

async function clone() {
	console.log('-> Loading new update');
	const response = await axios({
		method: 'GET',
		url: "https://github.com/miraiPr0ject/miraiv2/archive/refs/heads/main.zip",
		responseType: "stream"
	});

	const writer = createWriteStream("./tmp/main.zip");

	response.data.pipe(writer);

	return new Promise((resolve, reject) => {
		writer.on('finish', resolve);
		writer.on('error', (e) => reject('[!] Unable to download update [!] ' + e));
	});
}

function unzip() {
	console.log('-> Unzip new update');
	return extract("./tmp/main.zip", { dir: process.cwd() + "/tmp/main" }, (error) => {
		console.log(error);
        if (error) throw new Error(error);
        else return;
	});
}

function install () {
    console.log('-> Installing new update');
    copySync(process.cwd() + '/tmp/main/ChatBot-main/', './');
    return;
}

function modules() {
	return new Promise(function (resolve, reject) {
		console.log('-> Installing modules');
		let child = exec('npm install');
		child.stdout.on('end', resolve);
		child.stderr.on('data', data => {
			if (data.toLowerCase().includes('error')) {
				console.error('[!] An error has occurred. Please create a post and submit the updateError.log file in the Issue section on Github [!]');
				data = data.replace(/\r?\n|\r/g, '');
				writeFileSync('updateError.log', data);
				console.log("[!] Canceled the module installation process because an error occurred forcing the user to install the modules manually, proceed to install the final steps [!]");
				resolve();
			}
		});
	});
}

async function finish(configValue) {
	console.log('-> Completing');
	if (existsSync(`./tmp/${configValue.APPSTATEPATH}`)) copySync(`./tmp/${configValue.APPSTATEPATH}`, `./${configValue.APPSTATEPATH}`);
	if (existsSync(`./tmp/${configValue.DATABASE.sqlite.storage}`)) copySync(`./tmp/${configValue.DATABASE.sqlite.storage}`, `./includes/${configValue.DATABASE.sqlite.storage}`);
	if (existsSync("./tmp/newVersion")) removeSync("./tmp/newVersion");
	console.log('>> Update complete <<');
	console.log('>> ALL IMPORTANT DATA HAS BEEN BACKED UP TO THE "tmp" directory <<');
	return process.exit(0);
}