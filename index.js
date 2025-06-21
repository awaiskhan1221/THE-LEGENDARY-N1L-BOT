/**
 * 🌟 LEGENDARY BOT ENTRY POINT
 * 🔰 Powered by: 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋
 */

const { client, config } = require("./lib/");

const start = async () => {
    try {
        // 🔌 Initialize DB connection
        await config.DATABASE.sync();

        // 🤖 Create client instance
        const Client = new client();

        // 🛠️ Start Services
        Client.log("🚀 Launching Legendary Bot...");
        await Client.startServer();
        await Client.WriteSession();
        await Client.WaConnect();

    } catch (error) {
        // 🛑 Error Handling
        console.error("🔥 Bot Crashed:", error);
    }
};

// ⏯️ Start Everything
start();
