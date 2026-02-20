FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -w @foodie/shared
RUN npm run build -w services-auth
ENV NODE_ENV=production
EXPOSE 4001
WORKDIR /app/services/auth
CMD ["node", "dist/index.js"]
