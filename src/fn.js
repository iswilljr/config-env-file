import path from "path";

export const noConfig = "error: config must be an object or JSON";
export const pathFrom = (/** @type {string} */ filePath) =>
	path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
export const entries = (/** @type {string} */ data) => {
	if (!data.includes("=")) throw new Error("error: invalid file format to merge").message;
	return data.split("\n").map((_) => _.split("="));
};
