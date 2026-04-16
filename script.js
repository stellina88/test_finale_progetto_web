// Stato dell'applicazione: array che conterrà le nostre spese
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let editId = null; // Per gestire la modifica [cite: 56]

// Riferimenti agli elementi del DOM [cite: 9]
const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const totaleSpeseEl = document.getElementById('totaleSpese');
const numeroSpeseEl = document.getElementById('numeroSpese');
const searchDesc = document.getElementById('searchDesc');
const filterCat = document.getElementById('filterCat');

// Funzione principale per renderizzare la dashboard [cite: 41, 65]
function renderDashboard() {
    const searchTerm = searchDesc.value.toLowerCase();
    const categoryTerm = filterCat.value;

    // Filtriamo le spese in base a ricerca e categoria [cite: 74-77]
    const filteredExpenses = expenses.filter(exp => {
        const matchesSearch = exp.descrizione.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryTerm === 'Tutte' || exp.categoria === categoryTerm;
        return matchesSearch && matchesCategory;
    });

    // Svuotiamo la tabella
    expenseList.innerHTML = '';

    // Popoliamo la tabella con le spese filtrate [cite: 43, 102]
    filteredExpenses.forEach(exp => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${exp.data}</td>
            <td class="fw-bold">${exp.descrizione}</td>
            <td><span class="badge badge-${exp.categoria.toLowerCase().replace(' ', '-')}">${exp.categoria}</span></td>
            <td class="text-primary fw-bold">€ ${parseFloat(exp.importo).toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-outline-warning me-1" onclick="editExpense(${exp.id})">Modifica</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteExpense(${exp.id})">Elimina</button>
            </td>
        `;
        expenseList.appendChild(tr);
    });

    updateSummary();
    localStorage.setItem('expenses', JSON.stringify(expenses)); // Bonus: salvataggio [cite: 160]
}

// Aggiorna il riepilogo generale (totale e numero) [cite: 64-72]
function updateSummary() {
    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.importo), 0);
    totaleSpeseEl.innerText = `€ ${total.toFixed(2)}`;
    numeroSpeseEl.innerText = expenses.length;
}

// Gestione invio Form (Aggiunta o Modifica) [cite: 29-39]
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const descrizione = document.getElementById('descrizione').value;
    const importo = document.getElementById('importo').value;
    const categoria = document.getElementById('categoria').value;
    const data = document.getElementById('data').value;

    // Validazione semplice [cite: 36-38]
    if (importo <= 0) {
        alert("L'importo deve essere maggiore di 0");
        return;
    }

    if (editId) {
        // Logica di modifica [cite: 55-63]
        const index = expenses.findIndex(exp => exp.id === editId);
        expenses[index] = { id: editId, descrizione, importo, categoria, data };
        editId = null;
        expenseForm.querySelector('button').innerText = 'Aggiungi Spesa';
    } else {
        // Logica di aggiunta
        const newExpense = {
            id: Date.now(), // ID univoco temporaneo
            descrizione,
            importo,
            categoria,
            data
        };
        expenses.push(newExpense);
    }

    expenseForm.reset();
    renderDashboard();
});

// Funzione per eliminare una spesa [cite: 50-54]
function deleteExpense(id) {
    if (confirm('Sei sicuro di voler eliminare questa spesa?')) {
        expenses = expenses.filter(exp => exp.id !== id);
        renderDashboard();
    }
}

// Funzione per preparare la modifica [cite: 58]
function editExpense(id) {
    const exp = expenses.find(e => e.id === id);
    document.getElementById('descrizione').value = exp.descrizione;
    document.getElementById('importo').value = exp.importo;
    document.getElementById('categoria').value = exp.categoria;
    document.getElementById('data').value = exp.data;

    editId = id;
    expenseForm.querySelector('button').innerText = 'Aggiorna Spesa';
    window.scrollTo(0, 0); // Torna in alto per vedere il form
}

// Eventi per filtri in tempo reale [cite: 73-77]
searchDesc.addEventListener('input', renderDashboard);
filterCat.addEventListener('change', renderDashboard);

// Render iniziale al caricamento
renderDashboard();