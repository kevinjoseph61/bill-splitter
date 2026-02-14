// State
let state = {
    restaurantName: '',
    totalAmount: 0,
    discountedAmount: 0,
    cashback: '0',
    people: [],
    dishes: [],
    assignments: {} // { personId: [dishId, ...] }
};

let nextPersonId = 1;
let nextDishId = 1;
let selectedDishId = null; // For tap-to-assign on mobile

// DOM Elements
const restaurantNameInput = document.getElementById('restaurantName');
const totalAmountInput = document.getElementById('totalAmount');
const discountedAmountInput = document.getElementById('discountedAmount');
const cashbackInput = document.getElementById('cashback');
const finalAmountSpan = document.getElementById('finalAmount');

const addPersonBtn = document.getElementById('addPersonBtn');
const addPersonForm = document.getElementById('addPersonForm');
const newPersonNameInput = document.getElementById('newPersonName');
const confirmAddPersonBtn = document.getElementById('confirmAddPerson');
const cancelAddPersonBtn = document.getElementById('cancelAddPerson');
const peopleList = document.getElementById('peopleList');

const addDishBtn = document.getElementById('addDishBtn');
const addDishForm = document.getElementById('addDishForm');
const newDishNameInput = document.getElementById('newDishName');
const newDishPriceInput = document.getElementById('newDishPrice');
const confirmAddDishBtn = document.getElementById('confirmAddDish');
const cancelAddDishBtn = document.getElementById('cancelAddDish');
const dishesList = document.getElementById('dishesList');
const dishesTotalSpan = document.getElementById('dishesTotal');

const assignmentsGrid = document.getElementById('assignmentsGrid');
const summaryContent = document.getElementById('summaryContent');
const copyBtn = document.getElementById('copyBtn');
const toast = document.getElementById('toast');

// Modal elements
const assignModal = document.getElementById('assignModal');
const modalDishName = document.getElementById('modalDishName');
const modalPeople = document.getElementById('modalPeople');
const closeModalBtn = document.getElementById('closeModal');
const modalDoneBtn = document.getElementById('modalDone');

// Initialize
function init() {
    // Restaurant info listeners
    restaurantNameInput.addEventListener('input', (e) => {
        state.restaurantName = e.target.value;
        updateSummary();
    });

    totalAmountInput.addEventListener('input', (e) => {
        state.totalAmount = parseFloat(e.target.value) || 0;
        updateFinalAmount();
        updateSummary();
    });

    discountedAmountInput.addEventListener('input', (e) => {
        state.discountedAmount = parseFloat(e.target.value) || 0;
        updateFinalAmount();
        updateSummary();
    });

    cashbackInput.addEventListener('input', (e) => {
        state.cashback = e.target.value;
        updateFinalAmount();
        updateSummary();
    });

    // Person form listeners
    addPersonBtn.addEventListener('click', () => {
        addPersonForm.style.display = 'flex';
        newPersonNameInput.focus();
    });

    confirmAddPersonBtn.addEventListener('click', addPerson);
    cancelAddPersonBtn.addEventListener('click', () => {
        addPersonForm.style.display = 'none';
        newPersonNameInput.value = '';
    });

    newPersonNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPerson();
    });

    // Dish form listeners
    addDishBtn.addEventListener('click', () => {
        addDishForm.style.display = 'flex';
        newDishNameInput.focus();
    });

    confirmAddDishBtn.addEventListener('click', addDish);
    cancelAddDishBtn.addEventListener('click', () => {
        addDishForm.style.display = 'none';
        newDishNameInput.value = '';
        newDishPriceInput.value = '';
    });

    newDishPriceInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addDish();
    });

    // Copy button
    copyBtn.addEventListener('click', copySummary);

    // Modal listeners
    closeModalBtn.addEventListener('click', closeModal);
    modalDoneBtn.addEventListener('click', closeModal);
    assignModal.addEventListener('click', (e) => {
        if (e.target === assignModal) closeModal();
    });
}

// Calculate final amount after cashback
function calculateFinalAmount() {
    const discounted = state.discountedAmount;
    const cashback = state.cashback.trim();

    if (!cashback || cashback === '0') {
        return discounted;
    }

    if (cashback.endsWith('%')) {
        const percentage = parseFloat(cashback.slice(0, -1)) || 0;
        return Math.round((1 - percentage / 100) * discounted);
    } else {
        return Math.round(discounted - (parseFloat(cashback) || 0));
    }
}

function updateFinalAmount() {
    const final = calculateFinalAmount();
    finalAmountSpan.textContent = `Final Amount: ₹${final}`;
}

