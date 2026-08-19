# Dockerfile for Socio Production Server (Growth OS + Hermes / DSH Web Layer)
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Ensure outputs directory for persistence
RUN mkdir -p outputs

ENV NODE_ENV=production
ENV PORT=3030
ENV WEBHOOK_SECRET=""
ENV SOCIO_HERMES_PROFILE="socio-support"

EXPOSE 3030

CMD ["node", "server.js"]
