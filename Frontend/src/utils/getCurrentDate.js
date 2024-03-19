
export default function getCurrentDate() {
  let dt = new Date();
  const currentDate = `${dt.getFullYear()}-${(dt.getMonth()+1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')}`
  return currentDate;
}
