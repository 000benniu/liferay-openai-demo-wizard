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

type UserGroupsSchema = z.infer<typeof schema.userGroups>;

export default function UserGroups() {
  const userGroupsForm = useForm<UserGroupsSchema>({
    defaultValues: {
      userGroupNumber: '10',
      userGroupTopic: '就職支援サービスと研修',
    },
    resolver: zodResolver(schema.userGroups),
  });

  const [result, setResult] = useState('');

  async function onSubmit(payload: UserGroupsSchema) {
    const { data } = await nextAxios.post('/api/usergroups', payload);

    const hljsResult = hljs.highlightAuto(data.result).value;

    setResult(hljsResult);
  }

  const {
    formState: { isSubmitting },
  } = userGroupsForm;

  return (
    <Layout
      description='下記のフィールドにビジネス説明を入力し、ユーザーグループを生成してください。例:「高等教育」「自動車製造」「医療専門家」'
      title="Liferayユーザーグループ生成器"
    >
      <Form
        formProviderProps={userGroupsForm}
        onSubmit={userGroupsForm.handleSubmit(onSubmit)}
      >
        <div className="w-700 grid grid-cols-2 gap-2 sm:grid-cols-2 md:gap-4 mb-5">
          <Input
            label="ビジネス説明"
            name="userGroupTopic"
            placeholder="ビジネス説明を入力してください"
          />

          <Input
            label="ユーザーグループ数"
            name="userGroupNumber"
            placeholder="生成するユーザーグループ数を入力してください"
          />
        </div>

        <FieldSubmit 
          disabled={!userGroupsForm.formState.isValid || isSubmitting}
          label="ユーザーグループを生成" />
      </Form>

      {isSubmitting ? (
        <LoadingAnimation />
      ) : (
        result && <ResultDisplay result={result} />
      )}
    </Layout>
  );
}
