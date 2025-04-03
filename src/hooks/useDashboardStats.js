import { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const useDashboardStats = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    pendingPayments: 0,
    pendingAmount: 0,
    totalRevenue: 0,
    activeClients: 0,
    totalQuotes: 0,
    totalDeliveryOrders: 0,
    totalReceipts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get total invoices
        const invoicesQuery = query(collection(db, 'invoices'));
        const invoicesSnapshot = await getDocs(invoicesQuery);
        const totalInvoices = invoicesSnapshot.size;
        
        // Get pending payments
        const pendingQuery = query(
          collection(db, 'invoices'),
          where('status', '==', 'pending')
        );
        const pendingSnapshot = await getDocs(pendingQuery);
        const pendingPayments = pendingSnapshot.size;
        
        // Get total quotes
        const quotesQuery = query(collection(db, 'quotations'));
        const quotesSnapshot = await getDocs(quotesQuery);
        const totalQuotes = quotesSnapshot.size;
        
        // Get total delivery orders
        const deliveryOrdersQuery = query(collection(db, 'deliveryOrders'));
        const deliveryOrdersSnapshot = await getDocs(deliveryOrdersQuery);
        const totalDeliveryOrders = deliveryOrdersSnapshot.size;
        
        // Calculate total revenue and pending amount
        let totalRevenue = 0;
        let pendingAmount = 0;
        
        invoicesSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.total) {
            totalRevenue += parseFloat(data.total);
          }
        });
        
        pendingSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.total) {
            pendingAmount += parseFloat(data.total);
          }
        });
        
        // Get active clients (clients with at least one invoice)
        const clientsQuery = query(collection(db, 'clients'));
        const clientsSnapshot = await getDocs(clientsQuery);
        const activeClients = clientsSnapshot.size;
        
        // Get total receipts
        const receiptsSnapshot = await getDocs(collection(db, 'receipts'));
        const totalReceipts = receiptsSnapshot.size;
        
        setStats({
          totalInvoices,
          pendingPayments,
          pendingAmount: pendingAmount.toFixed(2),
          totalRevenue: totalRevenue.toFixed(2),
          activeClients,
          totalQuotes,
          totalDeliveryOrders,
          totalReceipts
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return { stats, loading, error };
};

export default useDashboardStats; 