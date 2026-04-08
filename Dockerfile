FROM oven/bun:alpine
WORKDIR /app
COPY package.json ./
COPY . .
RUN bun install && \
    bun run build && \
    bun cache clean --force && \
    rm -rf node_modules
EXPOSE 3000
CMD ["bun", "build/index.js"]
