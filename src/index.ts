import { action, Config } from "./program";

export interface Options extends Partial<Omit<Config, "file">> {}

const defaultConfig: Config = {
	file: "",
	destination: ".",
	extension: "local",
	template: "",
	project: "process",
	merge: "",
};

const configEnvFile = (file: string, options?: Options) => action({ ...defaultConfig, ...options, file });

export default configEnvFile;
