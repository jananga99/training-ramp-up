export function getBeforeDate(year: number) {
  const currentDate = new Date();
  const yearsAgo = new Date(
    currentDate.getFullYear() - 18,
    currentDate.getMonth(),
    currentDate.getDate()
  );
  return yearsAgo;
}
