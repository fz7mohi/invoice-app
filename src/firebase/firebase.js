import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

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
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize Firestore
  db = getFirestore(app);
  
  // Enable offline persistence (optional)
  enableIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('IndexedDB persistence failed - multiple tabs open');
      } else if (err.code === 'unimplemented') {
        console.warn('IndexedDB not supported by browser');
      }
    });
    
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  
  // Create a more comprehensive mock to handle all the Firestore methods we use
  db = {
    // Mock methods to prevent app from crashing
    collection: (collectionPath) => {
      console.log(`Mock accessing collection: ${collectionPath}`);
      return {
        doc: (docId) => ({
          id: docId,
          get: () => Promise.resolve({ 
            exists: false, 
            data: () => null,
            id: docId
          }),
          set: (data) => {
            console.log(`Mock set data for ${collectionPath}/${docId}:`, data);
            // Save to localStorage as fallback
            try {
              const storageKey = `${collectionPath}`;
              let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
              const existingIndex = items.findIndex(item => item.id === docId);
              
              if (existingIndex >= 0) {
                items[existingIndex] = { ...data, id: docId };
              } else {
                items.push({ ...data, id: docId });
              }
              
              localStorage.setItem(storageKey, JSON.stringify(items));
            } catch (e) {
              console.error('Error saving to localStorage:', e);
            }
            return Promise.resolve();
          },
          update: (data) => {
            console.log(`Mock update data for ${collectionPath}/${docId}:`, data);
            // Update in localStorage
            try {
              const storageKey = `${collectionPath}`;
              let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
              const existingIndex = items.findIndex(item => item.id === docId);
              
              if (existingIndex >= 0) {
                items[existingIndex] = { ...items[existingIndex], ...data, id: docId };
                localStorage.setItem(storageKey, JSON.stringify(items));
              }
            } catch (e) {
              console.error('Error updating in localStorage:', e);
            }
            return Promise.resolve();
          },
          delete: () => {
            console.log(`Mock delete document ${collectionPath}/${docId}`);
            // Delete from localStorage
            try {
              const storageKey = `${collectionPath}`;
              let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
              const filteredItems = items.filter(item => item.id !== docId);
              localStorage.setItem(storageKey, JSON.stringify(filteredItems));
            } catch (e) {
              console.error('Error deleting from localStorage:', e);
            }
            return Promise.resolve();
          }
        }),
        add: (data) => {
          const docId = Math.random().toString(36).substring(2, 15);
          console.log(`Mock add data to ${collectionPath}:`, data);
          
          // Save to localStorage
          try {
            const storageKey = `${collectionPath}`;
            let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
            items.push({ ...data, id: docId });
            localStorage.setItem(storageKey, JSON.stringify(items));
          } catch (e) {
            console.error('Error adding to localStorage:', e);
          }
          
          return Promise.resolve({ 
            id: docId,
            path: `${collectionPath}/${docId}`
          });
        },
        // For query() support
        orderBy: () => ({ 
          limit: () => ({
            get: () => {
              // Return data from localStorage
              try {
                const storageKey = `${collectionPath}`;
                const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
                return Promise.resolve({
                  docs: items.map(item => ({
                    id: item.id,
                    data: () => ({ ...item }),
                    exists: true
                  }))
                });
              } catch (e) {
                console.error('Error reading from localStorage:', e);
                return Promise.resolve({ docs: [] });
              }
            }
          }),
          get: () => {
            // Return data from localStorage
            try {
              const storageKey = `${collectionPath}`;
              const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
              return Promise.resolve({
                docs: items.map(item => ({
                  id: item.id,
                  data: () => ({ ...item }),
                  exists: true
                }))
              });
            } catch (e) {
              console.error('Error reading from localStorage:', e);
              return Promise.resolve({ docs: [] });
            }
          }
        }),
        where: () => ({
          get: () => {
            // Return filtered data from localStorage (simplified)
            try {
              const storageKey = `${collectionPath}`;
              const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
              return Promise.resolve({
                docs: items.map(item => ({
                  id: item.id,
                  data: () => ({ ...item }),
                  exists: true
                }))
              });
            } catch (e) {
              console.error('Error reading from localStorage:', e);
              return Promise.resolve({ docs: [] });
            }
          }
        }),
        get: () => {
          // Return data from localStorage
          try {
            const storageKey = `${collectionPath}`;
            const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
            return Promise.resolve({
              docs: items.map(item => ({
                id: item.id,
                data: () => ({ ...item }),
                exists: true
              }))
            });
          } catch (e) {
            console.error('Error reading from localStorage:', e);
            return Promise.resolve({ docs: [] });
          }
        }
      }
    },
    doc: (path) => {
      const pathParts = path.split('/');
      const collectionName = pathParts[0];
      const docId = pathParts[1];
      
      console.log(`Mock accessing document: ${path}`);
      
      return {
        get: () => {
          // Get from localStorage
          try {
            const storageKey = collectionName;
            const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const item = items.find(item => item.id === docId);
            
            return Promise.resolve({
              exists: !!item,
              data: () => item || null,
              id: docId
            });
          } catch (e) {
            console.error('Error reading from localStorage:', e);
            return Promise.resolve({ exists: false, data: () => null, id: docId });
          }
        },
        set: (data) => {
          console.log(`Mock set data for ${path}:`, data);
          // Save to localStorage
          try {
            const storageKey = collectionName;
            let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const existingIndex = items.findIndex(item => item.id === docId);
            
            if (existingIndex >= 0) {
              items[existingIndex] = { ...data, id: docId };
            } else {
              items.push({ ...data, id: docId });
            }
            
            localStorage.setItem(storageKey, JSON.stringify(items));
          } catch (e) {
            console.error('Error saving to localStorage:', e);
          }
          return Promise.resolve();
        },
        update: (data) => {
          console.log(`Mock update data for ${path}:`, data);
          // Update in localStorage
          try {
            const storageKey = collectionName;
            let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const existingIndex = items.findIndex(item => item.id === docId);
            
            if (existingIndex >= 0) {
              items[existingIndex] = { ...items[existingIndex], ...data, id: docId };
              localStorage.setItem(storageKey, JSON.stringify(items));
            }
          } catch (e) {
            console.error('Error updating in localStorage:', e);
          }
          return Promise.resolve();
        },
        delete: () => {
          console.log(`Mock delete document ${path}`);
          // Delete from localStorage
          try {
            const storageKey = collectionName;
            let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const filteredItems = items.filter(item => item.id !== docId);
            localStorage.setItem(storageKey, JSON.stringify(filteredItems));
          } catch (e) {
            console.error('Error deleting from localStorage:', e);
          }
          return Promise.resolve();
        }
      };
    }
  };
  console.warn('Using localStorage fallback due to Firebase initialization error');
}

export { db };