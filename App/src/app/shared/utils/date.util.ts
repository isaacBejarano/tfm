/** Check that 2 dates are the same */
const sameDate = (dateA: Date, dateB: Date): boolean => {
  return dateA.getTime() === dateB.getTime();
};

export { sameDate };
