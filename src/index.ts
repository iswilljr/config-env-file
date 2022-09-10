import fs from "fs/promises";
import { resolve } from "path";
import filenamify from "filenamify";
import { constantCase } from "constant-case";

type GetConfig = (
  config: Record<string, string>,
  prefix?: string,
  type?: "file" | "config",
  env?: "process" | "import"
) => string;

interface Options {
  destination?: string;
  extension?: string;
  prefix?: string;
  env?: "process" | "import";
  exitOnError?: boolean;
}

const getConfig: GetConfig = (config, _prefix = "", type = "file", env = "process") => {
  const isFile = type === "file";
  const prefix = constantCase(_prefix);

  const newConfig = Object.entries(config).map(([k, value]) => {
    const name = constantCase(k);
    const key = `${prefix && !name.includes(prefix) ? `${prefix}_` : ""}${name}`;
    const config = `${k}: ${env === "process" ? "process.env." : "import.meta.env."}${key}`;
    return isFile ? `${key}=${value}` : config;
  });

  return newConfig.join(isFile ? "\n" : ",\n ") + (isFile ? "\n" : "");
};

export const configEnvFile = async (
  file: string,
  { destination = ".", extension: e, prefix: p, env, exitOnError = false }: Options = {}
) => {
  try {
    const prefix = p ? filenamify(p, { replacement: "." }) : undefined;
    const extension = e ? filenamify(e, { replacement: "." }) || "local" : "local";

    if (!file) throw new Error("Config file is required");
    if (env && !["process", "import"].includes(env)) throw Error(`received '${env}' expected 'process' or 'import'`);

    const config = JSON.parse(await fs.readFile(file, "utf8"));
    await fs.writeFile(resolve(destination, `.env.${extension}`), getConfig(config, prefix));

    console.log(`const config = { \n ${getConfig(config, prefix, "config", env)}\n}`);
  } catch (e: any) {
    console.error("error:", e.message);
    exitOnError && process.exit(1);
  }
};
