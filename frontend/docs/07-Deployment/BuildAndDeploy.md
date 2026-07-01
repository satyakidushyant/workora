# Build & Deployment

The Angular frontend is built into static HTML/JS/CSS assets and served via an NGINX container.

## 1. Environment Variables
Angular's standard `environment.ts` files are compiled at build time. To support running a single Docker image across multiple environments (Dev, Staging, Prod), we use **Runtime Environment Injection**.

A `env.js` file is loaded in `index.html` before the Angular bundles. An entrypoint script in the Docker container replaces the values in `env.js` with actual OS environment variables before starting NGINX.

## 2. Dockerization
The `Dockerfile` utilizes a multi-stage build:

### Stage 1: Build
- Uses `node:20-alpine`.
- Runs `npm ci`.
- Runs `npm run build --configuration production`.

### Stage 2: Serve
- Uses `nginx:alpine`.
- Copies the `dist/workora-ui/browser` folder from Stage 1 to `/usr/share/nginx/html`.
- Replaces the default NGINX configuration to route all 404s to `index.html` to support Angular's HTML5 PushState routing.

## 3. Kubernetes / CDN
In production, the NGINX container is deployed to Kubernetes, and a CDN (like Cloudflare or AWS CloudFront) sits in front of it to cache static assets aggressively, improving load times globally.
