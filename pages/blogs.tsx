import hljs from 'highlight.js';
import { useMemo, useState } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import FieldSubmit from '../components/formfield-submit';
import Form from '../components/forms/form';
import Input from '../components/forms/input';
import Select from '../components/forms/select';
import ImageStyle from '../components/imagestyle';
import Layout from '../components/layout';
import LoadingAnimation from '../components/loadinganimation';
import ResultDisplay from '../components/resultdisplay';
import schema, { zodResolver } from '../schemas/zod';
import nextAxios from '../services/next';
import { USDollar } from '../utils/currency';
import functions from '../utils/functions';

type BlogSchema = z.infer<typeof schema.blog>;

const languageOptions = functions.getAvailableLanguages();
const viewOptions = functions.getViewOptions();

export default function Blogs() {
  const [result, setResult] = useState('');

  const blogsForm = useForm<BlogSchema>({
    defaultValues: {
      blogLanguage: 'en-US',
      blogLength: '200',
      blogNumber: '3',
      imageGeneration: 'none',
      imageStyle: '',
      viewOptions: 'Anyone',
    },
    resolver: zodResolver(schema.blog),
  });

  const {
    formState: { isSubmitting },
    setValue,
    watch,
  } = blogsForm;

  const blogNumber = watch('blogNumber');
  const imageGeneration = watch('imageGeneration');

  const { showImageStyle, submitLabel } = useMemo(() => {
    let showImageStyle = false;

    let cost = '';

    if (isNaN(parseInt(blogNumber))) {
      cost = '$0.00';
    } else if (imageGeneration == 'dall-e-3') {
      showImageStyle = true;
      cost = USDollar.format(parseInt(blogNumber) * 0.04);
    } else if (imageGeneration == 'dall-e-2') {
      cost = USDollar.format(parseInt(blogNumber) * 0.02);
    } else {
      cost = '<$0.01';
    }

    return {
      showImageStyle,
      submitLabel: 'ブログを生成 - 推定コスト: ' + cost,
    };
  }, [blogNumber, imageGeneration]);

  async function onSubmit(payload: BlogSchema) {
    const { data } = await nextAxios.post('/api/blogs', payload);

    const hljsResult = hljs.highlightAuto(data.result).value;

    setResult(hljsResult);
  }

  return (
    <Layout
      description={`以下のフィールドにトピックを入力してブログをお待ちください。ブログトピックの例は「リーダーシップスキルと学んだ教訓」、「航空宇宙工学ニュース」、「医療分野の技術進歩」などです。`}
      title="Liferayブログ生成器"
    >
      <Form
        formProviderProps={blogsForm}
        onSubmit={blogsForm.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:gap-4 mb-5">
          <Input
            label="ブログトピック"
            name="blogTopic"
            placeholder="ブログトピックを入力してください"
          />

          <Input
            label="作成する投稿数（最大10）"
            name="blogNumber"
            placeholder="ブログ投稿数"
          />

          <Input
            label="期待されるブログ投稿の長さ（単語数）"
            name="blogLength"
            placeholder="期待されるブログの長さを入力してください"
          />

          <Input
            label="サイトID"
            name="siteId"
            placeholder="サイトIDを入力してください"
          />

          <Select
            label="ブログ言語"
            name="blogLanguage"
            optionMap={languageOptions}
          />

          <Select
            label="表示オプション"
            name="viewOption"
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

          {showImageStyle && (
            <ImageStyle
              styleInputChange={(newValue: string) =>
                setValue('imageStyle', newValue)
              }
            />
          )}
        </div>

        <FieldSubmit
          disabled={!blogsForm.formState.isValid || isSubmitting}
          label={submitLabel} />
      </Form>

      <p className="text-slate-100 text-center text-lg mb-3 rounded p-5 bg-white/10 w-1/2 italic">
        <b>注意:</b> GPT 4.0ではブログのAI生成は信頼できません。そのため、現在はGPT 3.5またはGPT 3.5 turboが推奨されています。
      </p>

      {isSubmitting ? (
        <LoadingAnimation />
      ) : (
        result && <ResultDisplay result={result} />
      )}
    </Layout>
  );
}
