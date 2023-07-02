module.exports.config = {
	name: "uid",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Joshua Sy",
	description: "Get User ID.",
  usages: "reply/mention/args",
  commandCategory: "other",
	cooldowns: 2
};

module.exports.run = function({ api, event, args, Users  }) {
  let {threadID, senderID, messageID} = event;
         if (!args[0]) { var uid = senderID}
  if(event.type == "message_reply") { uid = event.messageReply.senderID }
  if (args.join().indexOf('@') !== -1){ var uid = Object.keys(event.mentions) } 
	return api.sendMessage(uid, threadID, messageID);
}