// Add person
function addPerson() {
    const name = newPersonNameInput.value.trim();
    if (!name) {
        showToast('Please enter a name');
        return;
    }

    const person = {
        id: nextPersonId++,
        name: name
    };

    state.people.push(person);
    state.assignments[person.id] = [];

    newPersonNameInput.value = '';
    addPersonForm.style.display = 'none';

    renderPeople();
    renderAssignments();
    updateSummary();
}

// Remove person
function removePerson(personId) {
    state.people = state.people.filter(p => p.id !== personId);
    delete state.assignments[personId];

    renderPeople();
    renderAssignments();
    updateDishAssignmentInfo();
    updateSummary();
}

// Render people list
function renderPeople() {
    if (state.people.length === 0) {
        peopleList.innerHTML = '<p class="empty-state">No people added yet</p>';
        return;
    }

    peopleList.innerHTML = state.people.map(person => `
        <div class="person-item">
            <span>
                <span class="person-name">${escapeHtml(person.name)}</span>
                <span class="person-id">#${person.id}</span>
            </span>
            <button class="btn btn-danger" onclick="removePerson(${person.id})">✕</button>
        </div>
    `).join('');
}

// Add dish
function addDish() {
    const name = newDishNameInput.value.trim();
    const price = parseFloat(newDishPriceInput.value) || 0;

    if (!name) {
        showToast('Please enter a dish name');
        return;
    }

    if (price <= 0) {
        showToast('Please enter a valid price');
        return;
    }

    const dish = {
        id: nextDishId++,
        name: name,
        price: price
    };

    state.dishes.push(dish);

    newDishNameInput.value = '';
    newDishPriceInput.value = '';
    addDishForm.style.display = 'none';

    renderDishes();
    updateDishesTotal();
    updateSummary();
}

// Remove dish
function removeDish(dishId) {
    state.dishes = state.dishes.filter(d => d.id !== dishId);
    
    // Remove from all assignments
    for (const personId in state.assignments) {
        state.assignments[personId] = state.assignments[personId].filter(id => id !== dishId);
    }

    renderDishes();
    renderAssignments();
    updateDishesTotal();
    updateSummary();
}

// Get people who share a dish
function getDishSharedBy(dishId) {
    const sharedBy = [];
    for (const personId in state.assignments) {
        if (state.assignments[personId].includes(dishId)) {
            const person = state.people.find(p => p.id === parseInt(personId));
            if (person) sharedBy.push(person.name);
        }
    }
    return sharedBy;
}

// Render dishes list
function renderDishes() {
    if (state.dishes.length === 0) {
        dishesList.innerHTML = '<p class="empty-state">No dishes added yet</p>';
        return;
    }

    dishesList.innerHTML = state.dishes.map(dish => {
        const sharedBy = getDishSharedBy(dish.id);
        const assignedText = sharedBy.length > 0 
            ? `Assigned to: ${sharedBy.join(', ')}` 
            : '';
        const isSelected = selectedDishId === dish.id;

        return `
            <div class="dish-item ${isSelected ? 'selected' : ''}" draggable="true" data-dish-id="${dish.id}">
                <div class="dish-info">
                    <span class="dish-name">${escapeHtml(dish.name)}</span>
                    <span class="dish-price">₹${dish.price}</span>
                    ${assignedText ? `<span class="dish-assigned">${assignedText}</span>` : ''}
                </div>
                <button class="btn btn-danger" onclick="event.stopPropagation(); removeDish(${dish.id})">✕</button>
            </div>
        `;
    }).join('');

    // Add drag and click listeners
    document.querySelectorAll('.dish-item').forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('click', handleDishClick);
    });
}

function updateDishAssignmentInfo() {
    renderDishes();
}

// Update dishes total
function updateDishesTotal() {
    const total = state.dishes.reduce((sum, dish) => sum + dish.price, 0);
    dishesTotalSpan.textContent = `₹${total}`;
}

