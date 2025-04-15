import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Button from '../shared/Button/Button';
import Icon from '../shared/Icon/Icon';
import { headingTitle } from '../../utilities/typographyStyles';

const CompanyProfile = ({ companies, setCompanies, isLoading }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    vatNumber: '',
    crNumber: '',
    gstNumber: '',
    website: '',
    bankName: '',
    branchName: '',
    accountName: '',
    accountNumber: '',
    iban: '',
    swift: '',
    chequesPayableTo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Define countries with their VAT/GST information
  const countries = [
    { value: 'uae', label: 'United Arab Emirates', hasVat: true },
    { value: 'qatar', label: 'Qatar', hasCr: true },
    { value: 'china', label: 'China' },
    { value: 'india', label: 'India (GST 18%)', hasGst: true }
  ];

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Set form data when editing a company
  useEffect(() => {
    if (editingCompany) {
      setFormData({
        name: editingCompany.name || '',
        email: editingCompany.email || '',
        phone: editingCompany.phone || '',
        address: editingCompany.address || '',
        country: editingCompany.country || '',
        vatNumber: editingCompany.vatNumber || '',
        crNumber: editingCompany.crNumber || '',
        gstNumber: editingCompany.gstNumber || '',
        website: editingCompany.website || '',
        bankName: editingCompany.bankName || '',
        branchName: editingCompany.branchName || '',
        accountName: editingCompany.accountName || '',
        accountNumber: editingCompany.accountNumber || '',
        iban: editingCompany.iban || '',
        swift: editingCompany.swift || '',
        chequesPayableTo: editingCompany.chequesPayableTo || ''
      });
    }
  }, [editingCompany]);

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      country: '',
      vatNumber: '',
      crNumber: '',
      gstNumber: '',
      website: '',
      bankName: '',
      branchName: '',
      accountName: '',
      accountNumber: '',
      iban: '',
      swift: '',
      chequesPayableTo: ''
    });
    setError(null);
  };

  // Get selected country details
  const selectedCountry = countries.find(c => c.value === formData.country);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingCompany) {
        // Update existing company
        const companyRef = doc(db, 'companies', editingCompany.id);
        await updateDoc(companyRef, formData);

        // Update local state
        const updatedCompanies = companies.map(company => 
          company.id === editingCompany.id ? { ...company, ...formData } : company
        );
        setCompanies(updatedCompanies);
        setEditingCompany(null);
      } else {
        // Add new company
        const companiesRef = collection(db, 'companies');
        const docRef = await addDoc(companiesRef, {
          ...formData,
          createdAt: new Date().toISOString()
        });

        // Update local state
        setCompanies([...companies, { id: docRef.id, ...formData, createdAt: new Date().toISOString() }]);
      }

      resetForm();
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving company:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle company deletion
  const handleDelete = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        // Delete from Firestore
        await deleteDoc(doc(db, 'companies', companyId));
        
        // Update local state
        setCompanies(companies.filter(company => company.id !== companyId));
        
        // If we were editing this company, reset the form
        if (editingCompany && editingCompany.id === companyId) {
          setEditingCompany(null);
          resetForm();
        }
      } catch (error) {
        console.error('Error deleting company:', error);
        alert('Failed to delete company. Please try again.');
      }
    }
  };

  // Cancel editing or adding
  const handleCancel = () => {
    if (editingCompany) {
      setEditingCompany(null);
    } else {
      setIsAdding(false);
    }
    resetForm();
  };

  // Render loading state
  if (isLoading) {
    return (
      <LoadingContainer>
        <div className="loading-spinner"></div>
        <p>Loading company profiles...</p>
      </LoadingContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <div>
          <h2>Company Profiles</h2>
          <p>Manage your company information and details.</p>
        </div>
        <AddButton onClick={() => setIsAdding(true)}>
          <Icon name="plus" size={16} />
          Add Company
        </AddButton>
      </ProfileHeader>

      {/* List of companies */}
      {!isAdding && !editingCompany && (
        <CompanyList>
          {companies.length === 0 ? (
            <EmptyState>
              <Icon name="building" size={48} color="#7e88c3" />
              <p>No company profiles found. Add your first company profile.</p>
            </EmptyState>
          ) : (
            companies.map(company => (
              <CompanyCard
                key={company.id}
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CompanyInfo>
                  <CompanyName>{company.name}</CompanyName>
                  <CompanyDetail>
                    <Label>Email:</Label> {company.email || 'Not provided'}
                  </CompanyDetail>
                  <CompanyDetail>
                    <Label>Phone:</Label> {company.phone || 'Not provided'}
                  </CompanyDetail>
                  {company.address && (
                    <CompanyDetail>
                      <Label>Address:</Label> {company.address}
                    </CompanyDetail>
                  )}
                  {company.website && (
                    <CompanyDetail>
                      <Label>Website:</Label> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a>
                    </CompanyDetail>
                  )}
                  {company.vatNumber && (
                    <CompanyDetail>
                      <Label>VAT Number:</Label> {company.vatNumber}
                    </CompanyDetail>
                  )}
                </CompanyInfo>
                <CompanyActions>
                  <ActionButton className="edit" onClick={() => {
                    setEditingCompany(company);
                    setIsAdding(true);
                  }}>
                    <Icon name="edit" size={16} />
                    Edit
                  </ActionButton>
                  <ActionButton className="delete" onClick={() => handleDelete(company.id)}>
                    <Icon name="trash" size={16} />
                    Delete
                  </ActionButton>
                </CompanyActions>
              </CompanyCard>
            ))
          )}
        </CompanyList>
      )}

      {/* Add/Edit Company Form */}
      <AnimatePresence>
        {isAdding && (
          <FormSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <FormTitle>{editingCompany ? 'Edit Company' : 'Add Company'}</FormTitle>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <Form onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a country</option>
                    {countries.map(country => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="email">Contact Email *</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="phone">Contact Number</Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="address">Address</Label>
                  <TextArea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                  />
                </FormGroup>
              </FormRow>

              {/* Conditional fields based on country */}
              {selectedCountry?.hasVat && (
                <FormRow>
                  <FormGroup>
                    <Label htmlFor="vatNumber">VAT Number (5%) *</Label>
                    <Input
                      type="text"
                      id="vatNumber"
                      name="vatNumber"
                      value={formData.vatNumber}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                </FormRow>
              )}

              {selectedCountry?.hasCr && (
                <FormRow>
                  <FormGroup>
                    <Label htmlFor="crNumber">CR Number *</Label>
                    <Input
                      type="text"
                      id="crNumber"
                      name="crNumber"
                      value={formData.crNumber}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                </FormRow>
              )}

              {selectedCountry?.hasGst && (
                <FormRow>
                  <FormGroup>
                    <Label htmlFor="gstNumber">GST Number (18%) *</Label>
                    <Input
                      type="text"
                      id="gstNumber"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                </FormRow>
              )}

              <FormRow>
                <FormGroup>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </FormGroup>
              </FormRow>

              {/* Bank Transfer Details Section */}
              <SectionDivider>
                <SectionTitle>Bank Transfer Details</SectionTitle>
              </SectionDivider>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="Enter bank name"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="branchName">Branch Name</Label>
                  <Input
                    type="text"
                    id="branchName"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleChange}
                    placeholder="Enter branch name"
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    type="text"
                    id="accountName"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    placeholder="Enter account name"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Enter account number"
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    type="text"
                    id="iban"
                    name="iban"
                    value={formData.iban}
                    onChange={handleChange}
                    placeholder="Enter IBAN"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="swift">SWIFT Code</Label>
                  <Input
                    type="text"
                    id="swift"
                    name="swift"
                    value={formData.swift}
                    onChange={handleChange}
                    placeholder="Enter SWIFT code"
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="chequesPayableTo">Cheques Payable To</Label>
                  <Input
                    type="text"
                    id="chequesPayableTo"
                    name="chequesPayableTo"
                    value={formData.chequesPayableTo}
                    onChange={handleChange}
                    placeholder="Enter name for cheques"
                  />
                </FormGroup>
              </FormRow>

              <ButtonGroup>
                <CancelButton
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </CancelButton>
                <SaveButton
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Company'}
                </SaveButton>
              </ButtonGroup>
            </Form>
          </FormSection>
        )}
      </AnimatePresence>
    </ProfileContainer>
  );
};

// Styled components
const ProfileContainer = styled.div`
  padding: 24px;
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  h2 {
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme?.text?.primary || '#ffffff'};
    margin-bottom: 8px;
  }

  p {
    color: ${({ theme }) => theme?.text?.secondary || '#7e88c3'};
    font-size: 14px;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme?.colors?.purple || '#7c5dfa'};
  color: ${({ theme }) => theme?.text?.white || '#ffffff'};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme?.colors?.purpleHover || '#9277ff'};
  }
`;

const CompanyList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CompanyCard = styled(motion.div)`
  background-color: ${({ theme }) => theme?.colors?.backgroundAlt || '#ffffff'};
  border-radius: 8px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid 7c5dfa;
    theme?.mode === 'dark' 
      ? '#252945' // Darker border for dark mode
      : '#dfe3fa' // Light border for light mode
  };
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme?.colors?.purple || '#7c5dfa'};
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

const CompanyInfo = styled.div`
  flex: 1;
`;

const CompanyName = styled.h3`
  font-size: 18px;
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme?.mode === 'dark' ? '#ffffff' : '#004359'};
`;

const CompanyDetail = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme?.mode === 'dark' ? '#dfe3fa' : '#7e88c3'};
`;

