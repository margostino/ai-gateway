module.exports = {
  '**/*.(t|j)s': 'eslint --fix',
  '**/*': () => 'yarn check:ts',
  '*': 'prettier -u --check',
};
