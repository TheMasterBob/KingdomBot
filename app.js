const Discord = require("discord.js");
const client = new Discord.Client();
const sql = require("sqlite");
var deleteIds = [];
sql.open("./kingdoms.sqlite");
function genLP () {
	var returnString = "ccc00000|ccc00000|000kkk00|000kkk00|000kkk00|00000000|ttt00000|ttt00000";
	for(var i = 0; i < returnString.length; i++) {
		if(returnString[i] == 0) {
			let num = Math.random();
			if(num > 0.45) {
				returnString = returnString.slice(0, i) + "w" + returnString.slice(i + 1, returnString.length);
			}
			else {
				returnString = returnString.slice(0, i) + "d" + returnString.slice(i + 1, returnString.length);
			}
		}
	}
	return returnString;
}
function unencrypt (code) {
	var returnString = "";
	for(var i = 0; i < code.length; i++) {
		let current;
		switch(code[i]) { //This supposedly works on Discord?
			case "c":
				current = "馃彮";
				break;
			case "k":
				current = "馃彴";
				break;
			case "t":
				current = "馃彉";
				break;
			case "w":
				current = "馃尣";
				break;
			case "d":
				current = "<:dirt:359865296770695169>";
				break;
			case "|":
				current = "\n";
				break;
			default:
				current = "err";
				break;
		}
		returnString += current;
	}
	return returnString;
}
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setGame("=help");
});
client.on('message', msg => {
	if(msg.author.bot) return;
	if(msg.content.trim() == '=help') {
		var theEmbed = new Discord.RichEmbed();
		theEmbed.setTitle("Commands");
		theEmbed.setDescription('Note: All things in brackets must be replaced and are parameters. All parentheses are parameters and are optional.');
		theEmbed.addField("=help", "Displays this message.");
		theEmbed.addField("=invite", "Generates invite link for the bot."); 
		theEmbed.addField("=addk [name]", "Adds a kingdom to the database named [name]. One per person per server only.");
		theEmbed.addField("=renamek [name]", "Renames your kingdom to [name]."); 
		theEmbed.addField("=delk", "Deletes your kingdom. Needs confirmation."); 
		theEmbed.addField("=kingdominfo", "Gives info on your kingdom.")
		theEmbed.addField("=clear [num] (user)", "Clears [num] messages. If (user) is specified, clears all messages from (user) in a search of [num] messages. [num] must be 1-100.");
		theEmbed.addField("=credits", "Shows credits. What did you expect?")
		theEmbed.setColor(0x7289da);
		theEmbed.setFooter("Requested by " + msg.author.username + "#" + msg.author.discriminator, msg.author.avatarURL);
		theEmbed.setTimestamp();
		msg.channel.send({embed: theEmbed});
	}
	if(msg.content.trim() == '=credits') {
		var anotherEmbed = new Discord.RichEmbed();
		anotherEmbed.setTitle("Credits");
		anotherEmbed.setDescription("Profile picture for KingdomBot is under CC-BY 4.0.")
		anotherEmbed.addField("Profile picture for KingdomBot:", "Light Runner");
		anotherEmbed.addField("Everything else", "MasterBob");
		anotherEmbed.setColor(0x7289da);
		anotherEmbed.setFooter("Requested by " + msg.author.username + "#" + msg.author.discriminator, msg.author.avatarURL);
		anotherEmbed.setTimestamp();
		msg.channel.send({embed: anotherEmbed});
	}
	if(msg.content.trim().startsWith('=clear ')) {
		if(!msg.channel.permissionsFor(msg.author).has("MANAGE_MESSAGES")){
			msg.reply("Hey! You don't have the Manage Messages permission!");
			return;
		}
		let content = Object.create(msg).content.trim();
		content = content.replace('=clear ', '');
		content = content.split(" ");
		if(content.length === 1){
			msg.channel.fetchMessages({limit: content[0], before: msg.id.toString()}).then(messages => {
				var newThing = messages;
				messages = Array.from(messages);
				var a = new Date();
				if(a - messages[messages.length - 1][1].createdAt > 1.21e+9) {
					var messageCount = messages.filter(ele => a - ele[1].createdAt <= 1.21e+9).length;
					if(messageCount === 0) {
						msg.delete();
					}
					else{
						msg.channel.bulkDelete(messageCount + 1).catch(e => msg.reply("Oops! An error occured while deleting! " + e.message));
					}
					Array.prototype.splice.call(newThing, 0, messageCount);
					var thing = newThing.deleteAll();
					thing[thing.length - 1].then(function() {
						msg.channel.send("Cleared " + messageCount + " messages!").then(function(m) {
							m.delete(4000);
						});
					}).catch(() => msg.reply("Oops! An error occured while deleting!"));
					return;
				}
				msg.channel.bulkDelete(messages.length + 1).then(function() {
					msg.channel.send("Cleared " + messages.length + " messages!").then(function(m) {
						m.delete(4000);
					});
				});
			});
		}
		else {
			msg.channel.fetchMessages({limit: content[0], before: msg.id.toString()}).then(messages => {
				var mentions = Array.from(msg.mentions.members);
				if(mentions.length === 0) {
					msg.reply("The second parameter must be a mention.");
					return;
				}
				var newArray = messages.filter(val => {
					return val.member.id == msg.mentions.members.firstKey();
				});
				messages = Array.from(newArray).map(val => val[1]);
				newThing = newArray;
				if(messages.length === 0) {
					msg.channel.send("Couldn't find any messages...");
					return;
				}
				msg.delete();
				var a = new Date();
				if(a - messages[messages.length - 1].createdAt > 1.21e+9) {
					var messageCount = messages.filter(ele => a - ele[1].createdAt <= 1.21e+9).length;
					if(messageCount === 0) {
						msg.delete();
					}
					else{
						msg.channel.bulkDelete(messages).catch(e => msg.reply("Oops! An error occured while deleting! " + e.message));
					}
					Array.prototype.splice.call(newThing, 0, messageCount);
					var thing = newThing.deleteAll();
					thing[thing.length - 1].then(function() {
						msg.channel.send("Cleared " + messageCount + " messages!").then(function(m) {
							m.delete(4000);
						});
					}).catch(() => msg.reply("Oops! An error occured while deleting!"));
					return;
				}
				if(messages.length === 1) {
					messages[0].delete().then(function() {
						msg.channel.send("Cleared " + messageCount + " messages!").then(function(m) {
							m.delete(4000);
						});
					});
				}
				else {
					msg.channel.bulkDelete(messages).then(function() {
						msg.channel.send("Cleared " + messages.length + " messages!").then(function(m) {
							m.delete(4000);
						});
					});
				}
			});
		}
	}
	if(msg.content.trim() == '=invite') {
		msg.channel.send("http://bit.ly/kingbot");
	}
	if(msg.content.trim() == '=leave') { //If for some reason, I need to make a bot leave a server.
		if(msg.author.id != 298636036135714816) {
			return;
		}
		msg.channel.send("Kthx, goodbye!").then(() => msg.guild.leave());
	}
	if(msg.content.trim() == '=cancel') {
		if(deleteIds.find(function(ele) {
				return ele[0] == msg.author.id && ele[1] == msg.guild.id;
			})) {
			deleteIds.splice(deleteIds.findIndex(function(ele) {
				return ele[0] == msg.author.id && ele[1] == msg.guild.id;
			}));
			msg.reply("Delete action canceled.")
		}
	}
	if(msg.content.trim() == '=delk') {
		sql.get('SELECT * FROM kingdoms WHERE userId = ? AND serverId = ?', [msg.author.id, msg.guild.id]).then(function(row) {
			if(!row) { // Can't find the row.
				msg.reply("Couldn't find your kingdom...")
			}
			else if(deleteIds.find(function(ele) {
					return ele[0] == msg.author.id && ele[1] == msg.guild.id;
				})) {
				sql.run('DELETE FROM kingdoms WHERE userId = ? AND serverId = ?', [msg.author.id, msg.guild.id]).then(function() {
					deleteIds.splice(deleteIds.findIndex(function(ele) {
						return ele[0] == msg.author.id && ele[1] == msg.guild.id;
					}));
					msg.reply("Your kingdom was deleted... :sob:");
				});
			}
			else { // Can find the row.
				msg.reply("Are you sure you want to delete your kingdom? Type `=delk` again to confirm, and `=cancel` to cancel.");
				deleteIds.push([msg.author.id, msg.guild.id]);
			}
		}).catch(() => {
			msg.reply("Couldn't find your kingdom...");
		});
	}
	if(msg.content.trim().startsWith('=addk ')) {
		let content = Object.create(msg).content;
		content = content.replace('=addk ', '');
		content = content.trim();
		sql.get('SELECT * FROM kingdoms WHERE userId = ? AND serverId = ?', [msg.author.id, msg.guild.id]).then(function(row) {
			sql.get('SELECT lower(name) FROM kingdoms WHERE name = ? AND serverId = ?', [content.toLowerCase(), msg.guild.id]).then(function(row2) {
				if(row2) {
					msg.reply("There's already another kingdom with the same name!");
					return;
				}
				else {
					if(content.length > 20) {
						msg.reply("Your kingdom name is too long!");
					}
					else if(content.split("").includes("\n")) {
						msg.reply("Your kingdom name cannot include enters/returns!");
					}
					else if(/<@\d*|@everyone>/.test(content)){
						msg.reply("No pings allowed in your kingdom name!");
					}
					else if(!row) { // Can't find the row.
						sql.run("INSERT INTO kingdoms VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [msg.author.id, content, 1, 1, null, msg.guild.id, 0, 0, 0, 0, 0, genLP()]);
						msg.reply("Kingdom " + content + " added!");
					}
					else { // Can find the row.
						msg.reply("You already have a kingdom!");
					}
				}
			});
		}).catch(() => {
			sql.run("CREATE TABLE IF NOT EXISTS kingdoms (userId INTEGER, name TEXT, aa INTEGER, da INTEGER, attackDate TEXT, serverId INTEGER, wood INTEGER, iron INTEGER, diamond INTEGER, kingCoins INTEGER, copperCoins INTEGER, land TEXT)").then(() => {
				sql.run("INSERT INTO kingdoms VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [msg.author.id, content, 1, 1, null, msg.guild.id, 0, 0, 0, 0, 0, genLP()]);
				msg.reply("Kingdom " + content + " added! (In accordance with the Discord Developer ToS, by adding your kindgom you agree to let KingdomBot store End User Data. If you do not agree, use =delk.)");
			})
		});
	}
	if(msg.content.trim().startsWith('=renamek ')) {
		let content = Object.create(msg).content;
		content = content.replace('=renamek ', '');
		content = content.trim();
		sql.get('SELECT * FROM kingdoms WHERE userId = ? AND serverId = ?', [msg.author.id, msg.guild.id]).then(function(row) {
			if(!row) { // Can't find the row.
				msg.reply("Couldn't find your kingdom...");
				return;
			}
			sql.get('SELECT lower(name) FROM kingdoms WHERE name = ? AND serverId = ?', [content.toLowerCase(), msg.guild.id]).then(function(row2) {
				if(row2) {
					msg.reply("There's already another kingdom with the same name!");
					return;
				}
				else {
					if(content.length > 20) {
						msg.reply("Your kingdom name is too long!");
					}
					else if(content.split("").includes("\n")) {
						msg.reply("Your kingdom name cannot include enters/returns!")
					}
					else if(content.toLowerCase() == row.name.toLowerCase()) {
						msg.reply("Your kingdom name is the same!");
					}
					else if(/<@\d*|@everyone>/.test(content)){
						msg.reply("No pings allowed in your kingdom name!");
					}
					else { // Can find the row.
						sql.run('UPDATE kingdoms SET name = ? WHERE userId = ? AND serverId = ?', [content, msg.author.id, msg.guild.id]);
						msg.reply("Your kingdom was renamed " + content + "!");
					}
				}
			});
		}).catch((e) => {
			msg.reply("Couldn't find your kingdom...");    
		});
	}
	if(msg.content.trim().startsWith("=kingdominfo")) {
		let content = Object.create(msg).content.trim();
		if(content === "=kingdominfo") {
			sql.get('SELECT * FROM kingdoms WHERE userId = ? AND serverId = ?', [msg.author.id, msg.guild.id]).then(row => {
				if(!row) {
					msg.reply("Couldn't find your kingdom...");
					return;
				}
				var theEmbed = new Discord.RichEmbed();
				theEmbed.setFooter("Requested by " + msg.author.username + "#" + msg.author.discriminator, msg.author.avatarURL);
				theEmbed.setTitle("Kingdom Info");
				theEmbed.setDescription(`Kingdom name: ${row.name}\nKingCoins: ${row.kingCoins}\n<:wood:356908039951089674> - ${row.wood}\n<:iron:357347435728863233> - ${row.iron}\n:gem: - ${row.diamond}`);
				theEmbed.setTimestamp();
				theEmbed.setColor(0x7289da);
				msg.channel.send({embed: theEmbed});
			}).catch(() => msg.reply("Couldn't find your kingdom... "));
		}
	}
	if(msg.content.trim().startsWith("=land")) {
		sql.get('SELECT * FROM kingdoms WHERE userId = ? AND serverId = ?', [msg.author.id, msg.guild.id]).then(row => {
			if(!row) {
				msg.reply("Couldn't find your kingdom...");
				return;
			}
			var moreThing = new Discord.RichEmbed();
			moreThing.setTitle("Land Plot");
			moreThing.setDescription("Use =kingdominfo to see stats.");
			moreThing.addField("Land:", unencrypt(row.land));
			moreThing.setColor(0x7289da);
			moreThing.setFooter("Requested by " + msg.author.username + "#" + msg.author.discriminator, msg.author.avatarURL);
			moreThing.setTimestamp();	
			if(msg.content.trim() == "=land DM") {
				try {
					msg.author.dmChannel.send({embed: moreThing});
				}
				catch (e) {
					try {
						msg.author.createDM().then(() => msg.author.dmChannel.send({embed: moreThing}));
					}
					catch(e) {
						msg.reply("To use this, please allow DMs from KingdomBot. " + e.message);
					}
				}
				return;
			}
		msg.channel.send({embed: moreThing});
		}).catch(e => msg.reply("Couldn't find your kingdom... " + e.message));
	}
});
