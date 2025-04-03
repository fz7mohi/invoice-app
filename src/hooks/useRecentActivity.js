import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const useRecentActivity = (limitCount = 4) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        
        // Get recent invoices
        const invoicesQuery = query(
          collection(db, 'invoices'),
          orderBy('createdAt', 'desc'),
          firestoreLimit(limitCount)
        );
        const invoicesSnapshot = await getDocs(invoicesQuery);
        
        const activityData = [];
        
        // Process invoice activities
        invoicesSnapshot.forEach(doc => {
          const data = doc.data();
          const createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
          const timeAgo = getTimeAgo(createdAt);
          
          activityData.push({
            id: doc.id,
            title: `Invoice ${data.invoiceNumber || 'Created'}`,
            time: timeAgo,
            icon: 'invoice',
            type: 'invoice',
            status: data.status || 'unknown'
          });
        });
        
        // Get recent payments
        const paymentsQuery = query(
          collection(db, 'payments'),
          orderBy('createdAt', 'desc'),
          firestoreLimit(limitCount)
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);
        
        paymentsSnapshot.forEach(doc => {
          const data = doc.data();
          const createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
          const timeAgo = getTimeAgo(createdAt);
          
          activityData.push({
            id: doc.id,
            title: `Payment Received: $${data.amount || '0'}`,
            time: timeAgo,
            icon: 'receipt',
            type: 'payment'
          });
        });
        
        // Get recent client additions
        const clientsQuery = query(
          collection(db, 'clients'),
          orderBy('createdAt', 'desc'),
          firestoreLimit(limitCount)
        );
        const clientsSnapshot = await getDocs(clientsQuery);
        
        clientsSnapshot.forEach(doc => {
          const data = doc.data();
          const createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
          const timeAgo = getTimeAgo(createdAt);
          
          activityData.push({
            id: doc.id,
            title: `New Client: ${data.name || 'Added'}`,
            time: timeAgo,
            icon: 'clients',
            type: 'client'
          });
        });
        
        // Sort all activities by time (most recent first)
        const sortedActivities = activityData.sort((a, b) => {
          const timeA = a.time.includes('minute') ? 0 : 
                        a.time.includes('hour') ? 1 : 
                        a.time.includes('day') ? 2 : 3;
          const timeB = b.time.includes('minute') ? 0 : 
                        b.time.includes('hour') ? 1 : 
                        b.time.includes('day') ? 2 : 3;
          return timeA - timeB;
        });
        
        // Limit to the requested number of activities
        setActivities(sortedActivities.slice(0, limitCount));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recent activity:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchRecentActivity();
  }, [limitCount]);
  
  // Helper function to format time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };
  
  return { activities, loading, error };
};

export default useRecentActivity; 