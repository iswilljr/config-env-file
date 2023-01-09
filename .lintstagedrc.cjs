module.exports = {
  "*.{js,jsx}": () => ["yarn lint --fix"],
  "*": () => ["yarn format"],
};
