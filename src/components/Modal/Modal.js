import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useReducedMotion } from 'framer-motion';
import ModalDelete from './ModalDelete';
import ModalStatus from './ModalStatus';
import ModalDeleteQuotation from './ModalDeleteQuotation';
import QuotationFormController from '../QuotationFormController/QuotationFormController';
import { modalVariants } from '../../utilities/framerVariants';
import { useGlobalContext } from '../App/context';
import { StyledModal } from './ModalStyles';

const Modal = () => {
    const { 
        state, 
        toggleModal,
        quotationState,
        toggleQuotationModal 
    } = useGlobalContext();
    
    // Simplified conditions
    const isDeleteModal = state.isModalOpen.name === 'delete';
    const isStatusModal = state.isModalOpen.name === 'status';
    const isQuotationModal = quotationState?.form?.isCreating === true || quotationState?.form?.isEditing === true;
    const isQuotationDeleteModal = quotationState?.modal?.isOpen && quotationState?.modal?.name === 'delete';
    
    const modalRef = useRef();
    const shouldReduceMotion = useReducedMotion();
    const variant = (element) => {
        return shouldReduceMotion
            ? modalVariants.reduced
            : modalVariants[element];
    };
    const containerVariant = variant('container');

    /**
     * Function to trap user focus within Modal component.
     */
    const focusTrap = (event) => {
        if (event.key === 'Escape') {
            if (isQuotationModal || isQuotationDeleteModal) {
                toggleQuotationModal();
            } else {
                toggleModal();
            }
        }
        if (event.key !== 'Tab') return;

        const modalElements = modalRef.current.querySelectorAll('button');
        const firstElement = modalElements[0];
        const lastElement = modalElements[modalElements.length - 1];

        // if going forward by pressing tab and lastElement is active shift focus to first focusable element
        if (!event.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
        }

        // if going backward by pressing tab and firstElement is active shift focus to last focusable element
        if (event.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
        }
    };

    /**
     * Function to hide Modal component after user click outside Modal container.
     */
    const handleClickOutsideModal = (event) => {
        const target = event.target;
        if (target === modalRef.current) {
            if (isQuotationModal || isQuotationDeleteModal) {
                toggleQuotationModal();
            } else {
                toggleModal();
            }
        }
    };

    // Side effect to add event listeners and disable page scrolling.
    useEffect(() => {
        document.addEventListener('keydown', focusTrap);
        document.addEventListener('click', handleClickOutsideModal);
        if (modalRef.current) {
            modalRef.current.focus();
        }
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', focusTrap);
            document.removeEventListener('click', handleClickOutsideModal);
            document.body.style.overflow = 'unset';
        };
    }, [isQuotationModal, isQuotationDeleteModal]);

    // Only render if any modal should be shown
    if (!isDeleteModal && !isStatusModal && !isQuotationModal && !isQuotationDeleteModal) {
        return null;
    }

    const modal = (
        <StyledModal
            aria-modal
            aria-label="Confirmation"
            tabIndex={-1}
            role="dialog"
            ref={modalRef}
            variants={variant('modal')}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {isDeleteModal && <ModalDelete variants={containerVariant} />}
            {isStatusModal && <ModalStatus variants={containerVariant} />}
            {isQuotationModal && <QuotationFormController variants={containerVariant} />}
            {isQuotationDeleteModal && <ModalDeleteQuotation variants={containerVariant} />}
        </StyledModal>
    );

    return ReactDOM.createPortal(modal, document.body);
};

export default Modal;
