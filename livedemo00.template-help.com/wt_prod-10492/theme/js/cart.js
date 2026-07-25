const quantities = document.querySelectorAll(".quantity");

const totalPrice = document.getElementById("totalPrice");
const cartCount = document.getElementById("cartCount");
const cartIcon = document.getElementById("cartIcon");
const cartIconMobile = document.getElementById("cartIconMobile");

function actualizarCarrito(){

    let total = 0;
    let cantidad = 0;

    quantities.forEach(input=>{

        const precio = parseFloat(input.dataset.price);
        const cant = parseInt(input.value);

        cantidad += cant;
        total += precio * cant;

        input.closest(".group-middle")
             .querySelector(".item-price")
             .textContent="$"+(precio*cant).toFixed(2);

    });

    totalPrice.textContent="$"+total.toFixed(2);

    cartCount.textContent=cantidad;
    cartIcon.textContent=cantidad;
    cartIconMobile.textContent=cantidad;

}

document.querySelectorAll(".mas").forEach(btn=>{

    btn.addEventListener("click",()=>{

        const input=btn.previousElementSibling;

        input.value=parseInt(input.value)+1;

        actualizarCarrito();

    });

});

document.querySelectorAll(".menos").forEach(btn=>{

    btn.addEventListener("click",()=>{

        const input=btn.nextElementSibling;

        if(parseInt(input.value)>1){

            input.value=parseInt(input.value)-1;

            actualizarCarrito();

        }

    });

});

quantities.forEach(input=>{

    input.addEventListener("change",()=>{

        if(input.value<1)
            input.value=1;

        actualizarCarrito();

    });

});

actualizarCarrito();