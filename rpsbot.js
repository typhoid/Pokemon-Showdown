/// beta of poketariat's rock paper scissors bot.
/// still a lot left to add if you want to use it.
/// made by typhoid lel


	var cmds = {	

rps: function(target, room, user, connections) {

	
		
 if (target === 'start') {
         if (!user.started) {
		this.sendReply('Okay, lets play! choose your move! /rps rock /rps paper /rps scissors ! can you beat the server?');
		user.started = true;
		//resets object properties
	   user.lastused = 'none';
user.turn = 0;
user.userscore = 0;
user.botscore = 0;
user.ties = 0;
user.same = 0;
user.action = 'none';
user.bot = 'none';
	}
	else this.sendReply(' youve already started a game! finish it first!')
	}
	
	if (target === 'rock') {
        if (!user.started)	{	
	this.sendReply('There is no started game!');
}
else if (user.lastused === 'none'){
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
	else if (user.lastused === 'rock'){
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
   else if (user.lastused === 'paper'){
	var myArray = ['rock', 'paper', 'scissors', 'scissors'];    
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
	
  else if (user.lastused === 'scissors'){
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
	}
	if (target === 'paper')
	{ if (!user.started){ return this.sendReply('There is no game started!');
	}
else if (user.lastused === 'none'){
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
	else if (user.lastused === 'rock'){
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
   else if (user.lastused === 'paper'){
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
	
  else if (user.lastused === 'scissors'){
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
	}
	if (target === 'scissors') { if (!user.started) { return this.sendReply('There is no game started!');
	}
	
else if (user.lastused === 'none'){
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
	else if (user.lastused === 'rock'){
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
   else if (user.lastused === 'paper'){
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
	
  else if (user.lastused === 'scissors'){
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
	if (target === 'help')
	{ 
	return this.sendReply('type /rps start to start a game! type /rps rock /rps scissors or /rps paper to make a move!');
	}
	}
	};
	for (var i in cmds) CommandParser.commands[i] = cmds[i];
