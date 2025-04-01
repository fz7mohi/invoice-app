import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useGlobalContext } from '../App/context';
import { Link } from 'react-router-dom';
import Icon from '../shared/Icon/Icon';
import InvoiceFormContent from './InvoiceFormContent';
import SubmissionController from './SubmissionController';
import {
    Backdrop,
    StyledInvoiceFormController,
    BackLink,
    BackIcon,
    BackText
} from './InvoiceFormControllerStyles';

const InvoiceFormController = ({ isEdited }) => {
    const {
        toggleInvoiceModal,
        windowWidth,
        isDarkMode
    } = useGlobalContext();

    const [mounted, setMounted] = useState(false);
    const formRef = useRef(null);
    const isDesktop = windowWidth >= 768;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                toggleInvoiceModal();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [toggleInvoiceModal]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                toggleInvoiceModal();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [toggleInvoiceModal]);

    if (!mounted) return null;

    return createPortal(
        <>
            <Backdrop onClick={toggleInvoiceModal} />
            <StyledInvoiceFormController ref={formRef}>
                <BackLink to="/invoices">
                    <BackIcon>
                        <Icon
                            name="arrow-left"
                            size={12}
                            color={isDarkMode ? '#DFE3FA' : '#7E88C3'}
                        />
                    </BackIcon>
                    <BackText>Go back</BackText>
                </BackLink>
                <InvoiceFormContent isEdited={isEdited} />
                <SubmissionController isEdited={isEdited} />
            </StyledInvoiceFormController>
        </>,
        document.body
    );
};

export default InvoiceFormController; 