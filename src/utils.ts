import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { BaseLLM } from "langchain/llms";

export async function trans2en(input: string, llm: BaseLLM) {
  const template = '如果是中文帮我翻译为英文：{input}';
  const res = await getChain(template, llm)
    .call({ input: input });

  return res.text;
}

export function getChain(template: string, llm: BaseLLM) {
  const promptTemplate = PromptTemplate.fromTemplate(template);

  return new LLMChain({
    llm: llm,
    prompt: promptTemplate,
  });
}
