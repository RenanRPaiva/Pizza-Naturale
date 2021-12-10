// Tradução do termo INNER = significa "Interno", innerhtml significa "Dentro do html"
// Open/Close cart sidebar
const cartSidebar = document.querySelector('.cart-sidebar')
function openSidebar(event) {
    event.stopPropagation()
    cartSidebar.classList.add('cart-sidebar-open')
}
function closeSidebar() {
    cartSidebar.classList.remove('cart-sidebar-open')
}
document.getElementById('btn-cart').addEventListener('click', openSidebar)
document.getElementById('btn-close-cart').addEventListener('click', closeSidebar)
document.getElementById('add-more').addEventListener('click', closeSidebar)
document.addEventListener('click', closeSidebar)
cartSidebar.addEventListener('click', event => event.stopPropagation())

// Fetch Products
const groupsRootEl = document.querySelector('#groups-root')
const fetchProducts = () => {
    fetch('/products.json')
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
if (groupsRootEl) {
    fetchProducts()
}


// Products cart
let productsCart = []
const addToCart = (event) => {
    const product = event.target.dataset
    const index = productsCart.findIndex((item) => item.id == product.id)
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
function removeOfCart() {
    const { id } = this.dataset
    productsCart = productsCart.filter((product) => product.id != id)
    handleCartUpdate()
}
const setupAddToCart = () => {
    const btnAddCartEls = document.querySelectorAll('.btn-add-cart')
    btnAddCartEls.forEach(btn => {
        btn.addEventListener('click', addToCart)
    })
}
const hadlekeydown = event => {
    if (event.key == '-' || event.key == '.') {
        event.preventDefault()
    }
}
const handleUpdateQty = event => {
    const { id } = event.target.dataset
    const qty = parseInt(event.target.value)
    if (qty > 0) {
        const index = productsCart.findIndex(item => item.id == id)
        productsCart[index].qty = qty
        handleCartUpdate(false)
    } else {
        productsCart = productsCart.filter((product) => product.id != id)
        handleCartUpdate()
    }
}
const setupCartEvents = () => {
    const btnRemoveCartEls = document.querySelectorAll('.btn-remove-cart')
    btnRemoveCartEls.forEach((btn) => {
        btn.addEventListener('click', removeOfCart)
    })
    const inputsQtyEl = document.querySelectorAll('.input-qty-cart')
    inputsQtyEl.forEach((input) => {
        input.addEventListener('keydown', hadlekeydown)
        input.addEventListener('keyup', handleUpdateQty)
        input.addEventListener('change', handleUpdateQty)
    })
}
const katCart = '@naturale/productsCart'
const handleCartUpdate = (renderItens = true) => {
    localStorage.setItem(katCart, JSON.stringify(productsCart))
    const badgeEl = document.querySelector('#btn-cart .badge')
    const emptyCartEl = document.querySelector('#empty-cart')
    const cartWithProductsEl = document.querySelector('#cart-with-products')
    const cartItensParent = cartWithProductsEl.querySelector('ul')
    const cartTotalValueEl = document.querySelector('#cart-total-vale')
    const totalCart = productsCart.reduce((total, item) => total + item.qty, 0)
    if (totalCart > 0) {
        badgeEl.classList.add('badge-show')
        badgeEl.innerText = totalCart
        cartWithProductsEl.classList.add('cart-with-products-show')
        emptyCartEl.classList.remove('empty-cart-show')
        if (renderItens) {
            cartItensParent.innerHTML = ''
            productsCart.forEach((product) => {
                cartItensParent.innerHTML += `<li class="cart-item">
                <img src="${product.image}" alt="${product.name}" width="70"
                    height="70" />
                <div>
                    <p class="h3">${product.name}</p>
                    <p class="price">R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <input class="form-input input-qty-cart" type="number" min="0" value="${product.qty}" data-id="${product.id}" />
                <button class="btn-remove-cart" data-id="${product.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </li>`
            })
            setupCartEvents()
        }
        const totalPrice = productsCart.reduce((total, item) => {
            return total + item.qty * item.price
        }, 0)
        cartTotalValueEl.innerText = 'R$ ' + totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    } else {
        badgeEl.classList.remove('badge-show')
        emptyCartEl.classList.add('empty-cart-show')
        cartWithProductsEl.classList.remove('cart-with-products-show')
    }
}
const initCart = () => {
    const savedProducts = localStorage.getItem(katCart)
    if (savedProducts) {
        productsCart = JSON.parse(savedProducts)
    }
    handleCartUpdate()
}
initCart()

const handleCheckoutSubmit = event => {
    event.preventDefault()
    if (productsCart.length == 0) {
        alert('Nenhum produto no carrinho.')
        return
    }
    let text = "Confira o pedido\n-----------------------------\n\n"
    productsCart.forEach((product) => {
        text += `*${product.qty}x ${product.name}* - R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`
    })
    const totalPrice = productsCart.reduce((total, item) => {
        return total + item.qty * item.price
    }, 0)
    text += `\n*Taxa de entrega:* a combinar:\n*Total: R$ ${totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*`
    text += `\n\n-----------------------------\n\n`
    text += `*${event.target.elements['input-name'].value}*`
    text += `\n${event.target.elements['input-phone'].value}\n\n`
    const complement = event.target.elements['input-complement'].value ? ` - ${event.target.elements['input-complement'].value}` : ``
    text += `\n${event.target.elements['input-address'].value}, ${event.target.elements['input-number'].value}${complement}\n`
    text += `${event.target.elements['input-neighborhood'].value}, ${event.target.elements['input-city'].value}\n`
    text += event.target.elements['input-cep'].value
    text = encodeURI(text)
    const subdomain = window.innerWidth > 768 ? 'web' : 'api'
    window.open(`https://${subdomain}.whatsapp.com/send/?phone=5521996227313&text=${text}`, '_blank')
}
const formCheckoutEl = document.querySelector('.form-checkout')
formCheckoutEl?.addEventListener('submit', handleCheckoutSubmit)

// Masks
const inputPhoneEl = document.querySelector('#input-phone')
const inputCepEl = document.querySelector('#input-cep')
if (inputPhoneEl) {
    IMask(inputPhoneEl, {
        mask: '(00) 00000-0000'
    })
}
if (inputCepEl) {
    IMask(inputCepEl, {
        mask: '00000-000'
    })
}

// Busca CEP
inputCepEl?.addEventListener("blur", () => {
    const cepValue = inputCepEl.value.replace('-', '')
    fetch(` http://viacep.com.br/ws/${cepValue}/json/`)
        .then(response => response.json())
        .then(body => {
            const address = document.querySelector('#input-address')
            const neighborhood = document.querySelector('#input-neighborhood')
            const city = document.querySelector('#input-city')
            address.value = body.logradouro || ''
            neighborhood.value = body.bairro || ''
            city.value = body.localidade || ''
            document.querySelector('#input-number').focus();            
        })
})