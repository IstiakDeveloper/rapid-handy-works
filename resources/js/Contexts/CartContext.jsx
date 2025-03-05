import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({
        items: [],
        totalItems: 0,
        totalPrice: 0,
        providerInfo: null,
        callingCharge: 0
    });

    // Load cart from localStorage on initial load
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (service, quantity = 1) => {
        setCart(prevCart => {
            // Ensure price is a number
            const price = Number(service.price || 0);

            // Check if service already exists in cart
            const existingItemIndex = prevCart.items.findIndex(
                item => item.id === service.id
            );

            let newItems;
            if (existingItemIndex > -1) {
                // If service exists, update quantity
                newItems = prevCart.items.map((item, index) =>
                    index === existingItemIndex
                        ? {
                            ...item,
                            quantity: item.quantity + quantity
                        }
                        : item
                );
            } else {
                // If service is new, add to cart
                newItems = [
                    ...prevCart.items,
                    {
                        ...service,
                        price,  // Ensure price is a number
                        quantity
                    }
                ];
            }

            // Calculate total items and price
            const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = newItems.reduce((sum, item) =>
                sum + (Number(item.price) * item.quantity), 0
            );
            const callingCharge = service.provider_calling_charge || 0;
            const providerInfo = service.provider_info || null;

            console.log(
                "service.provider_calling_charge", service.provider_calling_charge,
                "service.provider_info", service.provider_info
            );


            const newCart = {
                items: newItems,
                totalItems,
                totalPrice,
                providerInfo: prevCart.providerInfo || providerInfo,
                callingCharge: prevCart.callingCharge || callingCharge
            };

            return newCart;
        });
    };

    const removeFromCart = (serviceId) => {
        setCart((prevCart) => {
            const newItems = prevCart.items.filter(
                (item) => item.id !== serviceId
            );

            const totalItems = newItems.reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            const totalPrice = newItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            const newCart = {
                ...prevCart,
                items: newItems,
                totalItems,
                totalPrice,
                providerInfo: newItems.length > 0 ? prevCart.providerInfo : null,
                callingCharge: newItems.length > 0 ? prevCart.callingCharge : 0
            };

            return newCart;
        });
    };

    const updateQuantity = (serviceId, newQuantity) => {
        setCart((prevCart) => {
            const newItems = prevCart.items.map((item) =>
                item.id === serviceId
                    ? { ...item, quantity: Math.max(1, newQuantity) }
                    : item
            );

            const totalItems = newItems.reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            const totalPrice = newItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            const newCart = {
                ...prevCart,
                items: newItems,
                totalItems,
                totalPrice
            };

            return newCart;
        });
    };

    const setProviderInfo = (providerInfo) => {
        setCart(prevCart => ({
            ...prevCart,
            providerInfo
        }));
    };

    const setCallingCharge = (callingCharge) => {
        setCart(prevCart => ({
            ...prevCart,
            callingCharge: Number(callingCharge || 0)
        }));
    };

    const clearCart = () => {
        const newCart = {
            items: [],
            totalItems: 0,
            totalPrice: 0,
            providerInfo: null,
            callingCharge: 0
        };

        localStorage.setItem("cart", JSON.stringify(newCart));
        setCart(newCart);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                setProviderInfo,
                setCallingCharge
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === null) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
