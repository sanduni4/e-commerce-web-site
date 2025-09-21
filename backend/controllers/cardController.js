// For this implementation, we'll use in-memory cart storage
// In production, you might want to use a Cart model with MongoDB

// In-memory cart storage (resets on server restart)
const userCarts = new Map();

export function addToCart(req, res) {
    try {
        const { productId, productName, price, quantity, image } = req.body;
        const userEmail = req.user ? req.user.email : 'guest';

        // Validate required fields
        if (!productId || !productName || !price || !quantity) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        // Get or create user cart
        if (!userCarts.has(userEmail)) {
            userCarts.set(userEmail, []);
        }

        const cart = userCarts.get(userEmail);

        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => item.productId === productId);

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart[existingItemIndex].quantity += parseInt(quantity);
        } else {
            // Add new item to cart
            cart.push({
                productId,
                productName,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                image: image || ''
            });
        }

        res.json({
            message: "Item added to cart successfully",
            cart: cart,
            totalItems: cart.reduce((total, item) => total + item.quantity, 0)
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export function getCart(req, res) {
    try {
        const userEmail = req.user ? req.user.email : 'guest';
        const cart = userCarts.get(userEmail) || [];

        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        res.json({
            cart: cart,
            totalItems: totalItems,
            totalPrice: totalPrice.toFixed(2)
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export function updateCartItem(req, res) {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const userEmail = req.user ? req.user.email : 'guest';

        if (!userCarts.has(userEmail)) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const cart = userCarts.get(userEmail);
        const itemIndex = cart.findIndex(item => item.productId === productId);

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Item not found in cart"
            });
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            cart.splice(itemIndex, 1);
        } else {
            // Update quantity
            cart[itemIndex].quantity = parseInt(quantity);
        }

        res.json({
            message: "Cart updated successfully",
            cart: cart,
            totalItems: cart.reduce((total, item) => total + item.quantity, 0)
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export function removeFromCart(req, res) {
    try {
        const { productId } = req.params;
        const userEmail = req.user ? req.user.email : 'guest';

        if (!userCarts.has(userEmail)) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const cart = userCarts.get(userEmail);
        const itemIndex = cart.findIndex(item => item.productId === productId);

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Item not found in cart"
            });
        }

        cart.splice(itemIndex, 1);

        res.json({
            message: "Item removed from cart successfully",
            cart: cart,
            totalItems: cart.reduce((total, item) => total + item.quantity, 0)
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export function clearCart(req, res) {
    try {
        const userEmail = req.user ? req.user.email : 'guest';
        userCarts.set(userEmail, []);

        res.json({
            message: "Cart cleared successfully",
            cart: []
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}