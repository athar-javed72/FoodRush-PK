FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -w @foodie/shared
RUN npm run build -w services-notification
ENV NODE_ENV=production
EXPOSE 4008
WORKDIR /app/services/notification
CMD ["node", "dist/index.js"]
