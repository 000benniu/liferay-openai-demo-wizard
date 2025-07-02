import hljs from 'highlight.js';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import FieldSubmit from '../components/formfield-submit';
import Form from '../components/forms/form';
import Input from '../components/forms/input';
import Select from '../components/forms/select';
import Layout from '../components/layout';
import LoadingAnimation from '../components/loadinganimation';
import ResultDisplay from '../components/resultdisplay';
import schema, { z, zodResolver } from '../schemas/zod';
import nextAxios from '../services/next';

type ObjectsSchema = z.infer<typeof schema.objects>;

export default function Objects() {
  const objectsForm = useForm<ObjectsSchema>({
    defaultValues: {
      aiEndpoint: '/o/c/exampleobjects/batch',
      aiRequest: '日本の都道府県のリストを10個提供してください',
      aiRole:
        '回答リストを提供する責任を持つ、有能で役に立つアシスタントです。',
      objectFields: [
        { fieldDescription: '', fieldName: '', fieldType: 'string' },
      ],
    },
    resolver: zodResolver(schema.objects),
  });

  const { fields, ...fieldArray } = useFieldArray({
    control: objectsForm.control,
    name: 'objectFields',
  });

  const [updateCount, setUpdateCount] = useState(0);
  const [result, setResult] = useState('');

  const objectFields = objectsForm.watch('objectFields');

  const onSubmit = async (payload: ObjectsSchema) => {
    let postFields = {};

    for (let i = 0; i < objectFields.length; i++) {
      let fieldName = objectFields[i].fieldName;
      postFields[fieldName] = {
        description: objectFields[i].fieldDescription,
        type: objectFields[i].fieldType,
      };
    }

    const { data } = await nextAxios.post('/api/objects', {
      ...payload,
      objectFields: postFields,
    });

    const hljsResult = hljs.highlightAuto(data.result).value;

    setResult(hljsResult);
  };

  const addField = () => {
    event.preventDefault();
    fieldArray.append({ fieldDescription: '', fieldName: '', fieldType: '' });

    setUpdateCount(updateCount + 1);
  };

  const removeField = (index: number) => {
    event.preventDefault();

    fieldArray.remove(index);

    setUpdateCount(updateCount + 1);
  };

  const {
    formState: { isSubmitting },
  } = objectsForm;

  return (
    <Layout
      description="下記のプロンプトを入力し、オブジェクトデータを生成してください。"
      title="Liferayオブジェクトデータ生成器"
    >
      <Form
        className="mb-6"
        formProviderProps={objectsForm}
        onSubmit={objectsForm.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-1 mb-5">
          <Input
            label="AI生成器の役割"
            name="aiRole"
            placeholder="AIの役割を入力してください"
          />

          <Input
            label="OpenAIへの具体的なリクエスト"
            name="aiRequest"
            placeholder="OpenAIへのリクエストを入力してください"
          />

          <Input
            label="オブジェクトのバッチエンドポイント"
            name="aiEndpoint"
            placeholder="バッチエンドポイントを入力してください"
          />
        </div>

        <div className="bg-white/10 rounded p-3 mb-5">
          <h4 className="text-slate-200 font-bold mb-3">
            オブジェクト構造の説明
          </h4>

          {fields.map((_, index) => (
            <div
              className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:gap-4 mb-4"
              key={index}
            >
              <Input
                label="オブジェクトフィールド名"
                name={`objectFields.${index}.fieldName`}
                placeholder="オブジェクトフィールド名を入力してください"
              />

              <Input
                label="内容の説明"
                name={`objectFields.${index}.fieldDescription`}
                placeholder="例: 国名"
              />

              <Select
                label="フィールドタイプ"
                name={`objectFields.${index}.fieldType`}
                optionMap={[{ id: 'string', name: '文字列' }]}
              />
            </div>
          ))}

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-4 mb-2">
            <button
              className="text-sm pl-4 pr-4 rounded mt-6 disabled:bg-blue-800 bg-blue-400 font-semibold h-7 text-white disabled:text-slate-400"
              onClick={addField}
            >
              フィールドを追加
            </button>
            <button
              className="text-sm pl-4 pr-4 rounded mt-6 disabled:bg-blue-800 bg-blue-400 font-semiboldh-7 text-white disabled:text-slate-400"
              disabled={objectFields.length <= 1}
              onClick={() => removeField(objectFields.length - 1)}
            >
              最後のフィールドを削除
            </button>
          </div>
        </div>

        <FieldSubmit 
          disabled={!objectsForm.formState.isValid || isSubmitting}
          label="オブジェクトデータを生成" />
      </Form>

      {isSubmitting ? (
        <LoadingAnimation />
      ) : (
        result && <ResultDisplay result={result} />
      )}

      <div className="hidden">{updateCount}</div>
    </Layout>
  );
}
