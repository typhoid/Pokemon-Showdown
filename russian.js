/*********************************************************
 beta of Typhoid's ULTIMATE RUSSIAN ROULETTE
 
 known bugs: in standard mode, bullet is in second chamber far too often.
 known bugs: sometimes winner is undefined
 features unfinished :spectator gambling
 features unfinished: the atmosphere
 
 *********************************************************/

/*********************************************************
 * Functions
 *********************************************************/
exports.russian = function(ru) {
  if (typeof ru != "undefined") var russian = ru; else var russian = new Object();
	var russianStuff = {
		tiers: new Array(),
		timerLoop: function() {
			setTimeout(function() {
				russian.currentSeconds++;
				for (var i in russian.timers) {
					var c = russian.timers[i];
					var secondsNeeded = c.time * 60;
					var secondsElapsed = russian.currentSeconds - c.startTime;
					var difference = secondsNeeded - secondsElapsed;
					var fraction = secondsElapsed / secondsNeeded;
					function sendIt(end) {
						if (end) {
							Rooms.rooms[i].addRaw("<h3>The russian roulette was canceled because of lack of players.</h3>");
							return;
						}
						Rooms.rooms[i].addRaw("<i>The russian roulette will begin in " + difference + " second" + (difference == 1 ? '' : 's') + ".</i>");
					}
					if (fraction == 0.25 || fraction == 0.5 || fraction == 0.75) sendIt();
					if (fraction >= 1) {
						if (russian[i].players.length < 3) {
							russian.reset(i);
							sendIt(true);
						}
						else {
							if (russian[i].status == 1) {
								russian[i].size = russian[i].players.length;
								russian.reportdue(Rooms.rooms[i]);
								russian.start(i);
							}
						}
						delete russian.timers[i];
					}
				}
				russian.timerLoop();
			}, 1000);
		},
		reset: function(rid) {
			russian[rid] = {
				status: 0,
				tier: undefined,
				size: 0,
				roundNum: 0,
				turnNum: 0,
				usergroup: undefined,
				players: new Array(),
				winners: new Array(),
				losers: new Array(),
				round: new Array(),
				history: new Array(),
				byes: new Array(),
				playerslogged: new Array(),
				battles: new Object(),
				battlesended: new Array(),
				battlesinvtie: new Array(),
				question: undefined,
				answerList: new Array(),
				answers: new Object(),
				survivors: new Array(),
				revolver: new Array(),
                newrevolver: false,
				costbunnies: true,
		        costbits: false,
				moneypool: 0
			};
		},
		shuffle: function(list) {
		  var i, j, ru;
		  for (i = 1; i < list.length; i++) {
			j = Math.floor(Math.random()*(1+i));  // choose j in [0..i]
			if (j != i) {
				ru = list[i];                        // swap list[i] and list[j]
				list[i] = list[j];
				list[j] = ru;
			}
		  }
		  return list;
		},
		splint: function(target) {
			//splittyDiddles
			var cmdArr =  target.split(",");
			for (var i = 0; i < cmdArr.length; i++) cmdArr[i] = cmdArr[i].trim();
			return cmdArr;
		},
		username: function(uid) {
			if (Users.get(uid)) {
				var n = Users.get(uid).name;
				if (toId(n) != uid) return uid;
				return n;
			} else {
				return uid;
			}
		},
		maxauth: function(user) {
			if (user.can('forcewin') || user.userid === 'typhoid' || user.userid === 'dyb') return true;
			return false;
		},
		highauth: function(user) {
			//room auth is not enough
			if (!config.russianhighauth && user.can('ban')) return true;
			if (config.russianhighauth && config.groupsranking.indexOf(user.group) >= config.groupsranking.indexOf(config.russianhighauth)) return true;
			return false;
		},
		midauth: function(user, room) {
			if (!config.russianmidauth && user.can('broadcast')) return true;
			if (config.russianmidauth && config.groupsranking.indexOf(user.group) >= config.groupsranking.indexOf(config.russianmidauth)) return true;
			if (room.auth && room.auth[user.userid]) return true;
			return false;
		},
		lowauth: function(user, room) {
			if (!config.russianlowauth && user.can('broadcast')) return true;
			if (config.russianlowauth && config.groupsranking.indexOf(user.group) >= config.groupsranking.indexOf(config.russianlowauth)) return true;
			if (room.auth && room.auth[user.userid]) return true;
			return false;
		},
		remsg: function(apparent, nonhtml) {
			if (!isFinite(apparent)) return '';
			if (apparent === 0) return ' The first round of the russiannament starts now.';
			if (nonhtml) return (' ' + apparent + ' slot' + ( apparent === 1 ? '' : 's') + ' remaining.' );
			return (' <b><i>' + apparent + ' slot' + ( apparent === 1 ? '' : 's') + ' remaining.</b></i>' );
		},
		reportdue: function(room, connection) {
			var trid = russian[room.id];
			var remslots = trid.size - trid.players.length;
			if (trid.players.length == trid.playerslogged.length) {
				if (connection) connection.sendTo(room, 'There is nothing to report.');
			} else if (trid.players.length == trid.playerslogged.length + 1) {
				var someid = trid.players[trid.playerslogged.length];
				room.addRaw('<b>' + russian.username(someid) + '</b> has joined the russiannament.' + russian.remsg(remslots));
				trid.playerslogged.push(trid.players[trid.playerslogged.length]);
			} else {
				var someid = trid.players[trid.playerslogged.length];
				var prelistnames = '<b>' + russian.username(someid) + '</b>';
				for (var i = trid.playerslogged.length + 1; i < trid.players.length - 1; i++) {
					someid = trid.players[i];
					prelistnames = prelistnames + ', <b>' + russian.username(someid) + '</b>';
				}
				someid = trid.players[trid.players.length - 1];
				var listnames = prelistnames + ' and <b>' + russian.username(someid) + '</b>';
				room.addRaw(listnames + ' have joined the russiannament.' + russian.remsg(remslots));

				trid.playerslogged.push(trid.players[trid.playerslogged.length]);
				for (var i = trid.playerslogged.length; i < trid.players.length - 1; i++) { //the length is disturbed by the push above
					trid.playerslogged.push(trid.players[i]);
				}
				trid.playerslogged.push(trid.players[trid.players.length - 1]);
			}
		},
		joinable: function(uid, rid) {
			var players = russian[rid].players;
			for (var i=0; i<players.length; i++) {
				if (players[i] == uid) return false;
			}
			if (!config.russianallowalts){
				for (var i=0; i<players.length; i++) {
					if (players[i] == uid) return false;
				}
				for (var i=0; i<players.length; i++) {
					for (var j=0; j<Users.get(uid).getAlts().length; j++) {
						if (players[i] == toId(Users.get(uid).getAlts()[j])) return false;
					}
				}
				for (var i=0; i<players.length; i++) {
					for (var j in Users.get(uid).prevNames) {
						if (players[i] == toId(j)) return false;
					}
				}
				for (var i=0; i<players.length; i++) {	
					for (var j=0; j<Users.get(uid).getAlts().length; j++) {
						for (var k in Users.get(Users.get(uid).getAlts()[j]).prevNames) {
							if (players[i] == toId(k)) return false;
						}
					}
				}

			}
			return true;
		},
		lose: function(uid, rid) {
			/*
				if couldn'ru disqualify return false
				if could disqualify return the opponents userid
			*/
			var r = russian[rid].round;
			for (var i in r) {
				if (r[i][0] == uid) {
					var key = i;
					var p = 0;
					break;
				} 
			}
			if (!key) {
				//user not in russian
				return -1;
			}
			else {
				if (r[key][1] == undefined) {
					//no opponent
					var loser = 0;
			         russian[rid].losers.push(r[key][loser]);
                     var index = russian[rid].round.indexOf(uid);
					 var windex = russian[rid].winners.indexOf(uid);
					 var bindex = russian[rid].byes.indexOf(uid);
					 var sindex = russian[rid].survivors.indexOf(uid);
			if (index !== -1) {
					russian[rid].round.splice(index, 1);
					}
					if (windex != -1){
					russian[rid].winners.splice(windex, 1);
}					if (bindex != -1){
					russian[rid].byes.splice(bindex, 1);
}					if (sindex != -1){
					russian[rid].survivors.splice(sindex, 1);
}                  russian[rid].newrevolver = true;

					return 0;
				}
		
				var winner = 0;
				var loser = 1;
				if (p == 0) {
					winner = 1;
					loser = 0;
				}
				if ( p == 1) {r[key][2] = r[key][winner];
				russian[rid].winners.push(r[key][winner]);
				if (!russian[rid].byes.length) russian[rid].survivors.push(r[key][winner]);
}                russian[rid].newrevolver = true;
				if (p == 0) russian[rid].losers.push(r[key][loser]);
				russian[rid].history.push(r[key][winner] + "|" + r[key][loser]);
				return r[key][winner];
			}
		},
		win: function(uid, rid) {
			/*
				if couldn'ru disqualify return false
				if could disqualify return the opponents userid
			*/
			var r = russian[rid].round;
			for (var i in r) {
				if (r[i][0] == uid) {
					var key = i;
					var p = 0;
					break;
				} 
			}
			if (!key) {
				//user not in russian
				return -1;
			}
			else {
							if (r[key][1] == undefined) {
					//no opponent
					return 0;
				}
					var winner = 0;
				var loser = 1;
				if (p == 0) {
					winner = 0;
					loser = 1;
				}
				if ( p == 0) {r[key][2] = r[key][winner];
				russian[rid].winners.push(r[key][winner]);
				if (!russian[rid].byes.length) russian[rid].survivors.push(r[key][winner]);
}
				russian[rid].history.push(r[key][winner] + "|" + r[key][loser]);
				return r[key][winner];
			}
		},
		check: function(uid, rid) {
			/*
				if couldn'ru disqualify return false
				if could disqualify return the opponents userid
			*/
			var r = russian[rid].round;
			for (var i in r) {
				if (r[i][0] == uid) {
					var key = i;
					var p = 0;
					break;
				} 
			}
			if (!key) {
				//user not in russian
				return -1;
			}
			else {
				if (r[key][1] == undefined) {
					//no opponent
	
					
					return 0;
				}
		
	           else {return 1;}
			}
		},
		
		gamblebits: function(uid, rid, russianfunny, take) {
		console.log(uid);
		console.log(russianfunny);
		console.log(take);

						var data = fs.readFileSync('config/money.csv','utf8')
				var match = false;
				var money = 0;
				var row = (''+data).split("\n");
				var line = '';
				for (var i = row.length; i > -1; i--) {
					if (!row[i]) continue;
					var parts = row[i].split(",");
					var userid = toUserid(parts[0]);
					if (uid.userid == userid) {
						var x = Number(parts[1]);
						var money = x;
						match = true;
						if (match === true) {
							line = line + row[i];
							break;
						}
					}
				}
				uid.money = money;
				if (take === true){if (russianfunny <= uid.money){
				uid.money = uid.money - russianfunny; take = false;}
				else return false;
				}
				else {uid.money = uid.money + russianfunny;}
				if (match === true) {
					var re = new RegExp(line,"g");
					fs.readFile('config/money.csv', 'utf8', function (err,data) {
					if (err) {
						return console.log(err);
					}
					var result = data.replace(re, uid.userid+','+uid.money);
					fs.writeFile('config/money.csv', result, 'utf8', function (err) {
						if (err) return console.log(err);
					});
					});
				} else {
					var log = fs.createWriteStream('config/money.csv', {'flags': 'a'});
					log.write("\n"+uid.userid+','+uid.money);
				}
				return true;
				},
				
	    gamblecoins: function(uid, rid, russianfunny, take) {
	    var lore = fs.readFileSync('config/coins.csv','utf8')
                var match = false;
                var coins = 0;
                var spag = (''+lore).split("\n");
                var hetti = '';
                for (var i = spag.length; i > -1; i--) {
                    if (!spag[i]) continue;
                    var parts = spag[i].split(",");
                    var userid = toUserid(parts[0]);
					if (uid.userid == userid) {
                        var x = Number(parts[1]);
                        var coins = x;
                        match = true;
                        if (match === true) {
                            hetti = hetti + spag[i];
                            break;
                        }
                    }
                }
                uid.coins = coins;
						if (take === true){if (russianfunny <= uid.coins){
				uid.coins = uid.coins - russianfunny; take = false;}
				else return 1;
				}
                uid.coins = uid.coins + russianbunny;
				
                if (match === true) {
                    var be = new RegExp(hetti,"g");
                    fs.readFile('config/coins.csv', 'utf8', function (err,lore) {
                        if (err) {
                            return console.log(err);
                        }
                        var result = lore.replace(be, uid.userid+','+uid.coins);
                        fs.writeFile('config/coins.csv', result, 'utf8', function (err) {
                            if (err) return console.log(err);
                        });
                    });
                } else {
                    var log = fs.createWriteStream('config/coins.csv', {'flags': 'a'});
                    log.write("\n"+uid.userid+','+uid.coins);
                } return true;
		},
		start: function(rid) {
		if (config.russiansmith == true) {russian[rid].revolver = new Array("bullet","blank","blank","blank","blank","blank");} //Smith & Wesson model 3- 6 shot
		else if (config.russiannagant == true) {russian[rid].revolver = new Array("bullet","blank","blank","blank","blank","blank","blank");}    //Model 1895 Nagant 7 shot 
		else if (config.russianwebley == true) {russian[rid].revolver = new Array("bullet","blank","blank","blank","blank","blank","blank","blank");}//Webley-Fosbery Self-Cocking Automatic .38 Revolver  8 shot
	    else if (config.russianlemat == true) {russian[rid].revolver = new Array("bullet","blank","blank","blank","blank","blank","blank","blank","blank");}//LeMat Pinfire Revolver 9 shot,1 shotgun 
          else {russian[rid].revolver = new Array("bullet","blank","blank","blank","blank");}
		  if (config.russian1917 == true){
		 r1917 = russian[rid].revolver;
    for (var i in r1917){r1917.splice(i,1,"bullet"); } r1917.splice(0,1,"blank"); russian[rid].revolver = r1917;}
	
			var spin = russian[rid].revolver;
			russian.shuffle(spin);
			russian[rid].revolver = spin;
			var isValid = false;
			var numByes = 0;

			do {
				var numPlayers = (russian[rid].size - numByes);
				if (numPlayers == 1) isValid = true; else numByes++;
			}
			while (isValid == false);
			var r = russian[rid].round;
			var sList = russian[rid].players;
			russian.shuffle(sList);
			var key = 0;
			do {
				if (numByes > 0) {
					r.push([sList[key], undefined, sList[key]]);
					russian[rid].winners.push(sList[key]);
					russian[rid].byes.push(sList[key]);
					numByes -= 1
					key++;
				}
			}
			while (numByes > 0);
			do {
				var match = new Array(); //[p1, p2, result]
				match.push(sList[key]);
				key++;
				match.push('bob');
				match.push(undefined);
				r.push(match);
			}
			while (key != sList.length);
			russian[rid].roundNum++;
			russian[rid].turnNum++;
			russian[rid].status = 2;
			russian.startRaw(rid);
		},
		startRaw: function(i) {
			

			var room = Rooms.rooms[i];
			var html = '<hr /><h3><font color="green">Round '+ russian[room.id].roundNum +'!</font></h3><font color="blue"><b>TURN:' + russian[room.id].turnNum + '</b></font><font color="red"><b>MONEYPOOL:'+russian[room.id].moneypool + '</b></font><hr /><center>';
			var round = russian[room.id].round;
			var firstMatch = false;
			for (var i in round) {
				if (!round[i][1]) {
						var p1n = russian.username(round[i][0]);
						if (p1n.substr(0, 6) === 'Guest ') p1n = round[i][0];
						html += "<font color=\"red\">" + clean(p1n) + " hasnt gone yet!</font><br />";
				}
				else {
					var p1n = russian.username(round[i][0]);
					var p2n = russian.username(round[i][1]);
					var p3n = russian.username(round[i][2]);
					if (p1n.substr(0, 6) === 'Guest ') p1n = round[i][0];
					var tabla = ""; if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";firstMatch = true;}
					html += tabla + "<tr><td align=right>" + clean(p1n) + "</td></tr>";
				}
			}
			room.addRaw(html + "</table>");
		},
		nextRound: function(rid) {
		    var v = russian[rid].survivors;
			var w = russian[rid].winners;
			var l = russian[rid].losers;
			var b = russian[rid].byes;
			var check = 1;
			russian[rid].turnNum++;
			russian[rid].history.push(russian[rid].round);
			russian[rid].round = new Array();
			russian[rid].winners = new Array();
			russian[rid].byes = new Array();
			
			
			var firstMatch = false;
			 if ((russian[rid].players.length - check) == l.length ) {
				var russianMoney = 0;
				var tooSmall = '';
				var p = 'bits';
				var russianbunny = 0;
				var q = 'Dust Bunnies';
				if (!Rooms.rooms[rid].auth) {
					if (russian[rid].size >= 8) {
						russianMoney = 6;
						russianbunny = 300;
					}
					if (russian[rid].size >= 6 && russian[rid].size < 8) {
						russianMoney = 4;
						russianbunny = 200;
					}
					if (russian[rid].size < 6 && russian[rid].size >= 4) {
						russianMoney = 2;
						p = 'bit';
						russianbunny = 100;
					}
					if (russian[rid].size < 4) {
						russianMoney = 0;
						russianbunny = 0;
						if (russian[rid].costbunnies == false || russian[rid].costbits == false ) {tooSmall = tooSmall + '(the russian was too small)';
					}}
              if (russian[rid].costbunnies == true){
                    russianbunny = russian[rid].moneypool;
                russianMoney = 0;			p = 'dust bunnies';		}
             if (russian[rid].costbits == true){ russianMoney = russian[rid].moneypool;
			 russianbunny = 0;}					
				}  
			else	{
					tooSmall += '(this is not an official chatroom)';
				}
				//end russian
Rooms.rooms[rid].addRaw('<h2><font color="green">Congratulations <font color="black">' + Users.users[w[0]].name + '</font>!  Youre the last standing!<br>You have also won ' + russianMoney + ' poketariat ' + p + '! ' + tooSmall + '</font></h2><hr />');
				//fffffffffff
				var data = fs.readFileSync('config/money.csv','utf8')
				var match = false;
				var money = 0;
				var row = (''+data).split("\n");
				var line = '';
				for (var i = row.length; i > -1; i--) {
					if (!row[i]) continue;
					var parts = row[i].split(",");
					var userid = toUserid(parts[0]);
					if (Users.users[w[0]].userid == userid) {
						var x = Number(parts[1]);
						var money = x;
						match = true;
						if (match === true) {
							line = line + row[i];
							break;
						}
					}
				}
				Users.users[w[0]].money = money;
				Users.users[w[0]].money = Users.users[w[0]].money + russianMoney;
				if (match === true) {
					var re = new RegExp(line,"g");
					fs.readFile('config/money.csv', 'utf8', function (err,data) {
					if (err) {
						return console.log(err);
					}
					var result = data.replace(re, Users.users[w[0]].userid+','+Users.users[w[0]].money);
					fs.writeFile('config/money.csv', result, 'utf8', function (err) {
						if (err) return console.log(err);
					});
					});
				} else {
					var log = fs.createWriteStream('config/money.csv', {'flags': 'a'});
					log.write("\n"+Users.users[w[0]].userid+','+Users.users[w[0]].money);
				}
			    var lore = fs.readFileSync('config/coins.csv','utf8')
                var match = false;
                var coins = 0;
                var spag = (''+lore).split("\n");
                var hetti = '';
                for (var i = spag.length; i > -1; i--) {
                    if (!spag[i]) continue;
                    var parts = spag[i].split(",");
                    var userid = toUserid(parts[0]);
                    if (Users.users[w[0]].userid == userid) {
                        var x = Number(parts[1]);
                        var coins = x;
                        match = true;
                        if (match === true) {
                            hetti = hetti + spag[i];
                            break;
                        }
                    }
                }
                Users.users[w[0]].coins = coins;
                Users.users[w[0]].coins = Users.users[w[0]].coins + russianbunny;
                if (match === true) {
                    var be = new RegExp(hetti,"g");
                    fs.readFile('config/coins.csv', 'utf8', function (err,lore) {
                        if (err) {
                            return console.log(err);
                        }
                        var result = lore.replace(be, Users.users[w[0]].userid+','+Users.users[w[0]].coins);
                        fs.writeFile('config/coins.csv', result, 'utf8', function (err) {
                            if (err) return console.log(err);
                        });
                    });
                } else {
                    var log = fs.createWriteStream('config/coins.csv', {'flags': 'a'});
                    log.write("\n"+Users.users[w[0]].userid+','+Users.users[w[0]].coins);
                }
				russian[rid].status = 0;
			} 
			else if (!b.length)
		{       			russian[rid].roundNum++;
				var html = '<hr /><h3><font color="green">Round '+ russian[rid].roundNum +'!</font></h3><font color="blue"><b>TURN:'	+ russian[rid].turnNum + '</b></font><font color="red"><b>MONEYPOOL:'+russian[rid].moneypool + '</b></font>  <hr /><center>';
				var pBye = new Array();
				var pNorm = new Array();
				var p = new Array();
				var byerz = false;
				var pee = 0;
				for (var i in v) {
					var byer = false;
					for (var x in b) {
						if (b[x] == v[i]) {
							byer = true;
							pBye.push(v[i]);
						}
					}
					if (!byer) {
						pNorm.push(v[i]);
					}
				}
				for (var i in pBye) {
				
					p.push(pBye[i]);
					if (typeof pNorm[i] != "undefined") {
						p.push(pNorm[i]);
						pNorm.splice(i, 1);
					}
	
				}
				for (var i in pNorm) p.push(pNorm[i]);
			    for (var i = 1; p.length > i; i++){
				    var p1 = i;
					russian[rid].winners.push(p[p1]);
					russian[rid].byes.push(p[p1]);
			    russian[rid].round.push([p[p1], undefined, p[p1]]);
				    var p1n = russian.username(p[p1]);
				    var tabla = "";if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";firstMatch = true;}
				    html += tabla + "<font color=\"red\">" + clean(p1n) + " hasnt gone yet!</font><br />";

				}
				for (var i = 0; 1 > i; i++) {
					var p1 = i;
					russian[rid].round.push([p[p1], 'bob', undefined]);
					var p1n = russian.username(p[p1]);
					var p2n = 'bob';
					var tabla = "";if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";firstMatch = true;}
					var reload = "";if (russian[rid].newrevolver) {var reload = clean(p1n) + " picked up the revolver and put another bullet in the chamber!";russian[rid].newrevolver = false;}
					html += tabla + reload + "<tr><td align=right>" + clean(p1n) + "</td></tr>";
				}
				Rooms.rooms[rid].addRaw(html + "</table>");
                 russian[rid].survivors = new Array();
				}
			
			
			else {
				var html = '<hr /><h3><font color="green">Round '+ russian[rid].roundNum +'!</font></h3><font color="blue"><b>TURN:' + russian[rid].turnNum + '</b></font><font color="red"><b>MONEYPOOL:'+russian[rid].moneypool + '</b></font>  <hr /><center>';
				var pBye = new Array();
				var pNorm = new Array();
				var p = new Array();
				var byerz = false;
				for (var i in w) {
					var byer = false;
					for (var x in b) {
						if (b[x] == w[i]) {
							byer = true;
							pBye.push(w[i]);
						}
					}
					if (!byer) {
						pNorm.push(w[i]);
					}
				}
				for (var i in pBye) {
				
					p.push(pBye[i]);
					if (typeof pNorm[i] != "undefined") {
						v.push(pNorm[i]);
						pNorm.splice(i, 1);
					}
	
				}
				for (var i in pNorm) v.push(pNorm[i]);
				for (var i = 0; v.length > i; i++){
				     var s1 = i;
				     russian[rid].round.push([v[s1], undefined, v[s1]]);
				     var s1n = russian.username(v[s1]);
				     var tabla = "";if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";firstMatch = true;}
                     html += tabla + "<font color=\"red\">" + clean(s1n) + " survived so far!</font><br />";

				}
			    for (var i = 1; p.length > i; i++){
				    var p1 = i;
				    russian[rid].round.push([p[p1], undefined, p[p1]]);
					russian[rid].winners.push(p[p1]);
					russian[rid].byes.push(p[p1]);
				    var p1n = russian.username(p[p1]);
				    var tabla = "";if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";firstMatch = true;}
				    html += tabla + "<font color=\"red\">" + clean(p1n) + " hasn't gone yet!</font><br />";

				}
				for (var i = 0; 1 > i; i++) {
					var p1 = i;
					russian[rid].round.push([p[p1], 'bob', undefined]);
					var p1n = russian.username(p[p1]);
					var p2n = 'bob';
					var tabla = "";if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";firstMatch = true;}
					var reload = "";if (russian[rid].newrevolver) {var reload =clean(p1n) + " picked up the revolver and put another bullet in the chamber!";russian[rid].newrevolver = false;}
					html += tabla + reload + "<tr><td align=right>" + clean(p1n) + "</td></tr>";
				}
				Rooms.rooms[rid].addRaw(html + "</table>");
			}
			russian[rid].battlesended = [];
		},
	};


	if (typeof russian.timers == "undefined") russian.timers = new Object();
	if (typeof russian.currentSeconds == "undefined") {
		russian.currentSeconds = 0;
		russian.timerLoop();
	}
	for (var i in Rooms.rooms) {
		if (Rooms.rooms[i].type == "chat" && !russian[i]) {
			russian[i] = new Object();
			russian.reset(i);
		}
	}
	return russian;
};
function clean(string) {
	var entityMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': '&quot;',
		"'": '&#39;',
		"/": '&#x2F;'
	};
	return String(string).replace(/[&<>"'\/]/g, function (s) {
		return entityMap[s];
	});
}
/*********************************************************
 * Commands
 *********************************************************/
