export function classifyUser(years: number) {
  if (years < 2) return 'Junior';
  if (years < 5) return 'Mid-Level';
  if (years < 10) return 'Senior';
  return 'Expert';
}
