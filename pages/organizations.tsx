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

type OrganizationSchema = z.infer<typeof schema.organizations>;

export default function Organizations() {
  const organizationsForm = useForm<OrganizationSchema>({
    defaultValues: {
      childOrganizationtNumber: '3',
      departmentNumber: '3',
      organizationTopic: '日本のインターネット、電話、ケーブルサービス',
    },
    resolver: zodResolver(schema.organizations),
  });

  const [result, setResult] = useState('');

  async function onSubmit(payload: OrganizationSchema) {
    const { data } = await nextAxios.post('/api/organizations', payload);

    const hljsResult = hljs.highlightAuto(data.result).value;

    setResult(hljsResult);
  }

  const {
    formState: { isSubmitting },
  } = organizationsForm;

  return (
    <Layout
      description='下記のフィールドにビジネス説明を入力し、組織を生成してください。例:「自動車用品」「医療機器」「行政サービス」'
      title="Liferay組織生成器"
    >
      <Form
        formProviderProps={organizationsForm}
        onSubmit={organizationsForm.handleSubmit(onSubmit)}
      >
        <div className="w-700 grid grid-cols-2 gap-2 sm:grid-cols-2 md:gap-4 mb-5">
          <Input
            label="ビジネス説明"
            name="organizationTopic"
            placeholder="ビジネス説明を入力してください"
          />

          <Input
            label="子組織数"
            name="childOrganizationtNumber"
            placeholder="生成する子組織数を入力してください"
          />

          <Input
            label="部署数"
            name="departmentNumber"
            placeholder="生成する部署数を入力してください"
          />
        </div>

        <FieldSubmit 
          disabled={!organizationsForm.formState.isValid || isSubmitting}
          label="組織を生成" />
      </Form>

      {isSubmitting ? (
        <LoadingAnimation />
      ) : (
        result && <ResultDisplay result={result} />
      )}
    </Layout>
  );
}
