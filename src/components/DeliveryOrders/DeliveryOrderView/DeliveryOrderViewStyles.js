import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const StyledDeliveryOrderView = styled.div`
    width: 100%;
    min-height: 100vh;
    padding: 24px;
    background-color: ${({ theme }) => theme?.colors?.bgPrimary || '#141625'};
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    overflow-x: hidden;
    
    @media (min-width: 768px) {
        padding: 32px;
    }
`;

export const Container = styled.div`
    max-width: 780px;
    margin: 0 auto;
`;

export const StyledLink = styled(Link)`
    display: inline-flex;
    align-items: center;
    color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
    text-decoration: none;
    font-weight: 700;
    font-size: 12px;
    margin-bottom: 32px;
    
    &:hover {
        text-decoration: underline;
    }
    
    svg {
        margin-right: 8px;
    }
`;

export const Controller = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
`;

export const Text = styled.p`
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
`;

export const ButtonWrapper = styled.div`
    display: flex;
    gap: 8px;
`;

export const InfoCard = styled.div`
    background-color: ${({ theme }) => theme?.colors?.bgSecondary || '#1E2139'};
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 24px;
    
    @media (min-width: 768px) {
        padding: 32px;
    }
`;

export const InfoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
`;

export const InfoID = styled.h1`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    margin-bottom: 4px;
    
    span {
        color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
    }
`;

export const InfoDesc = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
`;

export const InfoGroup = styled.div`
    display: flex;
    flex-direction: column;
`;

export const InfoAddresses = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    margin-bottom: 32px;
    
    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
`;

export const AddressGroup = styled.div`
    display: flex;
    flex-direction: column;
    text-align: ${({ align }) => align || 'left'};
`;

export const AddressTitle = styled.h3`
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    margin-bottom: 8px;
`;

export const AddressText = styled.p`
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    margin-bottom: 8px;
`;

export const Details = styled.div`
    background-color: ${({ theme }) => theme?.colors?.bgTertiary || '#252945'};
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 24px;
    
    @media (min-width: 768px) {
        padding: 32px;
    }
`;

export const ItemsHeader = styled.div`
    display: none;
    
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 16px;
        margin-bottom: 16px;
    }
`;

export const HeaderCell = styled.div`
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    text-align: ${({ align }) => align || 'left'};
`;

export const Items = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const Item = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 16px;
    background-color: ${({ theme }) => theme?.colors?.bgSecondary || '#1E2139'};
    border-radius: 8px;
    
    @media (min-width: 768px) {
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 16px;
        align-items: center;
    }
`;

export const ItemName = styled.h3`
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    margin-bottom: 4px;
`;

export const ItemDescription = styled.p`
    font-size: 12px;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    margin-bottom: 8px;
`;

export const ItemQty = styled.div`
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
`;

export const ItemPackaging = styled.div`
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
`;

export const ItemTotal = styled.div`
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
`;

export const Total = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid ${({ theme }) => theme?.colors?.border || '#DFE3FA'};
`;

export const TotalText = styled.p`
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
`;

export const TotalAmount = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
`;

export const StatusBadge = styled.div`
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    background-color: ${({ $status, theme }) => {
        switch ($status) {
            case 'pending':
                return theme?.colors?.pendingBg || 'rgba(255, 143, 0, 0.1)';
            case 'completed':
                return theme?.colors?.completedBg || 'rgba(51, 214, 159, 0.1)';
            case 'cancelled':
                return theme?.colors?.cancelledBg || 'rgba(236, 87, 87, 0.1)';
            default:
                return theme?.colors?.pendingBg || 'rgba(255, 143, 0, 0.1)';
        }
    }};
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    color: ${({ $status, theme }) => {
        switch ($status) {
            case 'pending':
                return theme?.colors?.pending || '#FF8F00';
            case 'completed':
                return theme?.colors?.completed || '#33D69F';
            case 'cancelled':
                return theme?.colors?.cancelled || '#EC5757';
            default:
                return theme?.colors?.pending || '#FF8F00';
        }
    }};
`;

export const MetaInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
`;

export const MetaItem = styled.div`
    display: flex;
    align-items: center;
    font-size: 12px;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    
    svg {
        margin-right: 8px;
    }
`;

