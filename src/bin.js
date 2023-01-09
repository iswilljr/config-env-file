#!/usr/bin/env node
import { createRequire } from "module";
import sade from "sade";
import { configEnvFile } from "./index.js";

const pkg = createRequire(import.meta.url)("../package.json");

const cef = sade("cef <config-file>", true).version(pkg.version).describe(pkg.description);

cef
  .option("-d, --destination <d>", "destination path to env file")
  .option("-e, --extension <e>", "extension to env file name")
  .option("-p, --prefix <p>", "prefix to variables name")
  .option("-s, --silent", "skip console logs", false)
  .option("-E, --env <e>", "how to access variables");

cef
  .example("config.json # creates .env.local file with variables from config.json")
  .example("config.json -d ./my-app # creates .env.local to ./my-app")
  .example("config.json -e prod # creates env file like .env.prod")
  .example("config.json -p my_app # creates env vars with prefix MY_APP")
  .example("config.json -E import # output will be print with import.meta.env");

cef.action((file, options) => configEnvFile(file, { ...options, exitOnError: true })).parse(process.argv);
