# Stage 1: Building the code
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the built application
FROM node:18-alpine AS runner

WORKDIR /app

# Copy necessary files from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

# Run the application
CMD ["npm", "start"]
