import React, { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useTheme } from 'styled-components';
import { motion } from 'framer-motion';
import Icon from '../shared/Icon/Icon';
import {
  Container,
  Header,
  Title,
  BackButton,
  ClientInfo,
  ClientName,
  ClientEmail,
  ClientDetails,
  ClientDetail,
  DetailLabel,
  DetailValue,
  SummaryCards,
  SummaryCard,
  SummaryIcon,
  SummaryContent,
  SummaryValue,
  SummaryLabel,
  InvoicesList,
  InvoicesHeader,
  InvoicesTitle,
  InvoicesCount,
  InvoicesFilter,
  FilterButton,
  DateFilterContainer,
  DateFilterButton,
  DateFilterDropdown,
  DateRangeInput,
  ApplyButton,
  ClearButton,
  InvoiceItem,
  UAEInvoiceItem,
  NonUAEInvoiceItem,
  ColumnHeader,
  InvoiceNumber,
  InvoiceDate,
  InvoiceDescription,
  InvoiceTotal,
  InvoiceVAT,
  InvoiceStatus,
  StatusBadge,
  EmptyState,
  EmptyIcon,
  EmptyText,
  LoadingSpinner,
  ExportButton,
  ExportIcon
} from './ClientStatementStyles';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ClientStatementView = () => {
  const { id } = useParams();
  const history = useHistory();
  const { colors } = useTheme();
  const [client, setClient] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [summary, setSummary] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    totalQuotations: 0,
    totalCredits: 0
  });
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const dateFilterRef = useRef(null);

  // Set default date range to current month
  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Format dates as YYYY-MM-DD for input fields
    const formatDateForInput = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    setStartDate(formatDateForInput(firstDayOfMonth));
    setEndDate(formatDateForInput(lastDayOfMonth));
  }, []);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        
        // Fetch client data
        const clientRef = doc(db, 'clients', id);
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
        
        // Fetch invoices for this client
        const invoicesQuery = query(
          collection(db, 'invoices'),
          where('clientId', '==', id)
        );
        const invoicesSnapshot = await getDocs(invoicesQuery);
        
        // If no invoices found by clientId, try searching by clientName
        let allInvoices = [...invoicesSnapshot.docs];
        if (invoicesSnapshot.empty && clientData.companyName) {
          const nameQuery = query(
            collection(db, 'invoices'),
            where('clientName', '==', clientData.companyName)
          );
          const nameSnapshot = await getDocs(nameQuery);
          allInvoices = [...nameSnapshot.docs];
        }
        
        // Process invoices
        const processedInvoices = allInvoices.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            number: data.customId || doc.id,
            date: data.createdAt?.toDate?.() || data.createdAt,
            description: data.description || 'No description',
            total: parseFloat(data.total) || 0,
            vat: data.vat || 0,
            totalVat: data.totalVat || 0,
            status: data.status || 'draft',
            currency: data.currency || (clientData.country === 'UAE' ? 'AED' : 'USD')
          };
        });
        
        // Sort invoices by date (newest first)
        processedInvoices.sort((a, b) => b.date - a.date);
        
        // Calculate summary statistics
        const totalInvoices = processedInvoices.length;
        const totalAmount = processedInvoices.reduce((sum, inv) => sum + inv.total, 0);
        const paidAmount = processedInvoices
          .filter(inv => inv.status === 'paid')
          .reduce((sum, inv) => sum + inv.total, 0);
        const pendingAmount = totalAmount - paidAmount;
        
        // Fetch quotations and credits
        const quotationsQuery = query(
          collection(db, 'quotations'),
          where('clientId', '==', id)
        );
        const quotationsSnapshot = await getDocs(quotationsQuery);
        const totalQuotations = quotationsSnapshot.size;
        
        // If no quotations found by clientId, try searching by clientName
        let totalQuotationsCount = totalQuotations;
        if (quotationsSnapshot.empty && clientData.companyName) {
          const nameQuery = query(
            collection(db, 'quotations'),
            where('clientName', '==', clientData.companyName)
          );
          const nameSnapshot = await getDocs(nameQuery);
          totalQuotationsCount = nameSnapshot.size;
        }
        
        const creditsQuery = query(
          collection(db, 'credits'),
          where('clientId', '==', id)
        );
        const creditsSnapshot = await getDocs(creditsQuery);
        const totalCredits = creditsSnapshot.size;
        
        setSummary({
          totalInvoices,
          totalAmount,
          paidAmount,
          pendingAmount,
          totalQuotations: totalQuotationsCount,
          totalCredits
        });
        
        setInvoices(processedInvoices);
      } catch (err) {
        console.error('Error fetching client data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientData();
  }, [id]);

  const getClientCurrency = () => {
    if (!client?.country) return 'USD';
    
    const countryLower = client.country.toLowerCase();
    if (countryLower.includes('emirates') || countryLower.includes('uae') || countryLower.includes('united arab')) {
      return 'AED';
    } else if (countryLower.includes('qatar')) {
      return 'QAR';
    } else {
      return 'USD';
    }
  };

  const formatCurrency = (value, currency = null) => {
    // Use the provided currency or determine based on client country
    const currencyToUse = currency || getClientCurrency();
    
    // For UAE clients, always use AED
    if (client?.country && (
      client.country.toLowerCase().includes('emirates') || 
      client.country.toLowerCase().includes('uae') || 
      client.country.toLowerCase().includes('united arab')
    )) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'AED',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    }
    
    try {
      // For Qatar clients
      if (currencyToUse === 'QAR') {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'QAR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value);
      }
      // For other currencies
      else {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currencyToUse,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value);
      }
    } catch (error) {
      console.error(`Error formatting currency with ${currencyToUse}:`, error);
      // Fallback to USD if there's an error with the specified currency
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return colors.statusPaid;
      case 'pending':
        return colors.statusPending;
      case 'partially_paid':
        return colors.statusPartiallyPaid;
      case 'void':
        return colors.statusVoid;
      default:
        return colors.statusDraft;
    }
  };

  const handleBack = () => {
    history.push('/dashboard');
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const toggleDateFilter = () => {
    setShowDateFilter(!showDateFilter);
  };

  const handleApplyDateFilter = () => {
    setShowDateFilter(false);
  };

  const handleClearDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  // Close date filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateFilterRef.current && !dateFilterRef.current.contains(event.target)) {
        setShowDateFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredInvoices = invoices.filter(invoice => {
    // Filter by status
    if (filter !== 'all' && invoice.status !== filter) {
      return false;
    }
    
    // Filter by date range if dates are set
    if (startDate && endDate) {
      const invoiceDate = new Date(invoice.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Set end date to end of day
      end.setHours(23, 59, 59, 999);
      
      if (invoiceDate < start || invoiceDate > end) {
        return false;
      }
    }
    
    return true;
  });

  // Add getCompanyProfile function
  const getCompanyProfile = async (country) => {
    try {
      // Convert country to lowercase and handle variations
      const countryLower = country.toLowerCase();
      let searchCountry = countryLower;
      
      // Handle UAE variations
      if (countryLower.includes('emirates') || countryLower.includes('uae')) {
        searchCountry = 'uae';
      }
      
      // Query the companies collection
      const companiesRef = collection(db, 'companies');
      
      // Query for the specific country
      const q = query(companiesRef, where('country', '==', searchCountry));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const profile = querySnapshot.docs[0].data();
        
        const result = {
          name: profile.name || '',
          address: profile.address || '',
          phone: profile.phone || '',
          vatNumber: profile.vatNumber || '',
          crNumber: profile.crNumber || '',
          bankDetails: {
            bankName: profile.bankName || '',
            accountName: profile.accountName || '',
            accountNumber: profile.accountNumber || '',
            iban: profile.iban || '',
            swift: profile.chequesPayableTo || '' // Using chequesPayableTo as SWIFT code
          }
        };
        
        return result;
      }
      
      // If no profile found for UAE, return Qatar profile as default
      if (searchCountry === 'uae') {
        const qatarQuery = query(companiesRef, where('country', '==', 'qatar'));
        const qatarSnapshot = await getDocs(qatarQuery);
        
        if (!qatarSnapshot.empty) {
          const qatarProfile = qatarSnapshot.docs[0].data();
          
          const result = {
            name: qatarProfile.name || '',
            address: qatarProfile.address || '',
            phone: qatarProfile.phone || '',
            vatNumber: qatarProfile.vatNumber || '',
            crNumber: qatarProfile.crNumber || '',
            bankDetails: {
              bankName: qatarProfile.bankName || '',
              accountName: qatarProfile.accountName || '',
              accountNumber: qatarProfile.accountNumber || '',
              iban: qatarProfile.iban || '',
              swift: qatarProfile.chequesPayableTo || '' // Using chequesPayableTo as SWIFT code
            }
          };
          
          return result;
        }
      }
      
      throw new Error('No company profile found');
    } catch (error) {
      return null;
    }
  };

  const handleExport = async () => {
    try {
      // Get the client's country from the client data
      const clientCountry = client?.country || 'qatar';
      
      // Determine which company profile to use
      let companyProfile;
      try {
        if (clientCountry.toLowerCase().includes('emirates') || clientCountry.toLowerCase().includes('uae')) {
          companyProfile = await getCompanyProfile('uae');
        } else {
          companyProfile = await getCompanyProfile('qatar');
        }
      } catch (profileError) {
        companyProfile = {
          name: 'Fortune Gifts',
          address: 'Doha, Qatar',
          phone: '+974 1234 5678',
          vatNumber: 'VAT123456789',
          crNumber: 'CR123456789'
        };
      }

      // Create a new container for PDF content
      const pdfContainer = document.createElement('div');
      pdfContainer.style.cssText = `
        width: 297mm;
        min-height: 420mm;
        padding: 5mm 20mm 20mm 20mm;
        margin: 0;
        background-color: white;
        box-sizing: border-box;
        position: relative;
        font-family: Arial, sans-serif;
      `;

      // Add header
      pdfContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div>
            <img src="${window.location.origin}/images/invoice-logo.png" alt="${companyProfile.name} Logo" style="max-height: 80px;" onerror="this.onerror=null; this.src=''; this.alt='${companyProfile.name}'; this.style.fontSize='27px'; this.style.fontWeight='bold'; this.style.color='#004359';"/>
          </div>
          <div style="text-align: right; font-size: 19px; color: #000000;">
            <div style="font-weight: bold; font-size: 21px; margin-bottom: 5px;">${companyProfile.name}</div>
            <div>${companyProfile.address}</div>
            <div>Tel: ${companyProfile.phone} | ${clientCountry.toLowerCase().includes('emirates') || clientCountry.toLowerCase().includes('uae') ? 'TRN' : 'CR'} Number: <span style="color: #FF4806;">${clientCountry.toLowerCase().includes('emirates') || clientCountry.toLowerCase().includes('uae') ? companyProfile.vatNumber : companyProfile.crNumber}</span></div>
            <div>Email: sales@fortunegiftz.com | Website: www.fortunegiftz.com</div>
          </div>
        </div>
        <div style="height: 2px; background-color: #004359; margin-bottom: 10px;"></div>
        <div style="text-align: center; margin-top: 25px;">
          <h1 style="font-size: 32px; color: #004359; margin: 0; letter-spacing: 1px;">CLIENT STATEMENT</h1>
        </div>
      `;

      // Add client section
      const clientSection = document.createElement('div');
      clientSection.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        padding: 20px;
        background-color: white;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
      `;
      clientSection.innerHTML = `
        <div style="flex: 1;">
          <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Client Details</div>
          <div style="color: black; font-size: 16px;">
            <strong>${client?.companyName || 'Unnamed Client'}</strong><br />
            ${client?.address || ''}
            ${client?.phone ? `<br />${client.phone}` : ''}
            ${client?.email ? `<br />${client.email}` : ''}
            ${client?.country ? `<br />${client.country}` : ''}
            ${client?.trn ? `<br /><span style="font-weight: 600;">TRN: ${client.trn}</span>` : ''}
          </div>
        </div>
        <div style="text-align: right;">
          <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Statement Date</div>
          <div style="color: black; font-size: 16px; margin-bottom: 15px;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 10px;">Date Range</div>
          <div style="color: black; font-size: 16px;">
            ${startDate ? new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'All time'} - 
            ${endDate ? new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'All time'}
          </div>
        </div>
      `;
      pdfContainer.appendChild(clientSection);

      // Add summary section
      const summarySection = document.createElement('div');
      summarySection.style.cssText = `
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        margin-bottom: 20px;
      `;
      summarySection.innerHTML = `
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 4px; text-align: center;">
          <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 5px;">Total Invoices</div>
          <div style="color: black; font-size: 24px; font-weight: bold;">${summary.totalInvoices}</div>
        </div>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 4px; text-align: center;">
          <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 5px;">Total Amount</div>
          <div style="color: black; font-size: 24px; font-weight: bold;">${formatCurrency(summary.totalAmount)}</div>
        </div>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 4px; text-align: center;">
          <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 5px;">Total VAT</div>
          <div style="color: black; font-size: 24px; font-weight: bold;">${formatCurrency(filteredInvoices.reduce((sum, inv) => sum + (inv.totalVat || 0), 0))}</div>
        </div>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 4px; text-align: center;">
          <div style="color: #004359; font-weight: bold; font-size: 18px; margin-bottom: 5px;">Pending Amount</div>
          <div style="color: black; font-size: 24px; font-weight: bold;">${formatCurrency(summary.pendingAmount)}</div>
        </div>
      `;
      pdfContainer.appendChild(summarySection);

      // Add invoices table
      const invoicesTable = document.createElement('table');
      invoicesTable.style.cssText = `
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        background-color: white;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
      `;
      
      // Create table header based on client country
      let tableHeader = `
        <thead style="background-color: #004359; color: white;">
          <tr>
            <th style="padding: 15px; text-align: left; font-size: 18px;">Invoice#</th>
            <th style="padding: 15px; text-align: left; font-size: 18px;">Date</th>
            <th style="padding: 15px; text-align: left; font-size: 18px;">Project</th>
      `;
      
      // Add VAT column for UAE clients
      if (clientCountry.toLowerCase().includes('emirates') || clientCountry.toLowerCase().includes('uae')) {
        tableHeader += `<th style="padding: 15px; text-align: right; font-size: 18px;">VAT</th>`;
      }
      
      tableHeader += `
            <th style="padding: 15px; text-align: right; font-size: 18px;">Total Amount</th>
            <th style="padding: 15px; text-align: center; font-size: 18px;">Status</th>
          </tr>
        </thead>
      `;
      
      invoicesTable.innerHTML = tableHeader;
      
      // Add table body with filtered invoices
      const tableBody = document.createElement('tbody');
      
      // Use the filtered invoices based on date range and status
      const filteredInvoicesForPDF = invoices.filter(invoice => {
        // Filter by status
        if (filter !== 'all' && invoice.status !== filter) {
          return false;
        }
        
        // Filter by date range if dates are set
        if (startDate && endDate) {
          const invoiceDate = new Date(invoice.date);
          const start = new Date(startDate);
          const end = new Date(endDate);
          
          // Set end date to end of day
          end.setHours(23, 59, 59, 999);
          
          if (invoiceDate < start || invoiceDate > end) {
            return false;
          }
        }
        
        return true;
      });
      
      // Add rows for each invoice
      filteredInvoicesForPDF.forEach(invoice => {
        const row = document.createElement('tr');
        row.style.cssText = 'border-bottom: 1px solid #e0e0e0;';
        
        let rowContent = `
          <td style="padding: 15px; color: black; font-size: 16px;">#${invoice.number}</td>
          <td style="padding: 15px; color: black; font-size: 16px;">${formatDate(invoice.date)}</td>
          <td style="padding: 15px; color: black; font-size: 16px;">${invoice.description || 'No description'}</td>
        `;
        
        // Add VAT column for UAE clients
        if (clientCountry.toLowerCase().includes('emirates') || clientCountry.toLowerCase().includes('uae')) {
          // Use the totalVat from the database
          rowContent += `<td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatCurrency(invoice.totalVat, invoice.currency || 'AED')}</td>`;
        }
        
        rowContent += `
          <td style="padding: 15px; text-align: right; color: black; font-size: 16px;">${formatCurrency(invoice.total, invoice.currency || (client?.country === 'Qatar' ? 'QAR' : 'USD'))}</td>
          <td style="padding: 15px; text-align: center; color: black; font-size: 16px;">
            <span style="
              display: inline-block;
              padding: 5px 10px;
              border-radius: 4px;
              background-color: ${getStatusColor(invoice.status)};
              color: white;
              font-weight: bold;
              text-transform: capitalize;
            ">${invoice.status}</span>
          </td>
        `;
        
        row.innerHTML = rowContent;
        tableBody.appendChild(row);
      });
      
      invoicesTable.appendChild(tableBody);
      pdfContainer.appendChild(invoicesTable);

      // Add spacer for signature section
      const spacer = document.createElement('div');
      spacer.style.height = '150px';
      pdfContainer.appendChild(spacer);

      // Add signature section
      const signatureSection = document.createElement('div');
      signatureSection.style.cssText = `
        position: absolute;
        bottom: 30mm;
        left: 20mm;
        right: 20mm;
        display: flex;
        justify-content: space-between;
      `;
      signatureSection.innerHTML = `
        <div style="width: 45%;">
          <div style="border-bottom: 2px solid #004359; margin-bottom: 15px;"></div>
          <div style="font-weight: bold; color: #004359; font-size: 19px;">Authorized Signature</div>
        </div>
        <div style="width: 45%;">
          <div style="border-bottom: 2px solid #004359; margin-bottom: 15px;"></div>
          <div style="font-weight: bold; color: #004359; font-size: 19px;">Client Acceptance</div>
        </div>
      `;
      pdfContainer.appendChild(signatureSection);

      // Temporarily add to document to render
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.left = '-9999px';
      document.body.appendChild(pdfContainer);

      // Convert to canvas with A3 dimensions
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 1122.5, // 297mm in pixels at 96 DPI
        height: 1587.4 // 420mm in pixels at 96 DPI
      });

      // Remove temporary elements
      document.body.removeChild(pdfContainer);

      // Create PDF with A3 size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a3',
        compress: true
      });

      // Add the image to fit A3 page
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 420);

      // Save the PDF
      pdf.save(`ClientStatement_${client?.companyName || 'Client'}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ 
              width: 40, 
              height: 40, 
              border: `3px solid rgba(147, 112, 219, 0.3)`,
              borderTop: `3px solid ${colors.primary}`,
              borderRadius: '50%'
            }}
          />
          <span>Loading client statement...</span>
        </LoadingSpinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <BackButton onClick={handleBack}>
            <Icon name="back" size={24} color={colors.textPrimary} />
          </BackButton>
          <Title>Error</Title>
        </Header>
        <EmptyState>
          <EmptyIcon>
            <Icon name="warning" size={48} color={colors.textTertiary} />
          </EmptyIcon>
          <EmptyText>{error}</EmptyText>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <Icon name="back" size={24} color={colors.textPrimary} />
        </BackButton>
        <Title>Client Statement</Title>
        <ExportButton onClick={handleExport}>
          <ExportIcon>
            <Icon name="download" size={20} color="white" />
          </ExportIcon>
          Export
        </ExportButton>
      </Header>

      <ClientInfo>
        <ClientName>{client?.companyName || 'Unnamed Client'}</ClientName>
        <ClientEmail>{client?.email || 'No email'}</ClientEmail>
        <ClientDetails>
          <ClientDetail>
            <DetailLabel>Phone</DetailLabel>
            <DetailValue>{client?.phone || 'No phone'}</DetailValue>
          </ClientDetail>
          <ClientDetail>
            <DetailLabel>Address</DetailLabel>
            <DetailValue>{client?.address || 'No address'}</DetailValue>
          </ClientDetail>
          <ClientDetail>
            <DetailLabel>Country</DetailLabel>
            <DetailValue>{client?.country || 'No country'}</DetailValue>
          </ClientDetail>
        </ClientDetails>
      </ClientInfo>

      <SummaryCards>
        <SummaryCard>
          <SummaryIcon color={colors.blueGrayish}>
            <Icon name="invoice" size={24} color={colors.blueGrayish} />
          </SummaryIcon>
          <SummaryContent>
            <SummaryValue>{summary.totalInvoices}</SummaryValue>
            <SummaryLabel>Total Invoices</SummaryLabel>
          </SummaryContent>
        </SummaryCard>
        <SummaryCard>
          <SummaryIcon color={colors.statusPaid}>
            <Icon name="receipt" size={24} color={colors.statusPaid} />
          </SummaryIcon>
          <SummaryContent>
            <SummaryValue>{formatCurrency(summary.totalAmount, getClientCurrency())}</SummaryValue>
            <SummaryLabel>Total Amount</SummaryLabel>
          </SummaryContent>
        </SummaryCard>
        <SummaryCard>
          <SummaryIcon color={colors.statusPaid}>
            <Icon name="invoice" size={24} color={colors.statusPaid} />
          </SummaryIcon>
          <SummaryContent>
            <SummaryValue>{formatCurrency(summary.paidAmount, getClientCurrency())}</SummaryValue>
            <SummaryLabel>Paid Amount</SummaryLabel>
          </SummaryContent>
        </SummaryCard>
        <SummaryCard>
          <SummaryIcon color={colors.statusPending}>
            <Icon name="calendar" size={24} color={colors.statusPending} />
          </SummaryIcon>
          <SummaryContent>
            <SummaryValue>{formatCurrency(summary.pendingAmount, getClientCurrency())}</SummaryValue>
            <SummaryLabel>Pending Amount</SummaryLabel>
          </SummaryContent>
        </SummaryCard>
        <SummaryCard>
          <SummaryIcon color={colors.blueGrayish}>
            <Icon name="quotation" size={24} color={colors.blueGrayish} />
          </SummaryIcon>
          <SummaryContent>
            <SummaryValue>{summary.totalQuotations}</SummaryValue>
            <SummaryLabel>Total Quotations</SummaryLabel>
          </SummaryContent>
        </SummaryCard>
        <SummaryCard>
          <SummaryIcon color={colors.statusPartiallyPaid}>
            <Icon name="statement" size={24} color={colors.statusPartiallyPaid} />
          </SummaryIcon>
          <SummaryContent>
            <SummaryValue>{summary.totalCredits}</SummaryValue>
            <SummaryLabel>Total Credits</SummaryLabel>
          </SummaryContent>
        </SummaryCard>
      </SummaryCards>

      <InvoicesList>
        <InvoicesHeader>
          <InvoicesTitle>Invoices</InvoicesTitle>
          <InvoicesCount>{filteredInvoices.length} of {invoices.length}</InvoicesCount>
          <InvoicesFilter>
            <FilterButton 
              active={filter === 'all'} 
              onClick={() => handleFilterChange('all')}
            >
              All
            </FilterButton>
            <FilterButton 
              active={filter === 'paid'} 
              onClick={() => handleFilterChange('paid')}
            >
              Paid
            </FilterButton>
            <FilterButton 
              active={filter === 'pending'} 
              onClick={() => handleFilterChange('pending')}
            >
              Pending
            </FilterButton>
            <FilterButton 
              active={filter === 'draft'} 
              onClick={() => handleFilterChange('draft')}
            >
              Draft
            </FilterButton>
            <DateFilterContainer ref={dateFilterRef}>
              <DateFilterButton onClick={toggleDateFilter}>
                <Icon name="calendar" size={16} color={colors.textSecondary} />
                Date Range
                {(startDate || endDate) && (
                  <span style={{ 
                    backgroundColor: colors.primary, 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: '18px', 
                    height: '18px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    marginLeft: '4px'
                  }}>
                    !
                  </span>
                )}
              </DateFilterButton>
              {showDateFilter && (
                <DateFilterDropdown>
                  <DateRangeInput>
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </DateRangeInput>
                  <DateRangeInput>
                    <label>End Date</label>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </DateRangeInput>
                  <ApplyButton onClick={handleApplyDateFilter}>
                    Apply Filter
                  </ApplyButton>
                  {(startDate || endDate) && (
                    <ClearButton onClick={handleClearDateFilter}>
                      Clear Date Filter
                    </ClearButton>
                  )}
                </DateFilterDropdown>
              )}
            </DateFilterContainer>
          </InvoicesFilter>
        </InvoicesHeader>

        {/* Invoice List Headers */}
        {client?.country === 'UAE' ? (
          <UAEInvoiceItem style={{ cursor: 'default', pointerEvents: 'none', border: 'none', background: 'transparent', padding: '0 0.75rem' }}>
            <ColumnHeader>Invoice#</ColumnHeader>
            <ColumnHeader>Date</ColumnHeader>
            <ColumnHeader>Project</ColumnHeader>
            <ColumnHeader>VAT</ColumnHeader>
            <ColumnHeader align="right">Total Amount</ColumnHeader>
            <ColumnHeader align="right">Status</ColumnHeader>
          </UAEInvoiceItem>
        ) : (
          <NonUAEInvoiceItem style={{ cursor: 'default', pointerEvents: 'none', border: 'none', background: 'transparent', padding: '0 0.75rem' }}>
            <ColumnHeader>Invoice#</ColumnHeader>
            <ColumnHeader>Date</ColumnHeader>
            <ColumnHeader>Project</ColumnHeader>
            <ColumnHeader align="right">Total Amount</ColumnHeader>
            <ColumnHeader align="right">Status</ColumnHeader>
          </NonUAEInvoiceItem>
        )}

        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice) => (
            client?.country === 'UAE' ? (
              <UAEInvoiceItem
                key={invoice.id}
                onClick={() => history.push(`/invoices/${invoice.id}`)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <InvoiceNumber>#{invoice.number}</InvoiceNumber>
                <InvoiceDate>{formatDate(invoice.date)}</InvoiceDate>
                <InvoiceDescription>{invoice.description || 'No description'}</InvoiceDescription>
                <InvoiceVAT>{formatCurrency(invoice.totalVat, invoice.currency || 'AED')}</InvoiceVAT>
                <InvoiceTotal>{formatCurrency(invoice.total, invoice.currency || 'AED')}</InvoiceTotal>
                <InvoiceStatus>
                  <StatusBadge color={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </StatusBadge>
                </InvoiceStatus>
              </UAEInvoiceItem>
            ) : (
              <NonUAEInvoiceItem
                key={invoice.id}
                onClick={() => history.push(`/invoices/${invoice.id}`)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <InvoiceNumber>#{invoice.number}</InvoiceNumber>
                <InvoiceDate>{formatDate(invoice.date)}</InvoiceDate>
                <InvoiceDescription>{invoice.description || 'No description'}</InvoiceDescription>
                <InvoiceTotal>{formatCurrency(invoice.total, invoice.currency || (client?.country === 'Qatar' ? 'QAR' : 'USD'))}</InvoiceTotal>
                <InvoiceStatus>
                  <StatusBadge color={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </StatusBadge>
                </InvoiceStatus>
              </NonUAEInvoiceItem>
            )
          ))
        ) : (
          <EmptyState>
            <EmptyIcon>
              <Icon name="invoice" size={48} color={colors.textTertiary} />
            </EmptyIcon>
            <EmptyText>No invoices found for this client</EmptyText>
          </EmptyState>
        )}
      </InvoicesList>
    </Container>
  );
};

export default ClientStatementView; 