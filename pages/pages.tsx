import Layout from '../components/layout';
import NavItem from '../components/navitem';

export default function Pages() {
  return (
    <Layout
      description='ページをどのように追加しますか？'
      title='Liferayページ生成器'
    >
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8'>
        <NavItem
          description='OpenAIを使用してページ階層を生成します。'
          path='/pages-ai'
          title='AI生成'
        />

        <NavItem
          description='JSONファイルを使用してページ階層をアップロードします。'
          path='/pages-file'
          title='ファイルアップロード'
        />
      </div>
    </Layout>
  );
}
