const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { IMGUR_KEY } = process.env;

module.exports = class ImgurCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'imgur',
			aliases: ['imgur-image'],
			group: 'search',
			memberName: 'imgur',
			description: 'Searches Imgur for your query.',
			args: [
				{
					key: 'query',
					prompt: 'What image would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch
				.get('https://api.imgur.com/3/gallery/search')
				.query({ q: query })
				.set({ Authorization: `Client-ID ${IMGUR_KEY}` });
			const images = msg.channel.nsfw ? body.data : body.data.filter(image => !image.nsfw);
			if (!images.length) return msg.say('Could not find any results.');
			return msg.say(images[Math.floor(Math.random() * images.length)].images[0].link);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
