/*Funciones para la landing page*/
function irInvitacion() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        alert("Invitación no válida");
        return;
    }

    sessionStorage.setItem("invitadoId", id);
    window.location.href = `invitacion.html?id=${id}`;
    }

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("invitados.json")
  .then(res => res.json())
  .then(data => {
    const invitado = data[id];

    if (!invitado) {
      document.body.innerHTML = `
        <h1>Invitación no válida</h1>
        <p>Por favor revisa el enlace recibido.</p>
      `;
      return;
    }

    document.getElementById("nombre").innerHTML =
      `${invitado.name}`;

    document.getElementById("cupos").textContent =
      `Hemos reservado ${invitado.guests} espacio(s) para ti.`;
  })
  .catch(() => {
    document.body.innerHTML = "<p>Error al cargar la invitación.</p>";
  });