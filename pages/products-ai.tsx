import hljs from 'highlight.js';
import { useMemo, useState } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';

import FieldSubmit from '../components/formfield-submit';
import Form from '../components/forms/form';
import Input from '../components/forms/input';
import Select from '../components/forms/select';
import ImageStyle from '../components/imagestyle';
import Layout from '../components/layout';
import LoadingAnimation from '../components/loadinganimation';
import ResultDisplay from '../components/resultdisplay';
import useCatalogs from '../hooks/useCatalogs';
import schema, { z, zodResolver } from '../schemas/zod';
import nextAxios from '../services/next';
import { USDollar } from '../utils/currency';

type ProductAISchema = z.infer<typeof schema.productsAI>;

export default function Products() {
  const productForm = useForm<ProductAISchema>({
    defaultValues: {
      imageGeneration: 'none',
      imageStyle: '',
      numberOfCategories: '5',
      numberOfProducts: '3',
    },
    mode: 'all',
    resolver: zodResolver(schema.productsAI),
  });

  const catalogs = useCatalogs();
  const [result, setResult] = useState('');

  const {
    formState: { isSubmitting },
    setValue,
    watch,
  } = productForm;

  const numberOfCategories = watch('numberOfCategories');
  const numberOfProducts = watch('numberOfProducts');
  const imageGeneration = watch('imageGeneration');

  const { showImageStyle, submitLabel } = useMemo(() => {
    let showImageStyle = false;
    let cost = '';

    if (
      isNaN(parseInt(numberOfCategories)) &&
      isNaN(parseInt(numberOfProducts))
    ) {
      cost = '$0.00';
    } else if (imageGeneration == 'dall-e-3') {
      showImageStyle = true;
      cost = USDollar.format(
        parseInt(numberOfCategories) * parseInt(numberOfProducts) * 0.04
      );
    } else if (imageGeneration == 'dall-e-2') {
      cost = USDollar.format(
        parseInt(numberOfCategories) * parseInt(numberOfProducts) * 0.02
      );
    } else {
      cost = '<$0.01';
    }

    return {
      showImageStyle,
      submitLabel: '製品を生成 - 推定コスト: ' + cost,
    };
  }, [imageGeneration, numberOfCategories, numberOfProducts]);

  async function onSubmit(payload: ProductAISchema) {
    const { data } = await nextAxios.post('/api/products-ai', payload);

    const hljsResult = hljs.highlightAuto(data.result).value;
    setResult(hljsResult);
  }

  return (
    <Layout
      description='これはデモ製品を生成するためのOpenAI統合です。コマーステーマの例は「家庭用省エネ製品」、「電気自動車」、「鳥の餌台と用品」などです'
      title="Liferay製品生成器"
    >
      <Form
        formProviderProps={productForm}
        onSubmit={productForm.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 mb-5">
          <Input
            label="コマーステーマ"
            name="companyTheme"
            placeholder="コマーステーマを入力してください"
          />

          <Input
            label="語彙名"
            name="vocabularyName"
            placeholder="語彙名を入力してください"
          />

          <Input
            label="タクソノミーのグローバルサイトID"
            name="globalSiteId"
            placeholder="グローバルサイトIDを入力してください"
          />

          <Input
            label="カテゴリ数"
            name="numberOfCategories"
            placeholder="カテゴリ数を入力してください"
          />

          <Input
            label="カテゴリあたりの製品数"
            name="numberOfProducts"
            placeholder="カテゴリあたりの製品数を入力してください"
          />

          <Select
            defaultOption
            label="製品カタログID"
            name="catalogId"
            optionMap={catalogs}
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
          disabled={!productForm.formState.isValid || isSubmitting}
          label={submitLabel}
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
