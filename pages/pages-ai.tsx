import hljs from 'highlight.js';
import { useState } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';

import FieldSubmit from '../components/formfield-submit';
import FieldToggle from '../components/formfield-toggle';
import Form from '../components/forms/form';
import Input from '../components/forms/input';
import Layout from '../components/layout';
import LoadingAnimation from '../components/loadinganimation';
import ResultDisplay from '../components/resultdisplay';
import schema, { z, zodResolver } from '../schemas/zod';
import nextAxios from '../services/next';

type PagesAISchema = z.infer<typeof schema.pagesAI>;

export default function PagesAI() {
  const pagesAIForm = useForm<PagesAISchema>({
    defaultValues: {
      addPageContent: true,
      childPageNumber: '3',
      pageNumber: '8',
      pageTopic: '会社のイントラネットポータル',
    },
    resolver: zodResolver(schema.pagesAI),
  });

  const [result, setResult] = useState('');

  async function onSubmit(payload: PagesAISchema) {
    const { data } = await nextAxios.post('/api/pages-ai', payload);

    const hljsResult = hljs.highlightAuto(data.result).value;
    setResult(hljsResult);
  }

  const {
    formState: { isSubmitting },
    setValue,
    watch,
  } = pagesAIForm;

  const addPageContent = watch('addPageContent');

  return (
    <Layout
      description='下記のフィールドにビジネス説明を入力してページをお待ちください。サイト説明の例は「自動車サプライヤーポータル」「大学生ポータル」「植物愛好家サイト」などです。'
      title="Liferayページ生成器"
    >
      <Form
        formProviderProps={pagesAIForm}
        onSubmit={pagesAIForm.handleSubmit(onSubmit)}
      >
        <div className="w-700 grid grid-cols-2 gap-2 sm:grid-cols-2 md:gap-4 mb-5">
          <Input
            label="サイト説明"
            name="pageTopic"
            placeholder="サイト説明を入力してください"
          />

          <Input
            label="サイトID"
            name="siteId"
            placeholder="ページを追加したいサイトのIDを入力してください"
          />

          <Input
            label="最大ページ数"
            name="pageNumber"
            placeholder="生成するトップレベルページの最大数を入力してください"
          />

          <Input
            label="最大子ページ数"
            name="childPageNumber"
            placeholder="生成する子ページの最大数を入力してください"
          />

          <FieldToggle
            defaultValue={true}
            fieldKey="addContent"
            inputChange={() => setValue('addPageContent', !addPageContent)}
            name="ページコンテンツを生成（早期リリース、コンテンツ生成時間が増加します）"
          />
        </div>

        <FieldSubmit 
          disabled={!pagesAIForm.formState.isValid || isSubmitting}
          label="ページを生成" />
      </Form>

      <p className="text-slate-100 text-center text-lg mb-3 rounded p-5 bg-white/10 w-1/2 italic">
        <b>注意:</b> GPT 3.5でのページリスト生成は信頼できませんでした。そのため、完全なページ構造を生成するためにGPT 4.0が自動的に使用されます。後続の呼び出しでは選択されたモデルが使用されます。
      </p>

      {isSubmitting ? (
        <LoadingAnimation />
      ) : (
        result && <ResultDisplay result={result} />
      )}
    </Layout>
  );
}
