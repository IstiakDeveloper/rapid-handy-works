import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({
        items: [],
        totalItems: 0,
        totalPrice: 0,
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

            const newCart = {
                items: newItems,
                totalItems,
                totalPrice
            };

            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(newCart));

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
                items: newItems,
                totalItems,
                totalPrice,
            };

            localStorage.setItem("cart", JSON.stringify(newCart));

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
                items: newItems,
                totalItems,
                totalPrice,
            };

            localStorage.setItem("cart", JSON.stringify(newCart));

            return newCart;
        });
    };

    const clearCart = () => {
        const newCart = {
            items: [],
            totalItems: 0,
            totalPrice: 0,
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
