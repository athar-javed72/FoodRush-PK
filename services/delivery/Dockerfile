FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -w @foodie/shared
RUN npm run build -w services-delivery
ENV NODE_ENV=production
EXPOSE 4006
WORKDIR /app/services/delivery
CMD ["node", "dist/index.js"]
