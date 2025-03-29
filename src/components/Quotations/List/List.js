import { useTheme } from 'styled-components';
import Icon from '../../shared/Icon/Icon';
import Status from '../../shared/Status/Status';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { formatDate, formatPrice } from '../../../utilities/helpers';
import { useGlobalContext } from '../../App/context';
import {
    StyledList,
    Item,
    Link,
    Uid,
    Hashtag,
    PaymentDue,
    ClientName,
    TotalPrice,
} from './ListStyles';

const List = ({ isLoading, quotations, variant }) => {
    const { colors } = useTheme();
    const { windowWidth } = useGlobalContext();
    const isDesktop = windowWidth >= 768;
    const isEmpty = quotations.length === 0;

    if (isLoading) {
        return (
            <StyledList
                variants={variant('container')}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <Item
                    layout
                    variants={variant('list', 0)}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{ justifyContent: 'center' }}
                >
                    <p style={{ textAlign: 'center', padding: '2rem' }}>
                        Loading quotations...
                    </p>
                </Item>
            </StyledList>
        );
    }

    return (
        <>
            {isEmpty && <ErrorMessage variant={variant} />}
            {!isEmpty && (
                <StyledList>
                    {quotations.map(
                        (
                            { id, paymentDue, clientName, status, total },
                            index
                        ) => (
                            <Item
                                key={id}
                                layout
                                variants={variant('list', index)}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <Link to={`/quotation/${id}`}>
                                    <Uid>
                                        <Hashtag>#</Hashtag>
                                        {id}
                                    </Uid>
                                    <PaymentDue>
                                        Due {formatDate(paymentDue)}
                                    </PaymentDue>
                                    <ClientName>{clientName}</ClientName>
                                    <TotalPrice>
                                        {formatPrice(total)}
                                    </TotalPrice>
                                    <Status currStatus={status} $grid />
                                    {isDesktop && (
                                        <Icon
                                            name={'arrow-right'}
                                            size={10}
                                            color={colors.purple}
                                        />
                                    )}
                                </Link>
                            </Item>
                        )
                    )}
                </StyledList>
            )}
        </>
    );
};

export default List; 