# --- Stage 1: Base ---
FROM node:20-alpine as base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# --- Stage 2: Build ---
FROM base as build-stage

# Catch the build argument
ARG VITE_API_URL
# Set it as an environment variable for the build process
ENV VITE_API_URL=$VITE_API_URL

# Build (Vite will read the env var here)
RUN npx vite build

# --- Stage 3: Production ---
FROM nginx:stable-alpine as production-stage

# 1. Copy the built React files
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 2. COPY THE CUSTOM NGINX CONFIG (This fixes the 404 routing issue)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]