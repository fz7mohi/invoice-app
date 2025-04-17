import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { motion } from 'framer-motion';
import { 
    StyledInternalPOItem, 
    Id, 
    DueDate, 
    ClientName, 
    Total, 
    Status, 
    ArrowIcon 
} from './InternalPOItemStyles';
import Icon from '../../shared/Icon/Icon';

const InternalPOItem = ({ internalPO }) => {
    const { colors } = useTheme();

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return colors.success;
            case 'pending':
                return colors.warning;
            case 'draft':
                return colors.draft;
            default:
                return colors.draft;
        }
    };

    const getStatusBackground = (status) => {
        switch (status) {
            case 'paid':
                return colors.successAlpha10;
            case 'pending':
                return colors.warningAlpha10;
            case 'draft':
                return colors.draftAlpha10;
            default:
                return colors.draftAlpha10;
        }
    };

    return (
        <Link to={`/internal-po/${internalPO.id}`}>
            <StyledInternalPOItem
                as={motion.li}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Id>
                    <span>#</span>
                    {internalPO.id}
                </Id>
                <DueDate>Due {internalPO.paymentDue}</DueDate>
                <ClientName>{internalPO.clientName}</ClientName>
                <Total>${internalPO.total.toFixed(2)}</Total>
                <Status
                    $color={getStatusColor(internalPO.status)}
                    $background={getStatusBackground(internalPO.status)}
                >
                    {internalPO.status}
                </Status>
                <ArrowIcon>
                    <Icon name="arrow-right" size={16} color={colors.purple} />
                </ArrowIcon>
            </StyledInternalPOItem>
        </Link>
    );
};

export default InternalPOItem; 