// assets/app.js
document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = window.location.origin; // localhost o ngrok automáticamente

  // --- ELEMENTOS PRINCIPALES ---
  const musicaGrid = document.getElementById("productos-musica");
  const audifonosGrid = document.getElementById("productos-audifonos");
  const musicaPag = document.getElementById("pag-music");
  const audifonosPag = document.getElementById("pag-audio");

  const btnCarrito = document.getElementById("btn-carrito");
  const carritoPanel = document.getElementById("carrito-panel");
  const carritoItems = document.getElementById("carrito-items");
  const carritoTotal = document.getElementById("carrito-total");
  const btnCerrarCarrito = document.getElementById("cerrar-carrito");
  const btnCheckout = document.getElementById("btn-checkout");
  const checkoutPanel = document.getElementById("checkout-panel");
  const btnCerrarCheckout = document.getElementById("cerrar-checkout");
  const btnPagar = document.getElementById("btn-pagar");
  const selectPago = document.getElementById("metodo-pago");
  const paypalContainer = document.getElementById("paypal-button-container");

  // --- LOGIN / REGISTRO ---
  const modalRegister = document.getElementById("modal-register");
  const modalLogin = document.getElementById("modal-login");
  const btnRegisterModal = document.getElementById("btn-register-modal");
  const btnLoginModal = document.getElementById("btn-login-modal");
  const btnCerrarRegister = document.getElementById("cerrar-register");
  const btnCerrarLogin = document.getElementById("cerrar-login");

  btnRegisterModal.addEventListener("click", () => modalRegister.classList.remove("hidden"));
  btnLoginModal.addEventListener("click", () => modalLogin.classList.remove("hidden"));
  btnCerrarRegister.addEventListener("click", () => modalRegister.classList.add("hidden"));
  btnCerrarLogin.addEventListener("click", () => modalLogin.classList.add("hidden"));

  document.getElementById("btn-register").addEventListener("click", async () => {
    const nombre = document.getElementById("reg-nombre").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password })
    });
    const data = await res.json();
    alert(data.mensaje || data.error);
    if (data.usuario) modalRegister.classList.add("hidden");
  });

  document.getElementById("btn-login").addEventListener("click", async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      alert(`Bienvenido ${data.usuario.nombre}`);
      modalLogin.classList.add("hidden");
    } else {
      alert(data.error);
    }
  });

  // --- FUNCIONES DEL CARRITO ---
  const agregarAlCarrito = async (producto) => {
    try {
      const res = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: producto.id, nombre: producto.nombre, precio: producto.precio, img: producto.imagen_url, cantidad: 1 })
      });
      await res.json();
      alert(`✅ "${producto.nombre}" agregado al carrito`);
      if (!carritoPanel.classList.contains("hidden")) mostrarCarrito();
    } catch (err) { console.error(err); }
  };

  const eliminarDelCarrito = async (id) => {
    const res = await fetch(`${API_URL}/api/cart/remove`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({id})
    });
    await res.json(); mostrarCarrito();
  };

  const actualizarCantidad = async (id, cantidad) => {
    const res = await fetch(`${API_URL}/api/cart/update`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({id,cantidad})
    });
    await res.json(); mostrarCarrito();
  };

  const obtenerCarrito = async () => {
    const res = await fetch(`${API_URL}/api/cart`);
    return await res.json();
  };

  const mostrarCarrito = async () => {
    const cart = await obtenerCarrito();
    carritoItems.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      total += item.precio * item.cantidad;
      const div = document.createElement("div");
      div.className = "flex items-center gap-2 border-b pb-2";
      div.innerHTML = `
        <img src="${item.img}" alt="${item.nombre}" class="w-16 h-16 rounded" />
        <div class="flex-1">
          <p class="font-semibold">${item.nombre}</p>
          <div class="flex items-center gap-1 mt-1">
            <button class="px-1 bg-gray-200 rounded" data-action="menos" ${item.cantidad===1?'disabled':''}>-</button>
            <span>${item.cantidad}</span>
            <button class="px-1 bg-gray-200 rounded" data-action="mas">+</button>
          </div>
          <p class="text-sm text-gray-500">$${item.precio}</p>
        </div>
        <button class="text-red-500 font-bold text-xl" data-action="remove">×</button>
      `;
      div.querySelector("[data-action='mas']").addEventListener("click",()=>actualizarCantidad(item.id,item.cantidad+1));
      div.querySelector("[data-action='menos']").addEventListener("click",()=>item.cantidad>1?actualizarCantidad(item.id,item.cantidad-1):null);
      div.querySelector("[data-action='remove']").addEventListener("click",()=>eliminarDelCarrito(item.id));
      carritoItems.appendChild(div);
    });
    carritoTotal.textContent = `$${total.toFixed(2)}`;
  };

  btnCarrito.addEventListener("click", async()=>{carritoPanel.classList.remove("hidden");await mostrarCarrito();});
  btnCerrarCarrito.addEventListener("click",()=>carritoPanel.classList.add("hidden"));

  // --- PAGINACIÓN Y RENDER DE PRODUCTOS ---
  const renderProductos = (arr, contenedor) => {
    contenedor.innerHTML = "";
    arr.forEach(p => {
      const div = document.createElement("div");
      div.className = "bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition flex flex-col";
      div.innerHTML = `
        <img src="${p.imagen_url}" alt="${p.nombre}" class="rounded-lg mb-3 h-40 w-full object-cover" />
        <h3 class="text-lg font-semibold text-gray-800">${p.nombre}</h3>
        <p class="text-gray-500 mb-2 text-sm">${p.descripcion}</p>
        <span class="text-violet-600 font-bold mt-auto">$${p.precio}</span>
        <button class="mt-2 bg-violet-600 text-white py-1 px-2 rounded hover:bg-violet-700">
          Agregar al carrito
        </button>
      `;
      div.querySelector("button").addEventListener("click",()=>agregarAlCarrito(p));
      contenedor.appendChild(div);
    });
  };

  const cargarPagina = async (categoria, contenedor, pagContainer, page=1, limit=8) => {
    try {
      const res = await fetch(`${API_URL}/api/products/paginated?categoria=${categoria}&page=${page}&limit=${limit}`);
      const data = await res.json();
      renderProductos(data.productos, contenedor);

      // paginación
      pagContainer.innerHTML = "";
      if(data.pages <=1) return;
      for(let i=1;i<=data.pages;i++){
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = `px-3 py-1 rounded-md border ${i===page?'bg-violet-600 text-white':'bg-white border-gray-300'}`;
        btn.addEventListener("click",()=>cargarPagina(categoria,contenedor,pagContainer,i,limit));
        pagContainer.appendChild(btn);
      }
    } catch(err){console.error(err); contenedor.innerHTML=`<p class="text-red-500 text-center">Error al cargar productos.</p>`;}
  };

  // --- CARGAR PRIMERA PÁGINA ---
  cargarPagina("album", musicaGrid, musicaPag, 1, 8);
  cargarPagina("audifono", audifonosGrid, audifonosPag, 1, 8);

  // --- CHECKOUT ---
  btnCheckout.addEventListener("click", async () => {
    checkoutPanel.classList.remove("hidden");
    paypalContainer.innerHTML = ""; // limpiar por si acaso
    renderPaypal(); // renderizamos PayPal directo 
  });
  btnCerrarCheckout.addEventListener("click",()=>checkoutPanel.classList.add("hidden"));

  const renderPaypal = async ()=>{
    const cart = await obtenerCarrito();
    const total = cart.reduce((s,i)=>s+i.precio*i.cantidad,0);
    paypal.Buttons({
      createOrder: function(data, actions){
        return actions.order.create({purchase_units:[{amount:{value:total.toFixed(2)}}]});
      },
      onApprove:function(data, actions){
        return actions.order.capture().then(details=>{
          alert(`Pago completado por ${details.payer.name.given_name}`);
          checkoutPanel.classList.add("hidden");
        });
      }
    }).render("#paypal-button-container");
  };

  btnPagar.addEventListener("click", async ()=>{
    if(selectPago.value==="banco"){
      const cart = await obtenerCarrito();
      const res = await fetch(`${API_URL}/api/checkout`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({carrito:cart,metodoPago:"banco",usuario:"anonimo"})
      });
      const data = await res.json();
      alert(data.mensaje+`\nTotal: $${data.total.toFixed(2)}`);
      checkoutPanel.classList.add("hidden");
    }
  });
});
