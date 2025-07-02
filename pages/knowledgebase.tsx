import hljs from 'highlight.js';
import { useState } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';

import FieldSubmit from '../components/formfield-submit';
import Form from '../components/forms/form';
import Input from '../components/forms/input';
import Select from '../components/forms/select';
import Layout from '../components/layout';
import LoadingAnimation from '../components/loadinganimation';
import ResultDisplay from '../components/resultdisplay';
import schema, { z, zodResolver } from '../schemas/zod';
import nextAxios from '../services/next';
import functions from '../utils/functions';

type KnowledgeBaseSchema = z.infer<typeof schema.knowledgeBase>;

const languageOptions = functions.getAvailableLanguages();
const viewOptions = functions.getViewOptions();

export default function KnowledgeBase() {
  const knowledgeBaseForm = useForm<KnowledgeBaseSchema>({
    defaultValues: {
      kbArticleLength: '100',
      kbArticleNumber: '4',
      kbFolderNumber: '3',
      kbLanguage: 'en-US',
      kbTopic: '',
      siteId: '',
      viewOptions: viewOptions[0].id,
    },
    resolver: zodResolver(schema.knowledgeBase),
  });
  const [result, setResult] = useState('');

  async function onSubmit(payload: KnowledgeBaseSchema) {
    const { data } = await nextAxios.post('/api/knowledgebase', payload);

    const hljsResult = hljs.highlightAuto(data.result).value;

    setResult(hljsResult);
  }

  const {
    formState: { isSubmitting },
  } = knowledgeBaseForm;

  return (
    <Layout
      description='下記のフィールドにトピックを入力し、ナレッジベース記事を生成してください。例:「危険物の取り扱い」「健康的な生活のヒント」「ポジティブな職場環境の作り方」'
      title="Liferayナレッジベース生成器"
    >
      <Form
        formProviderProps={knowledgeBaseForm}
        onSubmit={knowledgeBaseForm.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:gap-4 mb-5">
          <Input
            label="ナレッジベーストピック"
            name="kbTopic"
            placeholder="ナレッジベーストピックを入力してください"
          />

          <Input label="Site ID" name="siteId" placeholder="Enter a site ID" />

          <Input
            label="記事の想定文字数"
            name="kbArticleLength"
            placeholder="記事の想定文字数を入力してください"
          />

          <Input
            label="フォルダ数"
            name="kbFolderNumber"
            placeholder="生成するフォルダ数を入力してください"
          />

          <Input
            label="各セクションの記事数"
            name="kbArticleNumber"
            placeholder="各セクションの記事数を入力してください"
          />

          <Select
            label="ナレッジベース言語"
            name="kbLanguage"
            optionMap={languageOptions}
          />

          <Select
            label="表示オプション"
            name="viewOptions"
            optionMap={viewOptions}
          />
        </div>

        <FieldSubmit 
          disabled={!knowledgeBaseForm.formState.isValid || isSubmitting}
          label="ナレッジベース記事を生成"
        />
      </Form>

      {isSubmitting ? (
        <LoadingAnimation />
      ) : (
        result && <ResultDisplay result={result} />
      )}
    </Layout>
  );
}
