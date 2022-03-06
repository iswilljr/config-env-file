const { Option } = require("commander");

// options
const file = {
	flags: "-f, --file <file>",
	desc: "File path where the config is",
};

const destination = {
	flags: "-d, --destination <destination>",
	desc: "Destination path to env file",
};

const extension = {
	flags: "-e, --extension <extension>",
	desc: "extension to env file name (example: [env.prod, env.local])",
	default: "local",
};

const template = {
	flags: "-t, --template <template>",
	desc: "Template to vars' name (example: [[REACT_APP_KEY, REACT_APP_API], [VITE_APP_KEY,VITE_APP_API]])",
};

const project = new Option(
	"-p, --project <type>",
	"Project type (options: [process, import], example: [process.env.KEY, import.meta.env.KEY])"
)
	.choices(["process", "import"])
	.default("process");

const merge = {
	flags: "-m, --merge <file>",
	desc: "merge a given env file with the new config",
};

module.exports = { file, destination, extension, template, project, merge };
