const API_URL = 'https://dummyjson.com/products';
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

window.addToCart = function(id, title, price) {
    cart.push({ id, title, price });
    saveCart();
    alert(`${title} has been added to your cart.`);
};

// --- TASK 1: LISTING PAGE ---
const productList = document.getElementById('product-list');
if (productList) {
    fetch(`${API_URL}?limit=194`)
        .then(response => response.json())
        .then(data => {
            productList.innerHTML = data.products.map(p => `
                <div class="card">
                    <img src="${p.thumbnail}" alt="${p.title}">
                    <h3>${p.title}</h3>
                    <p>$${p.price}</p>
                    <button onclick="window.location.href='product.html?id=${p.id}'">View Details</button>
                    <button onclick="addToCart(${p.id}, '${p.title.replace(/'/g, "\\'")}', ${p.price})">Add to Cart</button>
                </div>
            `).join('');
        })
        .catch(err => console.error("Error fetching products:", err));
}

// --- TASK 2: PRODUCT PAGE ---
const productDetail = document.getElementById('product-detail');
if (productDetail) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        fetch(`${API_URL}/${productId}`)
            .then(response => response.json())
            .then(p => {
                productDetail.innerHTML = `
                    <img src="${p.thumbnail}" alt="${p.title}">
                    <h2>${p.title}</h2>
                    <p>${p.description}</p>
                    <h3>Price: $${p.price}</h3>
                    <button onclick="addToCart(${p.id}, '${p.title.replace(/'/g, "\\'")}', ${p.price})">Add to Cart</button>
                `;
            })
            .catch(err => console.error("Error fetching product details:", err));
    } else {
        productDetail.innerHTML = "<p>Product not found.</p>";
    }
}

// --- TASK 3: CART PAGE ---
const cartContainer = document.getElementById('cart-container');
const billSummary = document.getElementById('bill-summary');

if (cartContainer && billSummary) {
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
    };

    function renderCart() {
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty.</p>';
            billSummary.innerHTML = '';
            return;
        }

        cartContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <h4>${item.title}</h4>
                <p>$${item.price}</p>
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        billSummary.innerHTML = `<h2>Total Bill: $${total.toFixed(2)}</h2>`;
    }
    
    renderCart();
}