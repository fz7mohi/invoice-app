import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useReducedMotion } from 'framer-motion';
import Icon from '../shared/Icon/Icon';
import Status from '../shared/Status/Status';
import Button from '../shared/Button/Button';
import InvoiceInfo from '../InvoiceInfo/InvoiceInfo';
import {
    invoiceViewLinkVariants,
    invoiceViewControllerVariants,
    motionReducedVariants,
} from '../../utilities/framerVariants';
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
    const [invoice] = useState(state.invoices.find((item) => item.id === id));
    const isPaid = invoice.status === 'paid';
    const isPaidOrDraft = isPaid || invoice.status === 'draft';
    const isDesktop = windowWidth >= 768;
    const shouldReduceMotion = useReducedMotion();
    const linkVariant = shouldReduceMotion
        ? motionReducedVariants
        : invoiceViewLinkVariants;
    const controllerVariant = shouldReduceMotion
        ? motionReducedVariants
        : invoiceViewControllerVariants;

    // Running an effect on render and change document title.
    useEffect(() => {
        document.title = `Invoices | #${id}`;
    }, []);

    return (
        <StyledInvoiceView>
            <Container>
                <MotionLink
                    to="/"
                    variants={linkVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Icon name={'arrow-left'} size={10} color={colors.purple} />
                    Go back
                </MotionLink>
                <Controller
                    variants={controllerVariant}
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
                                >
                                    Edit
                                </Button>
                            )}
                            <Button
                                $delete
                                onClick={() => toggleModal(id, 'delete')}
                            >
                                Delete
                            </Button>
                            {!isPaidOrDraft && (
                                <Button
                                    $primary
                                    onClick={() => toggleModal(id, 'status')}
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
                        <Button $secondary onClick={() => editInvoice(id)}>
                            Edit
                        </Button>
                    )}
                    <Button $delete onClick={() => toggleModal(id, 'delete')}>
                        Delete
                    </Button>
                    {!isPaidOrDraft && (
                        <Button
                            $primary
                            onClick={() => toggleModal(id, 'status')}
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
