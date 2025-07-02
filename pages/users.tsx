import Layout from '../components/layout';
import NavItem from '../components/navitem';

export default function Users() {
  return (
    <Layout
      description='ユーザーをどのように追加しますか？'
      title='Liferayユーザー生成器'
    >
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8'>
        <NavItem
          description='OpenAIを使用してランダムなデモユーザーのリストを生成します。'
          path='/users-ai'
          title='AI生成'
        />

        <NavItem
          description='CSVファイルから特定のユーザーのリストをアップロードします。'
          path='/users-file'
          title='ファイルアップロード'
        />
      </div>
    </Layout>
  );
}
