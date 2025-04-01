import { useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useReducedMotion } from 'framer-motion';
import Icon from '../shared/Icon/Icon';
import Status from '../shared/Status/Status';
import Button from '../shared/Button/Button';
import InvoiceInfo from '../InvoiceInfo/InvoiceInfo';
import { invoiceViewVariants } from '../../utilities/framerVariants';
import { useGlobalContext } from '../App/context';
import {
    StyledInvoiceView,
    Container,
    MotionLink,
    Controller,
    Text,
    ButtonWrapper,
} from './InvoiceViewStyles';

const InvoiceView = () => {
    const { state, windowWidth, toggleModal, editInvoice } = useGlobalContext();
    const { colors } = useTheme();
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const isLoading = state?.isLoading || false;
    const invoiceNotFound = !isLoading && (!invoice || !state?.invoices);
    const isPaid = invoice?.status === 'paid';
    const isPaidOrDraft = isPaid || invoice?.status === 'draft';
    const isDesktop = windowWidth >= 768;
    const shouldReduceMotion = useReducedMotion();
    const variant = (element) => {
        return shouldReduceMotion
            ? invoiceViewVariants.reduced
            : invoiceViewVariants[element];
    };

    // Running an effect on render and change document title.
    useEffect(() => {
        document.title = `Invoices | #${id}`;
    }, []);

    // setInvoice only if isDeleting is false on dependency array change
    // to prevent render error where invoice doesn't exist.
    useEffect(() => {
        if (!isDeleting && state?.invoices?.length > 0) {
            const foundInvoice = state.invoices.find((item) => item.id === id);
            setInvoice(foundInvoice);
        }
    }, [state?.invoices, id, isDeleting]);

    // Redirect to home if invoice not found and not loading
    if (invoiceNotFound) {
        return <Redirect to="/" />;
    }

    // Show loading state
    if (isLoading || !state?.invoices) {
        return (
            <StyledInvoiceView>
                <Container>
                    <MotionLink
                        to="/"
                        variants={variant('link')}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <Icon name={'arrow-left'} size={10} color={colors.purple} />
                        Go back
                    </MotionLink>
                    <Controller
                        variants={variant('controller')}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <Text>Loading invoice...</Text>
                    </Controller>
                </Container>
            </StyledInvoiceView>
        );
    }

    return (
        <StyledInvoiceView>
            <Container>
                <MotionLink
                    to="/"
                    variants={variant('link')}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Icon name={'arrow-left'} size={10} color={colors.purple} />
                    Go back
                </MotionLink>
                <Controller
                    variants={variant('controller')}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Text>Status</Text>
                    <Status currStatus={invoice.status} />
                    {isDesktop && (
                        <ButtonWrapper>
                            {!isPaid && (
                                <Button
                                    $secondary
                                    onClick={() => editInvoice(id)}
                                    disabled={isLoading}
                                >
                                    Edit
                                </Button>
                            )}
                            <Button
                                $delete
                                onClick={() => {
                                    toggleModal(id, 'delete');
                                    setIsDeleting(true);
                                }}
                                disabled={isLoading}
                            >
                                Delete
                            </Button>
                            {!isPaidOrDraft && (
                                <Button
                                    $primary
                                    onClick={() => toggleModal(id, 'status')}
                                    disabled={isLoading}
                                >
                                    Mark as Paid
                                </Button>
                            )}
                        </ButtonWrapper>
                    )}
                </Controller>
                <InvoiceInfo invoice={invoice} />
            </Container>
            {!isDesktop && (
                <ButtonWrapper>
                    {!isPaid && (
                        <Button $secondary onClick={() => editInvoice(id)} disabled={isLoading}>
                            Edit
                        </Button>
                    )}
                    <Button $delete onClick={() => toggleModal(id, 'delete')} disabled={isLoading}>
                        Delete
                    </Button>
                    {!isPaidOrDraft && (
                        <Button
                            $primary
                            onClick={() => toggleModal(id, 'status')}
                            disabled={isLoading}
                        >
                            Mark as Paid
                        </Button>
                    )}
                </ButtonWrapper>
            )}
        </StyledInvoiceView>
    );
};

export default InvoiceView;
