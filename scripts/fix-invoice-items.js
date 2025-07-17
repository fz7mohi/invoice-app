// fix-invoice-items.js
// Usage: node scripts/fix-invoice-items.js
// This script scans all invoices in Firestore and ensures the 'items' field is always an array.
// If 'items' is an object, it converts it to an array of its values.
// Requires: npm install firebase-admin

const admin = require('firebase-admin');
const path = require('path');

// Update this path to your Firebase service account key
const serviceAccount = require(path.resolve(__dirname, '../firebase-service-account.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function fixInvoiceItems() {
  const invoicesRef = db.collection('invoices');
  const snapshot = await invoicesRef.get();
  let fixedCount = 0;
  let skippedCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const items = data.items;
    if (Array.isArray(items)) {
      // Already correct
      skippedCount++;
      continue;
    }
    if (items && typeof items === 'object') {
      // Convert object to array
      const fixedItems = Object.values(items);
      await doc.ref.update({ items: fixedItems });
      console.log(`Fixed invoice ${doc.id}: converted items object to array (length ${fixedItems.length})`);
      fixedCount++;
    } else {
      // items is missing or not an object/array
      skippedCount++;
    }
  }

  console.log(`\nDone. Fixed: ${fixedCount}, Skipped: ${skippedCount}`);
}

fixInvoiceItems().catch(err => {
  console.error('Error fixing invoices:', err);
  process.exit(1);
}); 