const Label = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme?.mode === 'dark' ? '#ffffff' : '#004359'};
`;

const CompanyActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme?.text?.secondary || '#7e88c3'};
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme?.colors?.purple || '#7c5dfa'};
    background-color: ${({ theme }) => theme?.backgrounds?.main || '#f8f8fb'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px;
  color: ${({ theme }) => theme?.text?.secondary || '#7e88c3'};
  grid-column: 1 / -1;
  background-color: ${({ theme }) => theme?.backgrounds?.card || '#ffffff'};
  border-radius: 8px;
  border: 1px dashed ${({ theme }) => theme?.borders || '#dfe3fa'};
  
  p {
    margin-top: 16px;
    font-size: 14px;
  }
`;

const FormSection = styled(motion.div)`
  margin-top: 24px;
`;

const FormTitle = styled.h3`
  ${headingTitle}
  margin: 0 0 24px 0;
  color: ${({ theme }) => theme?.mode === 'dark' ? '#ffffff' : '#004359'};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme?.borders || '#dfe3fa'};
  background-color: ${({ theme }) => theme?.mode === 'dark' ? '#1e2139' : '#ffffff'};
  color: ${({ theme }) => theme?.mode === 'dark' ? '#ffffff' : '#004359'};
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: ${({ theme }) => theme?.colors?.purple || '#7c5dfa'};
    outline: none;
    background-color: ${({ theme }) => theme?.mode === 'dark' ? '#1e2139' : '#ffffff'};
  }

  &::placeholder {
    color: ${({ theme }) => theme?.mode === 'dark' ? '#888eb0' : '#7e88c3'};
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme?.borders || '#dfe3fa'};
  background-color: ${({ theme }) => theme?.mode === 'dark' ? '#1e2139' : '#ffffff'};
  color: ${({ theme }) => theme?.mode === 'dark' ? '#ffffff' : '#004359'};
  font-size: 14px;
  resize: vertical;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: ${({ theme }) => theme?.colors?.purple || '#7c5dfa'};
    outline: none;
    background-color: ${({ theme }) => theme?.mode === 'dark' ? '#1e2139' : '#ffffff'};
  }

  &::placeholder {
    color: ${({ theme }) => theme?.mode === 'dark' ? '#888eb0' : '#7e88c3'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme?.colors?.red || '#ec5757'};
  background-color: ${({ theme }) => theme?.colors?.redLight || '#ff9797'};
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  
  p {
    margin-top: 16px;
    color: ${({ theme }) => theme?.text?.secondary || '#7e88c3'};
  }
  
  .loading-spinner {
    border: 3px solid ${({ theme }) => theme?.borders || '#dfe3fa'};
    border-top: 3px solid ${({ theme }) => theme?.colors?.purple || '#7c5dfa'};
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const FormButton = styled(Button)`
  min-width: 120px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.2s ease;
