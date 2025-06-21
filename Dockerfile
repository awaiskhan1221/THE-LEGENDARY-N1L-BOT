# 🛠️ BASE: NodeJS lightweight image
FROM node:18

# 👑 Developer: 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋
LABEL author="𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋" \
      description="Legendary WhatsApp Bot container by 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋"

# 📁 Create bot directory
WORKDIR /app

# 🔽 Clone bot files directly (edit this repo with yours if needed)
RUN git clone https://github.com/YourUsername/YourRepoName.git . && \
    yarn install --network-concurrency 1

# ✅ Optional: install tools like ffmpeg if your bot needs them
RUN apt-get update && apt-get install -y ffmpeg imagemagick

# 🚀 Start the bot
CMD ["npm", "start"]
