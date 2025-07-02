import { zodResolver } from "@hookform/resolvers/zod";
import hljs from "highlight.js";
import { useState } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import FieldSubmit from "../components/formfield-submit";
import Form from "../components/forms/form";
import Input from "../components/forms/input";
import Layout from "../components/layout";
import LoadingAnimation from "../components/loadinganimation";
import ResultDisplay from "../components/resultdisplay";
import nextAxios from "../services/next";

const accountFormSchema = z.object({
  businessDescription: z.string().min(3),
  numberOfAccounts: z.string().min(1),
});

type AccountFormSchema = z.infer<typeof accountFormSchema>;

export default function Accounts() {
  const [result, setResult] = useState("");

  const accountForm = useForm<AccountFormSchema>({
    defaultValues: {
      businessDescription: "",
      numberOfAccounts: "1",
    },
    resolver: zodResolver(accountFormSchema),
  });

  const {
    formState: { isSubmitting },
  } = accountForm;

  async function onSubmit({
    businessDescription,
    numberOfAccounts,
  }: AccountFormSchema) {
    const { data } = await nextAxios.post("/api/accounts", {
      accountNumber: numberOfAccounts,
      accountTopic: businessDescription,
    });

    const hljsResult = hljs.highlightAuto(data.result).value;

    setResult(hljsResult);
  }

  return (
    <Layout
      description={`下記のフィールドにビジネス説明を入力し、アカウントを生成してください。例:「自動車用品」「医療機器」「行政サービス」`}
      title="Liferayアカウント生成器"
    >
      <Form
        formProviderProps={accountForm}
        onSubmit={accountForm.handleSubmit(onSubmit)}
      >
        <div className="w-700 mb-5 grid grid-cols-2 gap-2 sm:grid-cols-2 md:gap-4">
          <Input
            label="ビジネス説明"
            name="businessDescription"
            placeholder="ビジネス説明を入力してください"
          />

          <Input
            label="アカウント数"
            name="numberOfAccounts"
            placeholder="生成するアカウント数を入力してください"
          />
        </div>

        <FieldSubmit
          disabled={!accountForm.formState.isValid || isSubmitting}
          label="アカウントを生成"
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
