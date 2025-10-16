# ---- Build stage: compile TypeScript ----
FROM node:20-alpine AS builder

WORKDIR /app

# Ensure yarn is available and locked installs are used
RUN corepack enable

# Only install dependencies first for better layer caching
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and tsconfig, then build
COPY tsconfig.json ./
COPY src ./src

RUN yarn tsc


# ---- Production stage: minimal runtime image ----
FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

RUN corepack enable

# Install only production dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Railway provides PORT; default to 5001 for local use
ENV PORT=5001
EXPOSE 5001

CMD ["node", "dist/index.js"]


