import { Option } from "commander";
import { pathFrom } from "./fn";
import program from "./program";

program.requiredOption("-f, --file <file>", "The config file to use", (root: string) => pathFrom(root));
program.option(
	"-d, --destination <destination>",
	"Destination path to env file",
	(r: string) => (r === "." ? process.cwd() : pathFrom(r)),
	"."
);
program.option("-e, --extension <extension>", "extension to env file name (example: env.prod, env.local)", "local");
program.option("-t, --template <template>", "Template to vars' name (example: REACT_APP_KEY, VITE_APP_API)");
program.addOption(
	new Option("-p, --project <type>", "Project type (example: process.env.KEY, import.meta.env.KEY)")
		.choices(["process", "import"])
		.default("process")
);
program.option("-m, --merge <file>", "merge a given env file with the new config", (value: string) => pathFrom(value));
