// Capturar y mostrar las ofertas en la tabla
document.getElementById('offerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Obtener valores del formulario
    const username = document.getElementById('username').value;
    const offer = document.getElementById('offer').value;

    // Crear nueva fila en la tabla
    const table = document.getElementById('offersTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const userCell = newRow.insertCell(0);
    const offerCell = newRow.insertCell(1);

    userCell.innerHTML = username;
    offerCell.innerHTML = `$${offer}`;

    // Limpiar el formulario
    document.getElementById('offerForm').reset();
});

// Datos para el gráfico de ventas
const ctx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(ctx, {
    type: 'line', // Tipo de gráfico (puede ser 'bar', 'line', 'pie', etc.)
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'], // Etiquetas para el eje X
        datasets: [{
            label: 'Ventas ($)',
            data: [1200, 1900, 3000, 500, 2300, 3200], // Datos de ventas
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true // El eje Y comienza en 0
            }
        }
    }
});
