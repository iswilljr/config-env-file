import path from "path";
import fs from "fs/promises";
import { entries, noConfig } from "../fn";
import generate from "../generate";
import program from "../program";

export type Config = {
	file: string;
	destination: string;
	extension: string;
	template: string;
	project: "process" | "import";
	merge: string;
}

const config = async function ({ file, destination, extension, template, project, merge }: Config ): Promise<void> {
	if (destination === ".") destination = process.cwd();
	try {
		const config = JSON.parse(await fs.readFile(file, "utf8"));
		if (typeof config !== "object" || Array.isArray(config)) program.error(noConfig);
		if (!Object.keys(config).length) program.error(noConfig);
		const genFrom = config;
		if (merge) {
			const file = await fs.readFile(merge, "utf8");
			if (file) Object.assign(genFrom, Object.fromEntries(entries(file).filter((entry) => entry[0])));
		}
		await fs.writeFile(path.join(destination, `.env.${extension}`), generate(genFrom, template, "env"));
		const data = generate(genFrom, template, "file", project).split("\n").join(",\n  ");
		const newConfig = `const config = { \n  ${data}\n}`;
		console.log(`Check your .env.${extension} file\nYour config:\n${newConfig}`);
	} catch (error: any) {
		program.error(error.message);
	}
};

export default config;
