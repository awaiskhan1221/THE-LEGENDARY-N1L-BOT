# 🌟 LEGENDARY WHATSAPP BOT DOCKERFILE
# Developed & Maintained by 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋

FROM node:18

# 📁 Create App Directory
WORKDIR /root/𝚴𝚯𝚻-𝐔𝚪-𝚴𝚰𝐋

# 📦 Clone Bot Source Code
RUN git clone https://github.com/YourUsername/YourBotRepo.git .

# 🔧 Install Dependencies
RUN yarn install --network-concurrency 1

# 🚀 Launch the Bot
CMD ["npm", "start"]
