import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

/**
 * Generate a unique delivery order ID in format FTDOXXXX where X is a number
 * @returns {string} A unique ID in format FTDOXXXX
 */
const generateCustomId = () => {
    // Generate a random 4-digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `FTDO${randomNum}`;
};

const useManageDeliveryOrders = () => {
    const [state, setState] = useState({
        deliveryOrders: [],
        isLoading: false,
        error: null
    });

    const refreshDeliveryOrders = async () => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            // TODO: Implement actual API call to fetch delivery orders
            // For now, we'll use mock data
            const mockDeliveryOrders = [
                {
                    id: '1',
                    customId: 'DO-001',
                    clientName: 'John Doe',
                    description: 'Sample Delivery Order',
                    status: 'pending',
                    total: 150.00,
                    createdAt: new Date().toISOString()
                }
            ];
            
            setState({
                deliveryOrders: mockDeliveryOrders,
                isLoading: false,
                error: null
            });
        } catch (error) {
            setState({
                deliveryOrders: [],
                isLoading: false,
                error: error.message
            });
        }
    };

    const createDeliveryOrder = async (deliveryOrderData) => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            
            // Generate a custom ID for the delivery order
            const customId = generateCustomId();
            
            // Add the delivery order to Firestore
            const deliveryOrdersCollection = collection(db, 'deliveryOrders');
            const docRef = await addDoc(deliveryOrdersCollection, {
                ...deliveryOrderData,
                customId, // Add the custom ID
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            
            // Refresh the delivery orders list
            await refreshDeliveryOrders();
            
            return docRef.id;
        } catch (error) {
            console.error('Error creating delivery order:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message
            }));
            throw error;
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    };

    const updateDeliveryOrder = async (deliveryOrderId, deliveryOrderData) => {
        try {
            console.log('Starting updateDeliveryOrder with ID:', deliveryOrderId);
            console.log('Update data:', JSON.stringify(deliveryOrderData, null, 2));
            
            setState(prev => ({ ...prev, isLoading: true }));
            
            // Update the delivery order in Firestore
            const deliveryOrderRef = doc(db, 'deliveryOrders', deliveryOrderId);
            console.log('Updating document at path:', deliveryOrderRef.path);
            
            await updateDoc(deliveryOrderRef, {
                ...deliveryOrderData,
                updatedAt: serverTimestamp()
            });
            
            console.log('Document updated successfully');
            
            // Refresh the delivery orders list
            await refreshDeliveryOrders();
            
            console.log('Delivery orders list refreshed');
            return deliveryOrderId;
        } catch (error) {
            console.error('Error in updateDeliveryOrder:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message
            }));
            throw error;
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    };

    useEffect(() => {
        refreshDeliveryOrders();
    }, []);

    return {
        state,
        refreshDeliveryOrders,
        createDeliveryOrder,
        updateDeliveryOrder
    };
};

export default useManageDeliveryOrders; 