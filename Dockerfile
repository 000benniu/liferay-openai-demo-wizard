# ビルドステージ
FROM node:18-alpine AS builder
# セキュリティのため非rootユーザーを作成
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# 依存関係ファイルをコピー
COPY package*.json ./
RUN npm ci

# アプリケーションファイルをコピー
COPY . .
RUN chown -R nextjs:nodejs /app

# Next.jsアプリケーションをビルド
RUN npm run build

# 本番ステージ
FROM node:18-alpine

WORKDIR /app

# 必要なファイルのみコピー
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 権限設定
RUN chown -R nextjs:nodejs /app
USER nextjs

# ポートを公開（必要に応じて変更）
EXPOSE 4020

# 環境変数
ENV PORT 4020
ENV NODE_ENV production

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4020/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# アプリケーションを起動
CMD ["npm", "start"]
