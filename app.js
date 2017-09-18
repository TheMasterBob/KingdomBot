const Discord = require("discord.js");
const client = new Discord.Client();
const sql = require("sqlite");
var deleteIds = [];
sql.open("./kingdoms.sqlite");
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
	if(msg.content.trim() == '=leave') {
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
						sql.run("INSERT INTO kingdoms VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [msg.author.id, content, 1, 1, null, msg.guild.id, 0, 0, 0, 0]);
						msg.reply("Kingdom " + content + " added!");
					}
					else { // Can find the row.
						msg.reply("You already have a kingdom!");
					}
				}
			});
		}).catch(() => {
			sql.run("CREATE TABLE IF NOT EXISTS kingdoms (userId INTEGER, name TEXT, aa INTEGER, da INTEGER, attackDate TEXT, serverId INTEGER, wood INTEGER, iron INTEGER, diamond INTEGER, kingCoins INTEGER)").then(() => {
				sql.run("INSERT INTO kingdoms VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [msg.author.id, content, 1, 1, null, msg.guild.id, 0, 0, 0, 0]);
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
	if(msg.content.trim().startsWith("=speak ") && msg.author.id == 298636036135714816) {
		let content = Object.create(msg).content;
		content = content.replace("=speak ", "");
		msg.channel.send(content);
		msg.delete();
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
				theEmbed.setDescription(`Kingdom name: ${row.name}\nKingCoins: ${row.kingCoins}\n<:wood:356908039951089674> ${row.wood}\n<:iron:357347435728863233> ${row.iron}\nDiamond: ${row.diamond}`);
				theEmbed.setTimestamp();
				theEmbed.setColor(0x7289da);
				msg.channel.send({embed: theEmbed});
			}).catch(() => msg.reply("Couldn't find your kingdom... "));
		}
	}
	if(msg.content.trim().startsWith("=attack ")) {
		let content = Object.create(msg).content;
		content = content.replace('=attack ', '');
		content = content.trim();
		sql.get('SELECT * FROM kingdoms WHERE userId = ? AND serverId = ?', [msg.author.id, msg.guild.id]).then(row => {
			if(!row) {
				msg.reply("Couldn't find your kingdom...");
			}
			else if(row.gold < 50) {
				msg.reply("You don't have enough gold to initiate an attack!");
			}
			else if(/^<@\d*>$/.test(content)){
				var newContent = content.replace(/<|@|>/g, '');
				msg.reply(newContent);
				sql.get('SELECT * FROM kingdoms WHERE userId = ? AND serverId = ?', [newContent, msg.guild.id]).then(row2 => {
					if(!row2) {
						msg.reply("Couldn't find your target kingdom...");
					}
					else {
						sql.run('UPDATE kingdoms SET gold = ? WHERE userId = ? AND serverId = ?', [row.gold - 50, msg.author.id, msg.guild.id]);
						var probability = calcProb(row.aa, row2.da);
						var raNum = Math.random();
						var success = probability / 100 < raNum;
						var setInt = global.setInterval(function(arr, iterNum) {
							msg.channel.send(arr[iterNum]);
							if(iterNum === arr.length - 1) {
								global.clearInterval(setInt);
							}
							iterNum++;
						}, [":crossed_swords:", ":bow_and_arrow:", ":bomb:", ":boom:", success ? "The attack succeeded!" : "The attack failed..."], 0);
						if(success) {
							if(row2.gold >= 80) {
								sql.run('UPDATE kingdoms SET gold = ? WHERE name = ? AND serverId = ?', [row2.gold - 80, content, msg.guild.id]).then(() => {
									sql.run('UPDATE kingdoms SET gold = ? WHERE userId = ? AND serverId = ?', [row.gold + 30, msg.author.id, msg.guild.id]);
								});
							}
							else {
								sql.run('UPDATE kingdoms SET gold = 0 WHERE name = ? AND serverId = ?', [content, msg.guild.id]).then(() => {
									sql.run('UPDATE kingdoms SET gold = ? WHERE userId = ? AND serverId = ?', [row.gold + 30, msg.author.id, msg.guild.id]);
								});
							}
							msg.reply("You got 80 gold!");
						}
						else {
							sql.run('UPDATE kingdoms SET gold = ? WHERE name = ? AND serverId = ?', [row2.gold + 30, content, msg.guild.id]).then(() => {
								sql.run('UPDATE kingdoms SET gold = ? WHERE userId = ? AND serverId = ?', [row.gold - 30, msg.author.id, msg.guild.id]);
							});
							msg.reply("You lost 80 gold...");
						}
					}
				}).catch((e) => {
					console.error(e);
					msg.reply("Couldn't find your target kingdom...");
				});
			}
			else {
				sql.get('SELECT * FROM kingdoms WHERE name = ? AND serverId = ?', [content, msg.guild.id]).then(row2 => {
					if(!row2) {
						msg.reply("Couldn't find your target kingdom...");
					}
					else {
						sql.run('UPDATE kingdoms SET gold = ? WHERE userId = ? AND serverId = ?', [row.gold - 50, msg.author.id, msg.guild.id]);
						var probability = calcProb(row.aa, row2.da);
						var raNum = Math.random();
						var success = probability / 100 < raNum;
						var setInt = global.setInterval(function(arr, iterNum) {
							msg.channel.send(arr[iterNum]);
							if(iterNum === arr.length - 1) {
								global.clearInterval(setInt);
							}
							iterNum++;
						}, [":crossed_swords:", ":bow_and_arrow:", ":bomb:", ":boom:", success ? "The attack succeeded!" : "The attack failed..."], 0);
						if(success) {
							if(row2.gold >= 80) {
								sql.run('UPDATE kingdoms SET gold = ? WHERE name = ? AND serverId = ?', [row2.gold - 80, content, msg.guild.id]).then(() => {
									sql.run('UPDATE kingdoms SET gold = ? WHERE userId = ? AND serverId = ?', [row.gold + 30, msg.author.id, msg.guild.id]);
								});
							}
							else {
								sql.run('UPDATE kingdoms SET gold = 0 WHERE name = ? AND serverId = ?', [content, msg.guild.id]).then(() => {
									sql.run('UPDATE kingdoms SET gold = ? WHERE userId = ? AND serverId = ?', [row.gold + 30, msg.author.id, msg.guild.id]);
								});
							}
							msg.reply("You got 80 gold!");
						}
						else {
							sql.run('UPDATE kingdoms SET gold = ? WHERE name = ? AND serverId = ?', [row2.gold + 30, content, msg.guild.id]).then(() => {
								sql.run('UPDATE kingdoms SET gold = ? WHERE userId = ? AND serverId = ?', [row.gold - 30, msg.author.id, msg.guild.id]);
							});
							msg.reply("You lost 80 gold...");
						}
					}
				}).catch(() => {
					msg.reply("Couldn't find your target kingdom...");
				});
			}
		}).catch(() => {
			msg.reply("Couldn't find your kingdom...");
		});
	}
});
client.on("guildMemberRemoved", function(server, user){
	sql.get('SELECT * FROM kingdoms WHERE userId = ? AND serverId = ?', [user.id, server.id]).then(function(row){
		if(row){
			sql.run('DELETE FROM kingdoms WHERE userId = ? AND serverId = ?', [user.id, server.id]);
			server.defaultChannel.send("Oh no! ${user.username} has left the server. :boom: The kingdom has been destroyed... :sob:");
		}
	});
});
client.login("No, I'm not telling you my token. Back off.");