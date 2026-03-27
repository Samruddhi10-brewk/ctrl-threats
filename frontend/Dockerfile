# =========================
# Stage 1: Build (local artifacts only)
# =========================
FROM node:18 AS builder
 
WORKDIR /app
 
# Copy already built files from local
# (IMPORTANT: run npm run build locally first)
COPY dist ./dist
 
# Copy static files
COPY robots.txt ./dist/robots.txt
COPY sitemap.xml ./dist/sitemap.xml
 
 
# =========================
# Stage 2: Production (Nginx)
# =========================
FROM nginx:alpine AS runner
 
# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*
 
# Copy build from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html


 
# Expose port
EXPOSE 80
 
# Start nginx
CMD ["nginx", "-g", "daemon off;"]