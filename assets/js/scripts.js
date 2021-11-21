// Tradução do termo INNER = significa "Interno", innerhtml significa "Dentro do html"
const cartSidebar = document.querySelector('.cart-sidebar')
function openSidebar(){
    cartSidebar.classList.add('cart-sidebar-open')
}
function closeSidebar(){
    cartSidebar.classList.remove('cart-sidebar-open')
}
document.getElementById('btn-cart').addEventListener('click', openSidebar)
document.getElementById('btn-close-cart').addEventListener('click', closeSidebar)
document.getElementById('add-more').addEventListener('click', closeSidebar)