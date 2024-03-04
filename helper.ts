export function secondsToDate(secs: number) {
  const epoch = new Date(0);
  epoch.setUTCSeconds(secs);
  const localDate = new Date(
    epoch.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );
  return localDate;
}

export function getAMPMFromISOString(isoString: Date) {
  const date = new Date(isoString);
  const hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  return ampm;
}
