/* =========================================================
   WINNER CHAPEL COCOTOMEY
   SYSTÈME D'ÉVANGÉLISATION
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const USERS_KEY = "evangelisationUsers";
const PEOPLE_KEY = "evangelisationPeople";
const CURRENT_USER_KEY = "evangelisationCurrentUser";


/* =========================================================
   OUTILS LOCALSTORAGE
   ========================================================= */

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch (error) {
        console.error("Erreur utilisateurs :", error);
        return [];
    }
}


function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}


function getPeople() {
    try {
        return JSON.parse(localStorage.getItem(PEOPLE_KEY)) || [];
    } catch (error) {
        console.error("Erreur personnes :", error);
        return [];
    }
}


function savePeople(people) {
    localStorage.setItem(PEOPLE_KEY, JSON.stringify(people));
}


function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    } catch (error) {
        return null;
    }
}


function setCurrentUser(user) {
    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(user)
    );
}


function removeCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}


/* =========================================================
   ID UNIQUE
   ========================================================= */

function generateId() {
    return Date.now().toString() + Math.random()
        .toString(36)
        .substring(2, 9);
}


/* =========================================================
   PROTECTION CONTRE HTML
   ========================================================= */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   ANNÉE FOOTER
   ========================================================= */

function updateFooterYear() {

    const year = document.getElementById("currentYear");

    if (year) {
        year.textContent = new Date().getFullYear();
    }
}


/* =========================================================
   MENU MOBILE
   ========================================================= */

function initMobileMenu() {

    const menuButton = document.getElementById("mobileMenuButton");
    const nav = document.querySelector(".main-nav");

    if (!menuButton || !nav) {
        return;
    }

    menuButton.addEventListener("click", function () {
        nav.classList.toggle("mobile-open");
    });

    nav.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {
            nav.classList.remove("mobile-open");
        });

    });
}


/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(element, message, type = "success") {

    if (!element) {
        return;
    }

    element.textContent = message;
    element.className = "form-message " + type;
    element.style.display = "block";
}


function hideMessage(element) {

    if (!element) {
        return;
    }

    element.style.display = "none";
}


/* =========================================================
   INSCRIPTION
   ========================================================= */

function initRegister() {

    const form = document.getElementById("registerForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const firstName =
            document.getElementById("registerFirstName").value.trim();

        const lastName =
            document.getElementById("registerLastName").value.trim();

        const phone =
            document.getElementById("registerPhone").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const username =
            document.getElementById("registerUsername").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const passwordConfirm =
            document.getElementById("registerPasswordConfirm").value;

        const message =
            document.getElementById("registerMessage");

        hideMessage(message);


        if (!firstName || !lastName || !phone ||
            !email || !username || !password) {

            showMessage(
                message,
                "Veuillez remplir tous les champs.",
                "error"
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                message,
                "Le mot de passe doit contenir au moins 6 caractères.",
                "error"
            );

            return;
        }


        if (password !== passwordConfirm) {

            showMessage(
                message,
                "Les deux mots de passe ne correspondent pas.",
                "error"
            );

            return;
        }


        const users = getUsers();


        const usernameExists = users.some(function (user) {

            return user.username.toLowerCase() ===
                username.toLowerCase();

        });


        if (usernameExists) {

            showMessage(
                message,
                "Ce nom d'utilisateur existe déjà.",
                "error"
            );

            return;
        }


        const emailExists = users.some(function (user) {

            return user.email.toLowerCase() ===
                email.toLowerCase();

        });


        if (emailExists) {

            showMessage(
                message,
                "Cette adresse email est déjà utilisée.",
                "error"
            );

            return;
        }


        const newUser = {

            id: generateId(),

            firstName: firstName,

            lastName: lastName,

            phone: phone,

            email: email,

            username: username,

            password: password,

            role: "evangeliste",

            createdAt: new Date().toISOString()

        };


        users.push(newUser);

        saveUsers(users);


        showMessage(
            message,
            "Compte créé avec succès ! Redirection vers la connexion...",
            "success"
        );


        form.reset();


        setTimeout(function () {

            window.location.href = "login.html";

        }, 1500);

    });
}


