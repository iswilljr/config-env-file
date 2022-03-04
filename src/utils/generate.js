const normalize = (string) => {
  return string.toUpperCase().replace(/-/g, "_");
};

// gerenare env file or config variable
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

      const name = isEnv ? normalize(v[0]) : v[0];
      const temp = template && !name.includes(normalize(template)) ? normalize(template) + "_" : "";
      const value = isEnv ? v[1] : "";

      const varName = `${temp}${name}`.toUpperCase();

      const type = project === "process" ? "process.env." : "import.meta.env.";

      return isEnv ? `${varName}=${value}` : `${name}: ${type}${varName}`;
    })
    .join("\n");

module.exports = generateEnv;
