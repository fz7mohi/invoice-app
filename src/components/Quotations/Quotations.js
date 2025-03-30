import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useGlobalContext } from '../App/context';
import Filter from './Filter/Filter';
import List from './List/List';
import Button from '../shared/Button/Button';
import quotationsLengthMessage from '../../utilities/quotationsLengthMessage';
import { quotationsVariants } from '../../utilities/framerVariants';
import { Container, Header, Info, Title, Text } from './QuotationsStyles';

const Quotations = () => {
    const [filterType, setFilterType] = useState('all');
    const shouldReduceMotion = useReducedMotion();
    const { windowWidth, quotationState, createQuotation, refreshQuotations } = useGlobalContext();
    
    const isLoading = quotationState?.isLoading || false;
    const rawQuotations = quotationState?.quotations || [];
    const isDesktop = windowWidth >= 768;

    // Force a refresh of quotations data on component mount, only once
    useEffect(() => {
        refreshQuotations();
    }, []);

    // Filter quotations based on status
    const filteredQuotations = rawQuotations.filter(quotation => {
        if (filterType === 'all') return true;
        if (filterType === 'pending') return quotation.status === 'pending';
        if (filterType === 'paid') return quotation.status === 'paid';
        if (filterType === 'draft') return quotation.status === 'draft';
        return true;
    });

    // Update document title based on filter
    useEffect(() => {
        const message = quotationsLengthMessage(
            filteredQuotations.length,
            filterType,
            windowWidth
        );
        document.title = `Invoice App | ${message}`;
    }, [filteredQuotations.length, filterType, windowWidth]);

    // Define variant based on element type and reduced motion preference
    const variant = (type, index) => {
        if (shouldReduceMotion) return quotationsVariants.reduced;
        
        if (type === 'container') return quotationsVariants.container;
        if (type === 'header') return quotationsVariants.header;
        if (type === 'list') return quotationsVariants.list(index);
        if (type === 'error') return quotationsVariants.errorMessage;
        
        return {};
    };

    return (
        <Container>
            <Header
                variants={variant('header')}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <Info>
                    <Title>Quotations</Title>
                    <Text>
                        {isLoading 
                            ? "Loading quotations..."
                            : quotationsLengthMessage(
                                filteredQuotations.length,
                                filterType,
                                windowWidth
                            )
                        }
                    </Text>
                </Info>
                
                <Filter 
                    filterType={filterType} 
                    setFilterType={setFilterType} 
                />
                
                <Button 
                    type="button" 
                    $newInvoice 
                    onClick={createQuotation}
                    disabled={isLoading}
                >
                    New {isDesktop && 'Quotation'}
                </Button>
            </Header>

            <List 
                isLoading={isLoading}
                quotations={filteredQuotations} 
                variant={variant}
            />
        </Container>
    );
};

export default Quotations; 