import hljs from 'highlight.js';
import { useState } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';

import FieldSubmit from '../components/formfield-submit';
import Form from '../components/forms/form';
import Input from '../components/forms/input';
import Layout from '../components/layout';
import LoadingAnimation from '../components/loadinganimation';
import ResultDisplay from '../components/resultdisplay';
import schema, { z, zodResolver } from '../schemas/zod';
import nextAxios from '../services/next';

type WarehouseSchema = z.infer<typeof schema.warehouse>;

export default function Warehouses() {
  const warehouseForm = useForm<WarehouseSchema>({
    defaultValues: {
      warehouseNumber: '10',
      warehouseRegion: '神奈川県',
    },
    resolver: zodResolver(schema.warehouse),
  });

  const [result, setResult] = useState('');

  async function onSubmit(payload: WarehouseSchema) {
    const { data } = await nextAxios.post('/api/warehouses', payload);

    const hljsResult = hljs.highlightAuto(data.result).value;

    setResult(hljsResult);
  }

  const {
    formState: { isSubmitting },
  } = warehouseForm;

  return (
    <Layout
      description="下記のフィールドに地域を入力し、倉庫リストを生成してください。例:『グローバル』『アメリカ中西部』『イタリアと周辺国』"
      title="Liferay倉庫生成器"
    >
      <Form
        formProviderProps={warehouseForm}
        onSubmit={warehouseForm.handleSubmit(onSubmit)}
      >
        <div className="w-700 grid grid-cols-2 gap-2 sm:grid-cols-2 md:gap-4 mb-5">
          <Input
            label="倉庫の地域"
            name="warehouseRegion"
            placeholder="倉庫の地域を入力してください"
          />

          <Input
            label="倉庫数"
            name="warehouseNumber"
            placeholder="生成する倉庫数を入力してください"
          />
        </div>

        <FieldSubmit
          disabled={!warehouseForm.formState.isValid || isSubmitting}
          label="倉庫を生成" />
      </Form>

      <p className="text-slate-100 text-center text-lg mb-3 rounded p-5 bg-white/10 w-1/2 italic">
        <b>注意:</b> 最近、GPT 3.5での倉庫リスト生成が不安定になったため、自動的にGPT 4.0 Turbo Previewが使用されます。
      </p>

      {isSubmitting ? (
        <LoadingAnimation />
      ) : (
        result && <ResultDisplay result={result} />
      )}
    </Layout>
  );
}
