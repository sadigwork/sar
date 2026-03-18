export function calculateExperienceDuration(startDate: Date, endDate?: Date) {
  const end = endDate || new Date();

  const diffTime = end.getTime() - startDate.getTime();

  if (diffTime < 0) {
    throw new Error('End date must be after start date');
  }

  const totalMonths =
    (end.getFullYear() - startDate.getFullYear()) * 12 +
    (end.getMonth() - startDate.getMonth());

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return {
    years,
    months,
    totalMonths,
  };
}
