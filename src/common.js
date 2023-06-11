import fs from "fs/promises";
import filenamify from "filenamify";
import { constantCase } from "constant-case";

export const VALID_ENV_VALUES = ["process", "import"];

export async function getConfig(file) {
  const json = await fs.readFile(file, "utf8");
  return JSON.parse(json);
}

export function getVariableKey(key, _prefix) {
  const name = constantCase(key);
  const prefix = constantCase(_prefix ?? "");

  return `${prefix && !name.startsWith(prefix) ? `${prefix}_` : ""}${name}`;
}

export function getConfigVariableKeys({ _config, includeObjects, prefix }) {
  const config = Object.entries(_config).map(([key, value]) => {
    if (typeof value === "object" && !includeObjects) return null;

    const name = getVariableKey(key, prefix);

    return { name, key, value };
  });

  return config.filter((value) => value != null);
}

export function stringifyConfig({ config: _config, env, includeObjects, prefix }) {
  const envKey = env === "process" ? "process.env." : "import.meta.env.";

  const config = getConfigVariableKeys({ _config, includeObjects, prefix }).map(
    ({ name, key }) => `${key}: ${envKey}${name}`
  );

  return `const config = { \n ${config.join(",\n ")}\n}`;
}

export function stringifyEnvFileConfig({ config: _config, includeObjects, prefix, quote }) {
  const config = getConfigVariableKeys({ _config, includeObjects, prefix }).map(({ name, value }) => {
    return `${name}=${quote}${JSON.stringify(value).replace(/^"/, "").replace(/"$/, "")}${quote}`;
  });

  return `${config.join("\n")}\n`;
}

export function getOptions(options) {
  const { destination = ".", extension: e, prefix, includeObjects, noQuotes, singleQuotes } = options;

  if (typeof destination !== "string") typeError("destination", typeof destination);
  if (prefix != null && typeof prefix !== "string") typeError("prefix", typeof prefix);
  if (e != null && typeof e !== "string") typeError("extension", typeof e);
  if (destination === "") typeError("destination", "empty string");

  const extension = (e && filenamify(e, { replacement: "." })) || "local";

  return {
    destination,
    extension,
    prefix,
    includeObjects: Boolean(includeObjects),
    noQuotes: Boolean(noQuotes),
    singleQuotes: Boolean(singleQuotes),
  };
}

function typeError(name, value) {
  throw TypeError(`Invalid argument '${name}', expected 'string' got ${value}`);
}
