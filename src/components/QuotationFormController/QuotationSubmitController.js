import { useState, useEffect } from 'react';
import Button from '../shared/Button/Button';
import { useGlobalContext } from '../App/context';
import { StyledSubmitController } from '../FormController/SubmitController/SubmitControllerStyles';

const QuotationSubmitController = () => {
    const { quotationState, handleQuotationSubmit, discardQuotationChanges } = useGlobalContext();
    const [isQuotationEdited] = useState(quotationState.form.isEditing);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitWithLogging = async (type) => {
        if (isSubmitting) {
            console.log('Already submitting, ignoring click');
            return;
        }
        
        let isMounted = true;
        
        try {
            setIsSubmitting(true);
            console.log('QuotationSubmitController: Submit button clicked with type:', type);
            console.log('Current quotation state before submit:', quotationState);
            console.log('Is quotation being edited:', isQuotationEdited);
            
            // Call the submit function and await its completion
            const result = await handleQuotationSubmit(type);
            console.log('handleQuotationSubmit result:', result);
            
            if (!isMounted) return;
            
            if (result === true) {
                console.log('Quotation submitted successfully, waiting before closing form...');
                
                // Wait for a longer time to ensure all state updates are complete
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                if (!isMounted) return;
                
                console.log('Closing form after successful submission');
                discardQuotationChanges();
            } else {
                console.log('Submission did not return success, keeping form open');
                // Show validation errors if they exist
                if (quotationState.errors?.isError && quotationState.errors?.messages?.length > 0) {
                    console.log('Validation errors:', quotationState.errors.messages);
                }
            }
        } catch (error) {
            if (!isMounted) return;
            
            console.error('Error during form submission:', error);
            console.error('Error details:', {
                code: error.code,
                message: error.message,
                stack: error.stack
            });
            // Don't close the form on error
        } finally {
            if (isMounted) {
                setIsSubmitting(false);
            }
        }
    };

    // Cleanup function
    useEffect(() => {
        return () => {
            // This will be called when the component unmounts
            setIsSubmitting(false);
        };
    }, []);

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
                    $small
                    $save
                    onClick={() => handleSubmitWithLogging('draft')}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save as Draft'}
                </Button>
            )}
            <Button
                type="button"
                $small
                $primary
                onClick={() => handleSubmitWithLogging(isQuotationEdited ? 'change' : 'new')}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Saving...' : `Save ${!isQuotationEdited ? '& Send' : 'Changes'}`}
            </Button>
        </StyledSubmitController>
    );
};

export default QuotationSubmitController; 