`;

const CancelButton = styled(FormButton)`
  background-color: transparent;
  color: ${({ theme }) => theme?.mode === 'dark' ? '#ffffff' : '#7e88c3'};
  border: 1px solid ${({ theme }) => theme?.mode === 'dark' ? '#252945' : '#dfe3fa'};
  
  &:hover {
    background-color: ${({ theme }) => theme?.mode === 'dark' ? '#252945' : '#f9fafe'};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme?.mode === 'dark' ? '#1e2139' : '#f8f8fb'};
    color: ${({ theme }) => theme?.mode === 'dark' ? '#888eb0' : '#7e88c3'};
  }
`;

const SaveButton = styled(FormButton)`
  background-color: ${({ theme }) => theme?.colors?.purple || '#7c5dfa'};
  color: #ffffff;
  
  &:hover {
    background-color: ${({ theme }) => theme?.colors?.purpleHover || '#9277ff'};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme?.mode === 'dark' ? '#1e2139' : '#f8f8fb'};
    color: ${({ theme }) => theme?.mode === 'dark' ? '#888eb0' : '#7e88c3'};
  }
`;

// Add new styled component for select
const Select = styled.select`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme?.borders || '#dfe3fa'};
  background-color: ${({ theme }) => theme?.mode === 'dark' ? '#1e2139' : '#ffffff'};
  color: ${({ theme }) => theme?.mode === 'dark' ? '#ffffff' : '#004359'};
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237e88c3' d='M6 8.825L1.175 4 2.238 2.938 6 6.7l3.763-3.763L10.825 4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
  
  &:focus {
    border-color: ${({ theme }) => theme?.colors?.purple || '#7c5dfa'};
    outline: none;
    background-color: ${({ theme }) => theme?.mode === 'dark' ? '#1e2139' : '#ffffff'};
  }

  option {
    background-color: ${({ theme }) => theme?.mode === 'dark' ? '#1e2139' : '#ffffff'};
    color: ${({ theme }) => theme?.mode === 'dark' ? '#ffffff' : '#004359'};
  }
`;

const SectionDivider = styled.div`
  margin: 32px 0 24px;
  border-top: 1px solid ${({ theme }) => theme?.borders || '#dfe3fa'};
  padding-top: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme?.mode === 'dark' ? '#ffffff' : '#004359'};
  margin: 0;
`;

export default CompanyProfile;