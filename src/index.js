#!/usr/bin/env node
const { exec: run } = require("child_process");
const fs = require("fs/promises");
const path = require("path");
const { program } = require("commander");
const { options, noFile, noConfig, generate } = require("./utils");
const { version } = require("../package.json");

const PWD = process.env.PWD;
const isAbsolute = (/** @type {string} */ filePath) =>
	path.isAbsolute(filePath) ? filePath : path.resolve(PWD, filePath);
const entries = (/** @type {string} */ data) => data.split("\n").map((_) => _.split("="));

program.version(version).description("A command line to generate a .env.local based on a Config");

program
	.option(...Object.values(options.file))
	.option(...Object.values(options.destination), PWD)
	.option(...Object.values(options.extension))
	.option(...Object.values(options.template))
	.option(...Object.values(options.project))
	.option(...Object.values(options.merge))
	.action(({ file, destination: to, extension: ext, template, project, merge }) => {
		if (!file) throw noFile;
		if (to === ".") to = PWD;
		try {
			const filePath = isAbsolute(file);
			const config = require(filePath);
			if (typeof config !== "object") throw noConfig;
			const filePath2 = path.join(isAbsolute(to), `.env.${ext}`);
			const data = generate(config, template, "env");
			if (merge)
				run("cat " + merge, (error, envFile, err) => {
					if (err) throw err;
					if (error) throw error;
					const mergedConfig = {};
					entries(envFile + "\n" + data).map((_) => (mergedConfig[_[0]] = _[1]));
					const newData = generate(mergedConfig, template, "env");
					fs.writeFile(filePath2, newData);
				});
			else {
				fs.writeFile(filePath2, data);
			}
			const newConfig = `const config = {
  ${generate(config, template, "file", project).split("\n").join(",\n  ")}
}`;
			console.log("Check your .env file\nYour config:");
			console.log(newConfig);
		} catch (error) {
			throw error;
		}
	});

program.parse(process.argv);
