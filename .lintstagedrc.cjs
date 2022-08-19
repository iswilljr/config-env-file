module.exports = {
  "*.{js,jsx,ts,tsx}": () => ["yarn tsc --noEmit", "yarn lint --fix"],
  "*": () => ["yarn format"],
};
