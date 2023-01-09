import fs from "fs/promises";
import { resolve } from "path";
import filenamify from "filenamify";
import { constantCase } from "constant-case";

const getConfig = (config, _prefix = "", type = "file", env = "process") => {
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

export const configEnvFile = async (file, options = {}) => {
  const { destination = ".", extension: e, prefix: p, env, exitOnError = false, silent = true } = options;

  try {
    const prefix = p ? filenamify(p, { replacement: "." }) : undefined;
    const extension = e ? filenamify(e, { replacement: "." }) || "local" : "local";

    if (!file) throw new Error("Config file is required");
    if (env && !["process", "import"].includes(env)) throw Error(`received '${env}' expected 'process' or 'import'`);

    const config = JSON.parse(await fs.readFile(file, "utf8"));
    await fs.writeFile(resolve(destination, `.env.${extension}`), getConfig(config, prefix));

    if (!silent) console.log(`const config = { \n ${getConfig(config, prefix, "config", env)}\n}`);
  } catch (e) {
    if (exitOnError) {
      console.error("error:", e.message);
      process.exit(1);
    }
    throw Error(e.message);
  }
};
