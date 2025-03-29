import { useGlobalContext } from '../App/context';
import {
    Title,
    Hashtag,
    StyledForm,
    Fieldset,
    Legend,
    InputWrapper,
    Label,
    ErrorsWrapper,
    Error,
    Input,
    InputsGroup,
    defaultInput
} from '../FormController/Form/FormStyles';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';

// Create a styled textarea that matches the input styles
const TextArea = styled.textarea`
    ${defaultInput}
    min-height: 120px;
    resize: vertical;
    
    ${({ $error }) =>
        $error &&
        `border: 1px solid ${props => props.theme.colors.red};`}
    
    ${({ $valid }) =>
        $valid &&
        `border: 1px solid #33d69f;`}
`;

// Create a styled select that matches the input styles
const Select = styled.select`
    ${defaultInput}
    cursor: pointer;
    
    ${({ $error }) =>
        $error &&
        `border: 1px solid ${props => props.theme.colors.red};`}
    
    ${({ $valid }) =>
        $valid &&
        `border: 1px solid #33d69f;`}
`;

// Styled InputWrapper that includes a tooltip
const InputWrapperWithTooltip = styled(InputWrapper)`
    position: relative;
    
    &:hover .tooltip {
        visibility: visible;
        opacity: 1;
    }
`;

// Tooltip component
const Tooltip = styled.div`
    visibility: hidden;
    width: 200px;
    background-color: ${({ theme }) => theme.colors.bgTooltip || '#555'};
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 8px;
    position: absolute;
    z-index: 1;
    left: 50%;
    transform: translateX(-50%);
    bottom: 125%;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 12px;
    
    &::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: ${({ theme }) => theme.colors.bgTooltip || '#555'} transparent transparent transparent;
    }
`;

// Required field indicator
const RequiredIndicator = styled.span`
    color: ${({ theme }) => theme.colors.red};
    margin-left: 4px;
`;

// Input with suffix (for percentage)
const InputGroup = styled.div`
    position: relative;
    width: 100%;
    
    input {
        padding-right: 40px;
    }
