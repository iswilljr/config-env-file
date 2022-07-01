#!/usr/bin/env node
import { program, action } from "./program";

program.action(action);
program.parse(process.argv);
