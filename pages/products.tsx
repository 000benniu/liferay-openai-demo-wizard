import Layout from '../components/layout';
import NavItem from '../components/navitem';

export default function Products() {
  return (
    <Layout
      description='製品をどのように追加しますか？'
      title='Liferay製品生成器'
    >
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8'>
        <NavItem
          description='OpenAIを使用してテーマに基づいてデモ製品のリストを生成します。'
          path='/products-ai'
          title='AI生成'
        />

        <NavItem
          description='CSVファイルから特定の製品のリストをアップロードします。'
          path='/products-file'
          title='ファイルアップロード'
        />
      </div>
    </Layout>
  );
}
