export function secondsToDate(secs: number) {
  const epoch = new Date(0);
  epoch.setUTCSeconds(secs);
  const localDate = new Date(
    epoch.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );
  return localDate;
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${formattedHours}.${formattedMinutes}`;
}
