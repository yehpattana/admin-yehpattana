# Stage 1: Install dependencies and build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the built app
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
RUN npm install --production
CMD ["npm", "start"]
