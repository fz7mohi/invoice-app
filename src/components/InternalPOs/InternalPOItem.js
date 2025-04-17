import React from 'react';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, DollarSign, ChevronRight } from 'react-feather';
import { format } from 'date-fns';
import { StyledInternalPOItem } from './InternalPOsStyles';

const getStatusColor = (status) => {
    switch (status) {
        case 'paid':
            return '#33D69F';
        case 'pending':
            return '#FF8F00';
        case 'draft':
            return '#373B53';
        case 'void':
            return '#EC5757';
        default:
            return '#373B53';
    }
};

const InternalPOItem = ({ internalPO }) => {
    const history = useHistory();

    const handleClick = () => {
        history.push(`/internal-pos/${internalPO.id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
        >
            <StyledInternalPOItem onClick={handleClick}>
                <div className="id">
                    <span>#</span>
                    {internalPO.id}
                </div>
                <div className="due-date">
                    <Calendar size={16} />
                    {format(new Date(internalPO.paymentDue), 'MMM dd, yyyy')}
                </div>
                <div className="client-name">
                    <User size={16} />
                    {internalPO.clientName}
                </div>
                <div className="total">
                    <DollarSign size={16} />
                    {internalPO.total.toFixed(2)}
                </div>
                <div className="status" style={{ backgroundColor: getStatusColor(internalPO.status) }}>
                    {internalPO.status}
                </div>
                <ChevronRight className="chevron" size={20} />
            </StyledInternalPOItem>
        </motion.div>
    );
};

export default InternalPOItem; 