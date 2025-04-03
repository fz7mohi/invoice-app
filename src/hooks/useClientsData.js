import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const useClientsData = (searchQuery = '', currentPage = 1, itemsPerPage = 5) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalClients, setTotalClients] = useState(0);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        
        // Get all clients
        const clientsQuery = query(collection(db, 'clients'));
        const clientsSnapshot = await getDocs(clientsQuery);
        const clientsData = [];
        
        // Process each client to get their invoice data
        for (const clientDoc of clientsSnapshot.docs) {
          const clientData = clientDoc.data();
          
          // Get invoices for this client - try both clientId and clientName
          const clientInvoicesQuery = query(
            collection(db, 'invoices'),
            where('clientId', '==', clientDoc.id)
          );
          const invoicesSnapshot = await getDocs(clientInvoicesQuery);
          
          // If no invoices found by clientId, try searching by clientName
          let additionalInvoices = [];
          if (invoicesSnapshot.empty && clientData.companyName) {
            const nameQuery = query(
              collection(db, 'invoices'),
              where('clientName', '==', clientData.companyName)
            );
            const nameSnapshot = await getDocs(nameQuery);
            additionalInvoices = nameSnapshot.docs;
          }
          
          // Combine both query results
          const allInvoices = [...invoicesSnapshot.docs, ...additionalInvoices];
          
          // Calculate total amount for this client
          let totalAmount = 0;
          let lastInvoiceDate = null;
          
          allInvoices.forEach(doc => {
            const invoiceData = doc.data();
            
            // Ensure we're working with a number for the total
            const invoiceTotal = parseFloat(invoiceData.total) || 0;
            totalAmount += invoiceTotal;
            
            // Track the most recent invoice date
            const invoiceDate = invoiceData.createdAt?.toDate?.() || invoiceData.createdAt;
            if (invoiceDate && (!lastInvoiceDate || invoiceDate > lastInvoiceDate)) {
              lastInvoiceDate = invoiceDate;
            }
          });
          
          // Format the last invoice date
          const formattedLastInvoice = lastInvoiceDate 
            ? new Date(lastInvoiceDate).toLocaleDateString() 
            : 'No invoices';
          
          // Add client with invoice stats to the array
          clientsData.push({
            id: clientDoc.id,
            name: clientData.companyName || 'Unnamed Client',
            email: clientData.email || 'No email',
            totalInvoices: allInvoices.length,
            totalAmount: totalAmount.toFixed(2),
            lastInvoice: formattedLastInvoice
          });
        }
        
        // Filter clients based on search query
        const filteredClients = clientsData.filter(client => 
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        // Sort by total invoices (descending)
        const sortedClients = filteredClients.sort((a, b) => b.totalInvoices - a.totalInvoices);
        
        // Set total count for pagination
        setTotalClients(sortedClients.length);
        
        // Apply pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedClients = sortedClients.slice(startIndex, startIndex + itemsPerPage);
        
        setClients(paginatedClients);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching clients data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchClients();
  }, [searchQuery, currentPage, itemsPerPage]);
  
  return { clients, loading, error, totalClients };
};

export default useClientsData; 