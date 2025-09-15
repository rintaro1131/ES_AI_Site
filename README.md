# 業務AIレシピ集

静的サイトとして動作する「業務AIの活用レシピ」カタログです。純粋な HTML/CSS/バニラJS（ES Modules）で構築し、外部ライブラリに依存しません。

## 特徴
- カラートークン/ダーク・ライト切替、余白多め・繊細なグラデ/ノイズ、角丸と浅いシャドウ。
- WCAG 2.2 AA 配慮（フォーカス可視化、キーボード操作、reduced‑motion 対応）。
- 主要ページは JSON データから描画。`fetch` 失敗時も JS 内の `defaultData` にフォールバック。
- ROI 計算は即時更新 + クエリ共有、グラフは `<canvas>` に最小実装。

## 構成
```
/  index.html, catalog.html, templates.html, roi.html, cases.html, policy.html, faq.html, contact.html, blog.html
   assets/
     css/ base.css, layout.css, components.css, pages.css
     js/ app.js, store.js, ui/*, features/*
     img/ ogp.png, patterns.svg
   data/ usecases.json, templates.json, faq.json, blog.json
   prompts/ ask.txt, mail.txt, image-diagnosis.txt
```

## 使い方（ローカル閲覧）
- セキュリティ制約により `file://` では `fetch` が失敗する場合があります。ローカル HTTP サーバで開いてください。
  - 例: VSCode 拡張「Live Server」を使い、プロジェクトを開いて `Go Live`。
  - 例: `python3 -m http.server 5500` で起動し、 `http://localhost:5500/` を開く。
- `fetch` できない場合でも、各ページは `defaultData` により崩れず動作します。

## 編集ポイント（後日の修正）
- カタログ/テンプレ/FAQ/ブログは `data/*.json` を編集するだけで反映されます。
  - `data/usecases.json` … ユースケース（カテゴリ/難易度/所要時間/タグ/人気度/手順/プロンプト等）
  - `data/templates.json` … テンプレ（種類/本文/人気度）
  - `data/faq.json` … FAQ
  - `data/blog.json` … ブログ記事（簡易HTML）
- 見た目の調整は `assets/css/*.css` で行います。
- テーマやUIの振る舞いは `assets/js/ui/*`、データ取得は `assets/js/store.js`。

## パフォーマンス/アクセシビリティ
- 画像は `loading="lazy"` 相当の運用を想定。Hero 背景は `patterns.svg` を弱く重ねています。
- フォーカスリングは常に可視。キーボード操作（タブ移動/ESCでモーダル閉じ）に対応。
- `prefers-reduced-motion: reduce` でアニメーションを最小化。

## OGP 画像について
- `assets/img/ogp.png` はプレースホルダです（テキストファイル）。実運用時は 1200x630 の PNG に差し替えてください。

## ビルド不要
- 追加のビルド/依存はありません。各 HTML をそのままブラウザで開けます（上記の通り HTTP 経由推奨）。

