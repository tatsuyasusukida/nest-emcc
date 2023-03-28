FROM emscripten/emsdk as builder

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM emscripten/emsdk as runner

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY --from=builder /usr/src/app/dist ./dist
ENV PORT="3000"
ENV CORS_ORIGIN="http://example.com"
CMD [ "node", "dist/main" ]
