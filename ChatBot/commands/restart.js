module.exports.config = {
	name: "restart",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "zach",
	description: "Restart the Bot",
	commandCategory: "system",
	usages: "",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const { threadID, messageID } = event;
	return api.sendMessage(`The ${global.config.BOTNAME} Bot It will restart, The restarting it take 30 seconds to 1 minute to restart😊`, threadID, () => process.exit(1));
}