/* =========================================================
   CONNEXION
   ========================================================= */

function initLogin() {

    const form = document.getElementById("loginForm");

    if (!form) {
        return;
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;


        const message =
            document.getElementById("loginError");


        hideMessage(message);


        const users = getUsers();


        const user = users.find(function (item) {

            return item.username.toLowerCase() ===
                username.toLowerCase() &&
                item.password === password;

        });


        if (!user) {

            showMessage(
                message,
                "Nom d'utilisateur ou mot de passe incorrect.",
                "error"
            );

            return;
        }


        setCurrentUser({

            id: user.id,

            firstName: user.firstName,

            lastName: user.lastName,

            phone: user.phone,

            email: user.email,

            username: user.username,

            role: user.role

        });


        window.location.href = "dashboard.html";

    });
}


/* =========================================================
   PROTECTION DASHBOARD
   ========================================================= */

function protectDashboard() {

    const dashboard =
        document.getElementById("dashboardPage");

    if (!dashboard) {
        return true;
    }


    const currentUser = getCurrentUser();


    if (!currentUser) {

        window.location.href = "login.html";

        return false;
    }


    return true;
}


/* =========================================================
   AFFICHAGE PROFIL
   ========================================================= */

function displayCurrentUser() {

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }


    const welcome =
        document.getElementById("welcomeUser");

    if (welcome) {

        welcome.textContent =
            "Bienvenue " +
            currentUser.firstName +
            " " +
            currentUser.lastName +
            " 👋";

    }


    document.querySelectorAll(".current-user-name")
        .forEach(function (element) {

            element.textContent =
                currentUser.firstName +
                " " +
                currentUser.lastName;

        });


    document.querySelectorAll(".current-username")
        .forEach(function (element) {

            element.textContent =
                "@" + currentUser.username;

        });


    const evangelistInput =
        document.getElementById("evangelist");


    if (evangelistInput) {

        evangelistInput.value =
            currentUser.firstName +
            " " +
            currentUser.lastName;

    }

}


/* =========================================================
   DÉCONNEXION
   ========================================================= */

function initLogout() {

    const button =
        document.getElementById("logoutButton");

    if (!button) {
        return;
    }


    button.addEventListener("click", function () {

        const confirmLogout =
            confirm("Voulez-vous vraiment vous déconnecter ?");


        if (!confirmLogout) {
            return;
        }


        removeCurrentUser();

        window.location.href = "login.html";

    });
}


/* =========================================================
   FORMULAIRE ÉVANGÉLISATION
   ========================================================= */

