import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { parse } from "dotenv";
import { constantCase } from "constant-case";
import { camelCase } from "camel-case";

type Env = "process" | "import";
type Options = {
  destination?: string;
  extension?: string;
  template?: string;
  env?: Env;
  merge?: string;
};
type GenerateOptions = {
  temp?: string;
  type?: "env" | "file";
  env?: Env;
  sep?: string;
};

const generate = (config: object, { temp = "", type = "env", env = "process", sep = "\n" }: GenerateOptions = {}) => {
  const isEnv = type === "env";
  const template = constantCase(temp);
  return (
    Object.entries(config)
      .map((v) => {
        const name = constantCase(v[0]);
        const key = `${template && !name.includes(template) ? `${template}_` : ""}${name}`;
        return isEnv
          ? `${key}=${v[1]}`
          : `${camelCase(name)}: ${env === "process" ? "process.env." : "import.meta.env."}${key}`;
      })
      .join(sep) + (isEnv ? "\n" : "")
  );
};

const configEnvFile = async (file: string, { destination, extension, template, env, merge }: Options = {}) => {
  try {
    if (!file) throw new Error("File is required");
    if (env && !["process", "import"].includes(env)) throw Error(`invalid value '${env}' to option 'env'.`);

    let config = Object.fromEntries(
      Object.entries(JSON.parse(await readFile(resolve(file), "utf8"))).map((v) => [constantCase(v[0]), v[1]])
    );
    if (Array.isArray(config)) throw Error("error: invalid or empty config");
    if (merge) config = { ...parse(await readFile(resolve(merge), "utf8")), ...config };

    await writeFile(resolve(destination || ".", `.env.${extension || "local"}`), generate(config, { temp: template }));
    const data = generate(config, { temp: template, type: "file", env, sep: ",\n  " });
    const newConfig = `const config = { \n  ${data}\n}`;

    console.log(`Check your .env.${extension || "local"} file\nYour config:\n${newConfig}`);
  } catch (error: any) {
    console.error("error:", error.message);
  }
};

export default configEnvFile;
