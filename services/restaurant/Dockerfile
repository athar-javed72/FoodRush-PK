FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -w @foodie/shared
RUN npm run build -w services-restaurant
ENV NODE_ENV=production
EXPOSE 4003
WORKDIR /app/services/restaurant
CMD ["node", "dist/index.js"]
