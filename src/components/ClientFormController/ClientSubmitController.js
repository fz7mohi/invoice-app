import { useGlobalContext } from '../App/context';
import Button from '../shared/Button/Button';
import { StyledSubmitController } from '../FormController/SubmitController/SubmitControllerStyles';

const ClientSubmitController = () => {
    const { clientState, handleClientSubmit, toggleForm } = useGlobalContext();
    const isEdited = clientState.isClientEdited;

    return (
        <StyledSubmitController $isEdited={isEdited}>
            <Button type="button" $small $secondary onClick={toggleForm}>
                Discard
            </Button>
            {isEdited ? (
                <Button
                    type="button"
                    $small
                    $primary
                    onClick={(e) => handleClientSubmit(e, 'edit')}
                >
                    Save Changes
                </Button>
            ) : (
                <Button
                    type="button"
                    $small
                    $primary
                    onClick={(e) => handleClientSubmit(e, 'add')}
                >
                    Save Client
                </Button>
            )}
        </StyledSubmitController>
    );
};

export default ClientSubmitController; 