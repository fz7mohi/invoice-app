import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, collection, query, where, getDocs, limit, startAfter, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const ITEMS_PER_PAGE = 20;

export const useClientStatement = (clientId, options = {}) => {
  const [client, setClient] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [summary, setSummary] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    totalQuotations: 0,
    totalCredits: 0
  });

  // Memoized fetch function for pagination
  const fetchMoreInvoices = useCallback(async () => {
    if (!clientId || !hasMore) return;

    try {
      let invoicesQuery = query(
        collection(db, 'invoices'),
        where('clientId', '==', clientId),
        orderBy('createdAt', 'desc'),
        limit(ITEMS_PER_PAGE)
      );

      if (lastDoc) {
        invoicesQuery = query(
          collection(db, 'invoices'),
          where('clientId', '==', clientId),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(ITEMS_PER_PAGE)
        );
      }

      const snapshot = await getDocs(invoicesQuery);
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      setLastDoc(lastVisible);
      setHasMore(snapshot.docs.length === ITEMS_PER_PAGE);

      const newInvoices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt?.toDate?.() || doc.data().createdAt
      }));

      setInvoices(prev => [...prev, ...newInvoices]);
    } catch (err) {
      console.error('Error fetching more invoices:', err);
      setError(err.message);
    }
  }, [clientId, lastDoc, hasMore]);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch client data
        const clientRef = doc(db, 'clients', clientId);
        const clientSnap = await getDoc(clientRef);
        
        if (!clientSnap.exists()) {
          setError('Client not found');
          return;
        }
        
        const clientData = clientSnap.data();
        setClient({
          id: clientSnap.id,
          ...clientData
        });

        // Fetch initial batch of invoices
        await fetchMoreInvoices();

        // Fetch quotations count
        const quotationsQuery = query(
          collection(db, 'quotations'),
          where('clientId', '==', clientId)
        );
        const quotationsSnapshot = await getDocs(quotationsQuery);
        setQuotations(quotationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));

        // Fetch credits count
        const creditsQuery = query(
          collection(db, 'credits'),
          where('clientId', '==', clientId)
        );
        const creditsSnapshot = await getDocs(creditsQuery);
        setCredits(creditsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));

      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [clientId, fetchMoreInvoices]);

  // Update summary when data changes
  useEffect(() => {
    if (invoices.length > 0) {
      const totalAmount = invoices.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);
      const paidAmount = invoices.reduce((sum, inv) => sum + (parseFloat(inv.paidAmount) || 0), 0);
      
      setSummary({
        totalInvoices: invoices.length,
        totalAmount,
        paidAmount,
        pendingAmount: totalAmount - paidAmount,
        totalQuotations: quotations.length,
        totalCredits: credits.length
      });
    }
  }, [invoices, quotations, credits]);

  return {
    client,
    invoices,
    quotations,
    credits,
    loading,
    error,
    summary,
    hasMore,
    fetchMoreInvoices
  };
}; 