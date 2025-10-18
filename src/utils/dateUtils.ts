export function daysSince(dateStr: string): number {
  const givenDate: Date = new Date(dateStr);
  const today: Date = new Date();

  givenDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime: number = today.getTime() - givenDate.getTime();
  const diffDays: number = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}
