# 1. Base Image: Node 20 on Alpine Linux (Lightweight)
FROM node:20-alpine

# 2. Set Working Directory
WORKDIR /app

# 3. Install Dependencies
# Copy package.json and lockfile first to leverage Docker caching.
COPY package.json package-lock.json ./

# Use 'npm ci' for deterministic builds
RUN npm ci

# 4. Copy Source Code
COPY . .

# 5. Expose Port 8080 (Updated from 5173)
EXPOSE 8080

# 6. Default Command
# We pass '--host' to ensure Vite listens on 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host"]