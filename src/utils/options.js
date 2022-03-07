const { Option } = require("commander");

// options
const file = ["-f, --file <file>", "File path where the config is"];

const destination = ["-d, --destination <destination>", "Destination path to env file"];

const extension = ["-e, --extension <extension>", "extension to env file name (example: env.prod, env.local)", "local"];

const template = [
	"-t, --template <template>",
	"Template to vars' name (example: REACT_APP_KEY, REACT_APP_API, VITE_APP_KEY,VITE_APP_API)",
];

const project = new Option("-p, --project <type>", "Project type (example: [process.env.KEY, import.meta.env.KEY])")
	.choices(["process", "import"])
	.default("process");

const merge = ["-m, --merge <file>", "merge a given env file with the new config"];

module.exports = { file, destination, extension, template, project, merge };
