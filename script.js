let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let editId = null;

const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const searchDesc = document.getElementById('searchDesc');
const filterCat = document.getElementById('filterCat');

function updateSummary() {
    let entrate = 0;
    let uscite = 0;

    transactions.forEach(t => {
        if (t.tipo === 'Entrata') entrate += parseFloat(t.importo);
        else uscite += parseFloat(t.importo);
    });

    const bilancio = entrate - uscite;

    document.getElementById('totaleEntrate').innerText = `€ ${entrate.toFixed(2)}`;
    document.getElementById('totaleUscite').innerText = `€ ${uscite.toFixed(2)}`;
    
    const bilancioEl = document.getElementById('bilancioTotale');
    bilancioEl.innerText = `€ ${bilancio.toFixed(2)}`;
    bilancioEl.className = bilancio >= 0 ? 'text-success' : 'text-danger';
    
    document.getElementById('numeroSpese').innerText = transactions.length;
}

function renderDashboard() {
    const searchTerm = searchDesc.value.toLowerCase();
    const categoryTerm = filterCat.value;

    const filtered = transactions.filter(t => {
        const matchesSearch = t.descrizione.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryTerm === 'Tutte' || t.categoria === categoryTerm;
        return matchesSearch && matchesCategory;
    });

    expenseList.innerHTML = '';

    filtered.forEach(t => {
        const tr = document.createElement('tr');
        const isEntrata = t.tipo === 'Entrata';
        
        tr.innerHTML = `
            <td>${t.data}</td>
            <td>
                <span class="fw-bold">${t.descrizione}</span><br>
                <small class="text-muted">${t.tipo}</small>
            </td>
            <td><span class="badge badge-${t.categoria.toLowerCase().replace(' ', '-')}">${t.categoria}</span></td>
            <td class="${isEntrata ? 'text-success' : 'text-danger'} fw-bold">
                ${isEntrata ? '+' : '-'} € ${parseFloat(t.importo).toFixed(2)}
            </td>
            <td>
                <button class="btn btn-sm btn-outline-warning" onclick="prepareEdit(${t.id})">Modifica</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTransaction(${t.id})">Elimina</button>
            </td>
        `;
        expenseList.appendChild(tr);
    });

    updateSummary();
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    const descrizione = document.getElementById('descrizione').value;
    const importo = document.getElementById('importo').value;
    const categoria = document.getElementById('categoria').value;
    const data = document.getElementById('data').value;

    if (editId) {
        const index = transactions.findIndex(t => t.id === editId);
        transactions[index] = { id: editId, tipo, descrizione, importo, categoria, data };
        editId = null;
        document.getElementById('submitBtn').innerText = 'Aggiungi Operazione';
        document.getElementById('formTitle').innerText = 'Nuova Operazione';
    } else {
        transactions.push({ id: Date.now(), tipo, descrizione, importo, categoria, data });
    }

    expenseForm.reset();
    renderDashboard();
});

function deleteTransaction(id) {
    if (confirm('Sei sicuro di voler eliminare questa voce?')) {
        transactions = transactions.filter(t => t.id !== id);
        renderDashboard();
    }
}

function prepareEdit(id) {
    const t = transactions.find(item => item.id === id);
    document.getElementById(t.tipo.toLowerCase()).checked = true;
    document.getElementById('descrizione').value = t.descrizione;
    document.getElementById('importo').value = t.importo;
    document.getElementById('categoria').value = t.categoria;
    document.getElementById('data').value = t.data;

    editId = id;
    document.getElementById('submitBtn').innerText = 'Salva Modifiche';
    document.getElementById('formTitle').innerText = 'Modifica Operazione';
    window.scrollTo(0, 0);
}

searchDesc.addEventListener('input', renderDashboard);
filterCat.addEventListener('change', renderDashboard);

renderDashboard();