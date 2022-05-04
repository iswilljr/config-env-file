import path from "path";
import action, { Config } from "./config";

export type Options = {
	destination?: string;
	extension?: string;
	template?: string;
	project?: "process" | "import";
	merge?: string;
};

const defaultConfig = {
	destination: ".",
	extension: "local",
	template: "",
	project: "process",
	merge: "",
};

export default async function (file: string, config: Options): Promise<void> {
	const _config: Config = Object.assign({}, defaultConfig, config, { file });
	if (_config.destination === ".") _config.destination = process.cwd();
	if (!path.isAbsolute(_config.file)) _config.file = path.join(process.cwd(), _config.file);
	if (!_config.merge) _config.merge = "";
	else if (!path.isAbsolute(_config.merge)) _config.merge = path.join(process.cwd(), _config.merge);
	if (_config.project !== "process" && _config.project !== "import")
		throw new Error("Project type must be process or import");
	if (!_config.file) throw new Error("File is required");
	action(_config);
}
