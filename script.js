
// ======================================
// ROOM MAINTENANCE MANAGEMENT SYSTEM
// ======================================

// Get data from Local Storage
function getData(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
}

// Save data in Local Storage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Get logged-in user
function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem("currentUser") || "null");
}

// Check login on protected pages
const page = window.location.pathname.split("/").pop();

if (page !== "login.html" && page !== "" && !getCurrentUser()) {
    window.location.replace("login.html");
}

// ======================================
// 1. LOGIN FUNCTION
// ======================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();

        if (!name || !email) {
            return;
        }

        const user = {
            name: name,
            email: email
        };

        sessionStorage.setItem("currentUser", JSON.stringify(user));

        document.getElementById("loginMessage").textContent =
            "Login successful!";

        window.location.href = "index.html";
    });
}

// ======================================
// 2. LOGOUT FUNCTION
// ======================================

function logout() {

    sessionStorage.removeItem("currentUser");

    window.location.href = "login.html";
}

// ======================================
// 3. HOME PAGE WELCOME MESSAGE
// ======================================

const welcomeUser = document.getElementById("welcomeUser");

if (welcomeUser) {

    const user = getCurrentUser();

    if (user) {
        welcomeUser.textContent = "Hello, " + user.name + "!";
    }
}

// ======================================
// 4. REPORT SUBMISSION
// ======================================

const reportForm = document.getElementById("reportForm");

if (reportForm) {

    const user = getCurrentUser();

    if (user) {
        document.getElementById("studentName").value = user.name;
    }

    reportForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const currentUser = getCurrentUser();

        const reports = getData("maintenanceReports");

        const report = {

            id: Date.now(),

            studentName:
                document.getElementById("studentName").value.trim(),

            email: currentUser.email,

            roomNumber:
                document.getElementById("roomNumber").value.trim(),

            category:
                document.getElementById("category").value,

            description:
                document.getElementById("description").value.trim(),

            date: new Date().toLocaleString(),

            status: "Pending"
        };

        reports.push(report);

        saveData("maintenanceReports", reports);

        document.getElementById("reportMessage").textContent =
            "Your maintenance report was submitted successfully!";

        reportForm.reset();

        document.getElementById("studentName").value =
            currentUser.name;

        displayReports();
    });

    displayReports();
}

// ======================================
// 5. DISPLAY SUBMITTED REPORTS
// ======================================

function displayReports() {

    const reportsList = document.getElementById("reportsList");

    if (!reportsList) return;

    const user = getCurrentUser();

    if (!user) return;

    const reports = getData("maintenanceReports");

    const myReports = reports.filter(function(report) {
        return report.email === user.email;
    });

    reportsList.replaceChildren();

    if (myReports.length === 0) {

        reportsList.textContent = "No maintenance reports submitted yet.";

        return;
    }

    myReports.slice().reverse().forEach(function(report) {

        const card = document.createElement("div");
        card.className = "report-item";

        const details = [
            ["Student", report.studentName],
            ["Room", report.roomNumber],
            ["Category", report.category],
            ["Description", report.description],
            ["Date", report.date],
            ["Status", report.status]
        ];

        details.forEach(function(detail) {

            const paragraph = document.createElement("p");

            const label = document.createElement("strong");
            label.textContent = detail[0] + ": ";

            paragraph.appendChild(label);
            paragraph.appendChild(
                document.createTextNode(detail[1])
            );

            card.appendChild(paragraph);
        });

        reportsList.appendChild(card);
    });
}

// ======================================
// 6. CONTACT FORM
// ======================================

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    const user = getCurrentUser();

    if (user) {
        document.getElementById("contactName").value = user.name;
        document.getElementById("contactEmail").value = user.email;
    }

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const messages = getData("contactMessages");

        const message = {

            id: Date.now(),

            name: document.getElementById("contactName").value.trim(),

            email: document.getElementById("contactEmail").value.trim(),

            subject: document.getElementById("subject").value.trim(),

            message: document.getElementById("contactMessage").value.trim(),

            date: new Date().toLocaleString()
        };

        messages.push(message);

        saveData("contactMessages", messages);

        document.getElementById("contactStatus").textContent =
            "Your message has been saved successfully!";

        contactForm.reset();

        if (user) {
            document.getElementById("contactName").value = user.name;
            document.getElementById("contactEmail").value = user.email;
        }
    });
}

// ======================================
// 7. DASHBOARD STATISTICS
// ======================================

function updateDashboard() {

    const total = document.getElementById("totalReports");

    if (!total) return;

    const reports = getData("maintenanceReports");

    const user = getCurrentUser();

    const myReports = user
        ? reports.filter(report => report.email === user.email)
        : [];

    const pending = myReports.filter(function(report) {
        return report.status === "Pending";
    });

    const completed = myReports.filter(function(report) {
        return report.status === "Completed";
    });

    total.textContent = myReports.length;

    document.getElementById("pendingReports").textContent =
        pending.length;

    document.getElementById("completedReports").textContent =
        completed.length;
}

// Update dashboard when home page opens
updateDashboard();
