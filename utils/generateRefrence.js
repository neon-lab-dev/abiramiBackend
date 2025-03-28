import prismadb from "../db/prismaDb.js";

export const generateRefrence = async () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const generateRandomRefrence = () => {
    const randomLetters =
      letters.charAt(Math.floor(Math.random() * letters.length)) +
      letters.charAt(Math.floor(Math.random() * letters.length));
    const randomNumber = Math.floor(100 + Math.random() * 900);
    return `${randomLetters}${randomNumber}`;
  };

  let newRefrence;
  let isUnique = false;

  while (!isUnique) {
    newRefrence = generateRandomRefrence();

    // Double-check if this reference is already in the database
    const existingRefrence = await prismadb.inventory.findFirst({
      where: { refrence: newRefrence },
    });

    if (!existingRefrence) {
      isUnique = true;
    }
  }

  return newRefrence;
};
