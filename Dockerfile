# Stage 1: Build the Angular application
FROM node:18.17.1 as build
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build

# Stage 2: Serve the app with httpd (Apache)
FROM httpd:alpine3.15
COPY --from=build /app/dist/edocflow /usr/local/apache2/htdocs/