// Render assignment zones
function renderAssignments() {
    if (state.people.length === 0) {
        assignmentsGrid.innerHTML = '<p class="empty-state">Add people to see assignment zones</p>';
        return;
    }

    assignmentsGrid.innerHTML = state.people.map(person => {
        const assignedDishIds = state.assignments[person.id] || [];
        const personTotal = calculatePersonTotal(person.id);

        return `
            <div class="assignment-zone" data-person-id="${person.id}">
                <div class="zone-header">
                    <span class="zone-name">${escapeHtml(person.name)}</span>
                    <span class="zone-total">₹${personTotal.toFixed(2)}</span>
                </div>
                <div class="assigned-dishes">
                    ${assignedDishIds.length === 0 
                        ? '<p class="zone-empty">Drop dishes here</p>'
                        : assignedDishIds.map(dishId => {
                            const dish = state.dishes.find(d => d.id === dishId);
                            if (!dish) return '';
                            const sharedCount = countDishShares(dishId);
                            const shareAmount = (dish.price / sharedCount).toFixed(2);
                            return `
                                <div class="assigned-dish">
                                    <div class="dish-details">
                                        <span>${escapeHtml(dish.name)} - ₹${shareAmount}</span>
                                        ${sharedCount > 1 ? `<span class="shared-info">Shared by ${sharedCount} (₹${dish.price}/${sharedCount})</span>` : ''}
                                    </div>
                                    <button class="remove-btn" onclick="unassignDish(${person.id}, ${dishId})">✕</button>
                                </div>
                            `;
                        }).join('')
                    }
                </div>
            </div>
        `;
    }).join('');

    // Add drop listeners
    document.querySelectorAll('.assignment-zone').forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });
}

// Count how many people share a dish
function countDishShares(dishId) {
    let count = 0;
    for (const personId in state.assignments) {
        if (state.assignments[personId].includes(dishId)) {
            count++;
        }
    }
    return Math.max(count, 1);
}

// Calculate person's total
function calculatePersonTotal(personId) {
    const assignedDishIds = state.assignments[personId] || [];
    let total = 0;

    for (const dishId of assignedDishIds) {
        const dish = state.dishes.find(d => d.id === dishId);
        if (dish) {
            const sharedCount = countDishShares(dishId);
            total += dish.price / sharedCount;
        }
    }

    return total;
}

// Unassign dish from person
function unassignDish(personId, dishId) {
    state.assignments[personId] = state.assignments[personId].filter(id => id !== dishId);
    renderAssignments();
    updateDishAssignmentInfo();
    updateSummary();
}

// Drag and drop handlers
let draggedDishId = null;

function handleDragStart(e) {
    draggedDishId = parseInt(e.target.dataset.dishId);
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'copy';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedDishId = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const personId = parseInt(e.currentTarget.dataset.personId);
    
    if (draggedDishId && personId) {
        // Check if already assigned
        if (!state.assignments[personId].includes(draggedDishId)) {
            state.assignments[personId].push(draggedDishId);
            renderAssignments();
            updateDishAssignmentInfo();
            updateSummary();
            showToast('Dish assigned!');
        } else {
            showToast('Dish already assigned to this person');
        }
    }
}

// Handle dish click for mobile tap-to-assign
function handleDishClick(e) {
    // Don't trigger on button clicks
    if (e.target.closest('.btn')) return;
    
    const dishId = parseInt(e.currentTarget.dataset.dishId);
    const dish = state.dishes.find(d => d.id === dishId);
    
    if (!dish) return;
    
    if (state.people.length === 0) {
        showToast('Add people first!');
        return;
    }
    
    // Open modal
    openAssignModal(dish);
}

// Open assignment modal
function openAssignModal(dish) {
    selectedDishId = dish.id;
    modalDishName.textContent = `${dish.name} - ₹${dish.price}`;
    
    // Render people checkboxes
    modalPeople.innerHTML = state.people.map(person => {
        const isAssigned = state.assignments[person.id]?.includes(dish.id);
        return `
            <div class="modal-person ${isAssigned ? 'selected' : ''}" data-person-id="${person.id}">
                <div class="checkbox">${isAssigned ? '✓' : ''}</div>
                <span class="person-label">${escapeHtml(person.name)}</span>
            </div>
        `;
    }).join('');
    
    // Add click listeners to modal people
    document.querySelectorAll('.modal-person').forEach(item => {
        item.addEventListener('click', handleModalPersonClick);
    });
    
    assignModal.classList.add('show');
    renderDishes(); // Update selection state
}

// Handle modal person click
function handleModalPersonClick(e) {
    const personId = parseInt(e.currentTarget.dataset.personId);
    
    if (!selectedDishId || !personId) return;
    
    const isAssigned = state.assignments[personId]?.includes(selectedDishId);
    
    if (isAssigned) {
        // Unassign
        state.assignments[personId] = state.assignments[personId].filter(id => id !== selectedDishId);
        e.currentTarget.classList.remove('selected');
        e.currentTarget.querySelector('.checkbox').textContent = '';
    } else {
        // Assign
        if (!state.assignments[personId]) {
            state.assignments[personId] = [];
        }
        state.assignments[personId].push(selectedDishId);
        e.currentTarget.classList.add('selected');
        e.currentTarget.querySelector('.checkbox').textContent = '✓';
    }
    
    renderAssignments();
    updateDishAssignmentInfo();
    updateSummary();
}

// Close modal
function closeModal() {
    assignModal.classList.remove('show');
    selectedDishId = null;
    renderDishes(); // Clear selection state
}

