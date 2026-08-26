FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
COPY apps/backend/package.json ./package.json
COPY apps/backend/src ./src
EXPOSE 4000
CMD ["node", "src/server.mjs"]