function initEvangelisationForm() {

    const form =
        document.getElementById("evangelisationForm");

    if (!form) {
        return;
    }


    const currentUser = getCurrentUser();


    if (!currentUser) {
        return;
    }


    const meetingDate =
        document.getElementById("meetingDate");


    if (meetingDate && !meetingDate.value) {

        const today =
            new Date().toISOString().split("T")[0];

        meetingDate.value = today;

    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const editId =
            document.getElementById("editId").value;


        const person = {

            firstName:
                document.getElementById("firstName").value.trim(),

            lastName:
                document.getElementById("lastName").value.trim(),

            phone:
                document.getElementById("phone").value.trim(),

            gender:
                document.getElementById("gender").value,

            age:
                document.getElementById("age").value,

            neighborhood:
                document.getElementById("neighborhood").value.trim(),

            meetingDate:
                document.getElementById("meetingDate").value,

            meetingPlace:
                document.getElementById("meetingPlace").value.trim(),

            evangelist:
                currentUser.firstName +
                " " +
                currentUser.lastName,

            evangelistId:
                currentUser.id,

            acceptedJesus:
                document.getElementById("acceptedJesus").value,

            attendedChurch:
                document.getElementById("attendedChurch").value,

            followUp:
                document.getElementById("followUp").value,

            status:
                document.getElementById("status").value,

            notes:
                document.getElementById("notes").value.trim()

        };


        if (!person.firstName || !person.phone) {

            showMessage(
                document.getElementById("formMessage"),
                "Le prénom et le téléphone sont obligatoires.",
                "error"
            );

            return;
        }


        let people = getPeople();


        /* ================= MODIFICATION ================= */

        if (editId) {

            const index =
                people.findIndex(function (item) {

                    return item.id === editId;

                });


            if (index !== -1) {

                people[index] = {

                    ...people[index],

                    ...person,

                    updatedAt:
                        new Date().toISOString()

                };

            }


            savePeople(people);


            showMessage(
                document.getElementById("formMessage"),
                "La personne a été modifiée avec succès.",
                "success"
            );

        }


        /* ================= NOUVELLE PERSONNE ================= */

        else {

            const newPerson = {

                id: generateId(),

                ...person,

                createdAt:
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()

            };


            people.push(newPerson);

            savePeople(people);


            showMessage(
                document.getElementById("formMessage"),
                "Personne enregistrée avec succès.",
                "success"
            );

        }


        resetPersonForm();

        displayPeople();

        updateStatistics();

    });

}


/* =========================================================
   RESET FORMULAIRE
   ========================================================= */

function resetPersonForm() {

    const form =
        document.getElementById("evangelisationForm");

    if (!form) {
        return;
    }


    form.reset();


    document.getElementById("editId").value = "";


    const currentUser = getCurrentUser();


    if (currentUser) {

        document.getElementById("evangelist").value =
            currentUser.firstName +
            " " +
            currentUser.lastName;

    }


    const today =
        new Date().toISOString().split("T")[0];


    document.getElementById("meetingDate").value =
        today;


    const button =
        document.getElementById("savePersonButton");


    if (button) {

        button.innerHTML =
            "➕ Enregistrer la personne";

    }


    const cancelButton =
        document.getElementById("cancelEditButton");


    if (cancelButton) {

        cancelButton.style.display = "none";

    }

}


/* =========================================================
   ANNULER MODIFICATION
   ========================================================= */

function initCancelEdit() {

    const button =
        document.getElementById("cancelEditButton");

    if (!button) {
        return;
    }


    button.addEventListener("click", function () {

        resetPersonForm();


        const message =
            document.getElementById("formMessage");

        hideMessage(message);

    });

}


/* =========================================================
   AFFICHER LES PERSONNES
   ========================================================= */

