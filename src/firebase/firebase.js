import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, collection, addDoc, deleteDoc, doc, getDocs, query, limit } from 'firebase/firestore';

// Your Firebase configuration
// Replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyB7hCxrMOasNOfgXZt7FVuVZbBv5vamofw",
  authDomain: "fordox-c2355.firebaseapp.com",
  projectId: "fordox-c2355",
  storageBucket: "fordox-c2355.firebasestorage.app",
  messagingSenderId: "393306960588",
  appId: "1:393306960588:web:2dd1a133fc59228cb90869",
  measurementId: "G-QNBYKN34WP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test Firebase write functionality
const testFirebaseWrite = async () => {
  try {
    const testCollection = collection(db, 'test_permissions');
    const testDoc = await addDoc(testCollection, {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'This is a test document'
    });
    
    // Clean up the test document
    await deleteDoc(doc(db, 'test_permissions', testDoc.id));
    
    return true;
} catch (error) {
    if (error.code === 'permission-denied') {
      // Handle permission denied silently
    }
    return false;
  }
};

// Run the test after a short delay
setTimeout(() => {
  testFirebaseWrite();
}, 2000);

// Enable offline persistence
try {
  enableIndexedDbPersistence(db).catch(() => {
    // Handle persistence error silently
  });
} catch (error) {
  // Handle error silently
}

export { db };