# Estágio 1: Base de dependências
FROM node:20-alpine AS deps
# Adição de libc6-compat para compatibilidade com binários do Next.js em Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
# Instalação limpa para garantir reprodutibilidade no CI/CD
RUN npm ci

# Estágio 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desabilita telemetria para acelerar o build no pipeline
ENV NEXT_TELEMETRY_DISABLED=1

# Executa o build (requer 'output: standalone' no next.config.js)
RUN npm run build

# Estágio 3: Runner (Imagem Final de Produção)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Configuração de Segurança: Usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Prepara diretório de cache do Next.js com permissões corretas
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copia apenas os arquivos necessários do build standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Inicialização otimizada
CMD ["node", "server.js"]