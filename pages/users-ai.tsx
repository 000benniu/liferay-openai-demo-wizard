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

type UserAISchema = z.infer<typeof schema.userAI>;

export default function UsersAI() {
  const usersAIForm = useForm<UserAISchema>({
    defaultValues: {
      emailPrefix: 'liferay.xyz',
      password: 'password',
      userNumber: '5',
    },
    resolver: zodResolver(schema.userAI),
  });

  const [result, setResult] = useState('');

  async function onSubmit(payload: UserAISchema) {
    const { data } = await nextAxios.post('/api/users-ai', payload);

    const hljsResult = hljs.highlightAuto(data.result).value;

    setResult(hljsResult);
  }

  const {
    formState: { isSubmitting },
  } = usersAIForm;

  return (
    <Layout
      description="以下のフォームを使用してユーザーを作成します。"
      title="Liferayユーザー生成器"
    >
      <Form
        formProviderProps={usersAIForm}
        onSubmit={usersAIForm.handleSubmit(onSubmit)}
      >
        <div className="w-500 grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-4 mb-5">
          <Input
            label="作成するユーザー数"
            name="userNumber"
            placeholder="ユーザー数"
          />

          <Input
            label="メールドメイン (example.com)"
            name="emailPrefix"
            placeholder="liferay.xyz"
          />

          <Input
            label="ユーザーデフォルトパスワード"
            name="password"
            placeholder="password"
          />
        </div>

        <FieldSubmit 
          disabled={!usersAIForm.formState.isValid || isSubmitting}
          label="ユーザーを生成" />
      </Form>

      {isSubmitting ? (
        <LoadingAnimation />
      ) : (
        result && <ResultDisplay result={result} />
      )}
    </Layout>
  );
}
