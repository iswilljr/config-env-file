import fs from "fs/promises";
import { constantCase } from "constant-case";

export async function getConfig(file) {
  const json = await fs.readFile(file, "utf8");
  return JSON.parse(json);
}

export function getVariableKey(key, _prefix) {
  const name = constantCase(key);
  const prefix = constantCase(_prefix);

  return `${prefix && !name.includes(prefix) ? `${prefix}_` : ""}${name}`;
}

export function stringifyConfig(_config, env = "process", _prefix = "") {
  const envKey = env === "process" ? "process.env." : "import.meta.env.";

  const config = Object.keys(_config).map((key) => {
    const varKey = getVariableKey(key, _prefix);
    return `${key}: ${envKey}${varKey}`;
  });

  return `const config = { \n ${config.join(",\n ")}\n}`;
}

export function stringifyEnvFileConfig(_config, _prefix = "") {
  const config = Object.entries(_config).map(([key, value]) => {
    const name = getVariableKey(key, _prefix);
    return `${name}=${value}`;
  });

  return `${config.join("\n")}\n`;
}
