const normalize = (string) => {
  return string.toUpperCase().replace(/-/g, "_");
};

/**
 *
 * @param {Object} config
 * @param {string} template
 * @param {string} typeConfig
 * @param {string} project
 * @returns
 */
const generateEnv = (config, template, typeConfig, project) =>
  Object.entries(config)
    .map((v) => {
      const isEnv = typeConfig === "env";

      const temp = template ? normalize(template) + "_" : "";
      const name = isEnv ? normalize(v[0]) : v[0];
      const value = isEnv ? v[1] : "";

      const varName = `${temp}${name}`;

      const type = project === "process" ? "process.env." : "import.meta.env.";

      const variable = isEnv
        ? `${varName}=${value}`
        : `${name}: ${type}${varName.toUpperCase()}`;

      return variable;
    })
    .join("\n");

module.exports = generateEnv;
