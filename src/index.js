import fs from "fs/promises";
import path from "path";
import { getConfig, getOptions, stringifyEnvFileConfig } from "./common.js";

export async function configEnvFile(file, options = {}) {
  const { destination, extension, prefix, includeObjects, noQuotes, singleQuotes } = getOptions(options);

  if (!file) {
    throw new Error("Config file is required");
  }

  const filePath = path.resolve(destination, `.env.${extension}`);

  const config = await getConfig(file);
  const envFileString = stringifyEnvFileConfig({
    config,
    prefix,
    includeObjects,
    quote: noQuotes ? "" : singleQuotes ? "'" : '"',
  });

  await fs.writeFile(filePath, envFileString);
}
