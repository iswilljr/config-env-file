#!/usr/bin/env node
import { Option, program } from "commander";
import configEnvFile from ".";

program.version("3.0.1").description("A command line to generate a .env.local based on a Config");

program.argument("<file>", "The config file to use");
program.option("-d, --destination <destination>", "Destination path to env file");
program.option("-e, --extension <extension>", "extension to env file name (example: env.prod, env.local)");
program.option("-t, --template <template>", "Template to vars' name (example: REACT_APP_KEY, VITE_APP_API)");
program.addOption(
  new Option("-E, --env <type>", "Env (example: process.env, import.meta.env)").choices(["process", "import"])
);
program.option("-m, --merge <file>", "merge a given env file with the new config");

program.action(configEnvFile);

program.parse(process.argv);
