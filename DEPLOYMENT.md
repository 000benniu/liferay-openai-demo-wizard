# Liferay Cloud デプロイメントガイド

このプロジェクトは Liferay Cloud にデプロイできるように構成されています。

## 前提条件

- Liferay Cloud アカウント
- Liferay CLI がインストールされている
- Docker がインストールされている

## デプロイメント手順

### 1. ローカルでのテスト

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# ビルドテスト
npm run build

# Docker イメージのビルドテスト
npm run docker:build
```

### 2. Liferay Cloud へのデプロイ

#### 方法1: Liferay CLI を使用

```bash
# Liferay CLI にログイン
lcp login

# プロジェクトを初期化（初回のみ）
lcp init

# デプロイ
lcp deploy
```

#### 方法2: GitHub との連携

1. このリポジトリを GitHub にプッシュ
2. Liferay Cloud コンソールで GitHub リポジトリを接続
3. 自動デプロイを設定

### 3. 環境変数の設定

Liferay Cloud コンソールで以下の環境変数を設定してください：

- `NODE_ENV`: `production`
- `PORT`: `80`
- その他必要な環境変数（API キーなど）

### 4. ヘルスチェック

デプロイ後、以下のエンドポイントでヘルスチェックが可能です：

```
GET /api/health
```

## ファイル構成

- `client-extension.yaml`: Liferay Client Extension の設定
- `LCP.json`: Liferay Cloud Platform の設定
- `Dockerfile`: コンテナ化の設定
- `next.config.js`: Next.js の設定（standalone モード）
- `.dockerignore`: Docker ビルド時の除外ファイル

## トラブルシューティング

### ビルドエラー

```bash
# 依存関係をクリーンインストール
rm -rf node_modules package-lock.json
npm install
```

### デプロイエラー

1. Liferay Cloud コンソールでログを確認
2. 環境変数が正しく設定されているか確認
3. ポート設定が正しいか確認（80）

### ヘルスチェックエラー

1. アプリケーションが正常に起動しているか確認
2. `/api/health` エンドポイントが応答するか確認
3. ログでエラーメッセージを確認

## サポート

問題が発生した場合は、以下を確認してください：

1. Liferay Cloud のドキュメント
2. Next.js のドキュメント
3. プロジェクトのログファイル 