import hljs from 'highlight.js';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import TopNavItem from '../components/apptopnavitem';
import FieldLanguage from '../components/formfield-language';
import FieldSubmit from '../components/formfield-submit';
import Form from '../components/forms/form';
import Input from '../components/forms/input';
import Select from '../components/forms/select';
import ImageStyle from '../components/imagestyle';
import Layout from '../components/layout';
import LoadingAnimation from '../components/loadinganimation';
import ResultDisplay from '../components/resultdisplay';
import schema, { z, zodResolver } from '../schemas/zod';
import nextAxios from '../services/next';
import { USDollar } from '../utils/currency';
import { downloadFile } from '../utils/download';
import functions from '../utils/functions';

type NewsSchema = z.infer<typeof schema.news>;

const viewOptions = functions.getViewOptions();

const handleStructureClick = () => {
  downloadFile({
    fileName: 'Structure-News_Article',
    filePath: 'news/Structure-News_Article.json',
  });
};

const handleFragmentClick = () => {
  location.href = 'news/Fragment-News.zip';
};

export default function News() {
  const newsForm = useForm<NewsSchema>({
    defaultValues: {
      defaultLanguage: 'en-US',
      imageFolderId: '0',
      imageGeneration: 'none',
      imageStyle: '',
      languages: [],
      manageLanguage: false,
      newsLength: '75',
      newsNumber: '3',
      viewOptions: 'Anyone',
    },
    resolver: zodResolver(schema.news),
  });

  const [result, setResult] = useState('');

  const {
    formState: { isSubmitting },
    watch,
  } = newsForm;

  const imageGeneration = watch('imageGeneration');
  const newsNumber = watch('newsNumber');

  const { showImageFolder, showImageStyle, submitLabel } = useMemo(() => {
    let cost = '';
    let showImageStyle = false;
    let showImageFolder = false;

    if (isNaN(parseInt(newsNumber))) {
      cost = '$0.00';
    } else if (imageGeneration == 'dall-e-3') {
      showImageStyle = true;
      showImageFolder = true;
      cost = USDollar.format(parseInt(newsNumber) * 0.04);
    } else if (imageGeneration == 'dall-e-2') {
      cost = USDollar.format(parseInt(newsNumber) * 0.02);
      showImageFolder = true;
    } else {
      cost = '<$0.01';
    }

    return {
      showImageFolder,
      showImageStyle,
      submitLabel: 'ニュースを生成 - 推定コスト: ' + cost,
    };
  }, [newsNumber, imageGeneration]);

  async function onSubmit(payload: NewsSchema) {
    const { data } = await nextAxios.post('/api/news', payload);

    const hljsResult = hljs.highlightAuto(data.result).value;

    setResult(hljsResult);
  }

  return (
    <Layout
      description='以下のフィールドにトピックを入力してニュースをお待ちください。ニューストピックの例は「医療における技術的進歩」、「新年の抱負」、「成功するリーダーシップアプローチと目標」などです。'
      title="Liferayニュース生成器"
    >
      <div className="fixed top-2 right-5 text-lg download-options p-5 rounded">
        <TopNavItem label="ニュース構造" onClick={handleStructureClick} />

        <TopNavItem label="ニュースフラグメント" onClick={handleFragmentClick} />
      </div>

      <Form
        formProviderProps={newsForm}
        onSubmit={newsForm.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:gap-4 mb-5">
          <Input
            label="ニューストピック"
            name="newsTopic"
            placeholder="ニューストピックを入力してください"
          />

          <Input
            label="作成する記事数（最大10）"
            name="newsNumber"
            placeholder="ニュース投稿数"
          />

          <Input
            label="期待されるニュース投稿の長さ（単語数）"
            name="newsLength"
            placeholder="期待されるニュース投稿の長さ"
          />

          <Input
            label="サイトIDまたはアセットライブラリグループID"
            name="siteId"
            placeholder="サイトIDまたはアセットライブラリグループIDを入力してください"
          />

          <Input
            label="WebコンテンツフォルダID（ルートの場合は0）"
            name="folderId"
            placeholder="WebコンテンツフォルダIDを入力してください"
          />

          <Input
            label="構造ID"
            name="structureId"
            placeholder="構造IDを入力してください"
          />

          <Input
            label="カンマ区切りカテゴリID（オプション）"
            name="categoryIds"
            placeholder="カンマ区切りのカテゴリIDリスト"
          />

          <Select
            label="表示オプション"
            name="viewOptions"
            optionMap={viewOptions}
          />

          <Select
            label="画像生成"
            name="imageGeneration"
            optionMap={[
              { id: 'none', name: 'なし' },
              { id: 'dall-e-3', name: 'DALL·E 3（最高品質の画像）' },
              { id: 'dall-e-2', name: 'DALL·E 2（基本画像）' },
            ]}
          />

          {showImageFolder && (
            <Input
              label="画像フォルダID（ドキュメントライブラリルートの場合は0）"
              name="imageFolderId"
              placeholder="ドキュメントライブラリフォルダIDを入力してください"
            />
          )}

          {showImageStyle && (
            <ImageStyle
              styleInputChange={(value) =>
                newsForm.setValue('imageStyle', value)
              }
            />
          )}
        </div>

        <FieldLanguage
          defaultLanguageChange={(value) =>
            newsForm.setValue('defaultLanguage', value)
          }
          languagesChange={(value) => newsForm.setValue('languages', value)}
          manageLanguageChange={(value) =>
            newsForm.setValue('manageLanguage', value)
          }
        />

        <FieldSubmit 
          disabled={!newsForm.formState.isValid || isSubmitting}
          label={submitLabel} />
      </Form>

      <p className="text-slate-100 text-center text-lg mb-3 rounded p-5 bg-white/10 w-1/2 italic">
        <b>注意:</b> ニュース記事生成には特定のコンテンツ構造が必要です。 <br />
        上記で提供されているニュース構造を使用してください。
      </p>

      {isSubmitting ? (
        <LoadingAnimation />
      ) : (
        result && <ResultDisplay result={result} />
      )}
    </Layout>
  );
}
