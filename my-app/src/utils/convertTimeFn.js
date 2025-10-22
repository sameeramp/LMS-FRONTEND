

export function convertTime(isoDate) {
  return new Date(isoDate).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata", 
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
