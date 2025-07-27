import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from 'styled-components';
import Icon from '../shared/Icon/Icon';

const DraggableItemCard = styled.div`
    background: rgba(37, 41, 69, 0.3);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    border: 1px solid #252945;
    position: relative;
    transition: all 0.3s ease;
    cursor: grab;
    user-select: none;

    &:active {
        cursor: grabbing;
    }

    @media (min-width: 768px) {
        padding: 28px;
        margin-bottom: 24px;
        
        &:hover {
            border-color: #7C5DFA;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
        }
    }

    &.dragging {
        opacity: 0.8;
        transform: rotate(2deg);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        z-index: 1000;
    }
`;

const DragHandle = styled.div`
    position: absolute;
    top: 12px;
    left: 12px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888EB0;
    cursor: grab;
    border-radius: 4px;
    transition: all 0.2s ease;
    z-index: 2;

    &:hover {
        color: #7C5DFA;
        background: rgba(124, 93, 250, 0.1);
    }

    &:active {
        cursor: grabbing;
    }

    @media (min-width: 768px) {
        top: 28px;
        left: 28px;
        width: 28px;
        height: 28px;
    }
`;

const ItemGrid = styled.div`
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr;
    margin-left: 40px;
    
    @media (min-width: 768px) {
        grid-template-columns: 2.5fr 1fr 1fr 1fr 1fr;
        gap: 32px;
        align-items: start;
        margin-left: 60px;
    }

    > div {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
`;

const MinimalLabel = styled.label`
    color: #DFE3FA;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 4px;
    display: block;

    @media (min-width: 768px) {
        font-size: 13px;
    }
`;

const MinimalInput = styled.input`
    width: 100%;
    padding: 10px 12px;
    background-color: #252945;
    color: #FFFFFF;
    border: 1px solid #252945;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: #7C5DFA;
        box-shadow: 0 0 0 2px rgba(124, 93, 250, 0.1);
    }

    &[data-error="true"] {
        border-color: #EC5757;
    }

    @media (min-width: 768px) {
        font-size: 15px;
    }
`;

const DescriptionInput = styled.textarea`
    width: 100%;
    padding: 10px 12px;
    background-color: #252945;
    color: #FFFFFF;
    border: 1px solid #252945;
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;
    resize: vertical;
    min-height: 60px;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: #7C5DFA;
        box-shadow: 0 0 0 2px rgba(124, 93, 250, 0.1);
    }

    &::placeholder {
        color: #888EB0;
    }

    @media (min-width: 768px) {
        font-size: 15px;
        min-height: 80px;
    }
`;

const VatValue = styled.div`
    padding: 10px 12px;
    background-color: #252945;
    color: #FFFFFF;
    border: 1px solid #252945;
    border-radius: 4px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 4px;

    .currency {
        color: #888EB0;
        font-size: 12px;
    }

    @media (min-width: 768px) {
        font-size: 15px;
    }
`;

const TotalValue = styled.div`
    padding: 10px 12px;
    background-color: #252945;
    color: #FFFFFF;
    border: 1px solid #252945;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;

    .currency {
        color: #888EB0;
        font-size: 12px;
    }

    @media (min-width: 768px) {
        font-size: 15px;
    }
`;

const DeleteButton = styled.button`
    background: none;
    border: none;
    padding: 8px;
    color: #888EB0;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 1;

    @media (min-width: 768px) {
        top: 28px;
        right: 28px;
        padding: 10px;
    }

    &:hover {
        color: #EC5757;
        background: rgba(236, 87, 87, 0.1);
    }

    &:focus-visible {
        outline: 2px solid #7C5DFA;
        outline-offset: 2px;
    }
`;

const DraggableItem = ({ 
    item, 
    index, 
    handleItemChange, 
    removeItemAtIndex, 
    errors, 
    currency = 'USD',
    formatNumber 
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: `item-${index}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    console.log(`Rendering DraggableItem ${index}`, { item, isDragging });

    return (
        <DraggableItemCard
            ref={setNodeRef}
            style={style}
            className={isDragging ? 'dragging' : ''}
        >
            <DragHandle {...attributes} {...listeners}>
                <Icon name="arrow-up-down" size={16} />
            </DragHandle>
            
            <ItemGrid>
                <div>
                    <MinimalLabel
                        htmlFor={`item-name-${index}`}
                        data-error={errors?.items && errors.items[index]?.name}
                    >
                        Item Name
                    </MinimalLabel>
                    <MinimalInput
                        id={`item-name-${index}`}
                        type="text"
                        name="name"
                        value={item.name || ''}
                        placeholder="Item name"
                        data-error={errors?.items && errors.items[index]?.name}
                        onChange={(event) => handleItemChange(event, 'items', null, index)}
                    />
                    
                    <MinimalLabel
                        htmlFor={`item-description-${index}`}
                        style={{ marginTop: '8px' }}
                    >
                        Description
                    </MinimalLabel>
                    <DescriptionInput
                        id={`item-description-${index}`}
                        name="description"
                        value={item.description || ''}
                        placeholder="Item description..."
                        onChange={(event) => handleItemChange(event, 'items', null, index)}
                    />
                </div>
                
                <div>
                    <MinimalLabel htmlFor={`item-quantity-${index}`}>
                        Qty.
                    </MinimalLabel>
                    <MinimalInput
                        id={`item-quantity-${index}`}
                        type="number"
                        inputMode="numeric"
                        min="0"
                        name="quantity"
                        value={item.quantity || ''}
                        style={{
                            fontSize: '16px',
                            WebkitAppearance: 'none',
                            appearance: 'none',
                            touchAction: 'manipulation'
                        }}
                        onChange={(event) => handleItemChange(event, 'items', null, index)}
                    />
                </div>
                
                <div>
                    <MinimalLabel htmlFor={`item-price-${index}`}>
                        Price ({currency})
                    </MinimalLabel>
                    <input
                        id={`item-price-${index}`}
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0"
                        name="price"
                        value={item.price || ''}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            backgroundColor: '#252945',
                            color: '#FFFFFF',
                            border: '1px solid #252945',
                            borderRadius: '4px',
                            fontSize: '16px',
                            WebkitAppearance: 'none',
                            appearance: 'none',
                            touchAction: 'manipulation'
                        }}
                        onChange={(event) => {
                            handleItemChange({
                                target: {
                                    name: 'price',
                                    value: event.target.value
                                }
                            }, 'items', null, index);
                        }}
                        onBlur={(event) => {
                            const value = event.target.value;
                            if (value && !isNaN(parseFloat(value))) {
                                const formattedValue = parseFloat(value).toFixed(2);
                                handleItemChange({
                                    target: {
                                        name: 'price',
                                        value: formattedValue
                                    }
                                }, 'items', null, index);
                            }
                        }}
                    />
                </div>
                
                <div>
                    <MinimalLabel>VAT (5%)</MinimalLabel>
                    <VatValue>
                        <span className="currency">{currency}</span>
                        {formatNumber(item.vat)}
                    </VatValue>
                </div>
                
                <div>
                    <MinimalLabel>Total</MinimalLabel>
                    <TotalValue>
                        <span className="currency">{currency}</span>
                        {formatNumber(item.total)}
                    </TotalValue>
                </div>
            </ItemGrid>
            
            <DeleteButton
                type="button"
                onClick={() => removeItemAtIndex(index)}
                aria-label={`Delete item ${index + 1}`}
            >
                <Icon name="delete" size={16} />
            </DeleteButton>
        </DraggableItemCard>
    );
};

export default DraggableItem; 