var cmds = {
	

	//russian commands
	russian: function(target, room, user, connection) {
	
		if (target == "update" && this.can('hotpatch')) {
			CommandParser.uncacheTree('./russian.js');
			russian = require('./russian.js').russian(russian);
			return this.sendReply('russiannament scripts were updated.');
		}
		if (!russian.midauth(user,room)) return this.parse('/russians');
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		var rid = room.id;
		typemoney = ' ';
		if (russian[rid].status != 0) return this.sendReply('There is already a russian roulette running, or there is one in a signup phase.');
		if (!target) return this.sendReply('Proper syntax for this commandg: /russian NUMBER bits/bunnies, size');
		var targets = russian.splint(target);
		if (targets.length != 2 && targets.length != 1) return this.sendReply('Proper syntax for this command: /russian NUMBER bits/bunnies, size');
	if (targets.length == 2){
		if (targets[0].split('bunn').length - 1 > 0){
		targets[0] = parseInt(targets[0]);
		if (isNaN(targets[0]) || !targets[0]) return this.sendReply('/russian NUMBER bunnies/bits, size');
        targets[0] = Math.ceil(targets[0]);
		if (targets[0] < 0) return this.sendReply('dont use a negative number or a fraction.');
            bunbunz = true;
			bitbitz = false;
		 typemoney = 'bunnies';

		}
		else if (targets[0].split('bi').length - 1 > 0){
		targets[0] = parseInt(targets[0]);
		if (isNaN(targets[0]) || !targets[0]) return this.sendReply('/russian NUMBER bunnies/bits, size');
        targets[0] = Math.ceil(targets[0]);
		if (targets[0] < 0) return this.sendReply('dont use a negative number or a fraction.');
           bunbunz = false;
		   bitbitz = true;
		 typemoney = 'bits';

		}
		else { return this.sendReply(' please specify this is in bits or bunnies. example /russian NUMBER bunnies, size or /russian NUMBER bits, size');
		}
		if (targets[1].split('minut').length - 1 > 0) {
			targets[1] = parseInt(targets[1]);
			if (isNaN(targets[1]) || !targets[1]) return this.sendReply('/russian NUMBER bunnies/bits, NUMBER minutes');
			targets[1] = Math.ceil(targets[1]);
			if (targets[1] < 0) return this.sendReply('Why would you want to schedule a russian roulette for the past?');
			russian.timers[rid] = {
				time: targets[1],
				startTime: russian.currentSeconds
			};
			targets[1] = Infinity;
		}
		else {
			targets[1] = parseInt(targets[1]);
		}
		if (isNaN(targets[1])) return this.sendReply('Proper syntax for this commandd: /russian NUMBER bunnies/bits, size');
		if (targets[1] < 2) return this.sendReply('russian roulette must contain 2 or more people.');
}
if (targets.length == 1){
		if (targets[0].split('minut').length - 1 > 0) {
			targets[0] = parseInt(targets[0]);
			if (isNaN(targets[0]) || !targets[0]) return this.sendReply('/russian NUMBER bunnies/bits, NUMBER minutes');
			targets[0] = Math.ceil(targets[0]);
			if (targets[0] < 0) return this.sendReply('Why would you want to schedule a russian roulette for the past?');
			russian.timers[rid] = {
				time: targets[0],
				startTime: russian.currentSeconds
			};
			targets[0] = Infinity;
		}
		else {
			targets[0] = parseInt(targets[0]);
		}
		if (isNaN(targets[0])) return this.sendReply('Proper syntax for this commandd: /russian NUMBER bunnies/bits, size');
		if (targets[0] < 2) return this.sendReply('russian roulette must contain 2 or more people.');

		 typemoney = 'free'
}
		this.parse('/endpoll');
		russian.reset(rid);
if (targets.length == 1){  		 russian[rid].gambleamount = 0;  		russian[rid].size = targets[0]; russian[rid].costbunnies = false; russian[rid].costbits = false; joinable = true; }
if (targets.length == 2){ 		joinable = false; russian[rid].size = targets[1];   		 russian[rid].gambleamount = targets[0];  
if (bunbunz == true)         russian[rid].costbunnies = true; else {russian[rid].costbits = true;}
bunbunz = false; bitbitz = false; 
 }     console.log(russian[rid].costbunnies); console.log(russian[rid].costbits); 
		russian[rid].status = 1;
		russian[rid].players = new Array();
        console.log(targets);
		Rooms.rooms[rid].addRaw('<hr /><h2><font color="green">' + sanitize(user.name) + ' has started a  russian roulette game.</font> <font color="red">/j</font> <font color="green">to join!</font></h2><b><font color="blueviolet">PLAYERS:</font></b> ' + russian[rid].size + '<br /><font color="blue"><b>ENTRY FEE:</b></font> ' + (russian[rid].gambleamount == 0 ? '' : russian[rid].gambleamount) +  ' ' + typemoney + '  <hr />');
		if (russian.timers[rid]) Rooms.rooms[rid].addRaw('<i>The russian roulette will begin in ' + russian.timers[rid].time + ' minute' + (russian.timers[rid].time == 1 ? '' : 's') + '.<i>');
	},

	endrussian: function(target, room, user, connection) {
		if (!russian.midauth(user,room)) return this.sendReply('You do not have enough authority to use this command.');
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (russian[room.id] == undefined || russian[room.id].status == 0) return this.sendReply('There is no active russian roulette.');
		russian[room.id].status = 0;
		delete russian.timers[room.id];
		room.addRaw('<h2><b>' + user.name + '</b> has ended the russian roulette.</h2>');
	},

	russiansize: function(target, room, user, connection) {
		if (!russian.midauth(user,room)) return this.sendReply('You do not have enough authority to use this command.');
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (russian[room.id] == undefined) return this.sendReply('There is no active russian roulette in this room.');
		if (russian[room.id].status > 1) return this.sendReply('The russian roulette size cannot be changed now!');
		if (russian.timers[room.id]) return this.sendReply('This russian roulette has an open number of participants. It cannot be resized');
		if (!target) return this.sendReply('Proper syntax for this command: /russiansize size');
		target = parseInt(target);
		if (isNaN(target)) return this.sendReply('Proper syntax for this command: /russian size');
		if (target < 2) return this.sendReply('A russiannament must have at least 3 people in it.');
		if (target < russian[room.id].players.length) return this.sendReply('Target size must be greater than or equal to the amount of players in the russiannament.');
		russian[room.id].size = target;
		russian.reportdue(room);
		room.addRaw('<b>' + user.name + '</b> has changed the russian roulette size to: ' + target + '. <b><i>' + (target - russian[room.id].players.length) + ' slot' + ( ( target - russian[room.id].players.length ) == 1 ? '' : 's') + ' remaining.</b></i>');
		if (target == russian[room.id].players.length) russian.start(room.id);
	},

	russiantime: function(target, room, user, connection) {
		if (!russian.midauth(user,room)) return this.sendReply('You do not have enough authority to use this command.');
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (russian[room.id] == undefined) return this.sendReply('There is no active russian roulette in this room.');
		if (russian[room.id].status > 1) return this.sendReply('The russian roulette size cannot be changed now!');
		if (!russian.timers[room.id]) return this.sendReply('This russian roulette is not running under a clock!');
		if (!target) return this.sendReply('Proper syntax for this command: /russiantime time');
		target = parseInt(target);
		if (isNaN(target)) return this.sendReply('Proper syntax for this command: /russiantime time');
		if (target === 0) return this.sendReply('You cannot set the russian time to 0.');
		if (target < 0) return this.sendReply('Why would you want to reschedule a russian roulette for the past?');
		target = Math.ceil(target);
		russian.timers[room.id].time = target;
		russian.timers[room.id].startTime = russian.currentSeconds;
		room.addRaw('<b>' + user.name + '</b> has changed the remaining time for registering to the russian roulette to: ' + target + ' minute' + (target === 1 ? '' : 's') + '.');
		if (target === 0) {
			russian.reportdue(room);
			russian.start(room.id);
		}
	},


	joinrussian: function(target, room, user, connection) {
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (russian[room.id] == undefined || russian[room.id].status == 0) return this.sendReply('There is no active russian roulette to join.');
		if (russian[room.id].status == 2) return this.sendReply('Signups for the current russian roulette are over.');
		if (russian.joinable(user.userid, room.id)) {
		var russianfunny = russian[room.id].gambleamount
		var hipe = user
		take = true;
		console.log(joinable);
		           bunbunz = false;
		   bitbitz = true;
		if ( bunbunz == true) {
				var joinable = russian.gamblebunnies(hipe, room, russianfunny, take)
           }
		
		if (bitbitz == true){
	 var joinable = russian.gamblebits(hipe, room, russianfunny, take)
	}
	if (joinable == true ){
			russian[room.id].players.push(user.userid);
			var remslots = russian[room.id].size - russian[room.id].players.length;
			// these three assignments (natural, natural, boolean) are done as wished
			if (isFinite(russian[room.id].size)) {
			var pplogmarg = Math.ceil(Math.sqrt(russian[room.id].size) / 2);
			var logperiod = Math.ceil(Math.sqrt(russian[room.id].size));	
			} else {
			var pplogmarg = (!isNaN(config.russiantimemargin) ? config.russiantimemargin : 3);
			var logperiod = (config.russiantimeperiod ? config.russiantimeperiod : 4);
			}
			var perplayerlog = ( ( russian[room.id].players.length <= pplogmarg ) || ( remslots + 1 <= pplogmarg ) );
			//

			if (perplayerlog || (russian[room.id].players.length - russian[room.id].playerslogged.length >= logperiod) || ( remslots <= pplogmarg ) ) {
				russian.reportdue(room, connection);
				user.canttarget = false;
			                user.spin = 0;
							russian[room.id].moneypool += russian[room.id].gambleamount;
							console.log(russian[room.id].moneypool);
			} else {        user.canttarget = false;
			                user.spin = 0;
							russian[room.id].moneypool += russian[room.id].gambleamount;
							console.log(russian[room.id].moneypool);
				this.sendReply('You have succesfully joined the russian roulette game.');
			}
			if (russian[room.id].size == russian[room.id].players.length) russian.start(room.id);
			}
						else { return this.sendReply(' you dont have enough money to join. it costs' + russian[room.id].gambleamount + ' to join');
}
		} else {
			return this.sendReply('You could not enter the russian roulette. You may already be in the russian roulette. Type /l if you want to leave the russiannament.');
		}
	},

	forcejoin: 'fj',
	fj: function(target, room, user, connection) {
		if (!russian.lowauth(user,room)) return this.sendReply('You do not have enough authority to use this command.');
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (russian[room.id] == undefined || russian[room.id].status == 0 || russian[room.id].status == 2) return this.sendReply('There is no russiannament in a sign-up phase.');
		if (!target) return this.sendReply('Please specify a user who you\'d like to participate.');
		var targetUser = Users.get(target);
		if (targetUser) {
			target = targetUser.userid;
		} else {
			return this.sendReply('The user \'' + target + '\' doesn\'ru exist.');
		}
		if (russian.joinable(target, room.id)) {
				var russianfunny = russian[room.id].gambleamount;
		var hipe = targetUser
		take = true;
		console.log(joinable);
		           bunbunz = false;
		   bitbitz = true;
		if ( bunbunz == true) {
				var joinable = russian.gamblebunnies(hipe, room, russianfunny, take)
           }
		
		if (bitbitz == true){
	 var joinable = russian.gamblebits(hipe, room, russianfunny, take)
	}	if (joinable == true ){

			russian.reportdue(room);
			russian[room.id].players.push(target);
			russian[room.id].playerslogged.push(target);
			var remslots = russian[room.id].size - russian[room.id].players.length;
			        targetUser.canttarget = false;
					targetUser.spin = 0;
							russian[room.id].moneypool += russian[room.id].gambleamount;
					room.addRaw(user.name + ' has forced <b>' + russian.username(target) + '</b> to join the russian roulette.' + russian.remsg(remslots));
			if (russian[room.id].size == russian[room.id].players.length) russian.start(room.id);
					}
						else { return this.sendReply('the user' + targetUser +' does not have enough money to join. it costs' + russian[room.id].gambleamount + ' to join');
}
		} else {
			return this.sendReply('The user that you specified is already in the russiannament.');
		}
	},





	remind: function(target, room, user, connection) {
		if (!russian.lowauth(user,room)) return this.sendReply('You do not have enough authority to use this command.');
		if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (russian[room.id] == undefined || !russian[room.id].status) return this.sendReply('There is no active russiannament in this room.');
		if (russian[room.id].status == 1) {
			var remslots = russian[room.id].size - russian[room.id].players.length;
			russian.reportdue(room, connection);
			room.addRaw('<hr /><h2><font color="green">Please sign up for the ' + Tools.data.Formats[russian[room.id].tier].name + ' russiannament.</font> <font color="red">/j</font> <font color="green">to join!</font></h2><b><font color="blueviolet">PLAYERS:</font></b> ' + (isFinite(russian[room.id].size) ? russian[room.id].size : 'UNLIMITED') + '<br /><font color="blue"><b>TIER:</b></font> ' + Tools.data.Formats[russian[room.id].tier].name + '<hr />');
		} else {
			var c = russian[room.id];
			var unfound = [];
			if (!target) {
				for (var x in c.round) {
					if (c.round[x][0] && c.round[x][1] && !c.round[x][2]) {
						var userOne = Users.get(c.round[x][0]);
						var userTwo = Users.get(c.round[x][1]);
						if (userOne) {
							userOne.popup("Remember that you have a pending russiannament battle in the room ");
						} else {
							unfound.push(c.round[x][0]);
						}
	
					}
				}
			} else {
				var opponent = '';
				var targets = russian.splint(target);
				for (var i=0; i<targets.length; i++) {
					var nicetarget = false;
					var someuser = Users.get(targets[i]);
					if (someuser) {
						for (var x in c.round) {
							if (c.round[x][0] && c.round[x][1] && !c.round[x][2]) {
								if (c.round[x][0] === someuser.userid) {
									nicetarget = true;
									opponent = c.round[x][1];
									break;
								} else if (c.round[x][1] === someuser.userid) {
									nicetarget = true;
									opponent = c.round[x][0];
									break;
								}
							}
						}
					}
					if (nicetarget) {
						someuser.popup("Remember that you have a pending russiannament battle in the room ");
					} else {
						unfound.push(someuser.name);
					}
				}
			}
			room.addRaw("Users with pending battles in the russian roulette were reminded of it by " + user.name + '.');
			if (unfound.length) return this.sendReply("The following users are offline or lack pending battles: " + unfound.toString());
		}
	},




	forceshoot: function(target, room, user, connection){
	if (!russian.midauth(user,room)) return this.sendReply('You do not have enough authority to use this command.');
   	var newrevolver = false;
	if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
	if (russian[room.id] == undefined) return this.sendReply('There is no active russiannament in this room.');
	if (russian[room.id].status < 2) return this.sendReply('There is no russiannament out of its sign up phase.');
	if (!target) return this.sendReply('Proper syntax for this command is: /forceshoot username');
	if (config.russiandqguard) {
			var stop = false;
			for (var x in russian[room.id].round) {
				if (russian[room.id].round[x][2] === -1) {
					stop = true;
					break;
				}
			}
			if (stop) return this.sendReply('Due to current settings, it is not possible to disqualify players before the rest of russiannament battles finish.');
		}
		var targetUser = Users.get(target);
		if (!targetUser) {
			var dqGuy = sanitize(target.toLowerCase());
		} else {
			var dqGuy = toId(target);
		}
		var error = russian.check(dqGuy, room.id);
		if (error == -1) {
			return this.sendReply('The user \'' + target + '\' was not in the russiannament.');
		}
		else if (error == 0) {
			return this.sendReply('The user \'' + target + '\' doesnt have the revolver.');
		}

		else {
		 var coolguy = user.userid;
		var spin = russian[room.id].revolver;
		 if (config.russianspin == true) {russian.shuffle(spin);}

		   if (spin[0] == "bullet")
		{var error = russian.lose(dqGuy, room.id);


	room.addRaw('<b>' + russian.username(coolguy) + ' ' + 'took the gun, shouted "COWARD!" and pointed it at ' +' '+ russian.username(dqGuy)+' ' + 'and spilled tomato sauce all over' +' '+ russian.username(dqGuy) + 's '+' ' + ' new shirt! spaghetti flew all over the place! eh, was pretty cool guy too...</b>');
						russian[room.id].revolver = spin;
			var r = russian[room.id].round;
			var c = r.length;
			if (r.length == c) russian.nextRound(room.id);
			return this.sendReply('you made' + ''+ russian.username(dqGuy) + '' + 'get tomato sauce all over his shirt! shame on you!:O');

			}
	else {
	
			var error = russian.win(dqGuy, room.id);


			room.addRaw('<b>' + russian.username(coolguy) + ' ' + ' took the gun, shouted "COWARD!" and pointed it at ' +' '+ russian.username(dqGuy)+' ' + ' and pulled the trigger and nothing happened! oh well, maybe next time!' + russian.username(dqGuy) +' ' + 'glared at' + ' ' + russian.username(coolguy) + ' ' + ' for trying to get their air jordans messy!</b>');
			russian[room.id].revolver = spin;
	        var r = russian[room.id].round;
			var c = r.length;
		    if (r.length == c) russian.nextRound(room.id);
		return this.sendReply('he was lucky wasnt he?');

			}
	}
	
	},
	
	
		shoot: function(target, room, user, connection) {
		this.sendReply(room.id);
		var newrevolver = false;
	var index = russian[room.id].players.indexOf(user.userid);
			if (index !== -1) {
			canshoot = false;
					for (var i in russian) {
			var c = russian[i];
			if (c.status == 2) {
				for (var x in c.round) {
					if (c.round[x] === undefined) continue;
					if (user.userid == c.round[x][0] && 'bob' == c.round[x][1]) {
					canshoot = true;
					}}}}
			
if (canshoot) { 
          if (config.russianmultispin == true){
          if (user.spin == 0){
return this.sendReply(' due to settings, spin atleast once first! type /spin');		  
			 }}
	if (room.decision) return this.sendReply('Prof. Oak: There is a time and place for everything! You cannot do this in battle rooms.');
		if (russian[room.id] == undefined) return this.sendReply('There is no active russiannament in this room.');
		if (russian[room.id].status < 2) return this.sendReply('There is no russiannament out of its sign up phase.');

          //VVV check if eh cool guy is the guyVV
		if (!target || target == user){
		           user.spin = 0;
					 var spin = russian[room.id].revolver;
		 if (config.russianspin == true) {russian.shuffle(spin);}
              if (spin[0] == "bullet")
			  { var died = user.userid;
			  	var error = russian.lose(died, room.id);
			room.addRaw('<b>' + russian.username(died) + ' ' + 'pulled the trigger and blew spaghetti all over the place! eh, was pretty cool guy too...</b>');
			if (config.russianstandard == true) {russian.shuffle(spin);}
			russian[room.id].revolver = spin;
			var r = russian[room.id].round;
			var c = r.length;
			if (r.length == c) russian.nextRound(room.id);
			return this.sendReply('clean the tomato sauce off your shirt or your mom will get mad :O');

			}
			else {
			var lived = user.userid;
			var error = russian.win(lived, room.id);
			room.addRaw('<b>' + russian.username(lived) + ' ' + 'pulled the trigger and nothing happened! oh well, maybe next time!</b>');
		    if (config.russianstandard == true){
			poe = spin.shift(); spin.push(poe);}
			russian[room.id].revolver = spin;
	        var r = russian[room.id].round;
			var c = r.length;
		    if (r.length == c) russian.nextRound(room.id);
		return this.sendReply('lucky you');

			}
				
		}
			if (config.russiandqguard) {
			var stop = false;
			for (var x in russian[room.id].round) {
				if (russian[room.id].round[x][2] === -1) {
					stop = true;
					break;
				}
			}
			if (stop) return this.sendReply('Due to current settings, it is not possible to disqualify players before the rest of russiannament battles finish.');
		}
			var targetUser = Users.get(target);
		if (!targetUser) {
			var dqGuy = sanitize(target.toLowerCase());
		} else {
			var dqGuy = toId(target);
		}
		var error = russian.check(dqGuy, room.id);
		if (error == -1) {
			return this.sendReply('The user \'' + target + '\' was not in the russiannament.');
		}
		// ^^check if target is in da game^^^
        // VV check if homie already 'cheated'VV

		else { if (!user.canttarget){
		var coolguy = user.userid;
			    var spin = russian[room.id].revolver;
		 if (config.russianspin == true) {russian.shuffle(spin);}
           user.spin = 0;
		   if (spin[0] == "bullet")
		{var winned = russian.win(coolguy, room.id);
		var error = russian.lose(dqGuy, room.id);



		
	room.addRaw('<b>' + russian.username(coolguy) + ' ' + ' !!!cheated!!! and pointed the gun at ' +' '+ russian.username(dqGuy) + ' ' + 'and spilled tomato sauce all over' +' '+ russian.username(dqGuy)+'s '+' ' + ' new shirt! spaghetti flew all over the place! eh, was pretty cool guy too...</b>');
				if (config.russianstandard == true) {russian.shuffle(spin);}
					russian[room.id].revolver = spin;
			var r = russian[room.id].round;
			var c = r.length;
			if (r.length == c) russian.nextRound(room.id);
			user.canttarget = true;
			return this.sendReply('you made' + '' + russian.username(dqGuy) + '' + 'get tomato sauce all over his shirt! shame on you!:O');

			}
	else {
			var error = russian.win(coolguy, room.id);



			room.addRaw('<b>' + russian.username(coolguy) + ' ' + ' !!!cheated!!! and pointed the gun at ' +' '+ russian.username(dqGuy)+' ' + ' and pulled the trigger and nothing happened! oh well, maybe next time!' + russian.username(dqGuy) +' ' + 'glared at' + russian.username(coolguy) + ' ' + ' for trying to get their jordans messy!</b>');
					    if (config.russianstandard == true){
			poe = spin.shift(); spin.push(poe);}
			russian[room.id].revolver = spin;
	        var r = russian[room.id].round;
			var c = r.length;
		    if (r.length == c) russian.nextRound(room.id);
			user.canttarget = true;
		return this.sendReply('better not try that again!');

			} 	

		} else { return this.sendReply(' better not try that again!');
		}
			}}
			else {
			return this.sendReply("its not your turn dummy!!!!!");
			}
		 }
			else {
				return this.sendReply("You're not in the game dummy!!!!!.");
			}
	
	},
    spin: function(target, room, user, connection) {
	this.sendReply(room.id);
	var index = russian[room.id].players.indexOf(user.userid);
	if (index !== -1) {
	canspin = false;
					for (var i in russian) {
			var c = russian[i];
			if (c.status == 2) {
				for (var x in c.round) {
					if (c.round[x] === undefined) continue;
					if (user.userid == c.round[x][0] && 'bob' == c.round[x][1]) {
					canspin = true;
					}}}}

if (config.russianmultispin == true){
      if (canspin == true){

		 if (user.spin <= 3){
		 var spin = russian[room.id].revolver;
		 russian.shuffle(spin);
		 	  user.spin += 1;
   			russian[room.id].revolver = spin;
			canspin = false;
			return this.sendReply(' youve spun ' + ' ' + user.spin + ' ' + 'times');
			}
		 else return this.sendReply(' youve spun too many times. just shoot');
			}
			
		else return this.sendReply(' its not even your turn');}
		else return this.sendReply(' settings does not allow this. just shoot!');}
		else return this.sendReply(' you arent even in this game!');
},


	russians: function(target, room, user, connection) {
		if (!this.canBroadcast()) return;
		var oghtml = "<hr /><h2>russiannaments In Their Signup Phase:</h2>";
		var html = oghtml;
		for (var i in russian) {
			var c = russian[i];
			if (typeof c == "object") {
				if (c.status == 1) html += '<button name="joinRoom" value="' + i + '">' + Rooms.rooms[i].title + ' - ' + Tools.data.Formats[c.tier].name + '</button> ';
			}
		}
		if (html == oghtml) html += "There are currently no russiannaments in their signup phase.";
		this.sendReply('|raw|' + html + "<hr />");
	},

	



	russiansettings: function(target, room, user) {
		if (!russian.maxauth(user)) return this.sendReply('You do not have enough authority to use this command.');
		if (target === 'replace on') return config.russianunlimitreplace = true;
		if (target === 'replace off') return config.russianunlimitreplace = false;
		if (target === 'alts on') return config.russianallowalts = true;
		if (target === 'alts off') return config.russianallowalts = false;
		if (target === 'dq on') return config.russiandqguard = false;
		if (target === 'dq off') return config.russiandqguard = true;
		if (target === 'multispin') { config.russianstandard = false; config.russianmultispin = true; config.russianspin = false; return;} //multiple spins COMPLETE
		if (target === '1917')  return config.russian1917 = true;
        if (target === '1917 off') return config.russian1917 = false;		//1 empty chamber rest bulleetz
		if (target === 'special')  { config.russianspecial = true; config.russiansmith = false; config.russiannagant = false; config.russianwebley = false;  config.russianlemat = false; return;}            //charter .38 special snubnose undercover
		if (target === 'smith') { config.russiansmith = true; config.russianspecial = false; config.russiannagant = false; config.russianwebley = false; config.russianlemat = false; return;} //Smith & Wesson model 3- 6 shot
		if (target === 'nagant') {config.russiannagant = true; config.russianspecial = false; config.russiansmith = false; config.russianwebley = false;  config.russianlemat = false; return;}    //Model 1895 Nagant 7 shot 
		if (target === 'webley') {config.russianwebley = true; config.russiansmith = false; config.russiannagant = false; config.russianspecial = false;  config.russianlemat = false; return;}//Webley-Fosbery Self-Cocking Automatic .38 Revolver  8 shot
		if (target === 'lemat') {config.russianlemat = true; config.russianspecial = false; config.russiansmith = false; config.russiannagant = false;  config.russianwebley = false; return;}//LeMat Pinfire Revolver 9 shot,1 shotgun 
		if (target === 'standard') { config.russianstandard = true; config.russianmultispin = false; config.russianspin = false; return;} //only spin once until someone dieded
		if (target === 'onespin')  { config.russianstandard = false; config.russianmultispin = false; config.russianspin = true; return;} // only spin once per turn automatically COMPLETE
		// if (target === 'bullets') { 1234};
		if ((target.substr(0,6) === 'margin') && !isNaN(parseInt(target.substr(7))) && parseInt(target.substr(7)) >= 0) return config.russiantimemargin = parseInt(target.substr(7));
		if ((target.substr(0,6) === 'period') && !isNaN(parseInt(target.substr(7))) && parseInt(target.substr(7)) > 0) return config.russiantimeperiod = parseInt(target.substr(7));
		if (target.substr(0,7) === 'lowauth' && config.groupsranking.indexOf(target.substr(8,1)) != -1) return config.russianlowauth = target.substr(8,1);
		if (target.substr(0,7) === 'midauth' && config.groupsranking.indexOf(target.substr(8,1)) != -1) return config.russianmidauth = target.substr(8,1);
		if (target.substr(0,8) === 'highauth' && config.groupsranking.indexOf(target.substr(9,1)) != -1) return config.russianhighauth = target.substr(9,1);
		if (target === 'view' || target === 'show' || target === 'display') {
			var msg = '';
			msg = msg + 'Can players be replaced after the first round? ' + new Boolean(config.russianunlimitreplace) + '.<br>';
			msg = msg + 'Are alts allowed to join to the same russiannament? ' + new Boolean(config.russianallowalts) + '.<br>';
			msg = msg + 'Which minimal rank is required in order to use basic level russiannament commands? ' + (!config.russianlowauth ? '+' : (config.russianlowauth === ' ' ? 'None' : config.russianlowauth)) + '.<br>';
			msg = msg + 'Which minimal rank is required in order to use middle level russiannament commands? ' + (!config.russianmidauth ? '+' : (config.russianmidauth === ' ' ? 'None, which is not recommended' : config.russianmidauth)) + '.<br>';
			msg = msg + 'Which minimal rank is required in order to use high level russiannament commands? ' + (!config.russianhighauth ? '@' : (config.russianhighauth === ' ' ? 'None, which is highly not recommended' : config.russianhighauth)) + '.<br>';
			msg = msg + 'In russiannaments with timed register phase, the players joined are logged individually until ' + (isNaN(config.russiantimemargin) ? 3 : config.russiantimemargin) + ' players have joined.<br>';
			msg = msg + 'In russiannaments with timed register phase, the players joined are logged in groups of ' + (isNaN(config.russiantimemargin) ? 4 : config.russiantimeperiod) + ' players.';
			return this.sendReplyBox(msg);
		}
		return this.sendReply('Valid targets are: view, replace on/off, alts on/off, invalidate on/off, dq on/off, highauth/midauth/lowauth SYMBOL, margin NUMBER, period NUMBER');
	},

	russiandoc: function() {
		if (!this.canBroadcast()) return;
		this.sendReplyBox("Click <a href='http://elloworld.dyndns.org/documentation.html'>here</a> to be taken to the documentation for the russiannament commands.");
	},

	survey: 'poll',
	poll: function(target, room, user) {
		if (!russian.lowauth(user,room)) return this.sendReply('You do not have enough authority to use this command.');
		if (russian[room.id].question) return this.sendReply('There is currently a poll going on already.');
		var separacion = "&nbsp;&nbsp;";
		var answers = russian.splint(target);
		if (answers.length < 3) return this.sendReply('Correct syntax for this command is /poll question, option, option...');
		var question = answers[0];
		answers.splice(0, 1);
		var answers = answers.join(',').toLowerCase().split(',');
		russian[room.id].question = question;
		russian[room.id].answerList = answers;
		russian[room.id].usergroup = config.groupsranking.indexOf(user.group);
		room.addRaw('<div class="infobox"><h2>' + russian[room.id].question + separacion + '<font size=2 color = "#939393"><small>/vote OPTION<br /><i><font size=1>Poll started by '+user.name+'</font size></i></small></font></h2><hr />' + separacion + separacion + " &bull; " + russian[room.id].answerList.join(' &bull; ') + '</div>');
	},

	vote: function(target, room, user) {
		var ips = JSON.stringify(user.ips);
		if (!russian[room.id].question) return this.sendReply('There is no poll currently going on in this room.');
		if (!target) return this.parse('/help vote');
		if (russian[room.id].answerList.indexOf(target.toLowerCase()) == -1) return this.sendReply('\'' + target + '\' is not an option for the current poll.');
		russian[room.id].answers[ips] = target.toLowerCase();
		return this.sendReply('You are now voting for ' + target + '.');
	},

	votes: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('NUMBER OF VOTES: ' + Object.keys(russian[room.id].answers).length);
	},

	endsurvey: 'endpoll',
	ep: 'endpoll',
	endpoll: function(target, room, user) {
		if (!russian.lowauth(user,room)) return this.sendReply('You do not have enough authority to use this command.');
		if (!russian[room.id].question) return this.sendReply('There is no poll to end in this room.');
		if (russian[room.id].usergroup > config.groupsranking.indexOf(user.group)) return this.sendReply('You cannot end this poll as it was started by a user of higher auth than you.');
		var votes = Object.keys(russian[room.id].answers).length;
		if (votes == 0) {
			russian[room.id].question = undefined;
			russian[room.id].answerList = new Array();
			russian[room.id].answers = new Object();
			return room.addRaw("<h3>The poll was cancelled because of lack of voters.</h3>");			
		}
		var options = new Object();
		var obj = russian[room.id];
		for (var i in obj.answerList) options[obj.answerList[i]] = 0;
		for (var i in obj.answers) options[obj.answers[i]]++;
		var sortable = new Array();
		for (var i in options) sortable.push([i, options[i]]);
		sortable.sort(function(a, b) {return a[1] - b[1]});
		var html = "";
		for (var i = sortable.length - 1; i > -1; i--) {
			console.log(i);
			var option = sortable[i][0];
			var value = sortable[i][1];
			html += "&bull; " + option + " - " + Math.floor(value / votes * 100) + "% (" + value + ")<br />";
		}
		room.addRaw('<div class="infobox"><h2>Results to "' + obj.question + '"<br /><i><font size=1 color = "#939393">Poll ended by '+user.name+'</font></i></h2><hr />' + html + '</div>');		russian[room.id].question = undefined;
		russian[room.id].answerList = new Array();
		russian[room.id].answers = new Object();
	},

	pollremind: 'pr',
	pr: function(target, room, user) {
		var separacion = "&nbsp;&nbsp;";
		if (!russian[room.id].question) return this.sendReply('There is currently no poll going on.');
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<div class="infobox"><h2>' + russian[room.id].question + separacion + '<font font size=1 color = "#939393"><small>/vote OPTION</small></font></h2><hr />' + separacion + separacion + " &bull; " + russian[room.id].answerList.join(' &bull; ') + '</div>');
	}
};

for (var i in cmds) CommandParser.commands[i] = cmds[i];

