let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartUI() {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    let totalItems = 0;
    let totalPrice = 0;
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <span>${item.name} (x${item.quantity})</span>
                <div>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    <button onclick="removeFromCart(${index})" style="margin-left:5px; color:red; border:none; background:none; cursor:pointer;">✕</button>
                </div>
            </div>
        `;
    });

    cartCount.innerText = totalItems;
    cartTotal.innerText = totalPrice.toFixed(2);
}

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('hidden');
}

async function checkout() {
    if (cart.length === 0) return alert("Your cart is empty!");

    const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart })
    });

    const result = await response.json();
    alert(result.message);

    if (result.status === 'success') {
        cart = [];
        updateCartUI();
        toggleCart();
    }
}

// Load saved cart on page load
updateCartUI();