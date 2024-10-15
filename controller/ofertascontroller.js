document.addEventListener('DOMContentLoaded', function() {
    // Inicializar los iconos de Lucide
    lucide.createIcons();

    // Manejar el formulario de ofertas
    const ofertaForm = document.getElementById('ofertaForm');
    const ofertaInput = document.getElementById('ofertaInput');
    const ofertasTableBody = document.getElementById('ofertasTableBody');

    // Array para almacenar las ofertas
    let ofertas = [
        { usuario: 'Usuario1', oferta: '50.00' },
        { usuario: 'Usuario2', oferta: '55.00' }
    ];

    // Función para renderizar las ofertas en la tabla
    function renderizarOfertas() {
        ofertasTableBody.innerHTML = '';
        ofertas.forEach(oferta => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${oferta.usuario}</td>
                <td>$${oferta.oferta}</td>
            `;
            ofertasTableBody.appendChild(tr);
        });
    }

});