FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -w @foodie/shared
RUN npm run build -w services-admin
ENV NODE_ENV=production
EXPOSE 4007
WORKDIR /app/services/admin
CMD ["node", "dist/index.js"]
