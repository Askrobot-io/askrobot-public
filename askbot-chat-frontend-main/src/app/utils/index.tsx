export const getCurrentTime = () => {
  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes();

  const formattedHours = hours < 10 ? '0' + hours : hours;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  const formattedTime = formattedHours + ':' + formattedMinutes;

  return formattedTime;
}
