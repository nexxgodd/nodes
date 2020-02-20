const { Util } = require("discord.js");
//const ytdl = require("ytdl-core");

module.exports = {
	name: "roll",
	description: "Roll some dice!",
	async execute(receivedMessage){
		const a = receivedMessage.content.split(' ');

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
	},

	//they haten 
	roll(max){
		return Math.floor(Math.random() * Math.floor(max))+1;
	}
};
