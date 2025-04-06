import { useGlobalContext } from '../App/context';
import { motion, useReducedMotion } from 'framer-motion';
import { 
    StyledClients,
    Header,
    Title,
    TitleContainer,
    ClientCount,
    ButtonContainer,
    NewClientButton,
    EmptyState,
    EmptyText,
    EmptyHeading,
    ClientList,
    ClientItem,
    CompanyName,
    ClientInfo,
    InfoItem,
    ActionButtons,
    EditButton,
    DeleteButton,
    SearchBar,
    SearchContainer,
    SearchInput,
    SearchIcon,
    HeaderContent,
    TitleGroup,
    ImportExportButton,
    Pagination,
    PageButton,
    PageInfo
} from './ClientsStyles';
import Icon from '../shared/Icon/Icon';
import ConfirmModal from '../shared/ConfirmModal/ConfirmModal';
import ErrorMessage from './ErrorMessage/ErrorMessage';
import { clientsVariants } from '../../utilities/framerVariants';
import { useState, useMemo, useRef, useEffect } from 'react';
import Papa from 'papaparse';

const Clients = () => {
    const { 
        clientState, 
        toggleForm, 
        editClient, 
        toggleClientModal,
        handleClientDelete,
        addClients
    } = useGlobalContext();
    
    const { clients, isModalOpen, isLoading } = clientState;
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const shouldReduceMotion = useReducedMotion();
    const fileInputRef = useRef(null);
    
    // Enhanced search functionality with pagination
    const filteredClients = useMemo(() => {
        if (!searchQuery.trim()) return clients;
        
        const query = searchQuery.toLowerCase().trim();
        return clients.filter(client => {
            const searchableFields = [
                client.companyName,
                client.email,
                client.phone,
                client.address,
                client.country,
                client.trnNumber
            ].filter(Boolean); // Remove null/undefined values
            
            return searchableFields.some(field => 
                field.toLowerCase().includes(query)
            );
        });
    }, [clients, searchQuery]);

    // Calculate paginated clients
    const paginatedClients = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredClients.slice(startIndex, endIndex);
    }, [filteredClients, currentPage]);

    // Calculate total pages
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

    // Reset to first page when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    
    const variant = (element, index) => {
        if (typeof clientsVariants[element] === 'function') {
            return shouldReduceMotion
                ? clientsVariants.reduced
                : clientsVariants[element](index);
        }
        
        return shouldReduceMotion
            ? clientsVariants.reduced
            : clientsVariants[element];
    };
    
    const handleNewClientClick = () => {
        console.log('New Client button clicked');
        console.log('clientState before toggle:', clientState);
        toggleForm();
        console.log('clientState after toggle:', clientState);
    };

    const handleDeleteClick = (clientId) => {
        console.log('Delete button clicked for client:', clientId);
        toggleClientModal(clientId);
    };

    const handleConfirmDelete = () => {
        console.log('Confirming delete for client');
        handleClientDelete();
        toggleClientModal();
    };

    const handleCancelDelete = () => {
        console.log('Canceling delete for client');
        toggleClientModal();
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleExport = () => {
        const csv = Papa.unparse(clients.map(client => ({
            companyName: client.companyName,
            email: client.email,
            phone: client.phone || '',
            address: client.address || '',
            country: client.country || '',
            trnNumber: client.trnNumber || ''
        })));
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'clients.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                complete: (results) => {
                    // Skip the first row if it contains "clients"
                    const data = results.data[0][0] === 'clients' ? results.data.slice(1) : results.data;
                    
                    // Get the header row
                    const headers = data[0];
                    
                    // Process the data rows
                    const importedClients = data.slice(1).map(row => {
                        // Create an object with the correct field names
                        const client = {};
                        headers.forEach((header, index) => {
                            // Clean the value - remove quotes and trim whitespace
                            let value = row[index] || '';
                            if (typeof value === 'string') {
                                value = value.replace(/^["']|["']$/g, '').trim();
                            }
                            client[header] = value;
                        });
                        return client;
                    }).filter(client => client.companyName && client.email); // Filter out rows without required fields
                    
                    if (importedClients.length > 0) {
                        addClients(importedClients);
                    } else {
                        console.warn('No valid clients found in the CSV file');
                    }
                },
                header: false, // We'll handle headers manually
                skipEmptyLines: true
            });
        }
        // Reset the file input
        event.target.value = '';
    };

    return (
        <StyledClients
            as={motion.main}
            variants={variant('container')}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <Header
                as={motion.div}
                variants={variant('header')}
            >
                <HeaderContent>
                    <TitleGroup>
                        <TitleContainer>
                            <Title>Clients</Title>
                            <ClientCount>
                                {isLoading ? 'Loading...' : 
                                    filteredClients.length > 0
                                        ? `${filteredClients.length} client${filteredClients.length !== 1 ? 's' : ''}`
                                        : 'No clients'}
                            </ClientCount>
                        </TitleContainer>
                    </TitleGroup>
                    
                    <ButtonContainer>
                        <ImportExportButton
                            onClick={handleExport}
                            disabled={isLoading || filteredClients.length === 0}
                        >
                            <Icon name="download" size={15} color="#FFF" />
                            Export
                        </ImportExportButton>
                        <ImportExportButton
                            onClick={() => fileInputRef.current.click()}
                            disabled={isLoading}
                        >
                            <Icon name="upload" size={15} color="#FFF" />
                            Import
                        </ImportExportButton>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImport}
                            accept=".csv"
                            style={{ display: 'none' }}
                        />
                        <NewClientButton
                            onClick={handleNewClientClick}
                            disabled={isLoading}
                        >
                            <Icon name="plus" size={15} color="#FFF" />
                            New Client
                        </NewClientButton>
                    </ButtonContainer>
                </HeaderContent>
            </Header>

            <SearchBar>
                <SearchContainer>
                    <SearchIcon>
                        <Icon name="search" size={16} />
                    </SearchIcon>
                    <SearchInput
                        type="text"
                        placeholder="Search by name, email, phone..."
                        value={searchQuery}
                        onChange={handleSearch}
                        aria-label="Search clients"
                    />
                </SearchContainer>
            </SearchBar>
            
            {isLoading ? (
                <EmptyState
                    as={motion.div}
                    variants={variant('emptyState')}
                >
                    <EmptyHeading>Loading clients...</EmptyHeading>
                    <EmptyText>
                        Please wait while we fetch your client data.
                    </EmptyText>
                </EmptyState>
            ) : filteredClients.length === 0 ? (
                <ErrorMessage variant={variant} />
            ) : (
                <>
                    <ClientList>
                        {paginatedClients.map((client, index) => (
                            <ClientItem 
                                key={client.id}
                                as={motion.div}
                                variants={variant('clientItem', index)}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                layout
                            >
                                <CompanyName>{client.companyName}</CompanyName>
                                <ClientInfo>
                                    <InfoItem>
                                        <strong>Email:</strong> {client.email}
                                    </InfoItem>
                                    {client.phone && (
                                        <InfoItem>
                                            <strong>Phone:</strong> {client.phone}
                                        </InfoItem>
                                    )}
                                    {client.address && (
                                        <InfoItem>
                                            <strong>Address:</strong> {client.address}
                                        </InfoItem>
                                    )}
                                    {client.country && (
                                        <InfoItem>
                                            <strong>Country:</strong> {client.country}
                                        </InfoItem>
                                    )}
                                    {client.trnNumber && (
                                        <InfoItem>
                                            <strong>TRN:</strong> {client.trnNumber}
                                        </InfoItem>
                                    )}
                                </ClientInfo>
                                <ActionButtons>
                                    <EditButton onClick={() => editClient(client.id)} disabled={isLoading}>
                                        Edit
                                    </EditButton>
                                    <DeleteButton onClick={() => handleDeleteClick(client.id)} disabled={isLoading}>
                                        Delete
                                    </DeleteButton>
                                </ActionButtons>
                            </ClientItem>
                        ))}
                    </ClientList>
                    
                    {totalPages > 1 && (
                        <Pagination>
                            <PageButton
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </PageButton>
                            <PageInfo>
                                Page {currentPage} of {totalPages}
                            </PageInfo>
                            <PageButton
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </PageButton>
                        </Pagination>
                    )}
                </>
            )}
            
            {isModalOpen.status && (
                <ConfirmModal 
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this client? This action cannot be undone."
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </StyledClients>
    );
};

export default Clients; 