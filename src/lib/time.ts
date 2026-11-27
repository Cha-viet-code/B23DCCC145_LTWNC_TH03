/** Giờ hiện tại dạng HH:mm:ss (giờ Việt Nam). */
export const formatTime = (date: Date): string =>
  date.toLocaleTimeString('en-GB', {
    hourCycle: 'h23',
    timeZone: 'Asia/Ho_Chi_Minh',
  });
