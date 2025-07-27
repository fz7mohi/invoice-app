import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableItem from './DraggableItem';

const SortableItemsContainer = ({
    items,
    handleItemChange,
    removeItemAtIndex,
    errors,
    currency,
    formatNumber,
    onItemsReorder
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        console.log('Drag end event:', { active, over });

        if (active.id !== over.id) {
            const oldIndex = items.findIndex((_, index) => `item-${index}` === active.id);
            const newIndex = items.findIndex((_, index) => `item-${index}` === over.id);

            console.log('Reordering items:', { oldIndex, newIndex });

            if (oldIndex !== -1 && newIndex !== -1) {
                const newItems = arrayMove(items, oldIndex, newIndex);
                console.log('New items order:', newItems);
                onItemsReorder(newItems);
            }
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map((_, index) => `item-${index}`)}
                strategy={verticalListSortingStrategy}
            >
                {items.map((item, index) => (
                    <DraggableItem
                        key={`item-${index}`}
                        item={item}
                        index={index}
                        handleItemChange={handleItemChange}
                        removeItemAtIndex={removeItemAtIndex}
                        errors={errors}
                        currency={currency}
                        formatNumber={formatNumber}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );
};

export default SortableItemsContainer; 