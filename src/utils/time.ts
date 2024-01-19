export const getDurationInMilliseconds = (startHrTime: [number, number]) => {
  const NS_PER_SEC = 1e9; // convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diffHrTime = process.hrtime(startHrTime);
  const durationMs = (diffHrTime[0] * NS_PER_SEC + diffHrTime[1]) / NS_TO_MS;
  return Math.round(durationMs);
};

export const getDurationMsFrom = (startTimeString: string | undefined) => {
  if (!startTimeString) {
    return -1;
  }
  const [seconds, nanoseconds] = startTimeString
    ? startTimeString.toString().split(',').map(Number)
    : [0, 0];
  const startHrTime: [number, number] = [seconds, nanoseconds];
  return getDurationInMilliseconds(startHrTime);
};
