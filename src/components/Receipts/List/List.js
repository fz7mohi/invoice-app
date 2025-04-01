import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useState } from 'react';
import Icon from '../../shared/Icon/Icon';
import Status from '../../shared/Status/Status';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { formatDate, formatPrice } from '../../../utilities/helpers';
import { useGlobalContext } from '../../App/context';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import styled from 'styled-components';

const StyledList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const Item = styled.div`
    background: ${({ theme }) => theme.colors.cardBg};
    border-radius: 8px;
    padding: 24px;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.02);
    }

    @media (min-width: 768px) {
        padding: 28px 32px;
    }
`;

const Link = styled.div`
    display: grid;
    grid-template-areas:
        'date id client'
        'description description description'
        'price status arrow';
    gap: 8px;

    @media (min-width: 768px) {
        grid-template-areas: 'date id client description price status arrow';
        grid-template-columns: 120px 100px 140px 1fr 120px 100px 20px;
        align-items: center;
        gap: 16px;
    }

    @media (min-width: 1024px) {
        grid-template-columns: 140px 120px 160px 1fr 140px 120px 20px;
    }
`;

const PaymentDue = styled.span`
    grid-area: date;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    line-height: 1.25;
`;

const Uid = styled.span`
    grid-area: id;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 12px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.25px;
`;

const Hashtag = styled.span`
    color: ${({ theme }) => theme.colors.textTertiary};
`;

const ClientName = styled.span`
    grid-area: client;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    line-height: 1.25;
    text-align: right;

    @media (min-width: 768px) {
        text-align: left;
    }
`;

const Description = styled.span`
    grid-area: description;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    line-height: 1.25;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const TotalPrice = styled.span`
    grid-area: price;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 16px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.8px;
    display: flex;
    align-items: center;
    gap: 16px;

    @media (min-width: 768px) {
        font-size: 14px;
        letter-spacing: -0.7px;
    }
`;

const StatusBadge = styled.div`
    grid-area: status;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px;
    border-radius: 6px;
    background: ${({ status, theme }) => {
        switch (status) {
            case 'paid':
                return theme.colors.statusPaidBg;
            case 'pending':
                return theme.colors.statusPendingBg;
            default:
                return theme.colors.statusDraftBg;
        }
    }};
    color: ${({ status, theme }) => {
        switch (status) {
            case 'paid':
                return theme.colors.statusPaidText;
            case 'pending':
                return theme.colors.statusPendingText;
            default:
                return theme.colors.statusDraftText;
        }
    }};
    font-weight: 700;
    font-size: 12px;
    line-height: 1.25;
    text-transform: capitalize;
`;

const StatusDot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ status, theme }) => {
        switch (status) {
            case 'paid':
                return theme.colors.statusPaidText;
            case 'pending':
                return theme.colors.statusPendingText;
            default:
                return theme.colors.statusDraftText;
        }
    }};
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: 14px;
`;

const List = ({ receipts, isLoading, variant }) => {
    const { colors } = useTheme();
    const { windowWidth } = useGlobalContext();
    const isDesktop = windowWidth >= 768;

    if (isLoading) {
        return (
            <StyledList>
                <LoadingContainer>Loading receipts...</LoadingContainer>
            </StyledList>
        );
    }

    if (!receipts || receipts.length === 0) {
        return <ErrorMessage variant={variant} />;
    }

    return (
        <StyledList>
            {receipts.map((receipt, index) => (
                <RouterLink
                    to={`/receipt/${receipt.id}`}
                    key={receipt.id}
                    style={{ textDecoration: 'none' }}
                >
                    <Item
                        variants={variant('list', index)}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <Link>
                            <PaymentDue>
                                {formatDate(receipt.createdAt)}
                            </PaymentDue>
                            <Uid>
                                <Hashtag>#</Hashtag>
                                {receipt.customId || receipt.id}
                            </Uid>
                            <ClientName>{receipt.clientName}</ClientName>
                            <Description>
                                {receipt.description || 'No description'}
                            </Description>
                            <TotalPrice>
                                {formatPrice(receipt.total, receipt.currency)}
                            </TotalPrice>
                            <StatusBadge status={receipt.status}>
                                <StatusDot status={receipt.status} />
                                {receipt.status}
                            </StatusBadge>
                            {isDesktop && (
                                <Icon
                                    name="arrow-right"
                                    size={12}
                                    color={colors.purple}
                                />
                            )}
                        </Link>
                    </Item>
                </RouterLink>
            ))}
        </StyledList>
    );
};

export default List; 