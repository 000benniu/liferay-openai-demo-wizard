# Liferay OpenAI コンテンツ作成ウィザード

このアプリケーションにより、Liferay内でのコンテンツ作成が簡単になります！

例えば、あなたのプロンプト一つで、わずか35秒で5つのカテゴリに15個の製品を作成できます。この魔法は、OpenAIのAPIによるコンテンツ作成とLiferayのAPIによるシームレスな保存の統合によって実現されています。

このOpenAIウィザードは、多くの人が既にAIで行っているコンテンツ作成を高速化するだけでなく、Liferayの包括的なHeadless APIを通じてLiferayにシームレスに読み込むことで、さらに一歩先を行きます。LiferayのHeadless APIを通じてコマース製品、カテゴリ、SKUの設定に費やす時間を最適化する可能性を特定するのに役立ったSteven Luに大きな感謝を捧げます。
  
![AIWizard-Screenshot](https://github.com/weskempa-liferay/liferay-openai-demo-wizard/assets/68334638/eafd4327-492c-4fcf-81e8-2d3abfa9f8f7)

## Liferayコンテンツウィザードが現在サポートしているアセットタイプ：

- **アカウント**
- **画像付きブログ**
- **カテゴリ構造付きタクソノミー**
- **多言語FAQ**
- **ドキュメントとメディア内での画像生成（サイズと品質を選択可能）**
- **ナレッジベースフォルダと記事**
- **メッセージボードセクション、スレッド、メッセージ**
- **画像付き多言語ニュース記事**
- **カスタムLiferayオブジェクトのデータ**
- **組織構造**
- **ページ階層（AI生成とファイルアップロード）**
- **画像付きコマースカテゴリと製品（AI生成とファイルアップロード）**
- **ユーザー（AI生成とファイルアップロード）**
- **ユーザーグループ**
- **緯度と経度付き倉庫**
- **Wikiノードとページ**

今後、より多くのオプションとコンテンツタイプのより深い統合が期待されます。

> [!TIP]
> 頻繁な更新が予想されるため、定期的な更新をお勧めします。

![Wizard Dashboard](https://github.com/weskempa-liferay/liferay-openai-demo-wizard/assets/68334638/5f4f6f98-24c5-4785-8ac8-da12b75661da)

![287095500-3d733f48-a6cc-48e6-af4c-b0578542befa](https://github.com/weskempa-liferay/liferay-openai-demo-wizard/assets/68334638/de136608-8e95-4a74-bc16-08506570d7b9)

![287095038-7b60a262-e9af-47b4-bbae-7b58d30ee367](https://github.com/weskempa-liferay/liferay-openai-demo-wizard/assets/68334638/e7ed2ee8-a369-41da-aae2-deccf4c97b48)


使用技術：

- [OpenAI API](https://openai.com/api/)
- [Node.js](https://nodejs.org/en/)
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Highlight.js](https://highlightjs.org/)

## 認証

Liferayポータルを使用した認証には2つのオプションがあります

1. 基本認証
2. OAuth2

**基本認証**は、localhost、開発、ステージング環境に最適で、認証方法は**メールアドレス**と**パスワード**を使用します。ターゲットアセットで使用されるAPIを消費するための十分な権限が必要です。

**OAuth2**は、特にLiferay SaaSを使用している場合、基本認証がデフォルトで無効になっているため、本番環境に推奨されます。

**openai-demo-wizard**を使用するには、以下のスコープを有効にする必要があります：

- Liferay.Headless.Admin.Taxonomy.everything
- Liferay.Headless.Admin.User.everything
- Liferay.Headless.Admin.Workflow.everything
- Liferay.Headless.Commerce.Admin.Account.everything
- Liferay.Headless.Commerce.Admin.Catalog.everything
- Liferay.Headless.Delivery.everything
- Liferay.Headless.Site.everything


## セットアップ

1. Node.jsがインストールされていない場合は、[ここからインストールしてください](https://nodejs.org/en/)

2. このリポジトリをクローンします

3. プロジェクトディレクトリに移動します

```bash
cd liferay-openai-demo-wizard
```  

4. 必要なパッケージをインストールします

```bash
npm install
```

5. アプリを実行します

```bash
npm run dev
```

これで、[http://localhost:3000](http://localhost:3000)でアプリにアクセスできるはずです。

> [!TIP]
> localhostを通じてローカルLiferayインスタンスにアクセスしていて、設定の接続に問題がある場合は、"https://127.0.0.1:8080"を使用すると接続の問題が解決する可能性があります。一部のnodejsやaxiosバージョンでは、localhostの呼び出しに既知の問題があります。

## デプロイメント

アプリケーションの設定は現在UIを通じて行われます。画面右下の歯車アイコンを使用して環境プロパティを設定してください。

---

> [!WARNING]
> 生成AIプロンプトに個人情報、パスワード、機密データを絶対に使用しないでください。

> [!IMPORTANT]
> これはLiferay Inc.が直接サポートしていない個人プロジェクトです。

> [!TIP]
> あなたのフィードバックと提案は私たちにとって有用です。改善のためのアイデアを共有してください！

# 素晴らしいものを作りましょう！
