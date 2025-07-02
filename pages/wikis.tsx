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

type WikiSchema = z.infer<typeof schema.wiki>;

const viewOptions = functions.getViewOptions();

export default function Wikis() {
  const wikiForm = useForm<WikiSchema>({
    defaultValues: {
      siteId: '',
      viewOptions: viewOptions[0].id,
      wikiArticleLength: '60',
      wikiChildPageNumber: '3',
      wikiNodeName: '健康的な生活',
      wikiPageNumber: '3',
      wikiTopic: '健康的な生活のアドバイスとヒント',
    },
    resolver: zodResolver(schema.wiki),
  });

  const [result, setResult] = useState('');

  async function onSubmit(payload: WikiSchema) {
    const { data } = await nextAxios.post('/api/wikis', payload);

    const hljsResult = hljs.highlightAuto(data.result).value;

    setResult(hljsResult);
  }

  const {
    formState: { isSubmitting },
  } = wikiForm;

  return (
    <Layout
      description={
        '下記のフィールドにトピックを入力し、Wikiページを生成してください。例:「会社の方針と手順」「環境問題と持続可能性」「経済とビジネス」'
      }
      title={'Liferay Wiki生成器'}
    >
      <Form
        formProviderProps={wikiForm}
        onSubmit={wikiForm.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:gap-4 mb-5">
          <Input
            label="Wikiトピック"
            name="wikiTopic"
            placeholder="Wikiトピックを入力してください"
          />

          <Input
            label="Wikiノード名"
            name="wikiNodeName"
            placeholder="Wikiノード名を入力してください"
          />

          <Input label="Site ID" name="siteId" placeholder="Enter a site ID" />

          <Input
            label="ページの想定文字数"
            name="wikiArticleLength"
            placeholder="ページの想定文字数を入力してください"
          />

          <Input
            label="ページ数"
            name="wikiPageNumber"
            placeholder="生成するページ数を入力してください"
          />

          <Input
            label="各ページの子ページ数"
            name="wikiChildPageNumber"
            placeholder="各ページの子ページ数を入力してください"
          />

          <Select
            label="表示オプション"
            name="viewOptions"
            optionMap={viewOptions}
          />
        </div>

        <FieldSubmit
          disabled={!wikiForm.formState.isValid || isSubmitting}
          label="Wikiノードとページを生成"
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
