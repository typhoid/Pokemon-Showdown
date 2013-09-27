///  poketariat's rock paper scissors bot.
/// still a lot left to add if you want to use it for showdown.
///  this could be made 100% betterr and 80% smaller by a better programmer than i.
/// made by typhoid lel

exports.rps = function(r) {
if (typeof r != "undefined") var rps = r; else var rps = new Object();
	var rpsFunctions = {
//failure failure failure failure failure
	win: function(user, room, connections)
		{Rooms.rooms[i].addRaw("<h3>oh no! youve defeated me!!!! take your bunnies and leave me alone</h3>");
   user.started = false;
   return this.add( user.name + ' has defeated the server at rock paper scissors!');

},
lose: function(user, room, connections)
	{Rooms.rooms[i].addRaw(" hueheuheuhue you thought you could defeat the combined might of the Poketariat!? Think again!");
user.started = false;
return Rooms.rooms[i].addRaw( user.name + ' has lost to the server, not that anyones suprised!');	
}
};
	
	for (var i in rpsFunctions) {
		rps[i] = rpsFunctions[i];
	}
		for (var i in Rooms.rooms) {
		if (Rooms.rooms[i].type == "chat" && !rps[i]) {
			rps[i] = new Object(); } }
	return rps;
	};
	var cmds = {	

rps: function(target, room, user, connections) {

		
 if (target === 'start') {
 
  if (!user.canpayout){
				var lore = fs.readFileSync('config/coins.csv','utf8')
        var match = false;
        var coins = 0;
        var spag = (''+lore).split("\n");
        var hetti = '';
        for (var i = spag.length; i > -1; i--) {
            if (!spag[i]) continue;
            var parts = spag[i].split(",");
            var userid = toUserid(parts[0]);
		    if (user.userid == userid) {
            var y = Number(parts[1]);
            var coins = y;
            match = true;
            if (match === true) {
                hetti = hetti + spag[i];
                 break;
            }
            }
        }
		user.coins = coins; 
         var price = 1;
  		    if (price <= user.coins) {

         if (!user.started) {
		this.sendReply('Okay, lets play! choose your move! /rps rock /rps paper /rps scissors ! can you beat the server?');
		//starts game
		user.started = true;
		//pays the troll a toll
		user.coins = user.coins - price;
		//resets object properties
	   user.lastused = 'none';
user.turn = 0;
user.userscore = 0;
user.botscore = 0;
user.ties = 0;
user.same = 0;
user.action = 'none';
user.bot = 'none';
goodgame = 2;
			if (match === true) {
            var be = new RegExp(hetti,"g");
            fs.readFile('config/coins.csv', 'utf8', function (err,lore) {
             if (err) {
                 return console.log(err);
            }
            var result = lore.replace(be, user.userid+','+user.coins);
            fs.writeFile('config/coins.csv', result, 'utf8', function (err) {
                if (err) return console.log(err);
            });
            });
	    }
	}
	else this.sendReply(' youve already started a game! finish it first!');
	}
	else this.sendReply('you do not have enough dust bunnies to pay the game! it costs 1 bunny');
	}
	else this.sendReply(' collect your winnings  first!' );
	}
	
	if (target === 'rock')
		{ if (!user.started){ return this.sendReply('There is no game started!');
	}
	if (user.userscore < goodgame)	
{ if (user.botscore < goodgame)
{
 if (user.lastused === 'none'){
var myArray = ['rock', 'paper', 'scissors'];    
var rand = myArray[Math.floor(Math.random() * myArray.length)];
   user.bot = rand
   if (user.bot === 'rock') {
   user.outcome = 1;
   user.ties = user.ties + user.outcome;
   user.lastused = 'rock';
   return this.sendReply('server used rock! its a tie!' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);} 
   if (user.bot === 'paper') {
user.outcome = 1;
user.botscore = user.botscore + user.outcome;
user.lastused = 'rock';
return this.sendReply('Server used paper! you lose!' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
if (user.bot === 'scissors') {
user.outcome = 1;
user.userscore = user.userscore + user.outcome;
user.lastused = 'rock';
return this.sendReply('Server used scissors! you win!' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
	}
	 if (user.lastused === 'rock'){
	var myArray = ['rock', 'paper', 'scissors', 'paper', 'rock', 'paper'];    
var rand = myArray[Math.floor(Math.random() * myArray.length)];
   user.bot = rand
    if (user.bot === 'rock') {
	user.outcome = 1;
   user.ties = user.ties + user.outcome;
   user.lastused = 'rock';
   return this.sendReply('server used rock! its a tie!spaghetti' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
   if (user.bot === 'paper') {
   user.outcome = 1;
user.botscore = user.botscore + user.outcome;
user.lastused = 'rock';
return this.sendReply('Server used paper! you lose!spaghetti' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
if (user.bot === 'scissors') {
user.outcome = 1;
user.userscore = user.userscore + user.outcome;
user.lastused = 'rock';
return this.sendReply('Server used scissors! you win!spaghetti' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}

	}
   if (user.lastused === 'paper'){
	var myArray = ['rock', 'paper', 'scissors', 'scissors', 'scissors', 'paper'];    
var rand = myArray[Math.floor(Math.random() * myArray.length)];
   user.bot = rand
    if (user.bot === 'rock') {
	user.outcome = 1;
   user.ties = user.ties + user.outcome;
   user.lastused = 'rock';
   return this.sendReply('server used rock! its a tie!pasta' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
   if (user.bot === 'paper') {
user.outcome = 1;
user.botscore = user.botscore + user.outcome;
user.lastused = 'rock';
return this.sendReply('Server used paper! you lose!pasta' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
if (user.bot === 'scissors') {
user.outcome = 1;
user.userscore = user.userscore + user.outcome;
user.lastused = 'rock';
return this.sendReply('Server used scissors! you win!pasta' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
}
	
  if (user.lastused === 'scissors'){
	var myArray = ['rock', 'paper', 'scissors', 'rock'];    
var rand = myArray[Math.floor(Math.random() * myArray.length)];
   user.bot = rand
   if (user.bot === 'rock') {
  user.outcome = 1;
   user.ties = user.ties + user.outcome;
   user.lastused = 'rock';
   return this.sendReply('server used rock! its a tie!chow' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
   if (user.bot === 'paper') {
user.outcome = 1;
user.botscore = user.botscore + user.outcome;
user.lastused = 'rock';
return this.sendReply('Server used paper! you lose!chow' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
if (user.bot === 'scissors') {
user.outcome = 1;
user.userscore = user.userscore + user.outcome;
user.lastused = 'rock';
return this.sendReply('Server used scissors! you win!chow' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
	}

	}goodgame = 2;
 if (goodgame <= user.botscore){  
 this.sendReply(' hueheuheuhue you thought you could defeat the combined might of the Poketariat!? Think again!');
user.started = false;
return this.add( user.name + ' has lost to the server, not that anyones suprised!');
	}}goodgame = 2;
 if (goodgame <= user.userscore) 
{this.sendReply(' oh no! youve defeated me!!!! type /payout to take your bunnies and leave me alone :( ');
   user.canpayout = true;
   user.started = false;
   return this.add( user.name + ' has defeated the server at rock paper scissors!');
}
	}	
	if (target === 'paper')
	{ if (!user.started){ return this.sendReply('There is no game started!');
	}
	if (user.userscore < goodgame)	
{ if (user.botscore < goodgame)
{
 if (user.lastused === 'none'){
var myArray = ['rock', 'paper', 'scissors'];    
var rand = myArray[Math.floor(Math.random() * myArray.length)];
   user.bot = rand
   if (user.bot === 'paper') {
   user.outcome = 1;
   user.ties = user.ties + user.outcome;
   user.lastused = 'paper';
   return this.sendReply('server used paper! its a tie!' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);} 
   if (user.bot === 'scissors') {
user.outcome = 1;
user.botscore = user.botscore + user.outcome;
user.lastused = 'paper';
return this.sendReply('Server used scissors! you lose!' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
if (user.bot === 'rock') {
user.outcome = 1;
user.userscore = user.userscore + user.outcome;
user.lastused = 'paper';
return this.sendReply('Server used rock! you win!' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}

	}
	 if (user.lastused === 'rock'){
	var myArray = ['rock', 'paper', 'scissors', 'paper'];    
var rand = myArray[Math.floor(Math.random() * myArray.length)];
   user.bot = rand
    if (user.bot === 'paper') {
	user.outcome = 1;
   user.ties = user.ties + user.outcome;
   user.lastused = 'paper';
   return this.sendReply('server used paper! its a tie!spaghetti' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
   if (user.bot === 'scissors') {
   user.outcome = 1;
user.botscore = user.botscore + user.outcome;
user.lastused = 'paper';
return this.sendReply('Server used scissors! you lose!spaghetti' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
if (user.bot === 'rock') {
user.outcome = 1;
user.userscore = user.userscore + user.outcome;
user.lastused = 'paper';
return this.sendReply('Server used rock! you win!spaghetti' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}

	}
   if (user.lastused === 'paper'){
	var myArray = ['rock', 'paper', 'scissors', 'scissors', 'scissors', 'paper'];    
var rand = myArray[Math.floor(Math.random() * myArray.length)];
   user.bot = rand
    if (user.bot === 'paper') {
	user.outcome = 1;
   user.ties = user.ties + user.outcome;
   user.lastused = 'paper';
   return this.sendReply('server used paper! its a tie!pasta' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
   if (user.bot === 'scissors') {
user.outcome = 1;
user.botscore = user.botscore + user.outcome;
user.lastused = 'paper';
return this.sendReply('Server used scissors! you lose!pasta' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
if (user.bot === 'rock') {
user.outcome = 1;
user.userscore = user.userscore + user.outcome;
user.lastused = 'paper';
return this.sendReply('Server used rock! you win!pasta' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
	
	}
	
  if (user.lastused === 'scissors'){
	var myArray = ['rock', 'paper', 'scissors', 'rock'];    
var rand = myArray[Math.floor(Math.random() * myArray.length)];
   user.bot = rand
    if (user.bot === 'paper') {
  user.outcome = 1;
   user.ties = user.ties + user.outcome;
   user.lastused = 'paper';
   return this.sendReply('server used paper! its a tie!chow' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
   if (user.bot === 'scissors') {
user.outcome = 1;
user.botscore = user.botscore + user.outcome;
user.lastused = 'paper';
return this.sendReply('Server used scissors! you lose!chow' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
if (user.bot === 'rock') {
user.outcome = 1;
user.userscore = user.userscore + user.outcome;
user.lastused = 'paper';
return this.sendReply('Server used rock! you win!chow' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
	}

	}goodgame = 2;
 if (goodgame <= user.botscore){  
 this.sendReply(' hueheuheuhue you thought you could defeat the combined might of the Poketariat!? Think again!');
user.started = false;
return this.add( user.name + ' has lost to the server, not that anyones suprised!');
	}}goodgame = 2;
 if (goodgame <= user.userscore) 
{this.sendReply(' oh no! youve defeated me!!!! type /payout to take your bunnies and leave me alone :( ');
   user.canpayout = true;
   user.started = false;
   return this.add( user.name + ' has defeated the server at rock paper scissors!');
}
	}	
	if (target === 'scissors') 
	{ if (!user.started) { return this.sendReply('There is no game started!');}
		if (user.userscore < goodgame)	
{ if (user.botscore < goodgame)
	{
if (user.lastused === 'none'){
var myArray = ['rock', 'paper', 'scissors'];    
var rand = myArray[Math.floor(Math.random() * myArray.length)];
   user.bot = rand
   if (user.bot === 'scissors') {
   user.outcome = 1;
   user.ties = user.ties + user.outcome;
   user.lastused = 'scissors';
   return this.sendReply('server used scissors! its a tie!' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);} 
   if (user.bot === 'rock') {
user.outcome = 1;
user.botscore = user.botscore + user.outcome;
user.lastused = 'scissors';
return this.sendReply('Server used rock! you lose!' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
if (user.bot === 'paper') {
user.outcome = 1;
user.userscore = user.userscore + user.outcome;
user.lastused = 'scissors';
return this.sendReply('Server used paper! you win!' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
	
	}
	if (user.lastused === 'rock'){
	var myArray = ['rock', 'paper', 'scissors', 'paper'];    
var rand = myArray[Math.floor(Math.random() * myArray.length)];
   user.bot = rand
    if (user.bot === 'scissors') {
	user.outcome = 1;
   user.ties = user.ties + user.outcome;
   user.lastused = 'scissors';
   return this.sendReply('server used scissors! its a tie!spaghetti' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
   if (user.bot === 'rock') {
   user.outcome = 1;
user.botscore = user.botscore + user.outcome;
user.lastused = 'scissors';
return this.sendReply('Server used rock! you lose!spaghetti' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
if (user.bot === 'paper') {
user.outcome = 1;
user.userscore = user.userscore + user.outcome;
user.lastused = 'scissors';
return this.sendReply('Server used paper! you win!spaghetti' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
	
	}
   if (user.lastused === 'paper'){
	var myArray = ['rock', 'paper', 'scissors', 'scissors'];    
var rand = myArray[Math.floor(Math.random() * myArray.length)];
   user.bot = rand
    if (user.bot === 'scissors') {
	user.outcome = 1;
   user.ties = user.ties + user.outcome;
   user.lastused = 'scissors';
   return this.sendReply('server used scissors! its a tie!pasta' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
   if (user.bot === 'rock') {
user.outcome = 1;
user.botscore = user.botscore + user.outcome;
user.lastused = 'scissors';
return this.sendReply('Server used rock! you lose!pasta' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
if (user.bot === 'paper') {
user.outcome = 1;
user.userscore = user.userscore + user.outcome;
user.lastused = 'scissors';
return this.sendReply('Server used paper! you win!pasta' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
	
	}
	
  if (user.lastused === 'scissors'){
	var myArray = ['rock', 'paper', 'scissors', 'scissors', 'rock', 'scissors'];    
var rand = myArray[Math.floor(Math.random() * myArray.length)];
   user.bot = rand
    if (user.bot === 'scissors') {
  user.outcome = 1;
   user.ties = user.ties + user.outcome;
   user.lastused = 'scissors';
   return this.sendReply('server used scissors! its a tie!chow' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
   if (user.bot === 'rock') {
user.outcome = 1;
user.botscore = user.botscore + user.outcome;
user.lastused = 'scissors';
return this.sendReply('Server used rock! you lose!chow' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
if (user.bot === 'paper') {
user.outcome = 1;
user.userscore = user.userscore + user.outcome;
user.lastused = 'scissors';
return this.sendReply('Server used paper! you win!chow' + 'bot score:' + user.botscore + ' ' + user.name + ' ' + 'score:' + user.userscore + ' ' +  user.name + ' ' + 'ties:' + user.ties);}
	
	}

	}
	goodgame = 2;
 if (goodgame <= user.botscore){  
 this.sendReply(' hueheuheuhue you thought you could defeat the combined might of the Poketariat!? Think again!');
user.started = false;
return this.add( user.name + ' has lost to the server, not that anyones suprised!');
	}}
	goodgame = 2;
 if (goodgame <= user.userscore) 
{this.sendReply(' oh no! youve defeated me!!!! type /payout to take your bunnies and leave me alone :( ');
   user.canpayout = true;
   user.started = false;
   return this.add( user.name + ' has defeated the server at rock paper scissors!');
}
	}
	
	if (target === 'help')
	{ if (user.started === true)
	{ goodgame = 2;
	if (goodgame <= user.userscore)
	{ user.started = false;
	   user.canpayout = true;
 	 this.sendReply('oh no! youve defeated my spaghetti');
	 }
    if (goodgame <= user.botscore)
{ user.started = false;
this.sendReply(' lel you lost fag');
} }	
	return this.sendReply('type /rps start to start a game! type /rps rock /rps scissors or /rps paper to make a move!');
	}
		

if (user.started === true)
{		goodgame = 2;
if (goodgame <= user.userscore)	
{ this.sendReply(' oh no! youve defeated me!!!! type /payout to take your bunnies and leave me alone :( ');
   user.started = false;
   user.canpayout = true;
   return this.add( user.name + ' has defeated the server at rock paper scissors!');

}
if (goodgame <= user.botscore)
{ this.sendReply(' hueheuheuhue you thought you could defeat the combined might of the Poketariat!? Think again!');
user.started = false;
return this.add( user.name + ' has lost to the server, not that anyones suprised!');
}}
},
	
payout: function(target, room, user, connections)
	{ if (!user.canpayout)  return this.sendReply ('you havent won anything yet noob!');
	else  var lore = fs.readFileSync('config/coins.csv','utf8')
        var match = false;
        var coins = 0;
        var spag = (''+lore).split("\n");
        var hetti = '';
        for (var i = spag.length; i > -1; i--) {
            if (!spag[i]) continue;
            var parts = spag[i].split(",");
            var userid = toUserid(parts[0]);
		    if (user.userid == userid) {
            var y = Number(parts[1]);
            var coins = y;
            match = true;
            if (match === true) {
                hetti = hetti + spag[i];
                 break;
            }
            }
        }
		
		var payout = 3;
	user.coins = coins;
	user.coins =user.coins + payout;
  this.sendReply ('take your bunnies and leave');
				if (match === true) {
            var be = new RegExp(hetti,"g");
            fs.readFile('config/coins.csv', 'utf8', function (err,lore) {
             if (err) {
                 return console.log(err);
            }
            var result = lore.replace(be, user.userid+','+user.coins);
            fs.writeFile('config/coins.csv', result, 'utf8', function (err) {
                if (err) return console.log(err);
            });
            });
	    }  else {
					var log = fs.createWriteStream('config/coins.csv', {'flags': 'a'});
					log.write("\n"+user.userid+','+user.coins);
				}
		user.canpayout = false;

	}

	};
	for (var i in cmds) CommandParser.commands[i] = cmds[i];
