import hljs from "highlight.js";
import { useState } from "react";
import React from "react";
import { useForm } from "react-hook-form";

import TopNavItem from "../components/apptopnavitem";
import FieldLanguage from "../components/formfield-language";
import FieldSubmit from "../components/formfield-submit";
import Form from "../components/forms/form";
import Input from "../components/forms/input";
import Select from "../components/forms/select";
import Layout from "../components/layout";
import LoadingAnimation from "../components/loadinganimation";
import ResultDisplay from "../components/resultdisplay";
import schema, { z, zodResolver } from "../schemas/zod";
import nextAxios from "../services/next";
import { downloadFile } from "../utils/download";
import functions from "../utils/functions";
import { logger } from "../utils/logger";

const debug = logger("faqs");

type FaqSchema = z.infer<typeof schema.faq>;

const handleStructureClick = () => {
  downloadFile({
    fileName: "Structure-Frequently_Asked_Question.json",
    filePath: "faqs/Structure-Frequently_Asked_Question.json",
  });
};

const handleFragmentClick = () => {
  location.href = "faqs/Fragment-FAQ.zip";
};

const viewOptions = functions.getViewOptions();

export default function Faqs() {

  const faqForm = useForm<FaqSchema>({
    defaultValues: {
      categoryIds: "",
      defaultLanguage: "en-US",
      faqNumber: "5",
      folderId: "0",
      languages: [""],
      manageLanguage: false,
      viewOptions: viewOptions[0].id,
    },
    resolver: zodResolver(schema.faq),
  });

  const [result, setResult] = useState("");

  async function onSubmit(payload: FaqSchema) {
    debug(
      `languagesInput ${payload.languages}, manageLanguageInput ${payload.manageLanguage}, defaultLaguagesInput ${payload.defaultLanguage}`,
    );

    const { data } = await nextAxios.post("/api/faqs", payload);

    const hljsResult = hljs.highlightAuto(data.result).value;
    setResult(hljsResult);
  }

  const {
    formState: { isSubmitting },
  } = faqForm;

  return (
    <Layout
      description={`以下のフィールドにトピックを入力してFAQをお待ちください。FAQトピックの例は「予算計画」、「製造会社の立ち上げ」、「重曹の実用的な用途」などです。`}
      title="Liferay FAQ生成器"
    >
      <div className="download-options fixed right-5 top-2 rounded p-5 text-lg">
        <TopNavItem label="FAQ構造" onClick={handleStructureClick} />
        <TopNavItem label="FAQフラグメント" onClick={handleFragmentClick} />
      </div>

      <Form
        formProviderProps={faqForm}
        onSubmit={faqForm.handleSubmit(onSubmit)}
      >
        <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-3 md:gap-4">
          <Input
            label="FAQトピック"
            name="faqTopic"
            placeholder="FAQトピックを入力してください"
          />

          <Input
            label="作成するQ&Aペアの数"
            name="faqNumber"
            placeholder="FAQ数"
          />

          <Input
            label="サイトIDまたはアセットライブラリグループID"
            name="siteId"
            placeholder="サイトIDまたはアセットライブラリグループIDを入力してください"
          />

          <Input
            label="FAQ構造ID"
            name="structureId"
            placeholder="FAQ構造IDを入力してください"
          />

          <Input
            label="WebコンテンツフォルダID（ルートの場合は0）"
            name="folderId"
            placeholder="フォルダIDを入力してください"
          />

          <Select
            label="表示オプション"
            name="viewOptions"
            optionMap={viewOptions}
          />

          <Input
            label="カンマ区切りカテゴリID（オプション）"
            name="categoryIds"
            placeholder="カンマ区切りのカテゴリIDリスト"
          />
        </div>

        <FieldLanguage
          defaultLanguageChange={(value) =>
            faqForm.setValue("defaultLanguage", value)
          }
          languagesChange={(value) => faqForm.setValue("languages", value)}
          manageLanguageChange={(value) =>
            faqForm.setValue("manageLanguage", value)
          }
        />

        <FieldSubmit 
          disabled={!faqForm.formState.isValid || isSubmitting}
          label="FAQを生成" />
      </Form>

      <p className="mb-3 w-1/2 rounded bg-white/10 p-5 text-center text-lg italic text-slate-100">
        <b>注意:</b> FAQ生成には特定のコンテンツ構造が必要です。{" "}
        <br />
        上記で提供されているFAQ構造とフラグメントを使用してください。
      </p>

      {isSubmitting ? (
        <LoadingAnimation />
      ) : (
        result && <ResultDisplay result={result} />
      )}
    </Layout>
  );
}
