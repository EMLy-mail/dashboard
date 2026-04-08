FROM oven/bun:alpine
WORKDIR /app

# Build-time env vars required by SvelteKit's $env/static/private
ARG SERVER_URL
ARG API_KEY
ARG ADMIN_KEY
ENV SERVER_URL=$SERVER_URL \
    API_KEY=$API_KEY \
    ADMIN_KEY=$ADMIN_KEY

COPY package.json ./
COPY . .
RUN bun install && \
    bunx svelte-kit sync && \
    bun run build && \
    bun cache clean --force && \
    rm -rf node_modules
EXPOSE 3000
CMD ["bun", "build/index.js"]