`;

const InputSuffix = styled.span`
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: bold;
`;

// List of Middle Eastern countries
const middleEasternCountries = [
    "United Arab Emirates",
    "Qatar",
    "Saudi Arabia",
    "Bahrain",
    "Egypt",
    "Iran",
    "Iraq",
    "Jordan",
    "Kuwait",
    "Lebanon",
    "Oman",
    "Palestine",
    "Syria",
    "Turkey",
    "Yemen"
];

const ClientFormContent = ({ isEdited }) => {
    const { clientState, client, handleClientChange } = useGlobalContext();
    const errors = clientState.errors.err;
    const messages = clientState.errors.msg;
    const clientId = clientState.currClientIndex;
    const [validFields, setValidFields] = useState({});
    
    // Create refs for form elements
    const companyNameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const addressRef = useRef(null);
    const countryRef = useRef(null);
    const trnNumberRef = useRef(null);
    const vatPercentageRef = useRef(null);
    const uaeTaxSectionRef = useRef(null);
    
    // Format phone number as user types
    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/[^\d+]/g, ''); // Keep digits and plus sign
        
        // If there's no plus at the beginning, and the user has typed something, add it
        if (value.length > 0 && !value.startsWith('+')) {
            value = '+' + value;
        }
        
        // Format based on country code (if detected or country selected)
        if (value.startsWith('+971')) { // UAE
            // Format: +971 XX XXX XXXX
            if (value.length <= 4) { // Just +971
                // Do nothing, keep as is
            } else if (value.length <= 6) { // +971 XX
                value = value.slice(0, 4) + ' ' + value.slice(4);
            } else if (value.length <= 9) { // +971 XX XXX
                value = value.slice(0, 4) + ' ' + value.slice(4, 6) + ' ' + value.slice(6);
            } else { // +971 XX XXX XXXX
                value = value.slice(0, 4) + ' ' + value.slice(4, 6) + ' ' + value.slice(6, 9) + ' ' + value.slice(9, 13);
            }
        } else if (value.startsWith('+974')) { // Qatar
            // Format: +974 XXXX XX XX
            if (value.length <= 4) { // Just +974
                // Do nothing, keep as is
            } else if (value.length <= 8) { // +974 XXXX
                value = value.slice(0, 4) + ' ' + value.slice(4);
            } else if (value.length <= 10) { // +974 XXXX XX
                value = value.slice(0, 4) + ' ' + value.slice(4, 8) + ' ' + value.slice(8);
            } else { // +974 XXXX XX XX
                value = value.slice(0, 4) + ' ' + value.slice(4, 8) + ' ' + value.slice(8, 10) + ' ' + value.slice(10, 12);
            }
        } else if (value.startsWith('+966')) { // Saudi Arabia
            // Format: +966 XX XXX XXXX
            if (value.length <= 4) {
                // Do nothing, keep as is
            } else if (value.length <= 6) {
                value = value.slice(0, 4) + ' ' + value.slice(4);
            } else if (value.length <= 9) {
                value = value.slice(0, 4) + ' ' + value.slice(4, 6) + ' ' + value.slice(6);
            } else {
                value = value.slice(0, 4) + ' ' + value.slice(4, 6) + ' ' + value.slice(6, 9) + ' ' + value.slice(9, 13);
            }
        } else if (value.startsWith('+973')) { // Bahrain
            // Format: +973 XXXX XXXX
            if (value.length <= 4) {
                // Do nothing, keep as is
            } else if (value.length <= 8) {
                value = value.slice(0, 4) + ' ' + value.slice(4);
            } else {
                value = value.slice(0, 4) + ' ' + value.slice(4, 8) + ' ' + value.slice(8, 12);
            }
        } else if (value.startsWith('+965')) { // Kuwait
            // Format: +965 XXXX XXXX
            if (value.length <= 4) {
                // Do nothing, keep as is
            } else if (value.length <= 8) {
                value = value.slice(0, 4) + ' ' + value.slice(4);
            } else {
                value = value.slice(0, 4) + ' ' + value.slice(4, 8) + ' ' + value.slice(8, 12);
            }
        } else {
            // Generic Middle Eastern format when country code not recognized
            if (value.length > 4) {
                value = value.slice(0, 4) + ' ' + value.slice(4);
                
                if (value.length > 9) {
                    value = value.slice(0, 9) + ' ' + value.slice(9);
                }
                
                if (value.length > 14) {
                    value = value.slice(0, 14) + ' ' + value.slice(14);
                }
            }
        }
        
        handleClientChange({
            target: {
                name: 'phone',
                value
            }
        });
    };
    
    // Helper to set default country code based on selected country
    const setDefaultCountryCode = (country) => {
        const countryCodes = {
            'United Arab Emirates': '+971',
            'Qatar': '+974',
            'Saudi Arabia': '+966',
            'Bahrain': '+973',
            'Kuwait': '+965',
            'Oman': '+968',
            'Egypt': '+20',
            'Jordan': '+962',
            'Lebanon': '+961'
        };
        
        const countryCode = countryCodes[country];
        
        if (countryCode && (!client.phone || client.phone === '+')) {
            handleClientChange({
                target: {
                    name: 'phone',
                    value: countryCode + ' '
                }
            });
        }
    };
    
    // Set default country code when country changes
    useEffect(() => {
        if (client.country) {
            setDefaultCountryCode(client.country);
        }
    }, [client.country]);
    
    // Check valid fields
    useEffect(() => {
        const newValidFields = {};
        
        if (client.companyName.trim()) newValidFields.companyName = true;
        if (client.email.trim() && /\S+@\S+\.\S+/.test(client.email)) newValidFields.email = true;
        
        // Validate phone based on Middle Eastern standards (at least country code + 8 digits)
        const phoneDigits = client.phone.replace(/\D/g, '');
        if (client.phone.trim() && phoneDigits.length >= 9) newValidFields.phone = true;
        
        if (client.address.trim()) newValidFields.address = true;
        if (client.country) newValidFields.country = true;
        
        if (client.country === 'United Arab Emirates') {
            if (client.trnNumber.trim() && client.trnNumber.length >= 5) newValidFields.trnNumber = true;
            if (client.vatPercentage.trim() && !isNaN(parseFloat(client.vatPercentage))) newValidFields.vatPercentage = true;
        }
        
        setValidFields(newValidFields);
    }, [client]);
    
    // Set default VAT percentage for UAE if country is changed to UAE and VAT is not set
    useEffect(() => {
        if (client.country === 'United Arab Emirates' && !client.vatPercentage) {
            handleClientChange({
                target: {
                    name: 'vatPercentage',
                    value: '5'
                }
            });
        }
    }, [client.country]);
    
    // Scroll to UAE tax section when it appears
    useEffect(() => {
        if (client.country === 'United Arab Emirates' && uaeTaxSectionRef.current) {
            setTimeout(() => {
                uaeTaxSectionRef.current.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100); // Small delay to ensure the section is rendered
        }
    }, [client.country]);
    
    // Scroll to first error field when validation fails
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            let firstErrorRef = null;
            
            if (errors.companyName) firstErrorRef = companyNameRef;
            else if (errors.email) firstErrorRef = emailRef;
            else if (errors.phone) firstErrorRef = phoneRef;
            else if (errors.address) firstErrorRef = addressRef;
            else if (errors.country) firstErrorRef = countryRef;
            else if (errors.trnNumber) firstErrorRef = trnNumberRef;
            else if (errors.vatPercentage) firstErrorRef = vatPercentageRef;
            
            if (firstErrorRef && firstErrorRef.current) {
                firstErrorRef.current.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                firstErrorRef.current.focus();
            }
        }
    }, [errors]);

    const isUAE = client.country === 'United Arab Emirates';

    return (
        <>
            {!isEdited && <Title>New Client</Title>}
            {isEdited && (
                <Title>
                    Edit <Hashtag>#</Hashtag>
                    {clientId}
                </Title>
            )}
            <StyledForm id="client-form">
                <Fieldset>
                    <Legend>Client Information</Legend>
                    <InputWrapper>
                        <Label
                            htmlFor="companyName"
                            $error={errors?.companyName}
                        >
                            Company Name<RequiredIndicator>*</RequiredIndicator>
                            {errors?.companyName && (
                                <Error>can't be empty</Error>
                            )}
                        </Label>
                        <Input
                            ref={companyNameRef}
                            type="text"
                            name="companyName"
                            value={client.companyName}
                            $error={errors?.companyName}
                            $valid={validFields.companyName}
                            onChange={handleClientChange}
                            aria-required="true"
                            aria-invalid={errors?.companyName ? "true" : "false"}
                        />
                    </InputWrapper>
                    <InputWrapper>
                        <Label
                            htmlFor="email"
                            $error={errors?.email}
                        >
                            Email<RequiredIndicator>*</RequiredIndicator>
                            {errors?.email && (
                                <Error>invalid email</Error>
                            )}
                        </Label>
                        <Input
                            ref={emailRef}
                            type="email"
                            placeholder="e.g. email@example.com"
                            name="email"
                            value={client.email}
                            $error={errors?.email}
                            $valid={validFields.email}
                            onChange={handleClientChange}
                            aria-required="true"
                            aria-invalid={errors?.email ? "true" : "false"}
                        />
                    </InputWrapper>
                </Fieldset>

                <Fieldset>
                    <Legend>Contact Details</Legend>
                    <InputWrapper>
                        <Label 
                            htmlFor="phone"
                            $error={errors?.phone}
                        >
                            Phone<RequiredIndicator>*</RequiredIndicator>
                            {errors?.phone && (
                                <Error>can't be empty</Error>
                            )}
                        </Label>
                        <Input
                            ref={phoneRef}
                            type="text"
                            placeholder="e.g. +971 XX XXX XXXX"
                            name="phone"
                            value={client.phone}
                            $error={errors?.phone}
                            $valid={validFields.phone}
                            onChange={handlePhoneChange}
                            aria-required="true"
                            aria-invalid={errors?.phone ? "true" : "false"}
                        />
                    </InputWrapper>
                    <InputWrapper $fullWidth>
                        <Label 
                            htmlFor="address"
                            $error={errors?.address}
                        >
                            Address<RequiredIndicator>*</RequiredIndicator>
                            {errors?.address && (
                                <Error>can't be empty</Error>
                            )}
                        </Label>
                        <TextArea
                            ref={addressRef}
                            name="address"
                            value={client.address}
                            $error={errors?.address}
                            $valid={validFields.address}
                            onChange={handleClientChange}
                            placeholder="Enter full address"
                            aria-required="true"
                            aria-invalid={errors?.address ? "true" : "false"}
                        />
                    </InputWrapper>
                    <InputWrapper>
                        <Label 
                            htmlFor="country"
                            $error={errors?.country}
                        >
                            Country<RequiredIndicator>*</RequiredIndicator>
                            {errors?.country && (
                                <Error>must select a country</Error>
                            )}
                        </Label>
                        <Select
                            ref={countryRef}
                            name="country"
                            value={client.country}
                            $error={errors?.country}
                            $valid={validFields.country}
                            onChange={handleClientChange}
                            aria-required="true"
                            aria-invalid={errors?.country ? "true" : "false"}
                        >
                            <option value="">Select a country</option>
                            {middleEasternCountries.map(country => (
                                <option key={country} value={country}>
                                    {country}
                                    {country === "United Arab Emirates" ? " (requires additional info)" : ""}
                                </option>
                            ))}
                        </Select>
                    </InputWrapper>
                </Fieldset>

                {isUAE && (
                    <Fieldset ref={uaeTaxSectionRef}>
                        <Legend>UAE Tax Information</Legend>
                        <InputWrapperWithTooltip>
                            <Label 
                                htmlFor="trnNumber"
                                $error={errors?.trnNumber}
                            >
                                TRN Number<RequiredIndicator>*</RequiredIndicator>
                                {errors?.trnNumber && (
                                    <Error>TRN number is required</Error>
                                )}
                            </Label>
                            <Tooltip className="tooltip">
                                Tax Registration Number (TRN) is a unique identifier issued by the UAE Federal Tax Authority for VAT purposes
                            </Tooltip>
                            <Input
                                ref={trnNumberRef}
                                type="text"
                                name="trnNumber"
                                value={client.trnNumber}
                                $error={errors?.trnNumber}
                                $valid={validFields.trnNumber}
                                onChange={handleClientChange}
                                placeholder="Enter TRN Number"
                                aria-required="true"
                                aria-invalid={errors?.trnNumber ? "true" : "false"}
                                aria-describedby="trnHint"
                            />
                            <div id="trnHint" style={{ fontSize: '0.75rem', marginTop: '4px', color: '#777' }}>
                                Format: 15-digit number (e.g., 100123456700003)
                            </div>
                        </InputWrapperWithTooltip>
                        <InputWrapperWithTooltip>
                            <Label 
                                htmlFor="vatPercentage"
                                $error={errors?.vatPercentage}
                            >
                                VAT Percentage<RequiredIndicator>*</RequiredIndicator>
                                {errors?.vatPercentage && (
                                    <Error>must be a valid percentage</Error>
                                )}
                            </Label>
                            <Tooltip className="tooltip">
                                Standard VAT rate in UAE is 5%
                            </Tooltip>
                            <InputGroup>
                                <Input
                                    ref={vatPercentageRef}
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    name="vatPercentage"
                                    value={client.vatPercentage}
                                    $error={errors?.vatPercentage}
                                    $valid={validFields.vatPercentage}
                                    onChange={handleClientChange}
                                    placeholder="5"
                                    aria-required="true"
                                    aria-invalid={errors?.vatPercentage ? "true" : "false"}
                                />
                                <InputSuffix>%</InputSuffix>
                            </InputGroup>
                        </InputWrapperWithTooltip>
                    </Fieldset>
                )}

                {messages.length > 0 && (
                    <ErrorsWrapper>
                        {messages.map((message, index) => (
                            <Error key={index}>{message}</Error>
                        ))}
                    </ErrorsWrapper>
                )}
            </StyledForm>
        </>
    );
};

export default ClientFormContent; 