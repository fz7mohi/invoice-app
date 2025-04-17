import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useGlobalContext } from '../../App/context';
import { formatDate, formatPrice } from '../../../utilities/helpers';
import Modal from '../../Modal/Modal';
import Icon from '../../shared/Icon/Icon';
import {
    Container,
    StyledInternalPOView,
    Controller,
    Text,
    StatusContainer,
    StatusBadge,
    StatusDot,
    ActionButtons,
    InfoCard,
    InfoHeader,
    InfoGroup,
    InfoID,
    InfoDesc,
    InfoAddresses,
    AddressGroup,
    AddressTitle,
    AddressText,
    Details,
    ItemsHeader,
    HeaderCell,
    Items,
    Item,
    ItemName,
    ItemDescription,
    ItemQty,
    ItemPrice,
    ItemVat,
    ItemTotal,
    Total,
    TotalText,
    TotalAmount,
    MetaInfo,
    MetaItem,
    TermsSection,
    TermsHeader,
    TermsTitle,
    TermsText,
    TermsActions,
    Link
} from './InternalPOViewStyles';

const InternalPOView = () => {
    const { id } = useParams();
    const history = useHistory();
    const { colors } = useGlobalContext();
    const [internalPO, setInternalPO] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showVoidModal, setShowVoidModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [companyProfile, setCompanyProfile] = useState(null);

    useEffect(() => {
        const fetchInternalPOData = async () => {
            try {
                setLoading(true);
                setError(null);
                const internalPODoc = await getDoc(doc(db, 'internalPOs', id));
                
                if (!internalPODoc.exists()) {
                    setError('Internal PO not found');
                    setLoading(false);
                    return;
                }

                const data = internalPODoc.data();
                setInternalPO({
                    id: internalPODoc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate(),
                    paymentDue: data.paymentDue?.toDate()
                });

                // Fetch related receipts
                const receiptsQuery = await getDocs(collection(db, 'receipts'));
                const receiptsList = receiptsQuery.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        date: doc.data().date?.toDate()
                    }))
                    .filter(receipt => receipt.internalPOId === id);
                setReceipts(receiptsList);

                // Fetch company profile
                const companyProfileDoc = await getDoc(doc(db, 'companyProfile', 'default'));
                if (companyProfileDoc.exists()) {
                    setCompanyProfile(companyProfileDoc.data());
                }

            } catch (err) {
                console.error('Error fetching internal PO:', err);
                setError('Failed to load internal PO');
            } finally {
                setLoading(false);
            }
        };

        fetchInternalPOData();
    }, [id]);

    const handleDelete = async () => {
        try {
            await updateDoc(doc(db, 'internalPOs', id), {
                status: 'deleted'
            });
            history.push('/internal-pos');
        } catch (err) {
            console.error('Error deleting internal PO:', err);
            setError('Failed to delete internal PO');
        }
    };

    const handleVoid = async () => {
        try {
            await updateDoc(doc(db, 'internalPOs', id), {
                status: 'void'
            });
            setInternalPO(prev => ({ ...prev, status: 'void' }));
            setShowVoidModal(false);
        } catch (err) {
            console.error('Error voiding internal PO:', err);
            setError('Failed to void internal PO');
        }
    };

    const handlePaymentUpdate = async (amount) => {
        try {
            const newAmount = parseFloat(amount);
            const currentPaid = internalPO.paid || 0;
            const totalPaid = currentPaid + newAmount;
            const status = totalPaid >= internalPO.total ? 'paid' : 'partially_paid';

            await updateDoc(doc(db, 'internalPOs', id), {
                paid: totalPaid,
                status
            });

            setInternalPO(prev => ({
                ...prev,
                paid: totalPaid,
                status
            }));
            setShowPaymentModal(false);
        } catch (err) {
            console.error('Error updating payment:', err);
            setError('Failed to update payment');
        }
    };

    const handleEditTerms = async (terms) => {
        try {
            await updateDoc(doc(db, 'internalPOs', id), {
                terms
            });
            setInternalPO(prev => ({ ...prev, terms }));
            setShowEditModal(false);
        } catch (err) {
            console.error('Error updating terms:', err);
            setError('Failed to update terms');
        }
    };

    if (loading) {
        return (
            <Container>
                <div>Loading internal PO...</div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <div>{error}</div>
                <Link to="/internal-pos">Go back</Link>
            </Container>
        );
    }

    if (!internalPO) {
        return (
            <Container>
                <div>Internal PO not found</div>
                <Link to="/internal-pos">Go back</Link>
            </Container>
        );
    }

    const total = internalPO.items?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0;
    const vat = total * 0.15; // Assuming 15% VAT
    const grandTotal = total + vat;

    return (
        <StyledInternalPOView>
            <Container>
                <Controller>
                    <Text>Status</Text>
                    <StatusContainer>
                        <StatusBadge currStatus={internalPO.status}>
                            <StatusDot currStatus={internalPO.status} />
                            {internalPO.status}
                        </StatusBadge>
                    </StatusContainer>
                    <ActionButtons>
                        <button onClick={() => setShowDeleteModal(true)}>Delete</button>
                        <button onClick={() => setShowVoidModal(true)}>Void</button>
                        <button onClick={() => setShowPaymentModal(true)}>Add Payment</button>
                        <button onClick={() => setShowEditModal(true)}>Edit Terms</button>
                    </ActionButtons>
                </Controller>

                <InfoCard>
                    <InfoHeader>
                        <InfoGroup>
                            <InfoID>Internal PO #{internalPO.customId}</InfoID>
                            <InfoDesc>{internalPO.description}</InfoDesc>
                        </InfoGroup>
                    </InfoHeader>

                    <InfoAddresses>
                        <AddressGroup>
                            <AddressTitle>From</AddressTitle>
                            <AddressText>
                                {companyProfile?.name}<br />
                                {companyProfile?.address?.street}<br />
                                {companyProfile?.address?.city}, {companyProfile?.address?.postCode}<br />
                                {companyProfile?.address?.country}
                            </AddressText>
                        </AddressGroup>
                        <AddressGroup align="right">
                            <AddressTitle>To</AddressTitle>
                            <AddressText>
                                {internalPO.clientName}<br />
                                {internalPO.clientAddress?.street}<br />
                                {internalPO.clientAddress?.city}, {internalPO.clientAddress?.postCode}<br />
                                {internalPO.clientAddress?.country}
                            </AddressText>
                        </AddressGroup>
                    </InfoAddresses>

                    <Details>
                        <ItemsHeader>
                            <HeaderCell>Item Name</HeaderCell>
                            <HeaderCell>Qty</HeaderCell>
                            <HeaderCell>Price</HeaderCell>
                            <HeaderCell>VAT</HeaderCell>
                            <HeaderCell>Total</HeaderCell>
                        </ItemsHeader>
                        <Items>
                            {internalPO.items?.map((item, index) => (
                                <Item key={index}>
                                    <ItemName>{item.name}</ItemName>
                                    <ItemDescription>{item.description}</ItemDescription>
                                    <ItemQty>{item.quantity}</ItemQty>
                                    <ItemPrice>{formatPrice(item.price, internalPO.currency)}</ItemPrice>
                                    <ItemVat>{formatPrice(item.price * item.quantity * 0.15, internalPO.currency)}</ItemVat>
                                    <ItemTotal>{formatPrice(item.price * item.quantity, internalPO.currency)}</ItemTotal>
                                </Item>
                            ))}
                        </Items>
                        <Total>
                            <TotalText>Subtotal</TotalText>
                            <TotalAmount>{formatPrice(total, internalPO.currency)}</TotalAmount>
                            <TotalText>VAT (15%)</TotalText>
                            <TotalAmount>{formatPrice(vat, internalPO.currency)}</TotalAmount>
                            <TotalText>Grand Total</TotalText>
                            <TotalAmount>{formatPrice(grandTotal, internalPO.currency)}</TotalAmount>
                        </Total>
                    </Details>

                    <MetaInfo>
                        <MetaItem>
                            <Icon name="calendar" />
                            <span>Due Date: {formatDate(internalPO.paymentDue)}</span>
                        </MetaItem>
                    </MetaInfo>

                    {internalPO.terms && (
                        <TermsSection>
                            <TermsHeader>
                                <TermsTitle>Terms & Conditions</TermsTitle>
                            </TermsHeader>
                            <TermsText>{internalPO.terms}</TermsText>
                        </TermsSection>
                    )}
                </InfoCard>
            </Container>

            {showDeleteModal && (
                <Modal
                    title="Delete Internal PO"
                    message="Are you sure you want to delete this internal PO?"
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}

            {showVoidModal && (
                <Modal
                    title="Void Internal PO"
                    message="Are you sure you want to void this internal PO?"
                    onConfirm={handleVoid}
                    onCancel={() => setShowVoidModal(false)}
                />
            )}

            {showPaymentModal && (
                <Modal
                    title="Add Payment"
                    message="Enter the payment amount:"
                    onConfirm={handlePaymentUpdate}
                    onCancel={() => setShowPaymentModal(false)}
                    showInput={true}
                    inputType="number"
                />
            )}

            {showEditModal && (
                <Modal
                    title="Edit Terms"
                    message="Enter new terms:"
                    onConfirm={handleEditTerms}
                    onCancel={() => setShowEditModal(false)}
                    showInput={true}
                    inputType="text"
                />
            )}
        </StyledInternalPOView>
    );
};

export default InternalPOView; 