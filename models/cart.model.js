class Cart {
    // default values
    constructor(items = [], totalQuantity = 0, totalPrice = 0) {
        this.items = items;
        this.totalQuantity = totalQuantity;
        this.totalPrice = totalPrice;
    }

    addItem(product) {
        const cartItem = {
            product: product,
            quantity: 1,
            totalPrice: product.price
        };
        //  we check if the item is already in the cart; if the product are in the cart, we update the product item, the queantity and the price of that product
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.product.id === product.id) {
                //  we update the cart product data
                cartItem.quantity = item.quantity + 1;
                cartItem.totalPrice = item.totalPrice + product.price;
                this.items[i] = cartItem;

                //  we update the cart data
                this.totalQuantity = this.totalQuantity + 1;
                this.totalPrice = this.totalPrice + product.price;
                return;
            }
        }
        // if the item is nnot alredy in the cart, we added
        this.items.push(cartItem);

        //  we update the cart data
        this.totalQuantity = this.totalQuantity + 1;
        this.totalPrice = this.totalPrice + product.price;
    }

    updateItem(productId, newQuantity) {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.product.id === productId && newQuantity > 0) {
                // creating a copy of the item
                const cartItem = { ...item }
                const quantityChange = newQuantity - item.quantity;
                cartItem.quantity = newQuantity;
                cartItem.totalPrice = newQuantity * product.price;
                this.items[i] = cartItem;

                //  we update the cart data
                this.totalQuantity = this.totalQuantity + quantityChange;
                this.totalPrice += quantityChange * product.price;
                return { updateItemPrice: cartItem.totalPrice };
                //  we wanna remove the item
            } else if (item.product.id === productId && newQuantity <= 0) {
                // remove 1 item from an array in a specify item
                this.items.splice(i, 1);

                this.totalQuantity = this.totalQuantity - item.quantity;
                this.totalPrice -= item.totalPrice;
                // 'cause we remove the entire cart item
                return { updateItemPrice: 0 };
            }
        }
    }
}

module.exports = Cart;