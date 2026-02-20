FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -w @foodie/shared
RUN npm run build -w services-user
ENV NODE_ENV=production
EXPOSE 4002
WORKDIR /app/services/user
CMD ["node", "dist/index.js"]