function displayPeople() {

    const list =
        document.getElementById("peopleList");

    if (!list) {
        return;
    }


    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }


    const searchInput =
        document.getElementById("searchPeople");


    const filterSelect =
        document.getElementById("filterStatus");


    const search =
        searchInput ?
        searchInput.value.toLowerCase().trim() :
        "";


    const filter =
        filterSelect ?
        filterSelect.value :
        "all";


    let people = getPeople();


    /* ================= RECHERCHE ================= */

    if (search) {

        people = people.filter(function (person) {

            const text = (

                (person.firstName || "") +
                " " +
                (person.lastName || "") +
                " " +
                (person.phone || "") +
                " " +
                (person.neighborhood || "") +
                " " +
                (person.evangelist || "")

            ).toLowerCase();


            return text.includes(search);

        });

    }


    /* ================= FILTRE ================= */

    if (filter !== "all") {

        people = people.filter(function (person) {

            return person.status === filter;

        });

    }


    /* ================= AUCUN RÉSULTAT ================= */

    if (people.length === 0) {

        list.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    👥
                </div>

                <h3>
                    Aucune personne trouvée
                </h3>

                <p>
                    Aucune personne ne correspond à votre recherche.
                </p>

            </div>

        `;

        return;

    }


    /* ================= AFFICHAGE ================= */

    list.innerHTML = people
        .sort(function (a, b) {

            return new Date(b.createdAt) -
                new Date(a.createdAt);

        })
        .map(createPersonCard)
        .join("");


    attachPersonButtons();

}


/* =========================================================
   CARTE PERSONNE
   ========================================================= */

function createPersonCard(person) {

    const fullName =
        (
            person.firstName +
            " " +
            (person.lastName || "")
        ).trim();


    const statusClass =
        getStatusClass(person.status);


    return `

        <article class="person-card">

            <div class="person-card-header">

                <div>

                    <h3>
                        ${escapeHTML(fullName)}
                    </h3>

                    <p>
                        📞 ${escapeHTML(person.phone || "Non renseigné")}
                    </p>

                </div>


                <span class="person-status ${statusClass}">
                    ${escapeHTML(person.status || "Nouveau")}
                </span>

            </div>


            <div class="person-card-body">

                <div class="person-info">

                    <div>
                        <strong>📍 Quartier</strong>
                        <span>
                            ${escapeHTML(person.neighborhood || "Non renseigné")}
                        </span>
                    </div>


                    <div>
                        <strong>📅 Rencontre</strong>
                        <span>
                            ${escapeHTML(formatDate(person.meetingDate))}
                        </span>
                    </div>


                    <div>
                        <strong>👤 Évangéliste</strong>
                        <span>
                            ${escapeHTML(person.evangelist || "Non renseigné")}
                        </span>
                    </div>


                    <div>
                        <strong>✝ Jésus</strong>
                        <span>
                            ${escapeHTML(person.acceptedJesus || "Non renseigné")}
                        </span>
                    </div>


                    <div>
                        <strong>⛪ Église</strong>
                        <span>
                            ${escapeHTML(person.attendedChurch || "Non renseigné")}
                        </span>
                    </div>


                    <div>
                        <strong>📞 Suivi</strong>
                        <span>
                            ${escapeHTML(person.followUp || "Non renseigné")}
                        </span>
                    </div>

                </div>


                ${
                    person.notes
                    ?
                    `
                    <div class="person-notes">

                        <strong>📝 Notes</strong>

                        <p>
                            ${escapeHTML(person.notes)}
                        </p>

                    </div>
                    `
                    :
                    ""
                }


                <div class="person-card-actions">

                    <button
                        type="button"
                        class="btn btn-small btn-edit"
                        data-id="${person.id}">

                        ✏️ Modifier

                    </button>


                    <button
                        type="button"
                        class="btn btn-small btn-danger btn-delete"
                        data-id="${person.id}">

                        🗑️ Supprimer

                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   CLASSE STATUT
   ========================================================= */

function getStatusClass(status) {

    switch (status) {

        case "À contacter":
            return "status-contact";

        case "Contacté":
            return "status-contacted";

        case "Invité":
            return "status-invited";

        case "Venu au culte":
            return "status-church";

        case "Intégré":
            return "status-integrated";

        default:
            return "status-new";

    }

}


/* =========================================================
   DATE
   ========================================================= */

function formatDate(date) {

    if (!date) {
        return "Non renseignée";
    }


    const parts = date.split("-");


    if (parts.length !== 3) {
        return date;
    }


    return parts[2] + "/" +
        parts[1] + "/" +
        parts[0];

}


/* =========================================================
   BOUTONS PERSONNES
   ========================================================= */

function attachPersonButtons() {

    document.querySelectorAll(".btn-edit")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                editPerson(button.dataset.id);

            });

        });


    document.querySelectorAll(".btn-delete")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                deletePerson(button.dataset.id);

            });

        });

}


/* =========================================================
   MODIFIER PERSONNE
   ========================================================= */

