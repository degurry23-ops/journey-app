FROM node:22-alpine

WORKDIR /app

# Copy server files
COPY server/package.json server/package-lock.json ./
RUN npm install --production

# Copy everything
COPY server/ ./
COPY *.html *.css *.js ./
COPY pages/ pages/
COPY components/ components/

ENV PUBLIC_DIR=.
ENV PORT=3001

EXPOSE 3001

CMD ["node", "index.js"]
