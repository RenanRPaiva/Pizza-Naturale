// Tradução do termo INNER = significa "Interno", innerhtml significa "Dentro do html"
function openSidebar(){
    var cartSidebar = document.querySelector('.cart-sidebar')
    cartSidebar.classList.add('cart-sidebar-open')
}
function closeSidebar(){
    var cartSidebar = document.querySelector('.cart-sidebar')
    cartSidebar.classList.remove('cart-sidebar-open')
}
document.getElementById('btn-cart').addEventListener('click', openSidebar)
document.getElementById('btn-close-cart').addEventListener('click', closeSidebar)
document.getElementById('add-more').addEventListener('click', closeSidebar)