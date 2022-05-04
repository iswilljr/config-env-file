import path from "path";
const currentDir = process.cwd();
export const pathFrom = (root: string): string => (path.isAbsolute(root) ? root : path.join(currentDir, root));

export const noConfig = "error: config must be an object or JSON";

export const entries = (data: string) => {
	if (!data.includes("=")) throw new Error("error: invalid file format to merge").message;
	return data.split("\n").map((_) => _.split("="));
};
