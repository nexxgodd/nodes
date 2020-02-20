const fs = require('fs')

module.exports = {
	name: 'operation-sad-badger',
	description: 'Initiate Operation Sad Badger',
	execute(message) {
		message.channel.send("The D.E.N. is active!");
	},
};