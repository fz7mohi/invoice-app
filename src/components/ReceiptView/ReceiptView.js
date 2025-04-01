import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { formatDate, formatPrice } from '../../utilities/helpers';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Icon from '../shared/Icon/Icon';
import Button from '../shared/Button/Button';
import {
    StyledReceiptView,
    Container,
    GoBack,
    Card,
    Header,
    Status,
    StatusDot,
    Body,
    Row,
    Column,
    Label,
    Value,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    Total,
    Actions,
    LoadingContainer
} from './ReceiptViewStyles';

const ReceiptView = () => {
    const { id } = useParams();
    const history = useHistory();
    const { colors } = useTheme();
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReceipt = async () => {
            try {
                setLoading(true);
                const receiptRef = doc(db, 'receipts', id);
                const docSnap = await getDoc(receiptRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setReceipt({
                        ...data,
                        id: docSnap.id,
                        createdAt: data.createdAt?.toDate() || new Date(),
                        paymentDue: data.paymentDue?.toDate() || new Date()
                    });
                } else {
                    setError('Receipt not found');
                }
            } catch (err) {
                setError('Error loading receipt');
                console.error('Error fetching receipt:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReceipt();
    }, [id]);

    if (loading) {
        return (
            <LoadingContainer>
                <p>Loading receipt...</p>
            </LoadingContainer>
        );
    }

    if (error) {
        return (
            <LoadingContainer>
                <p>{error}</p>
                <Button type="button" onClick={() => history.push('/receipts')}>
                    Go Back
                </Button>
            </LoadingContainer>
        );
    }

    if (!receipt) {
        return null;
    }

    return (
        <StyledReceiptView>
            <Container>
                <GoBack onClick={() => history.push('/receipts')}>
                    <Icon name="arrow-left" size={10} color={colors.purple} />
                    Go back
                </GoBack>

                <Card>
                    <Header>
                        <div>
                            <h2>
                                <span>#</span>
                                {receipt.customId || receipt.id}
                            </h2>
                            <p>{receipt.description || 'No description'}</p>
                        </div>
                        <Status status={receipt.status}>
                            <StatusDot status={receipt.status} />
                            {receipt.status}
                        </Status>
                    </Header>

                    <Body>
                        <Row>
                            <Column>
                                <Label>Receipt Date</Label>
                                <Value>{formatDate(receipt.createdAt)}</Value>
                            </Column>
                            <Column>
                                <Label>Payment Due</Label>
                                <Value>{formatDate(receipt.paymentDue)}</Value>
                            </Column>
                        </Row>

                        <Row>
                            <Column>
                                <Label>Bill To</Label>
                                <Value>{receipt.clientName}</Value>
                                <Value>{receipt.clientEmail}</Value>
                                {receipt.clientAddress && (
                                    <>
                                        <Value>{receipt.clientAddress.street}</Value>
                                        <Value>{receipt.clientAddress.city}</Value>
                                        <Value>{receipt.clientAddress.postCode}</Value>
                                        <Value>{receipt.clientAddress.country}</Value>
                                    </>
                                )}
                            </Column>
                            <Column>
                                <Label>Sent To</Label>
                                {receipt.senderAddress && (
                                    <>
                                        <Value>{receipt.senderAddress.street}</Value>
                                        <Value>{receipt.senderAddress.city}</Value>
                                        <Value>{receipt.senderAddress.postCode}</Value>
                                        <Value>{receipt.senderAddress.country}</Value>
                                    </>
                                )}
                            </Column>
                        </Row>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell>Item Name</TableCell>
                                    <TableCell>QTY.</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Total</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {receipt.items?.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>
                                            {formatPrice(item.price, receipt.currency)}
                                        </TableCell>
                                        <TableCell>
                                            {formatPrice(item.total, receipt.currency)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Total>
                            <span>Amount Due</span>
                            <span>{formatPrice(receipt.total, receipt.currency)}</span>
                        </Total>
                    </Body>
                </Card>

                <Actions>
                    <Button
                        type="button"
                        $secondary
                        onClick={() => history.push('/receipts')}
                    >
                        Go Back
                    </Button>
                    <Button
                        type="button"
                        $primary
                        onClick={() => window.print()}
                    >
                        Print Receipt
                    </Button>
                </Actions>
            </Container>
        </StyledReceiptView>
    );
};

export default ReceiptView; 