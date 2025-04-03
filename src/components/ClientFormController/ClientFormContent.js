import { useGlobalContext } from '../App/context';
import {
    FormTitle,
    FormSection,
    SectionTitle,
    InputGroup,
    InputWrapper,
    InputContainer,
    Label,
    Input,
    TextArea,
    Select,
    ErrorMessage,
    RequiredIndicator,
    Tooltip,
    InputWrapperWithTooltip,
    AutoFillButton
} from './ClientFormControllerStyles';
import { useEffect, useRef, useState } from 'react';
import Icon from '../shared/Icon/Icon';
import { useTheme } from 'styled-components';

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
    const { colors } = useTheme();
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
        let value = e.target.value.replace(/[^\d+]/g, '');
        
        if (value.length > 0 && !value.startsWith('+')) {
            value = '+' + value;
        }
        
        if (value.startsWith('+971')) {
            if (value.length <= 4) {
                // Do nothing, keep as is
            } else if (value.length <= 6) {
                value = value.slice(0, 4) + ' ' + value.slice(4);
            } else if (value.length <= 9) {
                value = value.slice(0, 4) + ' ' + value.slice(4, 6) + ' ' + value.slice(6);
            } else {
                value = value.slice(0, 4) + ' ' + value.slice(4, 6) + ' ' + value.slice(6, 9) + ' ' + value.slice(9, 13);
            }
        } else if (value.startsWith('+974')) {
            if (value.length <= 4) {
                // Do nothing, keep as is
            } else if (value.length <= 8) {
                value = value.slice(0, 4) + ' ' + value.slice(4);
            } else if (value.length <= 10) {
                value = value.slice(0, 4) + ' ' + value.slice(4, 8) + ' ' + value.slice(8);
            } else {
                value = value.slice(0, 4) + ' ' + value.slice(4, 8) + ' ' + value.slice(8, 10) + ' ' + value.slice(10, 12);
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
            }, 100);
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

    // Auto-fill handlers
    const handleAutoFillEmail = () => {
        handleClientChange({
            target: {
                name: 'email',
                value: 'dummy@email.com'
            }
        });
    };

    const handleAutoFillPhone = () => {
        handleClientChange({
            target: {
                name: 'phone',
                value: '+974 123 4 5678'
            }
        });
    };

    return (
        <>
            {!isEdited && (
                <FormTitle>
                    <Icon name="user" size={20} color={colors.purple} />
                    New Client
                </FormTitle>
            )}
            {isEdited && (
                <FormTitle>
                    <Icon name="edit" size={20} color={colors.purple} />
                    Edit Client #{clientId}
                </FormTitle>
            )}

            <FormSection>
                <SectionTitle>
                    <Icon name="building" size={14} color={colors.textSecondary} />
                    Client Information
                </SectionTitle>
                <InputGroup>
                    <InputWrapper>
                        <InputContainer>
                            <Label htmlFor="companyName" $error={errors?.companyName}>
                                Company Name<RequiredIndicator>*</RequiredIndicator>
                            </Label>
                            <Input
                                ref={companyNameRef}
                                type="text"
                                name="companyName"
                                value={client.companyName}
                                $error={errors?.companyName}
                                $valid={validFields.companyName}
                                onChange={handleClientChange}
                                placeholder="Enter company name"
                                aria-required="true"
                                aria-invalid={errors?.companyName ? "true" : "false"}
                            />
                            {errors?.companyName && (
                                <ErrorMessage>Company name is required</ErrorMessage>
                            )}
                        </InputContainer>
                    </InputWrapper>

                    <InputWrapper>
                        <InputContainer>
                            <Label htmlFor="email" $error={errors?.email}>
                                Email<RequiredIndicator>*</RequiredIndicator>
                            </Label>
                            <Input
                                ref={emailRef}
                                type="email"
                                name="email"
                                value={client.email}
                                $error={errors?.email}
                                $valid={validFields.email}
                                onChange={handleClientChange}
                                placeholder="email@example.com"
                                aria-required="true"
                                aria-invalid={errors?.email ? "true" : "false"}
                            />
                            {errors?.email && (
                                <ErrorMessage>Please enter a valid email address</ErrorMessage>
                            )}
                        </InputContainer>
                        <AutoFillButton type="button" onClick={handleAutoFillEmail}>
                            Auto-fill
                        </AutoFillButton>
                    </InputWrapper>
                </InputGroup>
            </FormSection>

            <FormSection>
                <SectionTitle>
                    <Icon name="phone" size={14} color={colors.textSecondary} />
                    Contact Details
                </SectionTitle>
                <InputGroup>
                    <InputWrapper>
                        <InputContainer>
                            <Label htmlFor="phone" $error={errors?.phone}>
                                Phone<RequiredIndicator>*</RequiredIndicator>
                            </Label>
                            <Input
                                ref={phoneRef}
                                type="text"
                                name="phone"
                                value={client.phone}
                                $error={errors?.phone}
                                $valid={validFields.phone}
                                onChange={handlePhoneChange}
                                placeholder="+971 XX XXX XXXX"
                                aria-required="true"
                                aria-invalid={errors?.phone ? "true" : "false"}
                            />
                            {errors?.phone && (
                                <ErrorMessage>Please enter a valid phone number</ErrorMessage>
                            )}
                        </InputContainer>
                        <AutoFillButton type="button" onClick={handleAutoFillPhone}>
                            Auto-fill
                        </AutoFillButton>
                    </InputWrapper>

                    <InputWrapper>
                        <Label htmlFor="country" $error={errors?.country}>
                            Country<RequiredIndicator>*</RequiredIndicator>
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
                        {errors?.country && (
                            <ErrorMessage>Please select a country</ErrorMessage>
                        )}
                    </InputWrapper>
                </InputGroup>

                <InputWrapper>
                    <Label htmlFor="address" $error={errors?.address}>
                        Address<RequiredIndicator>*</RequiredIndicator>
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
                    {errors?.address && (
                        <ErrorMessage>Please enter the client's address</ErrorMessage>
                    )}
                </InputWrapper>
            </FormSection>

            {isUAE && (
                <FormSection ref={uaeTaxSectionRef}>
                    <SectionTitle>
                        <Icon name="receipt" size={14} color={colors.textSecondary} />
                        UAE Tax Information
                    </SectionTitle>
                    <InputGroup>
                        <InputWrapperWithTooltip>
                            <Label htmlFor="trnNumber" $error={errors?.trnNumber}>
                                TRN Number<RequiredIndicator>*</RequiredIndicator>
                            </Label>
                            <Tooltip>
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
                            <div id="trnHint" style={{ fontSize: '0.75rem', marginTop: '4px', color: colors.textSecondary }}>
                                Format: 15-digit number (e.g., 100123456700003)
                            </div>
                            {errors?.trnNumber && (
                                <ErrorMessage>Please enter a valid TRN number</ErrorMessage>
                            )}
                        </InputWrapperWithTooltip>

                        <InputWrapper>
                            <Label htmlFor="vatPercentage" $error={errors?.vatPercentage}>
                                VAT Percentage<RequiredIndicator>*</RequiredIndicator>
                            </Label>
                            <Input
                                ref={vatPercentageRef}
                                type="number"
                                name="vatPercentage"
                                value={client.vatPercentage}
                                $error={errors?.vatPercentage}
                                $valid={validFields.vatPercentage}
                                onChange={handleClientChange}
                                placeholder="Enter VAT percentage"
                                aria-required="true"
                                aria-invalid={errors?.vatPercentage ? "true" : "false"}
                            />
                            {errors?.vatPercentage && (
                                <ErrorMessage>Please enter a valid VAT percentage</ErrorMessage>
                            )}
                        </InputWrapper>
                    </InputGroup>
                </FormSection>
            )}

            {messages.length > 0 && (
                <div style={{ 
                    padding: '12px 16px', 
                    backgroundColor: colors.redLight, 
                    borderRadius: '12px', 
                    marginBottom: '20px',
                    border: `1px solid ${colors.red}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Icon name="alert" size={14} color={colors.red} />
                    {messages.map((message, index) => (
                        <ErrorMessage key={index}>{message}</ErrorMessage>
                    ))}
                </div>
            )}
        </>
    );
};

export default ClientFormContent; 