const contenedorProductos= document.getElementById("contenedor-productos");

const contenedorCarrito = document.getElementById("carrito-contenedor");

const botonVaciar = document.getElementById("vacias-carrito")

const contadorCarrito = document.getElementById("contadorCarrito")

const fragment = document.createDocumentFragment()

const precioTotal = document.getElementById("precioTotal")

let carrito =[]

document.addEventListener('DOMContentLoaded', () => {
    localStorage.getItem('carrito')? (carrito = JSON.parse(localStorage.getItem('carrito')), actualizarCarrito()): null
})

botonVaciar.addEventListener(`click`, ()=>{
    carrito=[];
    localStorage.clear();
    actualizarCarrito();
})




let producto= fetch("/data.json")
.then((res)=>res.json())
.then((data)=>{
    data.forEach((producto)=>{
        const div = document.createElement("div")
        div.classList.add("producto")
        div.innerHTML=`
        <img src=${producto.img} class="imagen">
        <h3>${producto.nombre}</h3>
        <p class="precioProducto">$${producto.precio}</p>
        <button id="agregar${producto.id}" class="boton-agregar">Agregar<i class="fas fa-shopping-cart"></i></button>
        `
        contenedorProductos.appendChild(div)
        const boton = document.getElementById(`agregar${producto.id}`)
        boton.addEventListener("click", ()=>{
            agregarCarrito(producto.id)
            
        })
        const agregarCarrito = (prodId)=>{
            const existe = carrito.some (prod =>prod.id === prodId)
            let prod;
            let item;
            existe? (prod = carrito.map(prod=>{
                if (prod.id === prodId)
                    prod.cantidad++
            })):(item = data.find((prod)=> prod.id === prodId), carrito.push(item))
            actualizarCarrito()
            Toastify({
                text: "Agregaste un producto al Carrito !!!",
                duration: 3000,
                gravity: "bottom",
                position: "left", 
                stopOnFocus: true, 
                style: {
                  background: "linear-gradient(to right, #4717f6, #a239ca)",
                }
              }).showToast()
            console.log(carrito)
        }
        
        })
    })


    const eliminarDelCarrito=(prodId)=>{
        const item = carrito.find((prod)=> prod.id === prodId)
        const indice = carrito.indexOf(item)
        carrito.splice(indice, 1)
        if(carrito.length = 0){
            carrito = [];
        }
        localStorage.clear()
        actualizarCarrito()
    }


    
    const actualizarCarrito = () =>{
        contenedorCarrito.innerHTML=""
        carrito.forEach((prod)=>{
            const div = document.createElement("div");
            div.className=("productoCarrito")
            div.innerHTML= `
            <p class="prodTitle">${prod.nombre}</p>
            <p class="prodPrecio">Precio: <span id="precio">$ ${prod.precio}</span></p>
            <p class="prodCantidad">Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
            <button onclick="eliminarDelCarrito(${prod.id})" class="boton-elminar btn-close"></button>
            `
            contenedorCarrito.appendChild(div)
    
            localStorage.setItem("carrito", JSON.stringify(carrito))
        })
        contadorCarrito.innerHTML= carrito.reduce((acc, prod)=> acc + prod.cantidad, 0)
        //contadorCarrito.innerHTML=carrito.length
        precioTotal.innerText = carrito.reduce((acc, prod)=> acc + prod.precio*prod.cantidad, 0)
    }








