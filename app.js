//KingdomBot v.0.4.2 - some unfinished code

const Discord = require("discord.js");
const client = new Discord.Client();
const sql = require("sqlite");
var deleteIds = [];
sql.open("./kingdoms.sqlite").then(() => sql.run("CREATE TABLE IF NOT EXISTS timedEvents (userId TEXT, serverId TEXT, eventCode INTEGER, dateStarted TEXT, addInfo TEXT)"));
function genLP () {
	var returnString = "ccc00|ccc00|kkk00|kkk00|kkk00";
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
		switch(code[i]) {
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
				current = "<:di:359865296770695169>";
				break;
			case "a":
				current = "<:ax:362010241052704789>";
				break;
			case "s":
				current = "<:sh:361564921705529345>";
				break;
			case "p":
				current = "馃尡";
				break;
			case "b":
				current = "馃敤";
				break;
			case "i":
				current = "<:ir:376886074397687808>";
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
	client.user.setGame("=help");
});
client.on('message', msg => {
	if(msg.author.bot) return;
	if(!msg.guild) {
		msg.reply("I'm sorry, I can't receive commands in DMs."); //Might change this soon - but only for some commands
		return;
	}
	if(msg.content.trim().startsWith('=help')) {
		let content = Object.create(msg).content.trim();
		let contentArr = content.trim().split(" ");
		var theEmbed = new Discord.RichEmbed();
		theEmbed.setColor(0x7289da);
		theEmbed.setFooter("Requested by " + msg.author.username + "#" + msg.author.discriminator, msg.author.avatarURL);
		theEmbed.setTimestamp(); 
		switch(contentArr[1]) {
			case "links":
				theEmbed.setTitle("Links");
				theEmbed.addField("KingdomBot Invite Link", "https://bit.ly/kingbot");
				theEmbed.addField("KingdomBot Support Server", "https://bit.ly/kingbotserver");
				theEmbed.addField("KingdomBot GitHub", "https://github.com/TheMasterBob/KingdomBot");
				break;
			case "utilinfo":
				theEmbed.setTitle("Utility/Info Commands");
				theEmbed.setDescription('Note: All things in brackets must be replaced and are parameters. All parentheses are parameters and are optional.');
				theEmbed.addField("=clear [num] (user)", "Clears `[num]` messages. If `(user)` is specified, clears all messages from `(user)` in a search of `[num]` messages. `[num]` must be 1-99. Moderator command.");
				theEmbed.addField("=help [type] (DM)", "Displays a section of help. If `(DM)` is \"DM\", the bot will send this message in DM (if you allow it to.)");
				theEmbed.addField("=credits", "Shows credits. What did you expect?");
				break;
			case "kdoms": 
				theEmbed.setTitle("Kingdom Commands");
				theEmbed.setDescription('Note: All things in brackets must be replaced and are parameters. All parentheses are parameters and are optional.');
				theEmbed.addField("=addk [name]", "Adds a kingdom to the database named `[name]`. One per person per server only.");
				theEmbed.addField("=renamek [name]", "Renames your kingdom to `[name]`."); 
				theEmbed.addField("=delk", "Deletes your kingdom. Needs confirmation."); 
				theEmbed.addField("=kingfo (DM)", "Gives info on your kingdom. If `(DM)` is \"DM\", then the bot will send you the info in DM (if you allow it to.)")
				theEmbed.addField("=land (DM)", "Shows your land plot. If `(DM)` is \"DM\", then the bot will send you the land plot in DM (if you allow it to.)")
				theEmbed.addField("=collect", "Collects any resources avaliable - copper coins, wood, etc.");
				theEmbed.addField("=work [code] (x) (y)", "Does work, such as cutting down trees. The type of job is specified by [code] and is done at (x) and (y), if it is there. Code list: =wcodelist");
				theEmbed.addField("=wcodelist", "Lists all the codes to put in the [code] parameter for `=work`.");
				break;
			default:
				theEmbed.setTitle("Help");
				theEmbed.setDescription("The `=help` command is divided into sections. The usage is `=help [type] (DM)` where `[type]` is a necessary parameter (must be one of the values below) and `(DM)` is an optional parameter. If the value of that is \"DM\", then it will send you that help section in DM.");
				theEmbed.addField("links", "Type `=help links` for any website links KingdomBot can give you. This includes invite links for the bot, support server, etc.");
				theEmbed.addField("utilinfo", "Type `=help utilinfo` for any utility commands, such as clearing messages, and any info commands, such as credits.");
				theEmbed.addField("kdoms", "Type `=help kdoms` for any commands you can use to play the game of Kingdom. This includes land plots, attacking, and more.");
				break;
		}
		if(contentArr[2] == "DM") {
			try {
				msg.author.dmChannel.send({embed: theEmbed});
			}
			catch (e) {
					msg.author.createDM().then(() => msg.author.dmChannel.send({embed: theEmbed}));
			}
			if(msg.author.dmChannel) {
				msg.author.dmChannel.send({embed: theEmbed});
			}
			else {
				msg.author.createDM().then(() => msg.author.dmChannel.send({embed: theEmbed}).catch(msg.reply("I can't send DMs to you...")));
			}
				return;
		}
		msg.channel.send({embed: theEmbed});
	}
	if(msg.content.trim() == '=credits') {
		var anotherEmbed = new Discord.RichEmbed();
		anotherEmbed.setTitle("Credits");
		anotherEmbed.addField("Profile picture for KingdomBot:", "Light Runner - license CC BY-SA at https://creativecommons.org/licenses/by-sa/4.0/");
		anotherEmbed.addField("Shovel Emoticon:", "http://www.free-emoticons.com/search.php?keyword=Shovel - free for non-commercial use");
		anotherEmbed.addField("Axe Emoticon:", "ChrisL21 at http://www.iconarchive.com/artist/chrisl21.html - license CC BY-NC-ND at https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode");
		anotherEmbed.addField("Board Game Emoticons:", "Twitter, tinted and edited by MasterBob - license CC BY at https://creativecommons.org/licenses/by/4.0/legalcode");
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
				var mentions = Array.from(msg.mentions.users);
				if(mentions.length === 0) {
					msg.reply("The second parameter must be a mention.");
					return;
				}
				var newArray = messages.filter(val => {
					return val.member.id == msg.mentions.users.firstKey();
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
	if(msg.content.trim() == '=leave') { //for testing purposes
		if(!(msg.author.id == 298636036135714816 || msg.author.id == msg.guild.ownerID)) {
			return;
		}
		msg.channel.send("Oh no... goodbye... :sob:").then(() => msg.guild.leave());
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
				sql.run('DELETE FROM timedEvents WHERE userId = ? AND serverId = ?', [msg.author.id, msg.guild.id]);
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
		sql.all('SELECT * FROM kingdoms WHERE userId = ?', [msg.author.id]).then(function(row) {
			sql.get('SELECT lower(name) FROM kingdoms WHERE name = ? AND serverId = ?', [content.toLowerCase(), msg.guild.id]).then(function(row2) {
				if(row2) {
					msg.reply("There's already another kingdom with the same name!");
					return;
				}
				else {
					if(row.length == 5) {
						msg.reply("You have too many kingdoms on Discord! 5 is the limit.");
						return;
					}
					row = row.find(ele => ele.serverId == msg.guild.id);
					if(content.length > 20) {
						msg.reply("Your kingdom name is too long!");
					}
					else if(content.split("").includes("\n")) {
						msg.reply("Your kingdom name cannot include enters/returns!");
					}
					else if(/<@\d*|@everyone>/.test(content)){
						msg.reply("No pings allowed in your kingdom name!");
					}
					else if(!(/^[a-zA-z\d\s]+$/.test(content))) {
						msg.reply("Alphanumeric characters only, please.");
					}
					else if(!row) { // Can't find the row.
						content = content.toLowerCase().replace(/\b\w/g, a => a.toUpperCase());
						sql.run("INSERT INTO kingdoms VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [msg.author.id.toString(), content, null, msg.guild.id.toString(), 0, 0, 0, 0, 0, genLP(), 1, 0, 1]);
						sql.run("INSERT INTO timedEvents VALUES (?, ?, 0, ?, NULL)", [msg.author.id.toString(), msg.guild.id.toString(), new Date().valueOf().toString()]);
						msg.reply("Kingdom " + content + " added!");
					}
					else { // Can find the row.
						msg.reply("You already have a kingdom!");
					}
				}
			});
		}).catch(() => {
			sql.run("CREATE TABLE IF NOT EXISTS kingdoms (userId TEXT, name TEXT, attackDate TEXT, serverId TEXT, wood INTEGER, iron INTEGER, diamond INTEGER, kingCoins INTEGER, copperCoins INTEGER, land TEXT, workforces INTEGER, dirt INTEGER, seeds INTEGER)").then(() => {
				content = content.toLowerCase().replace(/\b\w/g, a => a.toUpperCase());
				sql.run("INSERT INTO kingdoms VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [msg.author.id.toString(), content, null, msg.guild.id.toString(), 0, 0, 0, 0, 0, genLP(), 1, 0, 1]);
				sql.run("INSERT INTO timedEvents VALUES (?, ?, 0, ?, NULL)", [msg.author.id.toString(), msg.guild.id.toString(), new Date().valueOf().toString()]);
				msg.reply("Kingdom " + content + " added! (In accordance with the Discord Developer ToS, by adding your kindgom you agree to let KingdomBot store End User Data. If you do not agree, use =delk.)");
			});
		});
	}
	if(msg.content.trim().startsWith('=renamek ')) {
		let content = Object.create(msg).content;
		content = content.replace('=renamek ', '');
		content = content.trim();
		sql.all('SELECT * FROM kingdoms WHERE userId = ? AND serverId = ?', [msg.author.id, msg.guild.id]).then(function(row) {
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
					else if(!(/^[a-zA-z\d\s]+$/.test(content))) {
						msg.reply("Alphanumeric characters only, please.");
					}
					else { // Can find the row.
						content = content.toLowerCase().replace(/\b\w/g, a => a.toUpperCase());
						sql.run('UPDATE kingdoms SET name = ? WHERE userId = ? AND serverId = ?', [content, msg.author.id.toString(), msg.guild.id.toString()]);
						msg.reply("Your kingdom was renamed " + content + "!");
					}
				}
			});
		}).catch(() => msg.reply("Couldn't find your kingdom..."));
	}
	if(msg.content.trim().startsWith("=kingfo")) {
		let content = Object.create(msg).content.trim();
		sql.get('SELECT * FROM kingdoms WHERE userId = ? AND serverId = ?', [msg.author.id.toString(), msg.guild.id.toString()]).then(row => {
			if(!row) {
				msg.reply("Couldn't find your kingdom...");
				return;
			}
			sql.all('SELECT * FROM timedEvents WHERE userId = ? AND serverId = ?', [msg.author.id.toString(), msg.guild.id.toString()]).then(async function (row2){
				if(!row2) {
					msg.reply("I'm sorry, but there was an error processing your command.");
					return;
				}
				var dateRightNow = new Date();
				var newArray = row2.map((ele, ind) => {
					var returnVal;
					switch(ele.eventCode) {
						case 1:
							returnVal = dateRightNow.valueOf() - parseInt(ele.dateStarted, 10) > 10800000;
							break;
						case 2:
							returnVal = dateRightNow.valueOf() - parseInt(ele.dateStarted, 10) > 7200000;
							break;
					}
					return returnVal ? [ele, ind] : false;
				}).filter(ele => !!ele);
				if(newArray.length > 0) {
					var newArrayLast = newArray[newArray.length - 1][1];
					for(var i = 0; i < newArrayLast + 2; i++) {
						if(newArray.findIndex(ele => ele[1] == i) == -1) continue;
						switch(row2[i].eventCode) {
							case 1:
								if(dateRightNow.valueOf() - parseInt(row2[i].dateStarted, 10) > 10800000) {
									msg.reply("You collected 10 <:wood:356908039951089674>!");
									var thing = row2[i].addInfo.split("|");
									var thatOtherThing = row.land.split("|");
									thatOtherThing[thing[1]] = thatOtherThing[thing[1]].split("");
									thatOtherThing[thing[1]].splice(thing[0], 1, "d");
									thatOtherThing[thing[1]] = thatOtherThing[thing[1]].join("");
									await sql.run('UPDATE kingdoms SET land = ?, wood = ?, seeds = ? WHERE userId = ? AND serverId = ?', [thatOtherThing.join("|"), row.wood + 10, row.seeds + 2, msg.author.id.toString(), msg.guild.id.toString()]);
									await sql.run('DELETE FROM timedEvents WHERE userId = ? AND serverId = ? AND addInfo = ?', [msg.author.id.toString(), msg.guild.id.toString(), row2[newArrayLast].addInfo]);
								}
								break;
							case 2: 
								if(dateRightNow.valueOf() - parseInt(row2[i].dateStarted, 10) > 7200000) {
									if(newArrayLast == i) {
										var doubleCheck = [false, false];
									}
									var thing = row2[i].addInfo.split("|");
									var thatOtherThing = row.land.split("|");
									thatOtherThing[thing[1]] = thatOtherThing[thing[1]].split("");
									thatOtherThing[thing[1]].splice(thing[0], 1, "d");
									thatOtherThing[thing[1]] = thatOtherThing[thing[1]].join("");
									msg.reply("You collected 5 <:di:359865296770695169>!");
									await sql.run('UPDATE kingdoms SET land = ?, dirt = ? WHERE userId = ? AND serverId = ?', [thatOtherThing.join("|"), row.dirt + 5, msg.author.id.toString(), msg.guild.id.toString()]);
									await sql.run('DELETE FROM timedEvents WHERE userId = ? AND serverId = ? AND addInfo = ?', [msg.author.id.toString(), msg.guild.id.toString(), row2[newArrayLast].addInfo]);
								}
								break;
						}
					}
				}
			}).then(() => {
				sql.get('SELECT * FROM kingdoms WHERE userId = ? AND serverId = ?', [msg.author.id.toString(), msg.guild.id.toString()]).then(row => {
					var theEmbed = new Discord.RichEmbed();
					theEmbed.setFooter("Requested by " + msg.author.username + "#" + msg.author.discriminator, msg.author.avatarURL);
					theEmbed.setTitle("Info for Kingdom " + row.name);
					theEmbed.setDescription(`<:kingCoin:360975393756545024> - ${row.kingCoins}\n<:copperCoin:361226469336416276> - ${row.copperCoins}\n<:wood:356908039951089674> - ${row.wood}\n<:iron:357347435728863233> - ${row.iron}\n:gem: - ${row.diamond}\n<:di:359865296770695169> - ${row.dirt}\n<:seed:363718495420153867> - ${row.seeds}\n:hammer_and_pick: - ${row.workforces}`);
					theEmbed.setTimestamp();
					theEmbed.setColor(0x7289da);
					if(msg.content.trim() == "=kingdominfo DM") {
						try {
							msg.author.dmChannel.send({embed: theEmbed});
						}
						catch (e) {
							try {
								msg.author.createDM().then(() => msg.author.dmChannel.send({embed: theEmbed}));
							}
							catch(e) {
								msg.reply("To use this, please allow DMs from KingdomBot. " + e.message);
							}
						}
						return;
					}
					msg.channel.send({embed: theEmbed});
				});
			});
		}).catch(() => msg.reply("Couldn't find your kingdom... "));
	}
	if(msg.content.trim() === "=collect") {
		var dateRightNow = new Date();
		sql.get('SELECT * FROM kingdoms WHERE userId = ? AND serverId = ?', [msg.author.id.toString(), msg.guild.id.toString()]).then(row => {
			var currentTasks = 0;
			if(!row) {
				msg.reply("Couldn't find your kingdom...");
				return;
			}
			sql.all('SELECT * FROM timedEvents WHERE userId = ? AND serverId = ?', [msg.author.id.toString(), msg.guild.id.toString()]).then(row2 => {
				let that = false;
				if(!row2) {
					msg.reply("I'm sorry, but there was an error processing your command.");
					return;
				}
				for(var i = 0; i < row2.length; i++) {
					switch(row2[i].eventCode) {
						case 0:
							var remain = (dateRightNow - parseInt(row2[i].dateStarted, 10)) % 1440000;
							var coinsAdded = ((dateRightNow - parseInt(row2[i].dateStarted, 10)) - remain) / 1440000;
							if(coinsAdded > 60) {
								coinsAdded = 60;
								remain = 0;
							}
							if(coinsAdded != 0) {
								that = true;
								sql.run('UPDATE kingdoms SET copperCoins = ? WHERE userId = ? AND serverId = ?', [coinsAdded + row.copperCoins, msg.author.id.toString(), msg.guild.id.toString()]).then(() => msg.reply("You collected " + coinsAdded + " <:copperCoin:361226469336416276>!"));
								sql.run('UPDATE timedEvents SET dateStarted = ? WHERE userId = ? AND serverId = ? AND eventCode = 0', [dateRightNow - remain, msg.author.id.toString(), msg.guild.id.toString()]);
							}
							break;
						case 1:
							if(dateRightNow.valueOf() - parseInt(row2[i].dateStarted, 10) > 10800000) {
								that = true;
								msg.reply("You collected 10 <:wood:356908039951089674>!");
								var thing = row2[i].addInfo.split("|");
								var thatOtherThing = row.land.split("|");
								thatOtherThing[thing[1]] = thatOtherThing[thing[1]].split("");
								thatOtherThing[thing[1]].splice(thing[0], 1, "d");
								thatOtherThing[thing[1]] = thatOtherThing[thing[1]].join("");
								sql.run('UPDATE kingdoms SET land = ?, wood = ?, seeds = ? WHERE userId = ? AND serverId = ?', [thatOtherThing.join("|"), row.wood + 10, row.seeds + 2, msg.author.id.toString(), msg.guild.id.toString()]);
								sql.run('DELETE FROM timedEvents WHERE userId = ? AND serverId = ? AND addInfo = ?', [msg.author.id.toString(), msg.guild.id.toString(), row2[i].addInfo]);
							}
							break;
						case 2:
							if(dateRightNow.valueOf() - parseInt(row2[i].dateStarted, 10) > 7200000) {
								that = true;
								var thing = row2[i].addInfo.split("|");
								var thatOtherThing = row.land.split("|");
								thatOtherThing[thing[1]] = thatOtherThing[thing[1]].split("");
								thatOtherThing[thing[1]].splice(thing[0], 1, "d");
								thatOtherThing[thing[1]] = thatOtherThing[thing[1]].join("");
								msg.reply("You collected 5 <:di:359865296770695169>!");
								sql.run('UPDATE kingdoms SET land = ?, dirt = ? WHERE userId = ? AND serverId = ?', [thatOtherThing.join("|"), row.dirt + 5, msg.author.id.toString(), msg.guild.id.toString()]);
								sql.run('DELETE FROM timedEvents WHERE userId = ? AND serverId = ? AND addInfo = ?', [msg.author.id.toString(), msg.guild.id.toString(), row2[i].addInfo]);
							}
							break;
					}
				}
				if(!that) {
					msg.reply("You have no coins to collect right now. Try again later?");
				}
			});
		}).catch(() => msg.reply("Couldn't find your kingdom... "));
	}
	if(msg.content.trim() === "=wcodelist") {
		var newEmbed = new Discord.RichEmbed();
		newEmbed.setTitle("Code List");
		newEmbed.setDescription("KingdomBot is a work in progress, and new codes will be added from time to time. (x) and (y) are only necessary for some codes, and have no use in others.");
		newEmbed.setColor(0x7289da);
		newEmbed.addField("1", "Cuts down a tree specified at (x) and (y). (x) and (y) are necessary. Costs 50 copper coins and takes 3 hours to complete.");
		newEmbed.addField("2", "Digs dirt at (x) and (y). (x) and (y) are necessary. Costs 40 copper coins and takes 2 hours to complete.");
		newEmbed.addField("3", "Plants a tree at (x) and (y). (x) and (y) are necessary. Costs 45 copper coins and takes two hours to plant - but a week to grow. Will take up a workforce for planting period.");
		newEmbed.addField("4 WIP", "Builds an iron refinery, which takes up a 2x2 space. Costs 110 copper coins and 20 wood.")
		newEmbed.setFooter("Requested by " + msg.author.username + "#" + msg.author.discriminator, msg.author.avatarURL);
		newEmbed.setTimestamp();
		msg.channel.send(newEmbed);
	}
	if(msg.content.trim().startsWith("=land")) {
		let content = Object.create(msg).content.trim();
		sql.get('SELECT * FROM kingdoms WHERE userId = ? AND serverId = ?', [msg.author.id.toString(), msg.guild.id.toString()]).then(row => {
			if(!row) {
				msg.reply("Couldn't find your kingdom...");
				return;
			}
			sql.all('SELECT * FROM timedEvents WHERE userId = ? AND serverId = ?', [msg.author.id.toString(), msg.guild.id.toString()]).then(async function(row2) {
				if(!row2) {
					msg.reply("I'm sorry, but there was an error processing your command.");
					return;
				}
				var dateRightNow = new Date();
				var newArray = row2.map((ele, ind) => {
					var returnVal;
					switch(ele.eventCode) {
						case -1:
							returnVal = dateRightNow.valueOf() - parseInt(ele.dateStarted, 10) > 6.048e+8;
							break;
						case 1:
							returnVal = dateRightNow.valueOf() - parseInt(ele.dateStarted, 10) > 10800000;
							break;
						case 2:
							returnVal = dateRightNow.valueOf() - parseInt(ele.dateStarted, 10) > 7200000;
							break;
						case 3:
							returnVal = dateRightNow.valueOf() - parseInt(ele.dateStarted, 10) > 7200000;
							break;
						case 4:
							returnVal = dateRightNow.valueOf() - parseInt(ele.dateStarted, 10) > 3.456e+8;
							break;
					}
					return returnVal ? [ele, ind] : false;
				}).filter(ele => !!ele);
				if(newArray.length > 0) {
					var newArrayLast = newArray[newArray.length - 1][1];
					for(var i = 0; i < newArrayLast + 2; i++) {
						if(newArray.findIndex(ele => ele[1] == i) == -1) continue;
						switch(row2[i].eventCode) {
							case 1:
								if(dateRightNow.valueOf() - parseInt(row2[i].dateStarted, 10) > 10800000) {
									msg.reply("You collected 10 <:wood:356908039951089674>!");
									var thing = row2[i].addInfo.split("|");
									var thatOtherThing = row.land.split("|");
									thatOtherThing[thing[1]] = thatOtherThing[thing[1]].split("");
									thatOtherThing[thing[1]].splice(thing[0], 1, "d");
									thatOtherThing[thing[1]] = thatOtherThing[thing[1]].join("");
									await sql.run('UPDATE kingdoms SET land = ?, wood = ?, seeds = ? WHERE userId = ? AND serverId = ?', [thatOtherThing.join("|"), row.wood + 10, row.seeds + 2, msg.author.id.toString(), msg.guild.id.toString()]);
									await sql.run('DELETE FROM timedEvents WHERE userId = ? AND serverId = ? AND addInfo = ?', [msg.author.id.toString(), msg.guild.id.toString(), row2[newArrayLast].addInfo]);
								}
								break;
							case 2: 
								if(dateRightNow.valueOf() - parseInt(row2[i].dateStarted, 10) > 7200000) {
									var thing = row2[i].addInfo.split("|");
									var thatOtherThing = row.land.split("|");
									thatOtherThing[thing[1]] = thatOtherThing[thing[1]].split("");
									thatOtherThing[thing[1]].splice(thing[0], 1, "d");
									thatOtherThing[thing[1]] = thatOtherThing[thing[1]].join("");
									msg.reply("You collected 5 <:di:359865296770695169>!");
									await sql.run('UPDATE kingdoms SET land = ?, dirt = ? WHERE userId = ? AND serverId = ?', [thatOtherThing.join("|"), row.dirt + 5, msg.author.id.toString(), msg.guild.id.toString()]);
									await sql.run('DELETE FROM timedEvents WHERE userId = ? AND serverId = ? AND addInfo = ?', [msg.author.id.toString(), msg.guild.id.toString(), row2[newArrayLast].addInfo]);
								}
								break;
							case 3:
								if(dateRightNow.valueOf() - parseInt(row2[i].dateStarted, 10) > 7200000) {
									var thing = row2[i].addInfo.split("|");
									var thatOtherThing = row.land.split("|");
									thatOtherThing[thing[1]] = thatOtherThing[thing[1]].split("");
									thatOtherThing[thing[1]].splice(thing[0], 1, "p");
									thatOtherThing[thing[1]] = thatOtherThing[thing[1]].join("");
									msg.reply("Your <:seed:363718495420153867> has been planted!");
									await sql.run('UPDATE kingdoms SET land = ? WHERE userId = ? AND serverId = ?', [thatOtherThing.join("|"), msg.author.id.toString(), msg.guild.id.toString()]);
									await sql.run('UPDATE timedEvents SET eventCode = -1, dateStarted = ? WHERE userId = ? AND serverId = ? AND addInfo = ?', [row2[newArrayLast].dateStarted + 7200000, msg.author.id.toString(), msg.guild.id.toString(), row2[newArrayLast].addInfo]);
								}
							case -1:
								if(dateRightNow.valueOf() - parseInt(row2[i].dateStarted, 10) > 6.048e+8) {
									var thing = row2[i].addInfo.split("|");
									var thatOtherThing = row.land.split("|");
									thatOtherThing[thing[1]] = thatOtherThing[thing[1]].split("");
									thatOtherThing[thing[1]].splice(thing[0], 1, "w");
									thatOtherThing[thing[1]] = thatOtherThing[thing[1]].join("");
									msg.reply("Your :seedling: has grown to a :evergreen_tree:!")
									await sql.run('UPDATE kingdoms SET land = ? WHERE userId = ? AND serverId = ?', [thatOtherThing.join("|"), msg.author.id.toString(), msg.guild.id.toString()]);
									await sql.run('DELETE FROM timedEvents WHERE userId = ? AND serverId = ? AND addInfo = ?', [msg.author.id.toString(), msg.guild.id.toString(), row2[newArrayLast].addInfo]);
								}
								break;
							case 4:
								if(dateRightNow.valueOf() - parseInt(row2[i].dateStarted, 10) > 3.456e+8) {
									var thing = row2[i].addInfo.split("|");
									var thatOtherThing = row.land.split("|");
									thatOtherThing[thing[1]] = thatOtherThing[thing[1]].split("");
									thatOtherThing[thing[1]].splice(thing[0], 2, "i", "i");
									thatOtherThing[thing[1]] = thatOtherThing[thing[1]].join("");
									thing[1]++;
									thatOtherThing[thing[1]] = thatOtherThing[thing[1]].split("");
									thatOtherThing[thing[1]].splice(thing[0], 2, "i", "i");
									thatOtherThing[thing[1]] = thatOtherThing[thing[1]].join("");
									msg.reply("Your <:ir:376886074397687808> has been built!");
									await sql.run('UPDATE kingdoms SET land = ? WHERE userId = ? AND serverId = ?', [thatOtherThing.join("|"), msg.author.id.toString(), msg.guild.id.toString()]);
									await sql.run('UPDATE timedEvents SET eventCode = -3 WHERE userId = ? AND serverId = ? AND addInfo = ?', [msg.author.id.toString(), msg.guild.id.toString(), row2[newArrayLast].addInfo]);
								}
								break;
						}
					}
				}
			}).then(() => {
				sql.get('SELECT land FROM kingdoms WHERE userId = ? AND serverId = ?', [msg.author.id.toString(), msg.guild.id.toString()]).then(row => {
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
				});
			});
		}).catch(() => msg.reply("Couldn't find your kingdom... "));
	}
	if(msg.content.trim().startsWith("=work ")) {
		let content = Object.create(msg).content.trim().replace("=work ", "").split(" ");
		sql.get("SELECT workforces, land, copperCoins FROM kingdoms WHERE userId = ? AND serverId = ?", [msg.author.id, msg.guild.id]).then(row => {
			if(!row) {
				msg.reply("Couldn't find your kingdom...");
			}
			var that = row.land.split("|");
			sql.all("SELECT * FROM timedEvents WHERE userId = ? AND serverId = ?", [msg.author.id, msg.guild.id]).then(async function(row2) {
				var something = row2.findIndex(ele => ele.eventCode == 3 && +(new Date()) - ele.dateStarted > 7200000 && ele.addInfo == content[1] + "|" + content[2])
				if(something != -1) {
					row2[something].dateStarted = row2[something].dateStarted + 7200000;
					row2[something].eventCode = -1;
					that[content[2]] = that[content[2]].split("");
					that[content[2]].splice(content[1], 1, "p");
					that[content[2]] = that[content[2]].join("");
					await sql.run("UPDATE timedEvents SET eventCode = -1, dateStarted = ? WHERE userId = ? AND serverId = ? AND addInfo = ?", [row2[something].dateStarted, msg.author.id, msg.guild.id, content[1] + "|" + content[2]]);
				}
				if(row2.length > row.workforces + (row2.filter(a => a.eventCode < 0).length)) {
					msg.reply("You don't have any workforces avaliable!");
					return;
				}
				switch(parseInt(content[0], 10)) {
					case 1:
						if(that[content[2]][content[1]] == "p" && row2.findIndex(ele => ele.eventCode == -1 && +(new Date()) - ele.dateStarted > 6.048e+8 + 1 && ele.addInfo == content[1] + "|" + content[2])) {
							that[content[2]][content[1]] = "w";
							await sql.run("UPDATE kingdoms SET land = ? WHERE userId = ? AND serverId = ?", [that.join(""), msg.author.id, msg.guild.id]);
							await sql.run("DELETE FROM timedEvents WHERE userId = ? AND serverId = ? AND addInfo = ?", [msg.author.id, msg.guild.id, content[1] + "|" + content[2]]);
						}
						if(content[1] < 0 || content[1] > that[0].length) {
							msg.reply("Out-of-range x position.");
							return;
						}
						if(content[2] < 0 || content[2] > that[0].length) {
							msg.reply("Out-of-range y position");
							return;
						}
						if(that[content[2]][content[1]] != "w") {
							msg.reply("There's no tree there!");
							return;
						}
						if(row.copperCoins < 50) {
							msg.reply("You don't have enough copper coins to hire someone!");
							return;
						}
						sql.run("INSERT INTO timedEvents VALUES (?, ?, ?, ?, ?)", [msg.author.id, msg.guild.id, 1, new Date().valueOf().toString(), content[1] + "|" + content[2]]);
						that[content[2]] = that[content[2]].split("");
						that[content[2]].splice(content[1], 1, "a");
						that[content[2]] = that[content[2]].join("");
						sql.run("UPDATE kingdoms SET land = ?, copperCoins = ? WHERE userId = ? AND serverId = ?", [that.join("|"), row.copperCoins - 50, msg.author.id, msg.guild.id]);
						msg.reply("Executed! Collect wood in 3 hours.");
						break;
					case 2:
						if(content[1] < 0 || content[1] > that[0].length){
							msg.reply("Out-of-range x position.");
							return;
						}
						if(content[2] < 0 || content[2] > that[0].length) {
							msg.reply("Out-of-range y position");
							return;
						}
						if(that[content[2]][content[1]] != "d") {
							msg.reply("You can't dig dirt here, there's something in the way!");
							return;
						}
						if(row.copperCoins < 40) {
							msg.reply("You don't have enough copper coins to hire someone!");
							return;
						}
						sql.run("INSERT INTO timedEvents VALUES (?, ?, ?, ?, ?)", [msg.author.id, msg.guild.id, 2, new Date().valueOf().toString(), content[1] + "|" + content[2]]);
						that[content[2]] = that[content[2]].split("");
						that[content[2]].splice(content[1], 1, "s");
						that[content[2]] = that[content[2]].join("");
						sql.run("UPDATE kingdoms SET land = ?, copperCoins = ? WHERE userId = ? AND serverId = ?", [that.join("|"), row.copperCoins - 40, msg.author.id, msg.guild.id]);
						msg.reply("Executed! Collect dirt in 2 hours.");
						break;
					case 3:
						if(content[1] < 0 || content[1] > that[0].length){
							msg.reply("Out-of-range x position.");
							return;
						}
						if(content[2] < 0 || content[2] > that[0].length) {
							msg.reply("Out-of-range y position");
							return;
						}
						if(that[content[2]][content[1]] != "d") {
							msg.reply("You can't plant a tree here, there's something in the way!");
							return;
						}
						if(row.copperCoins < 45) {
							msg.reply("You don't have enough copper coins to hire someone!");
							return;
						}
						sql.run("INSERT INTO timedEvents VALUES (?, ?, 3, ?, ?)", [msg.author.id, msg.guild.id, new Date().valueOf().toString(), content[1] + "|" + content[2]]);
						that[content[2]] = that[content[2]].split("");
						that[content[2]].splice(content[1], 1, "s");
						that[content[2]] = that[content[2]].join("");
						sql.run("UPDATE kingdoms SET land = ?, copperCoins = ? WHERE userId = ? AND serverId = ?", [that.join("|"), row.copperCoins - 45, msg.author.id, msg.guild.id]);
						msg.reply("Executed! Tree will take 2 hours to plant, and after that, will grow in 1 week.");
						break;
					case 4:
						content[1] = parseInt(content[1]);
						content[2] = parseInt(content[2]);
						if(content[1] < 0 || content[1] > that[0].length){
							msg.reply("Out-of-range x position.");
							return;
						}
						if(content[2] < 0 || content[2] > that[0].length) {
							msg.reply("Out-of-range y position.");
							return;
						}
						var pos = [that[content[2]][content[1]], that[content[2] + 1][content[1]], that[content[2]][content[1] + 1], that[content[2] + 1][content[1] + 1]];
						if(!(pos.every(ele => ele == "d"))) {
							msg.reply("You can't build here, there's something in the way!");
							return;
						}
						if(row.copperCoins < 110) {
							msg.reply("You don't have enough copper coins to hire someone!");
							return;
						}
						if(row.wood < 20) {
							msg.reply("Your resources are too few!");
							return;
						}
						that[content[2]] = that[content[2]].split("");
						pos.map(() => {
							that[content[2]].splice(content[1], 1, "b");
						});
						that[content[2]] = that[content[2]].join("");
						sql.run("INSERT INTO timedEvents VALUES (?, ?, 4, ?, ?)", [msg.author.id, msg.guild.id, new Date().valueOf().toString(), content[1] + "|" + content[2]]);
						sql.run("UPDATE kingdoms SET land = ?, copperCoins = ?, wood = ? WHERE userId = ? AND serverId = ?", [that.join("|"), row.copperCoins - 110, row.wood - 20, msg.author.id, msg.guild.id]);
						msg.reply("Executed! It will take 4 days to build.");
					break;
					default:
						msg.reply("I'm sorry, that's not a valid code.");
						break;
				}
			}).catch(e => msg.reply(e.message));
		}).catch(e => msg.reply("Couldn't find your kingdom... " + e.message));
	}
});
