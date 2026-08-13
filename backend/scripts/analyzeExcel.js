const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../../VendSway_Massive_Dataset.xlsx');
const workbook = XLSX.readFile(excelPath);

console.log('Sheets:', workbook.SheetNames);
workbook.SheetNames.forEach(name => {
  const sheet = workbook.Sheets[name];
  const data = XLSX.utils.sheet_to_json(sheet);
  console.log(`${name}: ${data.length} rows`);
  
  if (data.length > 0) {
    console.log(`  Sample columns: ${Object.keys(data[0]).join(', ')}`);
  }
});
