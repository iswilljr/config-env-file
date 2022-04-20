#!/usr/bin/env node
const { exec: run } = require("child_process");
const fs = require("fs/promises");
const path = require("path");
const { program } = require("commander");
const { options, generate, entries, noConfig, isAbsolute } = require("./utils");
const { version } = require("../package.json");

const PWD = process.env.PWD;

program
	.version(version)
	.description("A command line to generate a .env.local based on a Config")
	.requiredOption(...options.file)
	.option(...options.destination, ".")
	.option(...options.extension)
	.option(...options.template)
	.addOption(options.project)
	.option(...options.merge)
	.showSuggestionAfterError()
	.action(({ file, destination: to, extension: ext, template, project, merge }) => {
		if (to === ".") to = PWD;
		try {
			const configPath = isAbsolute(file);
			const config = require(configPath);
			if (typeof config !== "object" || Array.isArray(config)) program.error(noConfig);
			const filePath = path.join(isAbsolute(to), `.env.${ext}`);
			const data = generate(config, template, "env");
			if (merge)
				run("cat " + merge, (error, envFile, err) => {
					if (err) program.error(err);
					if (error) program.error(error);
					const mergedConfig = Object.fromEntries(entries(envFile + "\n" + data));
					const newData = generate(mergedConfig, template, "env");
					fs.writeFile(filePath, newData);
				});
			else {
				fs.writeFile(filePath, data);
			}
			const newConfig = `const config = { \n  ${generate(config, template, "file", project)
				.split("\n")
				.join(",\n  ")}\n}`;
			console.log("Check your .env file\nYour config:");
			console.log(newConfig);
		} catch (error) {
			program.error(error);
		}
	});

program.parse(process.argv);
