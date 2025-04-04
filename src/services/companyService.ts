interface CompanyProfile {
    name: string;
    address: string;
    phone: string;
    vatNumber: string;
    crNumber: string;
    bankDetails?: {
        bankName: string;
        accountName: string;
        accountNumber: string;
        iban: string;
        swift: string;
    };
}

const uaeProfile: CompanyProfile = {
    name: 'Fortune Gifts Trading LLC',
    address: 'Dubai, UAE',
    phone: '+971 4 123 4567',
    vatNumber: 'TRN100123456789',
    crNumber: 'CR123456789',
    bankDetails: {
        bankName: 'Emirates NBD',
        accountName: 'Fortune Gifts Trading LLC',
        accountNumber: '1234567890',
        iban: 'AE123456789012345678901',
        swift: 'EBILAEAD'
    }
};

const qatarProfile: CompanyProfile = {
    name: 'Fortune Gifts Trading W.L.L.',
    address: 'Doha, Qatar',
    phone: '+974 4123 4567',
    vatNumber: 'VAT123456789',
    crNumber: 'CR123456789',
    bankDetails: {
        bankName: 'Qatar National Bank',
        accountName: 'Fortune Gifts Trading W.L.L.',
        accountNumber: '0987654321',
        iban: 'QA123456789012345678901',
        swift: 'QNBAQAQA'
    }
};

export const getCompanyProfile = async (country: 'uae' | 'qatar'): Promise<CompanyProfile> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return country === 'uae' ? uaeProfile : qatarProfile;
}; 