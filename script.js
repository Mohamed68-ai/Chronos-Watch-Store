const products = [
    { id: 1, name: "Gucci G-Timeless", price: 1450, category: "Premium", img: "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=800&q=80" },
    { id: 2, name: "Chronos Noir Matte", price: 1890, category: "Sport", img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop" },
    { id: 3, name: "Royal Gold Edition", price: 3200, category: "Premium", img: "https://images.unsplash.com/photo-1539683255143-73a6b838b106?q=80&w=800&auto=format&fit=crop" },
    { id: 4, name: "Stellar Silver", price: 950, category: "Classique", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop" },
    { id: 5, name: "Oceanic Pro Diver", price: 2100, category: "Sport", img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=800&auto=format&fit=crop" },
    { id: 6, name: "Minimaliste Chic", price: 780, category: "Classique", img: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop" },
    { id: 7, name: "Gucci Dive Tiger", price: 1600, category: "Premium", img: "https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=800&auto=format&fit=crop" },
    
];

let cart = JSON.parse(localStorage.getItem('chronos_cart')) || [];
const productGrid = document.getElementById('productGrid');

function renderProducts(filter = "all", searchQuery = "") {
    productGrid.innerHTML = '';
    
    let filteredProducts = products.filter(p => {
        const matchCategory = filter === "all" || p.category === filter;
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    if(filteredProducts.length === 0) {
        productGrid.innerHTML = '<p style="text-align:center; width:100%; color:#888;">Aucun modèle trouvé.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card reveal active'; 
        card.innerHTML = `
            <div class="img-container">
                <span class="category-badge">${product.category}</span>
                <img src="${product.img}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <div>
                    <h3>${product.name}</h3>
                    <p class="price">${product.price.toLocaleString('fr-FR')} €</p>
                </div>
                <button class="add-btn" onclick="addToCart(${product.id})">Ajouter au Panier</button>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');

searchInput.addEventListener('input', (e) => {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    renderProducts(activeFilter, e.target.value);
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderProducts(e.target.dataset.filter, searchInput.value);
    });
});

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `✓ ${message}`;
    document.getElementById('toastContainer').appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCart();
    showToast(`${product.name} ajouté au panier`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

function updateCart() {
    localStorage.setItem('chronos_cart', JSON.stringify(cart));
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p class="item-price">${item.price.toLocaleString('fr-FR')} €</p>
                <button class="remove-btn" onclick="removeFromCart(${index})">Retirer</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartCount.innerText = cart.length;
    cartTotal.innerText = total.toLocaleString('fr-FR');
}

const cartSidebar = document.getElementById('cartSidebar');
const overlay = document.getElementById('overlay');

document.getElementById('cartBtn').addEventListener('click', () => {
    cartSidebar.classList.add('open');
    overlay.classList.add('show');
});

const closeCart = () => {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('show');
};

document.getElementById('closeCart').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

document.getElementById('checkoutBtn').addEventListener('click', () => {
    if(cart.length > 0) {
        showToast("Commande validée ! Merci.");
        cart = [];
        updateCart();
        setTimeout(closeCart, 1000);
    } else {
        showToast("Votre panier est vide.");
    }
});

function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);

renderProducts();
updateCart();
reveal();