import fs from "fs/promises";
import { constantCase } from "constant-case";

export async function getConfig(file) {
  const json = await fs.readFile(file, "utf8");
  return JSON.parse(json);
}

export function getVariableKey(key, _prefix) {
  const name = constantCase(key);
  const prefix = constantCase(_prefix ?? "");

  return `${prefix && !name.includes(prefix) ? `${prefix}_` : ""}${name}`;
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