export const DownloadButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: ${({ theme }) => theme?.colors?.purple || '#7C5DFA'};
    color: white;
    border: none;
    border-radius: 24px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: ${({ theme }) => theme?.colors?.purpleHover || '#9277FF'};
    }
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 8px;
`;

export const StatusDot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ $status, theme }) => {
        switch ($status) {
            case 'pending':
                return theme?.colors?.pending || '#FF8F00';
            case 'completed':
                return theme?.colors?.completed || '#33D69F';
            case 'cancelled':
                return theme?.colors?.cancelled || '#EC5757';
            default:
                return theme?.colors?.pending || '#FF8F00';
        }
    }};
    margin-right: 8px;
`;

export const HeaderSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
`;

export const HeaderTitle = styled.h1`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
`;

export const InfoSectionsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    
    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
`;

export const CartonDetailsSection = styled.div`
    margin-bottom: 24px;
`;

export const CartonDetailsTitle = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    margin-bottom: 16px;
`;

export const CartonDetailsTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 24px;
`;

export const CartonDetailsRow = styled.tr`
    border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#DFE3FA'};
`;

export const CartonDetailsCell = styled.td`
    padding: 12px 16px;
    font-size: 14px;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
`;

export const PackagingDetailsSection = styled.div`
    margin-bottom: 24px;
`;

export const PackagingDetailsTitle = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    margin-bottom: 16px;
`;

export const PackagingDetailsTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 24px;
`;

export const PackagingDetailsHeader = styled.thead`
    background-color: ${({ theme }) => theme?.colors?.bgSecondary || '#1E2139'};
    border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#DFE3FA'};
`;

export const PackagingDetailsBody = styled.tbody``;

export const PackagingDetailsRow = styled.tr`
    border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#DFE3FA'};
    
    &:hover {
        background-color: ${({ theme }) => theme?.colors?.bgSecondary || '#1E2139'};
    }
`;

export const PackagingDetailsCell = styled.td`
    padding: 12px 16px;
    font-size: 14px;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
`;

export const PackagingDetailsHeaderCell = styled.th`
    padding: 12px 16px;
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    text-align: left;
`;

// New styled components for improved layout
export const SectionDivider = styled.hr`
    border: none;
    height: 1px;
    background-color: ${({ theme }) => theme?.colors?.border || '#DFE3FA'};
    margin: 24px 0;
    opacity: 0.1;
`;

export const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
    margin-bottom: 24px;
`;

export const TableHeader = styled.thead`
    background-color: ${({ theme }) => theme?.colors?.bgSecondary || '#1E2139'};
    border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#DFE3FA'};
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
    border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#DFE3FA'};
    
    &:hover {
        background-color: ${({ theme }) => theme?.colors?.bgSecondary || '#1E2139'};
    }
`;

export const TableCell = styled.td`
    padding: 12px 16px;
    font-size: 14px;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
`;

export const TableHeaderCell = styled.th`
    padding: 12px 16px;
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    text-align: left;
`;

export const TableFooter = styled.tfoot`
    background-color: ${({ theme }) => theme?.colors?.bgSecondary || '#1E2139'};
    border-top: 1px solid ${({ theme }) => theme?.colors?.border || '#DFE3FA'};
`;

export const TableFooterRow = styled.tr``;

export const TableFooterCell = styled.td`
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
`;

export const InfoSection = styled.div`
    margin-bottom: 24px;
`;

export const InfoSectionTitle = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
    margin-bottom: 16px;
`;

export const InfoSectionContent = styled.div`
    background-color: ${({ theme }) => theme?.colors?.bgTertiary || '#252945'};
    border-radius: 8px;
    padding: 16px;
`;

export const InfoSectionGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    
    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
    
    @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

export const InfoSectionItem = styled.div`
    display: flex;
    flex-direction: column;
`;

export const InfoSectionLabel = styled.span`
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme?.colors?.textSecondary || '#DFE3FA'};
    margin-bottom: 4px;
`;

export const InfoSectionValue = styled.span`
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme?.colors?.textPrimary || '#FFFFFF'};
`; 