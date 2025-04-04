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

declare module '@services/companyService' {
    export function getCompanyProfile(country: 'uae' | 'qatar'): Promise<CompanyProfile>;
} 