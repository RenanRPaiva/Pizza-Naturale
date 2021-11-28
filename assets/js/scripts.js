// Tradução do termo INNER = significa "Interno", innerhtml significa "Dentro do html"
// Open/Close cart sidebar
const cartSidebar = document.querySelector('.cart-sidebar')
function openSidebar() {
    cartSidebar.classList.add('cart-sidebar-open')
}
function closeSidebar() {
    cartSidebar.classList.remove('cart-sidebar-open')
}
document.getElementById('btn-cart').addEventListener('click', openSidebar)
document.getElementById('btn-close-cart').addEventListener('click', closeSidebar)
document.getElementById('add-more').addEventListener('click', closeSidebar)

// Fetch Products
const fetchProducts = () => {
    const groupsRootEl = document.querySelector('#groups-root')
    fetch('http://127.0.0.1:5500/products.json')
        .then(response => response.json())
        .then(body => {
            groupsRootEl.innerHTML = ''
            body.groups.forEach(group => {
                let groupHtml = `<section><h2>${group.name}</h2><div class="products-grid">`
                group.products.forEach(product => {
                    const description = product.description != null ? `<p>${product.description}</p> ` : ``
                    groupHtml += `<article class="card">
                    <img src="${product.image}" alt="${product.name}" width="196"
                        height="120" />
                    <div class="card-content">
                        <h3>${product.name}</h3>
                        <p class="price">R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        ${description}
                        <button 
                        class="btn btn-main btn-block btn-add-cart" 
                        data-id="${product.id}"
                        data-name="${product.name}"
                        data-image= "${product.image}"
                        data-price="${product.price}"
                        >Adicionar</button>
                    </div>
                </article>`
                })
                groupHtml += `</div></section>`
                groupsRootEl.innerHTML += groupHtml
            });
            setupAddToCart()
        })
        .catch(err => {
            groupsRootEl.innerHTML = `<p class= "alert-error">Falha ao carregar produtos. Recarregue a página.</p>`

        })
}
fetchProducts()

// Products cart
const productsCart = []
const addToCart = (event) => {
    const product = event.target.dataset
    const index = productsCart.findIndex((item) => {
        if (item.id == product.id) {
            return true
        }
        return false
    })
    if (index == -1) {
        productsCart.push({
            ...product,
            price: Number(product.price),
            qty: 1
        })
    } else {
        productsCart[index].qty++
    }
    handleCartUpdate()
}
const removeOfCart = () => {

}
const setupAddToCart = () => {
    const btnAddCartEls = document.querySelectorAll('.btn-add-cart')
    btnAddCartEls.forEach(btn => {
        btn.addEventListener('click', addToCart)
    })
}
const handleCartUpdate = () => {
    const badgeEl = document.querySelector('#btn-cart .badge')
    const emptyCartEl = document.querySelector('#empty-cart')
    const cartWithProductsEl = document.querySelector('#cart-with-products')
    const cartItensParent = cartWithProductsEl.querySelector('ul')
    const cartTotalValueEl = document.querySelector('#cart-total-vale')
    const totalCart = productsCart.reduce((total, item) => {
        return total + item.qty
    }, 0)    
    if(totalCart > 0){
        badgeEl.classList.add('badge-show')
        badgeEl.innerText = totalCart
        cartWithProductsEl.classList.add('cart-with-products-show')
        emptyCartEl.classList.remove('empty-cart-show')
        cartItensParent.innerHTML = ''
        productsCart.forEach((product)=>{
            cartItensParent.innerHTML += `<li class="cart-item">
            <img src="${product.image}" alt="${product.name}" width="70"
                height="70" />
            <div>
                <p class="h3">${product.name}</p>
                <p class="price">R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <input class="form-input" type="number" min="0" value="${product.qty}">
            <button class="btn-remove-cart">
                <i class="fas fa-trash-alt"></i>
            </button>
        </li>`
        })
        setupRemoveOfCart()
        const totalPrice = productsCart.reduce((total, item)=>{
           return total + item.qty * item.price 
        }, 0)
        cartTotalValueEl.innerText = 'R$ ' + totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    } else {
        badgeEl.classList.remove('badge-show')
        emptyCartEl.classList.add('empty-cart-show')
        cartWithProductsEl.classList.remove('cart-with-products-show')
    }
}
handleCartUpdate()
const setupRemoveOfCart = () => {

}