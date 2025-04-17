import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGlobalContext } from '../App/context';
import { Search, Plus } from 'react-feather';
import emptyListImage from '../../assets/empty-list.svg';
import {
    StyledInternalPOs,
    Header,
    HeaderTop,
    Info,
    Title,
    Subtitle,
    Filter,
    SearchBar,
    SearchContainer,
    SearchIcon,
    SearchInput,
    List,
    EmptyList,
    EmptyListImage,
    EmptyListTitle,
    EmptyListText,
    NewButton
} from './InternalPOsStyles';
import InternalPOItem from './InternalPOItem';

const InternalPOs = () => {
    const history = useHistory();
    const { internalPOState, loading, error, createInternalPO } = useGlobalContext();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredInternalPOs = internalPOState?.internalPOs?.filter(internalPO => {
        const matchesFilter = filter === 'all' || internalPO.status === filter;
        const matchesSearch = internalPO.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            internalPO.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    }) || [];

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleNewInternalPO = () => {
        createInternalPO();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <StyledInternalPOs
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Header>
                <HeaderTop>
                    <Info>
                        <Title>Internal POs</Title>
                        <Subtitle>There are {filteredInternalPOs.length} total internal POs</Subtitle>
                    </Info>
                    <NewButton onClick={handleNewInternalPO}>
                        <Plus size={16} />
                        New Internal PO
                    </NewButton>
                </HeaderTop>
                <SearchBar>
                    <SearchContainer>
                        <SearchIcon>
                            <Search size={16} />
                        </SearchIcon>
                        <SearchInput
                            type="text"
                            placeholder="Search by client name or ID..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </SearchContainer>
                </SearchBar>
                <Filter value={filter} onChange={handleFilterChange}>
                    <option value="all">All</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                </Filter>
            </Header>
            <List>
                {filteredInternalPOs.length > 0 ? (
                    filteredInternalPOs.map(internalPO => (
                        <InternalPOItem key={internalPO.id} internalPO={internalPO} />
                    ))
                ) : (
                    <EmptyList>
                        <EmptyListImage src={emptyListImage} alt="Empty list" />
                        <EmptyListTitle>There is nothing here</EmptyListTitle>
                        <EmptyListText>
                            Create a new internal PO by clicking the New Internal PO button and get started
                        </EmptyListText>
                    </EmptyList>
                )}
            </List>
        </StyledInternalPOs>
    );
};

export default InternalPOs; 