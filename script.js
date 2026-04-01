const fileInput = document.getElementById("fileInput");

let originalData = [];
let barChart, lineChart, pieChart;

fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            originalData = results.data;

            populateFilter(originalData);
            updateDashboard(originalData);
        }
    });
});

/* FILTER DROPDOWN */
function populateFilter(data) {
    const filter = document.getElementById("categoryFilter");
    filter.innerHTML = `<option value="All">All Categories</option>`;

    const categories = [...new Set(data.map(d => d["Category"]))];

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.text = cat;
        filter.appendChild(option);
    });
}

/* FILTER EVENT */
document.getElementById("categoryFilter").addEventListener("change", function () {
    const selected = this.value;

    if (selected === "All") {
        updateDashboard(originalData);
    } else {
        const filtered = originalData.filter(d => d["Category"] === selected);
        updateDashboard(filtered);
    }
});

/* MAIN UPDATE */
function updateDashboard(data) {
    displayTable(data);
    calculateMetrics(data);
    createBarChart(data);
    createLineChart(data);
    createPieChart(data);
}

/* TABLE */
function displayTable(data) {
    const head = document.querySelector("#dataTable thead");
    const body = document.querySelector("#dataTable tbody");

    head.innerHTML = "";
    body.innerHTML = "";

    const headers = Object.keys(data[0]);

    head.innerHTML = "<tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr>";

    data.forEach(row => {
        body.innerHTML += "<tr>" + headers.map(h => `<td>${row[h]}</td>`).join("") + "</tr>";
    });
}

/* METRICS */
function calculateMetrics(data) {
    let sales = 0, profit = 0;

    data.forEach(row => {
        sales += Number(row["Sales"]);
        profit += Number(row["Profit"]);
    });

    document.getElementById("totalSales").innerText = sales;
    document.getElementById("totalOrders").innerText = data.length;
    document.getElementById("totalProfit").innerText = profit;
}

/* BAR */
function createBarChart(data) {
    const map = {};

    data.forEach(r => {
        map[r["Category"]] = (map[r["Category"]] || 0) + Number(r["Sales"]);
    });

    if (barChart) barChart.destroy();

    barChart = new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: {
            labels: Object.keys(map),
            datasets: [{ data: Object.values(map) }]
        }
    });
}

/* LINE */
function createLineChart(data) {
    const map = {};

    data.forEach(r => {
        const d = r["Order Date"];
        map[d] = (map[d] || 0) + Number(r["Sales"]);
    });

    if (lineChart) lineChart.destroy();

    lineChart = new Chart(document.getElementById("lineChart"), {
        type: "line",
        data: {
            labels: Object.keys(map),
            datasets: [{ data: Object.values(map), fill: false }]
        }
    });
}

/* PIE */
function createPieChart(data) {
    const map = {};

    data.forEach(r => {
        map[r["Category"]] = (map[r["Category"]] || 0) + Number(r["Sales"]);
    });

    if (pieChart) pieChart.destroy();

    pieChart = new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: Object.keys(map),
            datasets: [{ data: Object.values(map) }]
        }
    });
}