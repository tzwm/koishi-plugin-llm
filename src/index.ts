import { Argv, Context, Schema } from 'koishi';
import { OpenAI } from "langchain/llms/openai";
import { getChain } from './utils';

export const name = 'llm';

export interface Config {
  azureOpenAIApiKey: string,
  azureOpenAIApiInstanceName: string,
  azureOpenAIApiDeploymentName: string,
  azureOpenAIApiVersion: string,
};

export const Config: Schema<Config> = Schema.object({
  azureOpenAIApiKey: Schema.string().required(),
  azureOpenAIApiInstanceName: Schema.string().required(),
  azureOpenAIApiDeploymentName: Schema.string().required(),
  azureOpenAIApiVersion: Schema.string().required(),
});

export function apply(ctx: Context, config: Config) {
  const llm = new OpenAI({
    azureOpenAIApiKey: config.azureOpenAIApiKey,
    azureOpenAIApiInstanceName: config.azureOpenAIApiInstanceName,
    azureOpenAIApiDeploymentName: config.azureOpenAIApiDeploymentName,
    azureOpenAIApiVersion: config.azureOpenAIApiVersion,
    modelName: "gpt-3.5-turbo",
    temperature: 0.4,
  });

  ctx.bots.forEach(b => b['llm'] = llm);

  ctx.command('llm.chat <preset:string>')
    .action((argv: Argv, prompt: string) => chatCallback(argv, prompt, config));
}


async function chatCallback(argv: Argv, prompt: string, config: Config) {
  const llm = argv.session.bot['llm'];
  const chain = getChain('{input}', llm);

  const res = await chain.call({input: prompt});

  return res.text;
}
