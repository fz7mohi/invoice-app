import { useGlobalContext } from '../App/context';
import { motion } from 'framer-motion';
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
    DeleteButton
} from './ClientsStyles';
import Icon from '../shared/Icon/Icon';
import ConfirmModal from '../shared/ConfirmModal/ConfirmModal';

const Clients = () => {
    const { 
        clientState, 
        toggleForm, 
        editClient, 
        toggleClientModal 
    } = useGlobalContext();
    
    const { clients, isModalOpen } = clientState;
    
    return (
        <StyledClients
            as={motion.main}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Header>
                <TitleContainer>
                    <Title>Clients</Title>
                    <ClientCount>
                        {clients.length > 0
                            ? `${clients.length} client${clients.length !== 1 ? 's' : ''}`
                            : 'No clients'}
                    </ClientCount>
                </TitleContainer>
                
                <ButtonContainer>
                    <NewClientButton onClick={toggleForm}>
                        <Icon name="plus" size={15} color="#FFF" />
                        New Client
                    </NewClientButton>
                </ButtonContainer>
            </Header>
            
            {clients.length === 0 ? (
                <EmptyState>
                    <img 
                        src={require('../../assets/images/illustration-empty.svg')} 
                        alt="No clients" 
                    />
                    <EmptyHeading>There is nothing here</EmptyHeading>
                    <EmptyText>
                        Create a client by clicking the 
                        <strong> New Client</strong> button.
                    </EmptyText>
                </EmptyState>
            ) : (
                <ClientList>
                    {clients.map((client) => (
                        <ClientItem key={client.id}>
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
                            </ClientInfo>
                            <ActionButtons>
                                <EditButton onClick={() => editClient(client.id)}>
                                    Edit
                                </EditButton>
                                <DeleteButton onClick={() => toggleClientModal(client.id)}>
                                    Delete
                                </DeleteButton>
                            </ActionButtons>
                        </ClientItem>
                    ))}
                </ClientList>
            )}
            
            {isModalOpen.status && (
                <ConfirmModal 
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this client? This action cannot be undone."
                    confirmAction="deleteClient"
                    cancelAction="toggleClientModal"
                />
            )}
        </StyledClients>
    );
};

export default Clients; 