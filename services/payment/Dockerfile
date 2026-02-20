FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -w @foodie/shared
RUN npm run build -w services-payment
ENV NODE_ENV=production
EXPOSE 4005
WORKDIR /app/services/payment
CMD ["node", "dist/index.js"]
