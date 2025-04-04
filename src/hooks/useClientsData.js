import { useState, useEffect, useCallback } from 'react';
import { collection, query, getDocs, where, orderBy, limit, startAfter, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

// Cache for client data
const clientCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

const useClientsData = (searchQuery = '', currentPage = 1, itemsPerPage = 5) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalClients, setTotalClients] = useState(0);
  const [lastDoc, setLastDoc] = useState(null);

  // Memoized function to get client summary from cache or Firestore
  const getClientSummary = useCallback(async (clientId) => {
    // Check cache first
    const cachedData = clientCache.get(clientId);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
      return cachedData.data;
    }

    try {
      // Get client doc
      const clientRef = doc(db, 'clients', clientId);
      const clientSnap = await getDoc(clientRef);
      
      if (!clientSnap.exists()) {
        return null;
      }

      const clientData = clientSnap.data();

      // Get invoices count and total amount in a single query
      const invoicesQuery = query(
        collection(db, 'invoices'),
        where('clientId', '==', clientId)
      );
      const invoicesSnapshot = await getDocs(invoicesQuery);
      
      let totalAmount = 0;
      let lastInvoiceDate = null;

      invoicesSnapshot.forEach(doc => {
        const invoiceData = doc.data();
        totalAmount += parseFloat(invoiceData.total) || 0;
        
        const invoiceDate = invoiceData.createdAt?.toDate?.() || invoiceData.createdAt;
        if (invoiceDate && (!lastInvoiceDate || invoiceDate > lastInvoiceDate)) {
          lastInvoiceDate = invoiceDate;
        }
      });

      const summary = {
        id: clientId,
        name: clientData.companyName || 'Unnamed Client',
        email: clientData.email || 'No email',
        totalInvoices: invoicesSnapshot.size,
        totalAmount: totalAmount.toFixed(2),
        lastInvoice: lastInvoiceDate ? new Date(lastInvoiceDate).toLocaleDateString() : 'No invoices'
      };

      // Cache the result
      clientCache.set(clientId, {
        data: summary,
        timestamp: Date.now()
      });

      return summary;
    } catch (err) {
      console.error('Error fetching client summary:', err);
      return null;
    }
  }, []);

  // Fetch clients with pagination and search
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        
        // Simple query for clients with ordering
        let clientsQuery = query(
          collection(db, 'clients'),
          orderBy('companyName'),
          limit(itemsPerPage)
        );

        // Get the clients
        const clientsSnapshot = await getDocs(clientsQuery);
        
        // Update lastDoc for pagination
        const lastVisible = clientsSnapshot.docs[clientsSnapshot.docs.length - 1];
        setLastDoc(lastVisible);

        // Get total count
        const totalQuery = query(collection(db, 'clients'));
        const totalSnapshot = await getDocs(totalQuery);
        setTotalClients(totalSnapshot.size);

        // Process clients in parallel
        const clientPromises = clientsSnapshot.docs.map(doc => getClientSummary(doc.id));
        const clientSummaries = await Promise.all(clientPromises);
        
        // Filter out any null results and sort by total invoices
        const validClients = clientSummaries
          .filter(Boolean)
          .sort((a, b) => b.totalInvoices - a.totalInvoices);

        // Apply search filter if needed
        const filteredClients = searchQuery
          ? validClients.filter(client => 
              client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              client.email.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : validClients;

        setClients(filteredClients);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching clients data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchClients();
  }, [searchQuery, currentPage, itemsPerPage, getClientSummary]);

  // Clear cache when component unmounts
  useEffect(() => {
    return () => {
      clientCache.clear();
    };
  }, []);
  
  return { clients, loading, error, totalClients };
};

export default useClientsData; 