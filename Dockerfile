# マルチステージビルド
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 依存関係ファイルをコピー
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm ci --only=production

# ビルドステージ
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.jsアプリケーションをビルド
RUN npm run build

# 本番ステージ
FROM node:18-alpine AS runner
WORKDIR /app

# セキュリティのため非rootユーザーを作成
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 必要なファイルをコピー
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# 適切な権限を設定
RUN chown -R nextjs:nodejs /app
USER nextjs

# ポートを公開
EXPOSE 80

# 環境変数を設定
ENV PORT 80
ENV NODE_ENV production

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:80/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# アプリケーションを起動
CMD ["npm", "start"] 