import { useState } from 'react';
import Button from '../shared/Button/Button';
import { useGlobalContext } from '../App/context';
import { StyledSubmitController } from '../FormController/SubmitController/SubmitControllerStyles';

const QuotationSubmitController = () => {
    const { quotationState, handleQuotationSubmit, discardQuotationChanges } = useGlobalContext();
    const [isQuotationEdited] = useState(quotationState.form.isEditing);

    return (
        <StyledSubmitController $isEdited={isQuotationEdited}>
            <Button $small type="button" $secondary onClick={discardQuotationChanges}>
                Discard
            </Button>
            {!isQuotationEdited && (
                <Button
                    type="submit"
                    form="quotation-form"
                    $small
                    $save
                    onClick={() => handleQuotationSubmit('draft')}
                >
                    Save as Draft
                </Button>
            )}
            <Button
                type="submit"
                form="quotation-form"
                $small
                $primary
                onClick={() => handleQuotationSubmit(isQuotationEdited ? 'change' : 'new')}
            >
                Save {!isQuotationEdited ? '& Send' : 'Changes'}
            </Button>
        </StyledSubmitController>
    );
};

export default QuotationSubmitController; 