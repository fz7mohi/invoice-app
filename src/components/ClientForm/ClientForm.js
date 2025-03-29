import { useGlobalContext } from '../App/context';
import { 
    Backdrop,
    StyledForm,
    FormHeader,
    Title,
    FormContent,
    FormFooter,
    CloseButton,
    InputWrapper,
    Label,
    Input,
    SubmitButton,
    CancelButton
} from './ClientFormStyles';

const ClientForm = () => {
    const { 
        clientState, 
        client, 
        handleClientChange, 
        handleClientSubmit,
        toggleForm
    } = useGlobalContext();
    
    const isEditing = clientState.isClientEdited;
    const errors = clientState.errors.err;
    
    return (
        <>
            <Backdrop onClick={toggleForm} />
            <StyledForm>
                <FormHeader>
                    <Title>{isEditing ? 'Edit Client' : 'Add New Client'}</Title>
                    <CloseButton onClick={toggleForm}>
                        <span>&times;</span>
                    </CloseButton>
                </FormHeader>
                
                <FormContent>
                    <InputWrapper>
                        <Label htmlFor="companyName" $error={errors?.companyName}>
                            Company Name
                            {errors?.companyName && <span>can't be empty</span>}
                        </Label>
                        <Input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={client.companyName}
                            onChange={handleClientChange}
                            $error={errors?.companyName}
                            placeholder="Company name"
                        />
                    </InputWrapper>
                    
                    <InputWrapper>
                        <Label htmlFor="email" $error={errors?.email}>
                            Email
                            {errors?.email && <span>invalid email</span>}
                        </Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={client.email}
                            onChange={handleClientChange}
                            $error={errors?.email}
                            placeholder="email@example.com"
                        />
                    </InputWrapper>
                    
                    <InputWrapper>
                        <Label htmlFor="phone">
                            Phone
                        </Label>
                        <Input
                            type="text"
                            id="phone"
                            name="phone"
                            value={client.phone}
                            onChange={handleClientChange}
                            placeholder="(123) 456-7890"
                        />
                    </InputWrapper>
                    
                    <InputWrapper>
                        <Label htmlFor="address">
                            Address
                        </Label>
                        <Input
                            type="text"
                            id="address"
                            name="address"
                            value={client.address}
                            onChange={handleClientChange}
                            placeholder="Street address"
                        />
                    </InputWrapper>
                    
                    <InputWrapper>
                        <Label htmlFor="country">
                            Country
                        </Label>
                        <Input
                            type="text"
                            id="country"
                            name="country"
                            value={client.country}
                            onChange={handleClientChange}
                            placeholder="Country"
                        />
                    </InputWrapper>
                </FormContent>
                
                <FormFooter>
                    <CancelButton type="button" onClick={toggleForm}>
                        Cancel
                    </CancelButton>
                    <SubmitButton 
                        type="button" 
                        onClick={(e) => handleClientSubmit(e, isEditing ? 'edit' : 'add')}
                    >
                        {isEditing ? 'Save Changes' : 'Save Client'}
                    </SubmitButton>
                </FormFooter>
            </StyledForm>
        </>
    );
};

export default ClientForm; 