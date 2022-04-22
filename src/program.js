import { program } from "commander";
const version = "1.2.2";

program.version(version).description("A command line to generate a .env.local based on a Config");

export function addOptions(...options) {
	options.forEach((option) => {
		program.option(...option);
	});
}

export default program;
