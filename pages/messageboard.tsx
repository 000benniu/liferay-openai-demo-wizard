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

type MessageBoardSchema = z.infer<typeof schema.messageBoard>;

const languageOptions = functions.getAvailableLanguages();
const viewOptions = functions.getViewOptions();

export default function MessageBoard() {
  const messageBoardForm = useForm<MessageBoardSchema>({
    defaultValues: {
      mbLanguage: 'en-US',
      mbMessageNumber: '2',
      mbSectionNumber: '3',
      mbThreadLength: '50',
      mbThreadNumber: '3',
      viewOptions: viewOptions[0].id,
    },
    resolver: zodResolver(schema.messageBoard),
  });

  const [result, setResult] = useState('');

  async function onSubmit(payload: MessageBoardSchema) {
    const { data } = await nextAxios.post('/api/messageboard', payload);

    const hljsResult = hljs.highlightAuto(data.result).value;
    setResult(hljsResult);
  }

  const {
    formState: { isSubmitting },
  } = messageBoardForm;

  return (
    <Layout
      description='下記のフィールドにトピックを入力し、メッセージボードスレッドを生成してください。例:「健康的な生活」「旅行のアドバイス」「ドッググルーミングビジネス」'
      title="Liferayメッセージボード生成器"
    >
      <Form
        formProviderProps={messageBoardForm}
        onSubmit={messageBoardForm.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:gap-4 mb-5">
          <Input
            label="メッセージボードトピック"
            name="mbTopic"
            placeholder="メッセージボードトピックを入力してください"
          />

          <Input label="Site ID" name="siteId" placeholder="Enter a site ID" />

          <Input
            label="スレッドの想定文字数"
            name="mbThreadLength"
            placeholder="スレッドの想定文字数を入力してください"
          />

          <Input
            label="セクション数"
            name="mbSectionNumber"
            placeholder="生成するセクション数を入力してください"
          />

          <Input
            label="各セクションのスレッド数"
            name="mbThreadNumber"
            placeholder="各セクションのスレッド数を入力してください"
          />

          <Input
            label="各スレッドのメッセージ数"
            name="mbMessageNumber"
            placeholder="各スレッドのメッセージ数を入力してください"
          />

          <Select
            label="メッセージボード言語"
            name="mbLanguage"
            optionMap={languageOptions}
          />

          <Select
            label="表示オプション"
            name="viewOptions"
            optionMap={viewOptions}
          />
        </div>

        <FieldSubmit 
          disabled={!messageBoardForm.formState.isValid || isSubmitting}
          label={'メッセージボードスレッドを生成'}
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