function editPerson(id) {

    const people = getPeople();


    const person =
        people.find(function (item) {

            return item.id === id;

        });


    if (!person) {
        return;
    }


    document.getElementById("editId").value =
        person.id;


    document.getElementById("firstName").value =
        person.firstName || "";


    document.getElementById("lastName").value =
        person.lastName || "";


    document.getElementById("phone").value =
        person.phone || "";


    document.getElementById("gender").value =
        person.gender || "";


    document.getElementById("age").value =
        person.age || "";


    document.getElementById("neighborhood").value =
        person.neighborhood || "";


    document.getElementById("meetingDate").value =
        person.meetingDate || "";


    document.getElementById("meetingPlace").value =
        person.meetingPlace || "";


    document.getElementById("evangelist").value =
        person.evangelist || "";


    document.getElementById("acceptedJesus").value =
        person.acceptedJesus || "";


    document.getElementById("attendedChurch").value =
        person.attendedChurch || "";


    document.getElementById("followUp").value =
        person.followUp || "";


    document.getElementById("status").value =
        person.status || "Nouveau";


    document.getElementById("notes").value =
        person.notes || "";


    const button =
        document.getElementById("savePersonButton");


    if (button) {

        button.innerHTML =
            "💾 Enregistrer les modifications";

    }


    const cancelButton =
        document.getElementById("cancelEditButton");


    if (cancelButton) {

        cancelButton.style.display =
            "inline-flex";

    }


    document.querySelector(
        ".evangelisation-management"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================================================
   SUPPRIMER PERSONNE
   ========================================================= */

function deletePerson(id) {

    const people = getPeople();


    const person =
        people.find(function (item) {

            return item.id === id;

        });


    if (!person) {
        return;
    }


    const name =
        (
            person.firstName +
            " " +
            (person.lastName || "")
        ).trim();


    const confirmation =
        confirm(
            "Voulez-vous vraiment supprimer " +
            name +
            " ?"
        );


    if (!confirmation) {
        return;
    }


    const updatedPeople =
        people.filter(function (item) {

            return item.id !== id;

        });


    savePeople(updatedPeople);


    displayPeople();

    updateStatistics();

}


/* =========================================================
   RECHERCHE
   ========================================================= */

function initPeopleSearch() {

    const search =
        document.getElementById("searchPeople");

    const filter =
        document.getElementById("filterStatus");


    if (search) {

        search.addEventListener(
            "input",
            displayPeople
        );

    }


    if (filter) {

        filter.addEventListener(
            "change",
            displayPeople
        );

    }

}


/* =========================================================
   STATISTIQUES
   ========================================================= */

function updateStatistics() {

    const people = getPeople();


    const total =
        people.length;


    const newPeople =
        people.filter(function (person) {

            return person.status === "Nouveau";

        }).length;


    const toContact =
        people.filter(function (person) {

            return person.status === "À contacter";

        }).length;


    const integrated =
        people.filter(function (person) {

            return person.status === "Intégré";

        }).length;


    const totalElement =
        document.getElementById("totalPeople");


    const newElement =
        document.getElementById("newPeople");


    const contactElement =
        document.getElementById("toContactPeople");


    const integratedElement =
        document.getElementById("integratedPeople");


    if (totalElement) {
        totalElement.textContent = total;
    }


    if (newElement) {
        newElement.textContent = newPeople;
    }


    if (contactElement) {
        contactElement.textContent = toContact;
    }


    if (integratedElement) {
        integratedElement.textContent = integrated;
    }

}


/* =========================================================
   INITIALISATION DASHBOARD
   ========================================================= */

function initDashboard() {

    const dashboard =
        document.getElementById("dashboardPage");


    if (!dashboard) {
        return;
    }


    if (!protectDashboard()) {
        return;
    }


    displayCurrentUser();

    initLogout();

    initEvangelisationForm();

    initCancelEdit();

    initPeopleSearch();

    displayPeople();

    updateStatistics();

}


/* =========================================================
   INITIALISATION GÉNÉRALE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    updateFooterYear();

    initMobileMenu();

    initRegister();

    initLogin();

    initDashboard();

});