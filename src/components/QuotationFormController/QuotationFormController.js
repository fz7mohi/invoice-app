import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from 'styled-components';
import { useReducedMotion } from 'framer-motion';
import { useGlobalContext } from '../App/context';
import { FormControllerVariants } from '../../utilities/framerVariants';
import Icon from '../shared/Icon/Icon';
import { Backdrop, Link } from '../FormController/FormControllerStyles';
import QuotationFormContent from './QuotationFormContent';
import QuotationSubmitController from './QuotationSubmitController';
import { StyledQuotationFormController } from './QuotationFormControllerStyles';

const QuotationFormController = () => {
    const { quotationState, windowWidth, discardQuotationChanges } = useGlobalContext();
    const { colors } = useTheme();
    const isTablet = windowWidth >= 768;
    const [isFormEdited] = useState(quotationState.form.isEditing);
    const formRef = useRef();
    const backdropRef = useRef();
    const hasScroll = window.innerWidth > document.documentElement.clientWidth;
    const shouldReduceMotion = useReducedMotion();
    
    const variant = (element) => {
        return shouldReduceMotion
            ? FormControllerVariants.reduced
            : FormControllerVariants[element];
    };

    // Side effect to add event listeners and disable page scrolling.
    useEffect(() => {
        document.addEventListener('keydown', focusTrap);
        document.addEventListener('click', handleClickOutsideForm);
        formRef.current.focus();
        document.body.style.overflow = 'hidden';
        hasScroll && (document.body.style.paddingRight = '17px');

        return () => {
            document.removeEventListener('keydown', focusTrap);
            document.removeEventListener('click', handleClickOutsideForm);
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = 'unset';
        };
    }, []);

    /**
     * Function to hide Form component after user click outside Form container.
     */
    const handleClickOutsideForm = (event) => {
        const target = event.target;
        
        // Only close the form if clicking on the backdrop
        if (target === backdropRef.current) {
            discardQuotationChanges();
        }
    };

    /**
     * Function to trap user focus within component.
     */
    const focusTrap = (event) => {
        if (event.key === 'Escape') discardQuotationChanges();
        if (event.key !== 'Tab') return;

        const formElements =
            formRef.current.querySelectorAll('button, a, input');
        const firstElement = formElements[0];
        const lastElement = formElements[formElements.length - 1];

        // if going forward by pressing tab and lastElement is active shift focus to first focusable element
        if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }

        // if going backward by pressing tab and firstElement is active shift focus to last focusable element
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        }
    };

    const controller = (
        <>
            <Backdrop
                ref={backdropRef}
                variants={variant('backdrop')}
                initial="hidden"
                animate="visible"
                exit="exit"
            ></Backdrop>
            <StyledQuotationFormController
                aria-modal
                aria-label="Quotation form"
                tabIndex={-1}
                role="dialog"
                ref={formRef}
                variants={variant('form')}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {!isTablet && (
                    <Link to="/quotations" onClick={discardQuotationChanges}>
                        <Icon
                            name={'arrow-left'}
                            size={10}
                            color={colors.purple}
                        />
                        Go back
                    </Link>
                )}
                <QuotationFormContent isEdited={isFormEdited} />
                <QuotationSubmitController />
            </StyledQuotationFormController>
        </>
    );

    return ReactDOM.createPortal(controller, document.body);
};

export default QuotationFormController; 