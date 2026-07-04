import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // S3 + CloudFront 静的ホスティング用に完全静的エクスポート
  output: "export",
  // S3 のディレクトリ index.html 解決に合わせる（/r/bra/ → r/bra/index.html）
  trailingSlash: true,
};

export default nextConfig;
