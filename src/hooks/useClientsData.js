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
  const [allClients, setAllClients] = useState([]);

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
      console.error('Error getting client summary:', err);
      return null;
    }
  }, []);

  // Fetch all clients for search
  useEffect(() => {
    const fetchAllClients = async () => {
      try {
        // Only fetch all clients if there's a search query
        if (!searchQuery) {
          setAllClients([]);
          return;
        }

        setLoading(true);
        
        // Get all clients for search
        const clientsQuery = query(
          collection(db, 'clients'),
          orderBy('companyName')
        );
        
        const clientsSnapshot = await getDocs(clientsQuery);
        
        // Process clients in parallel
        const clientPromises = clientsSnapshot.docs.map(doc => getClientSummary(doc.id));
        const clientSummaries = await Promise.all(clientPromises);
        
        // Filter out any null results and sort by total invoices
        const validClients = clientSummaries
          .filter(Boolean)
          .sort((a, b) => b.totalInvoices - a.totalInvoices);

        // Apply search filter
        const filteredClients = validClients.filter(client => 
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setAllClients(filteredClients);
        setTotalClients(filteredClients.length);
        
        // Apply pagination to filtered results
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedClients = filteredClients.slice(startIndex, endIndex);
        
        setClients(paginatedClients);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching all clients for search:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchAllClients();
  }, [searchQuery, currentPage, itemsPerPage, getClientSummary]);

  // Fetch clients with pagination when no search query
  useEffect(() => {
    const fetchClients = async () => {
      // Skip if there's a search query (handled by the other effect)
      if (searchQuery) {
        return;
      }
      
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

        setClients(validClients);
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