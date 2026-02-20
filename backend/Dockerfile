FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

# Copia arquivos de dependências primeiro para aproveitar o cache de camadas
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run generate

RUN npm run build

FROM node:20-alpine AS runner

RUN apk add --no-cache openssl
WORKDIR /app

# Define variável de ambiente para produção
ENV NODE_ENV=production

# Copia apenas o necessário do estágio de build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 8080

CMD ["npm", "start"]
