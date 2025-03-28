function generateInvoiceId() {
    const letters = 'AB';
    const randomNumber = Math.floor(1 + Math.random() * 9999).toString().padStart(4, '0');
  
    // Get the current date
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // Months are 0-based
  
    // Determine fiscal year based on April 1st - March 31st cycle
    const startYear = currentMonth >= 4 ? currentYear : currentYear - 1;
    const endYear = startYear + 1;
    const fiscalYear = `${startYear}-${endYear.toString().slice(-2)}`;
  
    return `${letters}/${randomNumber}/${fiscalYear}`;
  }
  
  export default generateInvoiceId;
  