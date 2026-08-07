const quantities = document.querySelectorAll(".quantity");
const totalPrice = document.getElementById("totalPrice");


function actualizarCarrito() {

    let total = 0;
    let cantidad = 0;

    quantities.forEach(input => {

        const precio = parseFloat(input.dataset.price);
        const cant = parseInt(input.value);

        cantidad += cant;
        total += precio * cant;

        const itemPrice = input
            .closest(".group-middle")
            ?.querySelector(".item-price");

        if (itemPrice) {
            itemPrice.textContent = "$" + (precio * cant).toFixed(2);
        }

    });


    // TOTAL DEL CARRITO
    if (totalPrice) {
        totalPrice.textContent = "$" + total.toFixed(2);
    }


    // Estos elementos están dentro de header.html,
    // por eso los buscamos CADA VEZ que actualizamos.
    const cartCount = document.getElementById("cartCount");
    const cartIcon = document.getElementById("cartIcon");
    const cartIconMobile = document.getElementById("cartIconMobile");


    if (cartCount) {
        cartCount.textContent = cantidad;
    }

    if (cartIcon) {
        cartIcon.textContent = cantidad;
    }

    if (cartIconMobile) {
        cartIconMobile.textContent = cantidad;
    }

}


// BOTÓN +
document.querySelectorAll(".mas").forEach(btn => {

    btn.addEventListener("click", () => {

        const input = btn.previousElementSibling;

        input.value = parseInt(input.value) + 1;

        actualizarCarrito();

    });

});


// BOTÓN -
document.querySelectorAll(".menos").forEach(btn => {

    btn.addEventListener("click", () => {

        const input = btn.nextElementSibling;

        if (parseInt(input.value) > 1) {

            input.value = parseInt(input.value) - 1;

            actualizarCarrito();

        }

    });

});


// CAMBIO MANUAL DE CANTIDAD
quantities.forEach(input => {

    input.addEventListener("change", () => {

        if (input.value < 1) {
            input.value = 1;
        }

        actualizarCarrito();

    });

});


// CUANDO EL HEADER TERMINE DE CARGAR
document.addEventListener("headerLoaded", () => {

    console.log("Header listo → actualizando carrito");

    actualizarCarrito();

});


// ACTUALIZAR EL RESTO DE LA PÁGINA
actualizarCarrito();