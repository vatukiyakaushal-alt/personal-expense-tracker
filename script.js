
// Get HTML Elements
const form = document.getElementById("transaction-form");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");

const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("expense");

const transactionList = document.getElementById("transaction-list");

// Load transactions from Local Storage
let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

// Create Pie Chart
const expenseChart = new Chart(
    document.getElementById("expenseChart"),
    {
        type: "pie",

        data: {
            labels: ["Income", "Expenses"],

            datasets: [{
                data: [0, 0],

                backgroundColor: [
                    "#16a34a",
                    "#dc2626"
                ],

                borderWidth: 2,
                borderColor: "#ffffff"
            }]
        },

        options: {
            responsive: true,

            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom"
                },

                title: {
                    display: true,
                    text: "Income vs Expenses"
                }
            }
        }
    }
);

// Add Transaction
form.addEventListener("submit", function(event) {

    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    // Validate Input
    if (
        description === "" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        alert("Please enter valid details.");
        return;
    }

    // Create Transaction Object
    const transaction = {

        id: Date.now(),

        description: description,

        amount: amount,

        type: type,

        date: new Date().toLocaleDateString("en-IN")

    };

    // Store Transaction
    transactions.push(transaction);

    // Update Website
    updateTracker();

    // Clear Form
    form.reset();

});

// Update Tracker
function updateTracker() {

    let totalIncome = 0;
    let totalExpense = 0;

    // Calculate Income and Expenses
    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {

            totalIncome += transaction.amount;

        } else {

            totalExpense += transaction.amount;

        }

    });

    // Calculate Balance
    const balance = totalIncome - totalExpense;

    // Display Amounts
    balanceDisplay.textContent = formatMoney(balance);

    incomeDisplay.textContent = formatMoney(totalIncome);

    expenseDisplay.textContent = formatMoney(totalExpense);

    // Update Pie Chart
    expenseChart.data.datasets[0].data = [
        totalIncome,
        totalExpense
    ];

    expenseChart.update();

    // Save Transactions in Local Storage
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    // Clear Old History
    transactionList.innerHTML = "";

    // Show Empty Message
    if (transactions.length === 0) {

        const emptyMessage = document.createElement("li");

        emptyMessage.textContent = "No transactions yet.";

        transactionList.appendChild(emptyMessage);

        return;
    }

    // Display Transaction History
    transactions.forEach(function(transaction) {

        const li = document.createElement("li");

        // Add Income or Expense Class
        if (transaction.type === "income") {

            li.className = "income-transaction";

        } else {

            li.className = "expense-transaction";

        }

        // Transaction Details
        const details = document.createElement("span");

        details.textContent =
            transaction.description +
            " - " +
            formatMoney(transaction.amount) +
            " (" +
            transaction.type +
            ") | Date: " +
            (transaction.date || "Earlier transaction");

        // Delete Button
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {

            deleteTransaction(transaction.id);

        });

        // Add Elements
        li.appendChild(details);

        li.appendChild(deleteButton);

        transactionList.appendChild(li);

    });

}

// Format Currency
function formatMoney(amount) {

    return amount.toLocaleString("en-IN", {

        style: "currency",

        currency: "INR"

    });

}

// Delete Transaction
function deleteTransaction(id) {

    transactions = transactions.filter(function(transaction) {

        return transaction.id !== id;

    });

    updateTracker();

}

// Load Saved Transactions
updateTracker();