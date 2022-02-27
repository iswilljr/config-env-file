#!/usr/bin/env node
const fs = require("fs/promises");
const path = require("path");
const { program } = require("commander");
const { options, noFile, noConfig, generate } = require("./utils");

const PWD = process.env.PWD;

program
  .version("1.0.0")
  .description("A command line to generate a .env.local based on a Config");

program
  .option(...Object.values(options.file))
  .option(...Object.values(options.destination), PWD)
  .option(...Object.values(options.extension))
  .option(...Object.values(options.template))
  .option(...Object.values(options.project))
  .action((opt) => {
    let { file, destination: to, extension: ext, template, project } = opt;
    if (!file) throw noFile;
    if (to === ".") to = PWD;
    try {
      const filePath = path.isAbsolute(file) ? file : path.resolve(PWD, file);
      const config = require(filePath);
      if (typeof config !== "object") throw noConfig;
      const data = generate(config, template, "env");
      const filePath2 = path.join(
        path.isAbsolute(to) ? to : path.resolve(PWD, to),
        `.env.${ext}`
      );
      fs.writeFile(filePath2, data);
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
