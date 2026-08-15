FROM node:22-alpine

RUN addgroup -g 1001 -S app && adduser -g app -S app -u 1001 -G app

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src

USER app

ENV NODE_ENV=production
ENV PORT=7000

EXPOSE 7000

HEALTHCHECK --interval=30s --timeout=5s --start-period=8s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||7000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/index.js"]
