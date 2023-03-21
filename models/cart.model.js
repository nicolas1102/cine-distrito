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
        for (let i = 0; i< this.items.length; i++){
            const item = this.items[i];
            if (item.product.id === product.id) {
                //  we update the cart product data
                cartItem.quantity = cartItem.quantity + 1;
                cartItem.totalPrice = cartItem.totalPrice + product.price;
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
}

module.exports = Cart;