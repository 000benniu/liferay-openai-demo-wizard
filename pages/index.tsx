import { RocketLaunchIcon } from '@heroicons/react/24/solid';

import AppHead from '../components/head';
import AppFooter from '../components/layout/footer';
import NavItem from '../components/navitem';

const navItems = [
  {
    description: '会社タイプに基づいてアカウントのリストを作成します。',
    path: '/accounts',
    title: 'アカウント',
  },
  {
    description: 'プロンプトに基づいてブログのセットを作成します。',
    path: '/blogs',
    title: 'ブログ',
  },
  {
    description: 'テーマに基づいてタクソノミーとカテゴリ構造を作成します。',
    path: '/categories',
    title: 'カテゴリ',
  },
  {
    description: 'トピックに基づいて多言語FAQのセットを作成します。',
    path: '/faqs',
    title: 'FAQ',
  },
  {
    description:
      'プロンプトに基づいてドキュメントライブラリフォルダに画像を生成します。',
    path: '/images',
    title: '画像',
  },
  {
    description: 'トピックに基づいてナレッジベースフォルダと記事を作成します。',
    path: '/knowledgebase',
    title: 'ナレッジベース',
  },
  {
    description: 'トピックを選択してメッセージボードセクションとスレッドを作成します。',
    path: '/messageboard',
    title: 'メッセージボード',
  },
  {
    description: 'トピックに基づいて多言語ニュース記事のセットを作成します。',
    path: '/news',
    title: 'ニュース',
  },
  {
    description: 'プロンプトに基づいてカスタムオブジェクトにレコードを追加します。',
    path: '/objects',
    title: 'オブジェクト',
  },
  {
    description: '会社の組織構造を作成します。',
    path: '/organizations',
    title: '組織',
  },
  {
    description:
      'サイトの目標の説明からページ階層を生成します。',
    path: '/pages',
    title: 'ページ階層',
  },
  {
    description: '会社テーマを使用して製品とカテゴリを生成します。',
    path: '/products',
    title: '製品',
  },
  {
    description: 'ポータルインスタンスのサンプルユーザーを作成します。',
    path: '/users',
    title: 'ユーザー',
  },
  {
    description: 'ポータルインスタンスのサンプルユーザーグループを作成します。',
    path: '/usergroups',
    title: 'ユーザーグループ',
  },
  {
    description: '指定された地域に倉庫のセットを作成します。',
    path: '/warehouses',
    title: '倉庫',
  },
  {
    description: 'プロンプトに基づいてWikiノードとページのセットを作成します。',
    path: '/wikis',
    title: 'Wiki',
  },
];

const HomePage = () => {
  return (
    <>
      <AppHead title="" />

      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0b1d67] to-[#204f79]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 pt-6 pb-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-[4rem]">
            Liferay <span className="text-[hsl(210,70%,50%)]">OpenAI</span>{' '}
            コンテンツウィザード
            <RocketLaunchIcon className="inline pl-3 h-20 w-20 relative bottom-2 text-[hsl(210,50%,80%)]" />
          </h1>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-8">
            {navItems.map((navItem, index) => (
              <NavItem {...navItem} key={index} />
            ))}
          </div>
        </div>

        <AppFooter />
      </main>
    </>
  );
};

export default HomePage;
