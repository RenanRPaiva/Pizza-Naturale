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
                        <p class="price">R$ ${product.price.toLocaleString('pt-BR', {minimumFractionDigits: 2}) }</p>
                        ${description}
                        <button class="btn btn-main btn-block btn-add-cart" data-id="${product.id}">Adicionar</button>
                    </div>
                </article>`
                })
                groupHtml += `</div></section>`
                groupsRootEl.innerHTML += groupHtml
            });
            setupAddToCart()
        })
        .catch(err =>{groupsRootEl.innerHTML = `<p class= "alert-error">Falha ao carregar produtos. Recarregue a página.</p>`
            
        })
}
fetchProducts()

// Products cart
const productsCart = []
const addToCart = (event) => {
    console.log(event.target.dataset)
}
const setupAddToCart = () => {
    const btnAddCartEls = document.querySelectorAll('.btn-add-cart')
    btnAddCartEls.forEach(btn =>{
        btn.addEventListener('click', addToCart)
    })
}