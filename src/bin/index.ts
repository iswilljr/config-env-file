#!/usr/bin/env node
import program from "../program";
import "../options";
import config from "../config";

program.action(config);

program.parse(process.argv);
