function generateInvoiceId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters =
      letters.charAt(Math.floor(Math.random() * letters.length)) +
      letters.charAt(Math.floor(Math.random() * letters.length));
    const randomNumber = Math.floor(100 + Math.random() * 900);
  
    // Get the current date
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // Months are 0-based
  
    // Determine fiscal year based on April 1st - March 31st cycle
    const startYear = currentMonth >= 4 ? currentYear : currentYear - 1;
    const endYear = startYear + 1;
    const fiscalYear = `${startYear}-${endYear.toString().slice(-2)}`;
  
    return `${randomLetters}/${randomNumber}/${fiscalYear}`;
  }
  
  export default generateInvoiceId;
  