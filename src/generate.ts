function normalize(string: string, u: boolean = false) {
	const s = string.replace(/-|\s/g, "_");
	return u ? s.toUpperCase() : s;
}

const generateEnv = (config: object, template: string, typeConfig: string, project?: string) =>
	Object.entries(config)
		.map((v) => {
			const isEnv = typeConfig === "env";
			const name = isEnv ? normalize(v[0], true) : normalize(v[0]);
			const temp = template && !name.includes(normalize(template, true)) ? `${normalize(template, true)}_` : "";
			const value = isEnv ? v[1] : "";
			const varName = `${temp}${name}`.toUpperCase();
			const type = project === "process" ? "process.env." : "import.meta.env.";
			return isEnv ? `${varName}=${value}` : `${name}: ${type}${varName}`;
		})
		.join("\n");

export default generateEnv;
