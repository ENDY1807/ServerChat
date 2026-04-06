const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const TOKEN = "TOKEN_BOT_LO"; // isi token
const VERIFY_CHANNEL_ID = "CHANNEL_VERIF_LO"; // channel #verifikasi
const API_URL = "http://localhost:3000/verify"; // nanti kita sambung ke plugin

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Bot nyala: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== VERIFY_CHANNEL_ID) return;

    const code = message.content.trim();

    // hanya angka
    if (!/^\d{4,8}$/.test(code)) return;

    try {
        const res = await axios.post(API_URL, {
            code: code,
            discordId: message.author.id,
            username: message.author.username
        });

        if (res.data.success) {
            message.reply("✅ Verifikasi berhasil! Balik ke Minecraft & rejoin.");
        } else {
            message.reply("❌ Kode tidak valid / sudah expired.");
        }

    } catch (err) {
        console.error(err);
        message.reply("⚠️ Error ke server Minecraft.");
    }
});

client.login(TOKEN);
