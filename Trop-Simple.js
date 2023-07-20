const { Client, Intents } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

const token = 'YOUR_BOT_TOKEN';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.guild) return;

  if (message.content === '!join') {
    const memberChannel = message.member.voice.channel;
    if (!memberChannel) {
      return message.reply("You must be in a voice channel to use this command.");
    }

    const connection = joinVoiceChannel({
      channelId: memberChannel.id,
      guildId: memberChannel.guild.id,
      adapterCreator: memberChannel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    connection.subscribe(player);

    const resource = createAudioResource('path_to_your_audio_file.mp3', {
      inputType: StreamType.Arbitrary,
    });

    player.play(resource);

    player.on('error', (error) => {
      console.error('Error:', error.message);
    });

    player.on('stateChange', (oldState, newState) => {
      if (newState.status === 'idle') {
        connection.destroy();
      }
    });
  }
});

client.login(token);
