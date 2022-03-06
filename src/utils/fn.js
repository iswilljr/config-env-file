const PWD = process.env.PWD;
const path = require("path");

const noConfig = "error: config must be an object or JSON";


const isAbsolute = (/** @type {string} */ filePath) =>
	path.isAbsolute(filePath) ? filePath : path.resolve(PWD, filePath);

const entries = (/** @type {string} */ data) => data.split("\n").map((_) => _.split("="));

module.exports = { noConfig, isAbsolute, entries };
