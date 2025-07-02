import hljs from 'highlight.js';
import { useState } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';

import FieldLanguage from '../components/formfield-language';
import FieldSubmit from '../components/formfield-submit';
import Form from '../components/forms/form';
import Input from '../components/forms/input';
import Layout from '../components/layout';
import LoadingAnimation from '../components/loadinganimation';
import ResultDisplay from '../components/resultdisplay';
import schema, { z, zodResolver } from '../schemas/zod';
import nextAxios from '../services/next';

type CategorySchema = z.infer<typeof schema.category>;

export default function Categories() {
  const [result, setResult] = useState('');

  const categoriesForm = useForm<CategorySchema>({
    defaultValues: {
      categorytNumber: '5',
      childCategorytNumber: '3',
      defaultLanguage: 'en-US',
      languages: [],
      manageLanguage: false,
      vocabularyDescription: '様々な本のカテゴリ',
      vocabularyName: '本の種類',
    },
    resolver: zodResolver(schema.category),
  });

  async function onSubmit(payload: CategorySchema) {
    const { data } = await nextAxios.post('/api/categories', payload);

    const hljsResult = hljs.highlightAuto(data.result).value;

    setResult(hljsResult);
  }

  const {
    formState: { isSubmitting },
  } = categoriesForm;

  return (
    <Layout
      description={`以下のフィールドにビジネス説明を入力してカテゴリをお待ちください。語彙テーマの例は「様々な本のカテゴリ」、「ヘルスケアサービスの種類」、「家庭用家具のオプション」などです。`}
      title="Liferayカテゴリ生成器"
    >
      <Form
        formProviderProps={categoriesForm}
        onSubmit={categoriesForm.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:gap-4 mb-5">
          <Input
            label="語彙テーマ"
            name="vocabularyDescription"
            placeholder="語彙の説明を入力してください"
          />

          <Input
            label="語彙名"
            name="vocabularyName"
            placeholder="語彙名を入力してください"
          />

          <Input
            label="サイトIDまたはアセットライブラリグループID"
            name="siteId"
            placeholder="サイトIDまたはアセットライブラリグループIDを入力してください"
          />

          <Input
            label="カテゴリ数"
            name="categorytNumber"
            placeholder="生成するカテゴリ数を入力してください"
          />

          <Input
            label="子カテゴリ数"
            name="childCategorytNumber"
            placeholder="生成する子カテゴリ数を入力してください"
          />
        </div>

        <FieldLanguage
          defaultLanguageChange={(value) =>
            categoriesForm.setValue('defaultLanguage', value)
          }
          languagesChange={(value) =>
            categoriesForm.setValue('languages', value)
          }
          manageLanguageChange={(value) =>
            categoriesForm.setValue('manageLanguage', value)
          }
        />

        <FieldSubmit 
          disabled={!categoriesForm.formState.isValid || isSubmitting}
          label="カテゴリを生成" />
      </Form>

      {isSubmitting ? (
        <LoadingAnimation />
      ) : (
        result && <ResultDisplay result={result} />
      )}
    </Layout>
  );
}
