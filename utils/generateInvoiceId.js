import prismadb from "../db/prismaDb.js";

async function generateInvoiceId() {
  const letters = 'AE';

  // Fetch the last used invoice number
  const counter = await prismadb.InvoiceCounter.findUnique({
    where: { id: 1 },
  });

  let lastUsed = counter ? counter.lastUsed : 0;

  // Increment the last used number
  const newNumber = (lastUsed + 1).toString().padStart(4, '0');

  // Update the last used number in the database
  await prismadb.InvoiceCounter.upsert({
    where: { id: 1 },
    update: { lastUsed: lastUsed + 1 },
    create: { id: 1, lastUsed: lastUsed + 1 },
  });

  // Get the current date
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // Months are 0-based

  // Determine fiscal year based on April 1st - March 31st cycle
  const startYear = currentMonth >= 4 ? currentYear : currentYear - 1;
  const endYear = startYear + 1;
  const fiscalYear = `${startYear}-${endYear.toString().slice(-2)}`;

  return `${letters}/${newNumber}/${fiscalYear}`;
}

export default generateInvoiceId;