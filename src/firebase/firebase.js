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

console.log('Firebase initialized');

// Test Firebase write functionality
const testFirebaseWrite = async () => {
  try {
    console.log('Testing Firebase write permissions...');
    const testCollection = collection(db, 'test_permissions');
    const testDoc = await addDoc(testCollection, {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'This is a test document'
    });
    console.log('Successfully wrote test document with ID:', testDoc.id);
    
    // Clean up the test document
    await deleteDoc(doc(db, 'test_permissions', testDoc.id));
    console.log('Successfully deleted test document');
    
    return true;
} catch (error) {
    console.error('Firebase write test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'permission-denied') {
      console.error('PERMISSION DENIED: You do not have permission to write to Firebase');
    }
    
    return false;
  }
};

// Run the test after a short delay
setTimeout(() => {
  testFirebaseWrite().then(result => {
    console.log('Firebase write permission test result:', result ? 'SUCCESS' : 'FAILED');
  });
}, 2000);

// Enable offline persistence
try {
  enableIndexedDbPersistence(db).then(() => {
    console.log('Firebase offline persistence enabled');
  }).catch((err) => {
    console.error('Firebase persistence error:', err);
  });
} catch (error) {
  console.error('Error enabling persistence:', error);
}

export { db };