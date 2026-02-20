FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -w @foodie/shared
RUN npm run build -w services-order
ENV NODE_ENV=production
EXPOSE 4004
WORKDIR /app/services/order
CMD ["node", "dist/index.js"]