// Update summary
function updateSummary() {
    const dishesTotal = state.dishes.reduce((sum, dish) => sum + dish.price, 0);
    const finalAmount = calculateFinalAmount();

    if (state.people.length === 0) {
        summaryContent.innerHTML = '<p class="empty-state">Add people and assign dishes to see the summary</p>';
        return;
    }

    let html = '';

    // Restaurant name
    if (state.restaurantName) {
        html += `<div class="summary-restaurant">🍽️ ${escapeHtml(state.restaurantName)}</div>`;
    }

    // Totals
    html += `
        <div class="summary-totals">
            <span>📊 Total: ₹${state.totalAmount}</span>
            <span>💳 Discounted: ₹${state.discountedAmount}</span>
            ${state.cashback && state.cashback !== '0' ? `<span>🎁 Cashback: ${state.cashback}</span>` : ''}
            <span>💰 Final: ₹${finalAmount}</span>
            <span>🍕 Dishes Total: ₹${dishesTotal}</span>
        </div>
    `;

    // Per person
    for (const person of state.people) {
        const assignedDishIds = state.assignments[person.id] || [];
        const personTotal = calculatePersonTotal(person.id);
        const percentage = dishesTotal > 0 ? (personTotal / dishesTotal * 100) : 0;
        const personFinal = dishesTotal > 0 ? Math.round((personTotal / dishesTotal) * finalAmount) : 0;

        const dishItems = assignedDishIds.map(dishId => {
            const dish = state.dishes.find(d => d.id === dishId);
            if (!dish) return null;
            const sharedCount = countDishShares(dishId);
            const shareAmount = (dish.price / sharedCount).toFixed(2);
            return {
                name: dish.name,
                amount: shareAmount,
                shared: sharedCount > 1 ? sharedCount : null
            };
        }).filter(Boolean);

        const dishesHtml = dishItems.length > 0 
            ? dishItems.map(d => 
                d.shared 
                    ? `<span class="dish-chip">₹${d.amount} <small>(${d.name} ÷${d.shared})</small></span>`
                    : `<span class="dish-chip">₹${d.amount} <small>(${d.name})</small></span>`
            ).join(' + ')
            : '<span class="no-dishes">No dishes assigned</span>';

        html += `
            <div class="summary-person">
                <div class="summary-person-name">${escapeHtml(person.name)}</div>
                <div class="summary-person-dishes">${dishesHtml}</div>
                <div class="summary-person-total">
                    <span>Subtotal: ₹${personTotal.toFixed(2)} (${percentage.toFixed(1)}%)</span>
                    <span class="summary-person-final">Pay: ₹${personFinal}</span>
                </div>
            </div>
        `;
    }

    summaryContent.innerHTML = html;
}

// Copy summary to clipboard
function copySummary() {
    const dishesTotal = state.dishes.reduce((sum, dish) => sum + dish.price, 0);
    const finalAmount = calculateFinalAmount();

    let text = '';

    if (state.restaurantName) {
        text += `*${state.restaurantName}*\n`;
    }

    text += `Total Amount: ${state.totalAmount}\n`;
    text += `Discounted Amount: ${state.discountedAmount}\n`;

    if (state.cashback && state.cashback !== '0') {
        text += `Cashback: ${state.cashback}\n`;
        text += `Discounted Amount After Cashback: ${finalAmount}\n`;
    }

    text += '\n';

    for (const person of state.people) {
        const assignedDishIds = state.assignments[person.id] || [];
        const personTotal = calculatePersonTotal(person.id);
        const percentage = dishesTotal > 0 ? (personTotal / dishesTotal * 100) : 0;
        const personFinal = dishesTotal > 0 ? Math.round((personTotal / dishesTotal) * finalAmount) : 0;

        const dishesText = assignedDishIds.map(dishId => {
            const dish = state.dishes.find(d => d.id === dishId);
            if (!dish) return '';
            const sharedCount = countDishShares(dishId);
            const shareAmount = (dish.price / sharedCount).toFixed(2);
            if (sharedCount > 1) {
                return `${shareAmount} (${dish.name}) (/${sharedCount})`;
            }
            return `${shareAmount} (${dish.name})`;
        }).filter(Boolean).join(' + ');

        text += `*${person.name}*: ${dishesText || 'No dishes'} = ${personTotal.toFixed(2)} => ${percentage.toFixed(2)}% ~ *${personFinal}*\n`;
    }

    navigator.clipboard.writeText(text).then(() => {
        showToast('Summary copied to clipboard!');
    }).catch(() => {
        showToast('Failed to copy');
    });
}

// Show toast notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize the app
init();
