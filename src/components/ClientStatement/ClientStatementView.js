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
      month: 'short',
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

  const handleExport = () => {
    // This would be implemented to export the client statement as PDF or CSV
    alert('Export functionality would be implemented here');
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
                <InvoiceVAT>{formatCurrency(invoice.vat, invoice.currency || 'AED')}</InvoiceVAT>
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