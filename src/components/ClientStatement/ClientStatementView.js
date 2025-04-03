import React, { useState, useEffect } from 'react';
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
  InvoiceItem,
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
    pendingAmount: 0
  });

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
            status: data.status || 'draft'
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
        
        setSummary({
          totalInvoices,
          totalAmount,
          paidAmount,
          pendingAmount
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'QAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
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

  const filteredInvoices = invoices.filter(invoice => {
    if (filter === 'all') return true;
    return invoice.status === filter;
  });

  const handleExport = () => {
    // This would be implemented to export the client statement as PDF or CSV
    alert('Export functionality would be implemented here');
  };

  if (loading) {
    return (
      <LoadingSpinner>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ 
            width: 40, 
            height: 40, 
            border: `3px solid ${colors.border}`,
            borderTop: `3px solid ${colors.primary}`,
            borderRadius: '50%'
          }}
        />
        <span>Loading client statement...</span>
      </LoadingSpinner>
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
            <Icon name="dollar" size={24} color={colors.statusPaid} />
          </SummaryIcon>
          <SummaryContent>
            <SummaryValue>{formatCurrency(summary.totalAmount)}</SummaryValue>
            <SummaryLabel>Total Amount</SummaryLabel>
          </SummaryContent>
        </SummaryCard>
        <SummaryCard>
          <SummaryIcon color={colors.statusPaid}>
            <Icon name="check" size={24} color={colors.statusPaid} />
          </SummaryIcon>
          <SummaryContent>
            <SummaryValue>{formatCurrency(summary.paidAmount)}</SummaryValue>
            <SummaryLabel>Paid Amount</SummaryLabel>
          </SummaryContent>
        </SummaryCard>
        <SummaryCard>
          <SummaryIcon color={colors.statusPending}>
            <Icon name="clock" size={24} color={colors.statusPending} />
          </SummaryIcon>
          <SummaryContent>
            <SummaryValue>{formatCurrency(summary.pendingAmount)}</SummaryValue>
            <SummaryLabel>Pending Amount</SummaryLabel>
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
          </InvoicesFilter>
        </InvoicesHeader>

        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice, index) => (
            <InvoiceItem
              key={invoice.id}
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => history.push(`/invoice/${invoice.id}`)}
            >
              <InvoiceNumber>{invoice.number}</InvoiceNumber>
              <InvoiceDate>{formatDate(invoice.date)}</InvoiceDate>
              <InvoiceDescription>{invoice.description}</InvoiceDescription>
              {invoice.vat > 0 && (
                <InvoiceVAT>{formatCurrency(invoice.vat)}</InvoiceVAT>
              )}
              <InvoiceTotal>{formatCurrency(invoice.total)}</InvoiceTotal>
              <InvoiceStatus>
                <StatusBadge color={getStatusColor(invoice.status)}>
                  {invoice.status.replace('_', ' ')}
                </StatusBadge>
              </InvoiceStatus>
            </InvoiceItem>
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