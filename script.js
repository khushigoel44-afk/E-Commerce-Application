const API_URL = 'https://dummyjson.com/products';
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

window.addToCart = function(id, title, price) {
    cart.push({ id, title, price });
    saveCart();
    // A simple alert, but you could upgrade this to a custom toast notification later!
    alert(`${title} added to cart!`);
};

// --- TASK 1: LISTING PAGE ---
const productList = document.getElementById('product-list');
if (productList) {
    // Adding a loading state
    productList.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">Loading products...</p>`;
    
    fetch(`${API_URL}?limit=194`)
        .then(response => response.json())
        .then(data => {
            productList.innerHTML = data.products.map(p => `
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group">
                    <div class="relative w-full h-56 bg-gray-100 flex items-center justify-center p-4">
                        <img src="${p.thumbnail}" alt="${p.title}" class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300">
                    </div>
                    <div class="p-5 flex-1 flex flex-col">
                        <p class="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">${p.category}</p>
                        <h3 class="text-lg font-bold text-gray-800 line-clamp-1 mb-2">${p.title}</h3>
                        <p class="text-2xl text-gray-900 font-extrabold mt-auto">$${p.price}</p>
                        
                        <div class="mt-5 flex gap-2">
                            <button onclick="window.location.href='product.html?id=${p.id}'" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 px-3 rounded-xl transition-colors text-sm">Details</button>
                            <button onclick="addToCart(${p.id}, '${p.title.replace(/'/g, "\\'")}', ${p.price})" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-3 rounded-xl transition-colors text-sm">Add to Cart</button>
                        </div>
                    </div>
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
        productDetail.innerHTML = `<p class="text-center text-gray-500 py-10">Loading details...</p>`;
        
        fetch(`${API_URL}/${productId}`)
            .then(response => response.json())
            .then(p => {
                productDetail.innerHTML = `
                    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                        <div class="md:w-1/2 bg-gray-50 flex items-center justify-center p-8">
                            <img src="${p.thumbnail}" alt="${p.title}" class="w-full h-auto object-contain max-h-[500px] hover:scale-105 transition-transform duration-500">
                        </div>
                        <div class="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <p class="text-sm text-blue-600 font-bold uppercase tracking-wider mb-2">${p.category}</p>
                            <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">${p.title}</h2>
                            <div class="flex items-center gap-2 mb-6">
                                <span class="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-0.5 rounded">⭐ ${p.rating}</span>
                                <span class="text-sm text-gray-500">${p.stock} in stock</span>
                            </div>
                            <p class="text-gray-600 text-lg mb-8 leading-relaxed">${p.description}</p>
                            <div class="mt-auto">
                                <p class="text-4xl text-gray-900 font-black mb-6">$${p.price}</p>
                                <button onclick="addToCart(${p.id}, '${p.title.replace(/'/g, "\\'")}', ${p.price})" class="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
                                    Add to Cart 🛒
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            })
            .catch(err => console.error("Error fetching product details:", err));
    } else {
        productDetail.innerHTML = `<div class="text-center py-20"><p class="text-xl text-gray-500">Product not found.</p><a href="index.html" class="text-blue-600 hover:underline mt-4 inline-block">Go back to products</a></div>`;
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
            cartContainer.innerHTML = `
                <div class="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                    <p class="text-gray-500 text-lg mb-4">Your cart is feeling a bit empty.</p>
                    <a href="index.html" class="inline-block bg-gray-900 text-white font-semibold py-2 px-6 rounded-full hover:bg-gray-800 transition-colors">Start Shopping</a>
                </div>`;
            billSummary.innerHTML = `<p class="text-gray-500">No items to bill.</p>`;
            return;
        }

        cartContainer.innerHTML = cart.map((item, index) => `
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
                <div class="flex-1">
                    <h4 class="font-bold text-gray-900 text-lg line-clamp-1">${item.title}</h4>
                </div>
                <div class="font-extrabold text-gray-900 text-lg">
                    $${item.price}
                </div>
                <button onclick="removeFromCart(${index})" class="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Remove Item">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const tax = total * 0.08; // 8% dummy tax
        const finalTotal = total + tax;

        billSummary.innerHTML = `
            <div class="space-y-3 mb-6 text-sm">
                <div class="flex justify-between text-gray-600">
                    <span>Subtotal (${cart.length} items)</span>
                    <span class="font-semibold text-gray-900">$${total.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                    <span>Estimated Tax (8%)</span>
                    <span class="font-semibold text-gray-900">$${tax.toFixed(2)}</span>
                </div>
            </div>
            <div class="border-t pt-4">
                <div class="flex justify-between items-center mb-6">
                    <span class="text-lg font-bold text-gray-900">Total</span>
                    <span class="text-2xl font-black text-gray-900">$${finalTotal.toFixed(2)}</span>
                </div>
                <button class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors">
                    Checkout Now
                </button>
            </div>
        `;
    }
    
    renderCart();
}