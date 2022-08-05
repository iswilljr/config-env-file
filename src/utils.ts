// Adapted from: https://github.com/blakeembrey/change-case/blob/master/packages/no-case
function noCase(str: string, delimiter: string, transform: (str: string, index: number) => string) {
	const splitRegexp = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g];
	const stripRegexp = /[^A-Z0-9]+/gi;

	function replace(input: string, re: RegExp | RegExp[], value: string) {
		if (re instanceof RegExp) return input.replace(re, value);
		return re.reduce((input, re) => input.replace(re, value), input);
	}

	let result = replace(replace(str, splitRegexp, "$1\0$2"), stripRegexp, "\0");
	let start = 0;
	let end = result.length;

	while (result.charAt(start) === "\0") start++;
	while (result.charAt(end - 1) === "\0") end--;

	return result.slice(start, end).split("\0").map(transform).join(delimiter);
}

// Adapted from: https://github.com/blakeembrey/change-case/blob/master/packages/camel-case
export function toConstantCase(str: string) {
	return noCase(str, "_", (str) => str.toUpperCase());
}

// Adapted from: https://github.com/blakeembrey/change-case/blob/master/packages/constant-case
function toCamelCase(str: string) {
	return noCase(str, "", (str, index) =>
		index === 0 ? str.toLowerCase() : `${str.charAt(0)}${str.slice(1).toLowerCase()}`
	);
}

export const getConfig = (
	config: object,
	prefix: string = "",
	type: "file" | "config" = "file",
	env: "process" | "import" = "process"
) => {
	const isFile = type === "file";
	const _prefix = toConstantCase(prefix);

	return (
		Object.entries(config)
			.map((v) => {
				const name = toConstantCase(v[0]);
				const key = `${_prefix && !name.includes(_prefix) ? `${_prefix}_` : ""}${name}`;

				return isFile
					? `${key}=${v[1]}`
					: `${toCamelCase(name)}: ${env === "process" ? "process.env." : "import.meta.env."}${key}`;
			})
			.join(isFile ? "\n" : ",\n ") + (isFile ? "\n" : "")
	);
};
