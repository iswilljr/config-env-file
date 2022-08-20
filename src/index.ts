import fs from "fs/promises";
import { resolve } from "path";
import filenamify from "filenamify";
import { getConfig } from "./utils.js";

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
  try {
    const prefix = p ? filenamify(p, { replacement: "." }) : undefined;
    const extension = e ? filenamify(e, { replacement: "." }) ?? "local" : "local";

    if (!file) throw new Error("Config file is required");
    if (env && !["process", "import"].includes(env)) throw Error(`recived '${env}' expected 'process' or 'import'`);

    const config = JSON.parse(await fs.readFile(file, "utf8"));
    await fs.writeFile(resolve(destination, `.env.${extension}`), getConfig(config, prefix));

    console.log(`const yourConfig = { \n ${getConfig(config, prefix, "config", env)}\n}`);
  } catch (e: any) {
    console.error("error:", e.message);
    process.exit(1);
  }
};
