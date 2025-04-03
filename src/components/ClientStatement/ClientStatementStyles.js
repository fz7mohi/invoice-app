import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  letter-spacing: -0.5px;
`;

export const BackButton = styled.button`
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundTertiary};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

export const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

export const ExportIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ClientInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 12px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

export const ClientName = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  letter-spacing: -0.5px;
`;

export const ClientEmail = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

export const ClientDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ClientDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const DetailLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textTertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const DetailValue = styled.span`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
`;

export const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
`;

export const SummaryCard = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    border-color: ${({ theme }) => theme.colors.primary}40;
  }
`;

export const SummaryIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background-color: ${({ color }) => color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ color }) => color}30;
`;

export const SummaryContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const SummaryValue = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.5px;
`;

export const SummaryLabel = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

export const InvoicesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

export const InvoicesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const InvoicesTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  letter-spacing: -0.5px;
`;

export const InvoicesCount = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const InvoicesFilter = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const FilterButton = styled.button`
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.backgroundTertiary};
  color: ${({ active, theme }) => 
    active ? 'white' : theme.colors.textSecondary};
  border: 1px solid ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.border};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ active, theme }) => 
      active ? theme.colors.primaryDark : theme.colors.backgroundQuaternary};
    color: ${({ active, theme }) => 
      active ? 'white' : theme.colors.textPrimary};
    transform: translateY(-1px);
  }
`;

export const InvoiceItem = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  border-radius: 10px;
  padding: 1.25rem;
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr 1fr 1fr;
  gap: 1rem;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundQuaternary};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.colors.primary}40;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    & > *:nth-child(4) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
    & > *:nth-child(3) {
      display: none;
    }
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    & > *:nth-child(2) {
      display: none;
    }
  }
`;

export const InvoiceNumber = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
`;

export const InvoiceDate = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
`;

export const InvoiceDescription = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
`;

export const InvoiceTotal = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
`;

export const InvoiceVAT = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.85rem;
`;

export const InvoiceStatus = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const StatusBadge = styled.span`
  background-color: ${({ color }) => color}15;
  color: ${({ color }) => color};
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  border: 1px solid ${({ color }) => color}30;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  border-radius: 12px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;

export const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.backgroundQuaternary};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
  margin: 0;
  text-align: center;
  max-width: 400px;
`;

export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  height: 100vh;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
`; 