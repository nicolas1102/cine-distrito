class Cart {
    // default values
    constructor(items = [], totalQuantity = 0, totalPrice = 0, totalPoints = 0) {
        this.items = items;
        this.totalPoints = totalPoints;
        this.totalQuantity = totalQuantity;
        this.totalPrice = totalPrice;
    }

    addItem(product) {
        const cartItem = {
            product: product,
            quantity: 1,
            totalPrice: product.price,
            totalPoints: product.points,
        };
        //  we check if the item is already in the cart; if the product are in the cart, we update the product item, the queantity and the price of that product
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.product.snackId && (item.product.snackId === product.snackId)) {
                //  we update the cart product data
                cartItem.quantity = +item.quantity + 1;
                cartItem.totalPoints = item.totalPoints + product.points;
                cartItem.totalPrice = item.totalPrice + product.price;
                this.items[i] = cartItem;

                //  we update the cart data
                this.totalQuantity++;
                this.totalPrice += product.price;
                return;
            }
        }
        // if the item is nnot alredy in the cart, we added
        this.items.push(cartItem);

        //  we update the cart data
        this.totalPoints += (+product.points);
        this.totalQuantity++;
        this.totalPrice += product.price;
    }

    updateItem(productId, newQuantity) {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.product.snackId === productId && newQuantity > 0) {
                // creating a copy of the item
                const cartItem = { ...item };
                const quantityChange = newQuantity - item.quantity;
                cartItem.quantity = newQuantity;
                cartItem.totalPoints = newQuantity * (+item.product.points);
                console.log(cartItem.totalPoints);
                cartItem.totalPrice = newQuantity * item.product.price;
                this.items[i] = cartItem;

                //  we update the cart data
                this.totalQuantity = this.totalQuantity + quantityChange;
                this.totalPoints = this.totalPoints + quantityChange * item.product.points;
                this.totalPrice += quantityChange * item.product.price;
                return { updatedItemPrice: cartItem.totalPrice };
                //  we wanna remove the item
            } else if ((item.product.ticketId === productId && newQuantity <= 0) || (item.product.snackId === productId && newQuantity <= 0)) {
                // remove 1 item from an array in a specify item
                this.items.splice(i, 1);
                this.totalQuantity = this.totalQuantity - item.quantity;
                this.totalPoints -= item.totalPoints;
                this.totalPrice -= item.totalPrice;
                // 'cause we remove the entire cart item
                return { updatedItemPrice: 0 };
            }
        }
    }
}

module.exports = Cart;