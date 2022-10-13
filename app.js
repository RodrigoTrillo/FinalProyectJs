const contenedorProductos= document.getElementById("contenedor-productos");

const contenedorCarrito = document.getElementById("carrito-contenedor");

const botonVaciar = document.getElementById("vacias-carrito")

const contadorCarrito = document.getElementById("contadorCarrito")

const finCompra = document.querySelector("#finCompra")

const precioTotal = document.getElementById("precioTotal")

let carrito =[]

const formulario = document.getElementById("formulario")
const inputs = document.querySelectorAll("#formulario input")

const expresiones = {
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	telefono: /^\d{7,14}$/ // 7 a 14 numeros.
}

const campos = {
	nombre: false,
	correo: false,
	telefono: false
}

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
        precioTotal.innerText = carrito.reduce((acc, prod)=> acc + prod.precio*prod.cantidad, 0)
    }




// codigo para el formulario

const validarFormulario = (e) => {
	switch (e.target.name) {
		case "nombre":
			validarCampo(expresiones.nombre, e.target, 'nombre');
		break;
		case "correo":
			validarCampo(expresiones.correo, e.target, 'correo');
		break;
		case "telefono":
			validarCampo(expresiones.telefono, e.target, 'telefono');
		break;
	}
}

const validarCampo = (expresion, input, campo) => {
	if(expresion.test(input.value)){
		document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
		document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
		document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
		campos[campo] = true;
	} else {
		document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
		document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
		document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
		campos[campo] = false;
	}
}



inputs.forEach((input) => {
	input.addEventListener('keyup', validarFormulario);
	input.addEventListener('blur', validarFormulario);
});

formulario.addEventListener('submit', (e) => {
	e.preventDefault();

	const terminos = document.getElementById('terminos');
	if(campos.nombre && campos.correo && campos.telefono && terminos.checked ){
		formulario.reset();
        carrito=[];
        localStorage.clear();
        actualizarCarrito();


		document.getElementById('formulario__mensaje-exito').classList.add('formulario__mensaje-exito-activo');
		setTimeout(() => {
			document.getElementById('formulario__mensaje-exito').classList.remove('formulario__mensaje-exito-activo');
		}, 5000);

		document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
			icono.classList.remove('formulario__grupo-correcto');
		});
	} else {
		document.getElementById('formulario__mensaje').classList.add('formulario__mensaje-activo');
	}
});



