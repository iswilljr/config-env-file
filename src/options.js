import { Option } from "commander";
import { pathFrom } from "./fn.js";

// options
export const file = ["-f, --file <file>", "File path where the config is", (value) => pathFrom(value)];
export const destination = [
	"-d, --destination <destination>",
	"Destination path to env file",
	".",
	(value) => (value === "." ? process.cwd() : pathFrom(value)),
];
export const extension = [
	"-e, --extension <extension>",
	"extension to env file name (example: env.prod, env.local)",
	"local",
];
export const template = ["-t, --template <template>", "Template to vars' name (example: REACT_APP_KEY, VITE_APP_API)"];
export const project = new Option(
	"-p, --project <type>",
	"Project type (example: process.env.KEY, import.meta.env.KEY)"
)
	.choices(["process", "import"])
	.default("process");
export const merge = ["-m, --merge <file>", "merge a given env file with the new config", (value) => pathFrom(value)];
