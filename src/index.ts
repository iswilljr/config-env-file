import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { getConfig, toConstantCase } from "./utils.js";

interface Options {
  destination?: string;
  extension?: string;
  prefix?: string;
  env?: "process" | "import";
}

export const configEnvFile = async (
  file: string,
  { destination = ".", extension: e, prefix: p, env }: Options = {}
) => {
  const escape = /[a-z0-9._-]+/gi;
  const prefix = p ? p.trim().match(escape)?.join("") : undefined;
  const extension = e ? e.trim().match(escape)?.join("") ?? "local" : "local";

  try {
    if (!file) throw new Error("File is required");
    if (env && !["process", "import"].includes(env)) throw Error(`recived '${env}' expected 'process' or 'import'`);

    const readedFile = await readFile(resolve(file), "utf8");
    const configFile = JSON.parse(readedFile);
    const config = Object.fromEntries(Object.entries<string>(configFile).map((v) => [toConstantCase(v[0]), v[1]]));

    await writeFile(resolve(destination, `.env.${extension}`), getConfig(config, prefix));

    console.log(
      `Check your .env.${extension}\nyour config:\nconst config = { \n ${getConfig(config, prefix, "config", env)}\n}`
    );
  } catch (e: any) {
    console.error("error:", e);
    process.exit(1);
  }
};
