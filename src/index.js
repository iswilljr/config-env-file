import fs from "fs/promises";
import path from "path";
import filenamify from "filenamify";
import { getConfig, stringifyEnvFileConfig } from "./common.js";

const VALID_ENV_NAMES = ["process", "import"];

export async function configEnvFile(file, options = {}) {
  const { destination = ".", extension: e, prefix, env = "process" } = options;

  if (!file) {
    throw new Error("Config file is required");
  }

  if (!VALID_ENV_NAMES.includes(env)) {
    throw Error(`received '${env}' expected 'process' or 'import'`);
  }

  const extension = (e && filenamify(e, { replacement: "." })) || "local";

  const filePath = path.resolve(destination, `.env.${extension}`);

  const config = await getConfig(file);
  const envFileString = stringifyEnvFileConfig(config, prefix);

  await fs.writeFile(filePath, envFileString);
}
