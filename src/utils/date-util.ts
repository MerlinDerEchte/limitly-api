export const getSevenDaysAgo = (): Date => {
  const sevenDaysBefore = new Date();
  sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);
  return sevenDaysBefore;
};
