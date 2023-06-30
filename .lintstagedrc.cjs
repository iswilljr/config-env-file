module.exports = {
  "*.{js,jsx}": () => ["pnpm lint --fix"],
  "*": () => ["pnpm format"],
};
