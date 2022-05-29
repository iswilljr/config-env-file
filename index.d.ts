declare module "config-env-file" {
	export type Options = {
		destination?: string;
		extension?: string;
		template?: string;
		project?: "process" | "import";
		merge?: string;
	};
	
	export default function configEnvFile(file: string, options: Options): Promise<void>;
}
