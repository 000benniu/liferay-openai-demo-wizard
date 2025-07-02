import { XCircleIcon } from '@heroicons/react/24/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import schema from '../schemas/zod';
import functions from '../utils/functions';
import Form from './forms/form';
import Input from './forms/input';
import Select from './forms/select';

const authenticationTypes = [
  { id: 'basic', name: '基本認証' },
  { id: 'oauth', name: 'OAuth2' },
];

const aiModelOptions = functions.getAIModelOptions();

export default function ConfigModal({
  appConfig,
  saveConfiguration,
  setShowModal,
}) {
  const configForm = useForm<z.infer<typeof schema.config>>({
    defaultValues: appConfig,
    resolver: zodResolver(schema.config),
  });

  const authenticationType = configForm.watch('authenticationType');

  return (
    <Form
      formProviderProps={configForm}
      onSubmit={configForm.handleSubmit(saveConfiguration)}
    >
      <div className="popup text-black justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl font-semibold mr-6">
                AIコンテンツウィザード設定
              </h3>
              <XCircleIcon
                className="h-8 w-8 fill-blue-500 cursor-pointer"
                onClick={() => setShowModal(false)}
              />
            </div>

            <div className="relative p-4 flex-auto">
              <div className="mb-2">
                <div className="mb-2 p-2 bg-blue-500/20 rounded-lg font-normal">
                  <div className="mb-1">
                    <Input
                      label="OpenAIキー"
                      name="openAIKey"
                      placeholder="OpenAIキーを入力してください"
                    />

                    <Select
                      label="AIモデル"
                      name="model"
                      optionMap={aiModelOptions}
                    />

                    <p className="text-xs text-black/60 pt-2 mt-2 p-2 bg-sky-400/20 rounded-lg font-normal">
                      OpenAI{' '}
                      <a
                        className="text-sky-500"
                        href="https://platform.openai.com/docs/models/overview"
                        target="_new"
                      >
                        モデル
                      </a>{' '}
                      と{' '}
                      <a
                        className="text-sky-500"
                        href="https://openai.com/pricing"
                        target="_new"
                      >
                        料金
                      </a>
                    </p>
                  </div>
                </div>

                <div className="p-2 mb-2 bg-green-600/20 rounded-lg">
                  <Input
                    label="サーバーURLを設定"
                    name="serverURL"
                    placeholder="サーバーURLを入力してください"
                  />
                </div>

                <div className="mb-2 p-2 bg-blue-600/20 rounded-lg">
                  <Select
                    label="認証タイプを選択"
                    name="authenticationType"
                    optionMap={authenticationTypes}
                  />
                </div>

                {authenticationType === 'basic' && (
                  <div>
                    <div className="mb-2 p-2 bg-blue-600/30 rounded-lg">
                      <Input
                        label="ユーザーログイン"
                        name="login"
                        placeholder="ユーザーログインを入力してください"
                      />

                      <Input
                        label="パスワード"
                        name="password"
                        placeholder="パスワードを入力してください（パスワードは直接保存されません）"
                        type="password"
                      />
                    </div>
                  </div>
                )}

                {authenticationType === 'oauth' && (
                  <div>
                    <div className="mb-2 p-2 bg-blue-600/30 rounded-lg">
                      <Input
                        label="OAuth2 - クライアントID"
                        name="clientId"
                        placeholder="クライアントIDを入力してください（シークレットは直接保存されません）"
                      />

                      <Input
                        label="OAuth2 - クライアントシークレット"
                        name="clientSecret"
                        placeholder="クライアントシークレットを入力してください（シークレットは直接保存されません）"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center p-2 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="bg-blue-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="submit"
              >
                設定を保存
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </Form>
  );
}
