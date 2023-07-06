export const dateFormat_YY_MM_DY = (dateMillis: number | string | null) => {
  if (dateMillis === null) return "-";
  const date = new Date(dateMillis);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  // append 0 if month or day is less than 10
  const mn = `${month < 10 ? `0${month}` : month}`;
  const dy = `${day < 10 ? `0${day}` : day}`;

  return `${year}-${mn}-${dy}`;
};

export const timestampToDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US");
};

export const dateFormat = (dateMillis: number | string) => {
  if (dateMillis === null || dateMillis === 0 || dateMillis === undefined)
    return "-";
  // year numeric, month numeric, day numeric
  const date = new Date(dateMillis);

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });
};


export const timestampToTime = (timestamp: any): string => {
  return timestamp.toDate().toLocaleTimeString("en-US");
};

export const addBusinessDaysToDate = (startDate: number, days: number) => {
  if (days === 0) return new Date(startDate);

  let count = 1;
  const curDate = new Date(startDate);
  // Count the days excluding weekends.
  while (count <= days) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    curDate.setDate(curDate.getDate() + 1);
  }

  // Minus 1 day from the dates.
  const endDate = curDate;
  endDate.setDate(curDate.getDate() - 1);
  endDate.setHours(23, 59, 59, 999);

  return endDate;
};

export const businessDaysBetweenDates = (date1: number, date2: number) => {
  const startDate = new Date(date1);
  const endDate = new Date(date2);
  // Validate input
  if (endDate < startDate) return 0;

  // Calculate days between dates
  const millisecondsPerDay = 86400 * 1000; // Day in milliseconds
  startDate.setHours(0, 0, 0, 1); // Start just after midnight
  endDate.setHours(23, 59, 59, 999); // End just before midnight
  const daysDifference = endDate.getTime() - startDate.getTime(); // Milliseconds between datetime objects
  let days = Math.ceil(daysDifference / millisecondsPerDay);

  // Subtract two weekend days for every week in between
  const weeks = Math.floor(days / 7);

  days = days - weeks * 2;

  // Handle special cases
  const startDay = startDate.getDay();
  const endDay = endDate.getDay();

  // Remove weekend not previously removed.
  if (startDay - endDay > 1) days = days - 2;

  // Remove start day if span starts on Sunday but ends before Saturday
  if (startDay === 0 && endDay !== 6) days = days - 1;

  // Remove end day if span ends on Saturday but starts after Sunday
  if (endDay === 6 && startDay !== 0) days = days - 1;

  return days;
};
