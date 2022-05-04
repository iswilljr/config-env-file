import { Command, program } from "commander";

program.version("2.0.2").description("A command line to generate a .env.local based on a Config");

export const command = new Command("init").description("Generate a .env.local file based on a config");

program.addCommand(command)

export default program;
