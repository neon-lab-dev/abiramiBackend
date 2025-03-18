export const generateRefrence=()=>{
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters =
      letters.charAt(Math.floor(Math.random() * letters.length)) +
      letters.charAt(Math.floor(Math.random() * letters.length));
    const randomNumber = Math.floor(100 + Math.random() * 900);

    return `${randomLetters}${randomNumber}`;
}