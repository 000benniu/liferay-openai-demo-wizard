/** @type {import('next').NextConfig} */
const nextConfig = {
  // 画像最適化の設定
  images: {
    unoptimized: true,
  },
  
  // トラブルシューティング用の設定
  poweredByHeader: false,
  
  // ヘルスチェック用のAPIエンドポイント
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/health',
      },
    ];
  },
};

module.exports = nextConfig; 