let salary = 0;
    let expenses = [];
    let chart;

    function renderChart() {
      const ctx = document.getElementById('expense-chart');
      const data = {
        labels: expenses.map(e => e.name),
        datasets: [{
          label: 'Expenses',
          data: expenses.map(e => e.amount),
          backgroundColor: [
            '#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#f472b6'
          ]
        }]
      };
      if (chart) chart.destroy();
      chart = new Chart(ctx, { type: 'pie', data });
    }

    function renderExpenses() {
      const list = document.getElementById("expenses-list");
      list.innerHTML = "";
      let totalSpent = 0;

      expenses.forEach((exp, index) => {
        totalSpent += exp.amount;
        const div = document.createElement("div");
        div.className = "flex justify-between items-center border-b py-1";

        div.innerHTML = `
          <div>
            <strong>${exp.name}</strong> - Rs. ${exp.amount}
          </div>
          <div class="space-x-2">
            <button onclick="editExpense(${index})" class="text-blue-500 hover:underline text-sm">Edit</button>
            <button onclick="deleteExpense(${index})" class="text-red-500 hover:underline text-sm">Delete</button>
          </div>
        `;
        list.appendChild(div);
      });

      const remaining = salary - totalSpent;
      document.getElementById("remaining").innerText = `Remaining: Rs. ${remaining}`;
      renderChart();
    }

    function saveSalary() {
      const inputSalary = parseInt(document.getElementById("salary").value);
      if (!isNaN(inputSalary)) {
        salary = inputSalary;
        localStorage.setItem("salary", salary);
        localStorage.setItem("expenses", JSON.stringify([]));
        document.getElementById("budget-section").classList.add("hidden");
        document.getElementById("expense-section").classList.remove("hidden");
        expenses = [];
        renderExpenses();
      }
    }

    function addExpense() {
      const name = document.getElementById("expense-name").value;
      const amount = parseInt(document.getElementById("expense-amount").value);
      if (name && !isNaN(amount)) {
        expenses.push({ name, amount });
        localStorage.setItem("expenses", JSON.stringify(expenses));
        document.getElementById("expense-name").value = "";
        document.getElementById("expense-amount").value = "";
        renderExpenses();
      }
    }

    function newPlan() {
      if (confirm("Start a new plan? This will erase all current data.")) {
        localStorage.clear();
        window.location.reload();
      }
    }

    function downloadCSV() {
      const rows = [["Expense", "Amount"]];
      expenses.forEach(e => rows.push([e.name, e.amount]));
      let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", "budget_plan.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // Auto load from localStorage
    window.onload = function () {
      const storedSalary = localStorage.getItem("salary");
      const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

      if (storedSalary) {
        salary = parseInt(storedSalary);
        expenses = storedExpenses;
        document.getElementById("budget-section").classList.add("hidden");
        document.getElementById("expense-section").classList.remove("hidden");
        renderExpenses();
      }
    }

    function deleteExpense(index) {
      if (confirm("Are you sure you want to delete this expense?")) {
        expenses.splice(index, 1);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        renderExpenses();
      }
    }

    function editExpense(index) {
      const newName = prompt("Enter new expense name:", expenses[index].name);
      const newAmount = prompt("Enter new expense amount:", expenses[index].amount);

      if (newName && !isNaN(parseInt(newAmount))) {
        expenses[index].name = newName;
        expenses[index].amount = parseInt(newAmount);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        renderExpenses();
      }
    }