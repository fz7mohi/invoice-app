import { useState } from 'react';
import Button from '../shared/Button/Button';
import { useGlobalContext } from '../App/context';
import { StyledSubmitController } from '../FormController/SubmitController/SubmitControllerStyles';

const QuotationSubmitController = () => {
    const { quotationState, handleQuotationSubmit, discardQuotationChanges } = useGlobalContext();
    const [isQuotationEdited] = useState(quotationState.form.isEditing);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitWithLogging = async (type) => {
        try {
            // Prevent double submissions
            if (isSubmitting) return;
            
            setIsSubmitting(true);
            console.log('QuotationSubmitController: Submit button clicked with type:', type);
            console.log('Current quotation state before submit:', quotationState);
            
            // Call the submit function and await its completion
            await handleQuotationSubmit(type);
            
            console.log('Quotation submitted successfully, closing form...');
            
            // After submit completes, close the form with a small delay to ensure state updates
            setTimeout(() => {
                discardQuotationChanges();
                console.log('Form closed after submission');
            }, 300);
        } catch (error) {
            console.error('Error during form submission:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <StyledSubmitController $isEdited={isQuotationEdited}>
            <Button 
                $small 
                type="button" 
                $secondary 
                onClick={discardQuotationChanges}
                disabled={isSubmitting}
            >
                Discard
            </Button>
            {!isQuotationEdited && (
                <Button
                    type="button"
                    form="quotation-form"
                    $small
                    $save
                    onClick={(e) => {
                        e.preventDefault();
                        handleSubmitWithLogging('draft');
                    }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save as Draft'}
                </Button>
            )}
            <Button
                type="button"
                form="quotation-form"
                $small
                $primary
                onClick={(e) => {
                    e.preventDefault();
                    handleSubmitWithLogging(isQuotationEdited ? 'change' : 'new');
                }}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Saving...' : `Save ${!isQuotationEdited ? '& Send' : 'Changes'}`}
            </Button>
        </StyledSubmitController>
    );
};

export default QuotationSubmitController; 