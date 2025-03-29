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
    DeleteButton
} from './ClientsStyles';
import Icon from '../shared/Icon/Icon';
import ConfirmModal from '../shared/ConfirmModal/ConfirmModal';
import { clientsVariants } from '../../utilities/framerVariants';

const Clients = () => {
    const { 
        clientState, 
        toggleForm, 
        editClient, 
        toggleClientModal 
    } = useGlobalContext();
    
    const { clients, isModalOpen } = clientState;
    const shouldReduceMotion = useReducedMotion();
    
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
                <EmptyState
                    as={motion.div}
                    variants={variant('emptyState')}
                >
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
                    {clients.map((client, index) => (
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