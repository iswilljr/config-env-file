import { program } from "commander";

program.version("2.0.2").description("A command line to generate a .env.local based on a Config");

export function addOptions(...options) {
	options.forEach((option) => {
		program.option(...option);
	});
}

export default program;
