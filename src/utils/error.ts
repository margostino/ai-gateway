export const exitIfUndefinedOrEmpty = (
  key: string,
  value: string | undefined,
) => {
  if (!value) {
    console.log(`${key} is not specified. Exiting...`);
    process.exit(1);
  }
};
