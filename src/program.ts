import { Option, program } from "commander";
import { resolve } from "path";
import fs from "fs/promises";
import { parse } from "dotenv";

const normalize = (string: string) => string.replace(/-|\s/g, "_").replace(/\_$/, "").toUpperCase();

export type Project = "process" | "import";

export type Config = {
	file: string;
	destination: string;
	extension: string;
	template: string;
	project: Project;
	merge: string;
};

program.version("2.0.2").description("A command line to generate a .env.local based on a Config");

program.requiredOption("-f, --file <file>", "The config file to use");
program.option("-d, --destination <destination>", "Destination path to env file", ".");
program.option("-e, --extension <extension>", "extension to env file name (example: env.prod, env.local)", "local");
program.option("-t, --template <template>", "Template to vars' name (example: REACT_APP_KEY, VITE_APP_API)");
program.addOption(
	new Option("-p, --project <type>", "Project type (example: process.env.KEY, import.meta.env.KEY)")
		.choices(["process", "import"])
		.default("process")
);
program.option("-m, --merge <file>", "merge a given env file with the new config");

export function parseConfig(config: Config): Config {
	if (!config.file) throw new Error("File is required");
	if (!["process", "import"].includes(config.project)) throw Error("Project type must be process or import");
	config.destination = resolve(config.destination);
	config.file = resolve(config.file);
	if (config.merge) config.merge = resolve(config.merge);
	return config;
}

const generate = (config: object, template: string, typeConfig: "env" | "file", project?: Project) => {
	const isEnv = typeConfig === "env";
	return Object.entries(config)
		.map((v) => {
			const name = normalize(v[0]);
			const temp = template && !name.includes(normalize(template)) ? `${normalize(template)}_` : "";
			const varName = `${temp}${name}`.toUpperCase();
			const type = project === "process" ? "process.env." : "import.meta.env.";
			return isEnv ? `${varName}=${v[1]}` : `${name}: ${type}${varName}`;
		})
		.join("\n");
};

const action = async function (options: Config): Promise<void> {
	try {
		const { file, destination, extension, merge, project, template } = parseConfig(options);
		const config = Object.fromEntries(
			Object.entries(JSON.parse(await fs.readFile(file, "utf8"))).map((v) => [v[0].toUpperCase(), v[1]])
		);
		if (Array.isArray(config) || !Object.keys(config).length) throw Error("error: invalid or empty config");
		if (merge) Object.assign(config, parse(await fs.readFile(merge, "utf8")));
		await fs.writeFile(resolve(destination, `.env.${extension}`), generate(config, template, "env"));
		const data = generate(config, template, "file", project).split("\n").join(",\n  ");
		const newConfig = `const config = { \n  ${data}\n}`;
		console.log(`Check your .env.${extension} file\nYour config:\n${newConfig}`);
	} catch (error: any) {
		program.error(error.message);
	}
};

export { program, action };
