const Discord = require('discord.js');
const {
	token,
} = require('./config.json');
const ytdl = require('ytdl-core');

const client = new Discord.Client();
const queue = new Map();




/*											*\
				Start up/down?
\*											*/
client.once('ready', () => {
	console.log("Connected as " + client.user.tag+ "\tReady to go!");
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});


/*											*\
				Catch message
\*											*/
client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.content.startsWith("!")) {
		if (message.content.replace("!","").includes(client.user.toString())) {
			message.channel.send("Don't @ me");
		}
		return;
	}

	const serverQueue = queue.get(message.guild.id);

	var a = message.content.split(" ");
	switch(a[0].toLowerCase()){
		case "!roll":
			dice(message,a)
			return;
	//	case "!play":
			execute(message, serverQueue);
			return;
	//	case "!skip":
			skip(message, serverQueue);
			return;
	//	case "!stop":
			stop(message, serverQueue);
			return;
	}
});

async function execute(message, serverQueue) {
	const args = message.content.split(' ');

	const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send('I need the permissions to join and speak in your voice channel!');
	}
	const songInfo = await ytdl.getInfo(args[1]);
	const song = {
		title: songInfo.title,
		url: songInfo.video_url,
	};

	if (!serverQueue) {
		// Creating the contract for our queue
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
		};
		// Setting the queue using our contract
		queue.set(message.guild.id, queueContruct);
		// Pushing the song to our songs array
		queueContruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;
			play(message.guild, queueContruct.songs[0]);
		} catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		return message.channel.send(`${song.title} has been added to the queue!`);
	}

}

function skip(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');
	serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', () => {
			console.log('Music ended!');
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}






/*											*\
					dicy
\*											*/
function dice(receivedMessage){
	const a = message.content.split(' ');

	var out =receivedMessage.author.toString();
	if(a.length==1){
		receivedMessage.channel.send("Tide!");
		return;
	}
	if(a[1].toUpperCase()=="TIDE"||a[1].toUpperCase()=="TIDE!"){
		receivedMessage.channel.send("Roll Tide!");
		return;
	}
	if(a.length>2){
		//receivedMessage.channel.send(out+ " Not a number!");
		return;
	}
	var num =a[1].split(/[dD]/);
	var max = num[0];
	//nan
	if(isNaN(max)||max%1!=0||num.length>2||max>999999){
		//receivedMessage.channel.send(out+ " Not a number!");
		return;
	}
	//single number
	if(num.length==1){
		receivedMessage.channel.send(out+" "+ roll(max));
		return;
	}
	//nan 2
	var count=max;
	if(count==''){
		count=1;
	}
	max=num[1]
	if(isNaN(max)||max%1!=0||max<1||count<1||max>999999||count>100){
		//receivedMessage.channel.send(out+ " Not a number!");
		return;
	}		
	//split 5d6
	var total=0;
	for(var i=0; i<count;i++){
		var mine=roll(max);
		total+=mine;
		out+= " "+mine;
	}
	if(count!=1){
		out+="\nTotal: "+total;
	}
	receivedMessage.channel.send(out);
}

//they haten 
function roll(max){
	return Math.floor(Math.random() * Math.floor(max))+1;
}




client.login(token);