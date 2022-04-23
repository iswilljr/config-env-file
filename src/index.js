#!/usr/bin/env node
import path from "path";
import fs from "fs/promises";
import program, { addOptions } from "./program.js";
import { entries, noConfig } from "./fn.js";
import generate from "./generate.js";
import { file, destination, extension, merge, project, template } from "./options.js";

program.requiredOption(...file);
addOptions(extension, template, destination, merge);
program.addOption(project);

program.action(async ({ file, destination: to, extension: ext, template, project, merge, config }) => {
	if (to === ".") to = process.cwd();
	try {
		const config = JSON.parse(await fs.readFile(file, "utf8"));
		if (typeof config !== "object" || Array.isArray(config)) program.error(noConfig);
		if (!Object.keys(config).length) program.error(noConfig);
		const genFrom = config;
		if (merge) {
			const file = await fs.readFile(merge, "utf8");
			if (file) Object.assign(genFrom, Object.fromEntries(entries(file).filter((entry) => entry[0])));
		}
		await fs.writeFile(path.join(to, `.env.${ext}`), generate(genFrom, template, "env"));
		const data = generate(genFrom, template, "file", project).split("\n").join(",\n  ");
		const newConfig = `const config = { \n  ${data}\n}`;
		console.log(`Check your .env.${ext} file\nYour config:\n${newConfig}`);
	} catch (error) {
		program.error(error);
	}
});

program.parse(process.argv);
