const body = document.querySelector("body");
const burger = document.querySelector('.burger');

const workoutLink = document.querySelectorAll('.nav__link')[0];
const teacherLink = document.querySelectorAll('.nav__link')[1];
const atmosferaLink = document.querySelectorAll('.nav__link')[2];
const priceLink = document.querySelectorAll('.nav__link')[3];
const contactLink = document.querySelectorAll('.nav__link')[4];

const workoutLinkDropMenu = document.querySelectorAll('.dropdown__link')[0];
const teacherLinkDropMenu = document.querySelectorAll('.dropdown__link')[1];
const atmosferaLinkDropMenu = document.querySelectorAll('.dropdown__link')[2];
const priceLinkDropMenu = document.querySelectorAll('.dropdown__link')[3];
const contactLinkDropMenu = document.querySelectorAll('.dropdown__link')[4];

const authLink = document.querySelectorAll('.menu_auth_nav__link')[0];
const regLink = document.querySelectorAll('.menu_auth_nav__link')[1];

const authLinkDropMenu = document.querySelectorAll('.dropdown__link')[5];
const regLinkDropMenu = document.querySelectorAll('.dropdown__link')[6];

const cards = document.querySelector('.card');


const wrapperContainer = document.querySelector('.wrapper-container');
const contact = document.querySelector('.contact');
const signin = document.querySelector('.signin');
const reg = document.querySelector('.reg');




// BURGER

burger.addEventListener('click', function () {
    this.classList.toggle('active');
    reg.classList.remove('active');
    signin.classList.remove('active');
    contact.classList.remove('active');
});







// Scroll

// const getScreenScroll = () => {
//     return {
//         x: window.pageXOffset || document.documentElement.scrollLeft,
//         y: window.pageYOffset || document.documentElement.scrollTop
//     };
// };


// const getElementScroll = (element) => {
//     return {
//         x: element.scrollLeft,
//         y: element.scrollTop 
//     }
// }








// WINDOW

contactLink.onclick = () => {
    contact.classList.toggle("active");
}
contactLinkDropMenu.onclick = () => {
    contact.classList.toggle("active");
    burger.classList.toggle("active");
}

authLink.onclick = () => {
    signin.classList.toggle("active");
}
authLinkDropMenu.onclick = () => {
    signin.classList.toggle("active");
    burger.classList.toggle("active");
}

regLink.onclick = () => {
    reg.classList.toggle("active");
}
regLinkDropMenu.onclick = () => {
    reg.classList.toggle("active");
    burger.classList.toggle("active");
}






// Добавление столбца в таблицу


const form = document.getElementById('scheduleForm');
const table = document.getElementById('scheduleTable');
const tBody = table.querySelector('tbody');

var token = "1 Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk5NzUyOTA5LCJleHAiOjE3MDAxMTI5MDl9.5CTQyfImZdV44MOsPMv_GBeoZQn4EghCATOOp-wOmbE";


// Функция получения всех данных
function fetchDataFromServer() {
    console.log("Fetch Data From Server");

    return fetch('http://localhost:5000/schedules', {
        headers: {
            'Authorization': token,
        },
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching data from the server:', error);
            throw error;
        });
}


// Функция создает расписание и после обновляет таблицу
async function addScheduleToServer(scheduleData) {
    try {
        const response = await fetch('http://localhost:5000/schedules/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(scheduleData),
        });

        console.log("Add Schedule to Server");

        const result = await response.json();
        await loadDataFromServer(); // Ждем, пока данные будут загружены
    } catch (error) {
        console.error('Error adding schedule to the server:', error);
        throw error;
    }
}


// Удаляет расписание по id и обновляет таблицу
async function deleteScheduleByIdFromServer(scheduleId) {
    try {
        const response = await fetch(`http://localhost:5000/schedules/deleteId/${scheduleId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        });

        const result = await response.json();

        console.log("Delete Schedule By Id From Server");

        await loadDataFromServer(); // Ждем, пока данные будут загружены
    } catch (error) {
        console.error('Error deleting schedule from the server:', error);
        throw error;
    }
}


// Динамически добавляет новую строку в таблицу с редактируемыми ячейками
document.getElementById('addButton').addEventListener('click', function () {
    const newRow = tBody.insertRow();
    addIDToRows();

    for (let i = 0; i < 4; i++) {
        const newCell = newRow.insertCell();
        const cellContent = document.createElement('div');
        cellContent.contentEditable = true;
        newCell.appendChild(cellContent);
    }

    console.log("Event Add Button");
});


// Заполняет таблицу данными полученными с сервера, вкл. кнопки для действий таких как аренда или отмена
function populateTable(data) {
    const datas = [];
    while (tBody.firstChild) {
        tBody.firstChild.remove();
    }

    if (data && Array.isArray(data)) {
        data.forEach(rowData => {
            const newRow = tBody.insertRow();
            let arenda = false;
            const rentals = rowData.Rentals;

            if (rentals && rentals.length > 0) {
                if (rentals[0].user_id == token.split(' ')[0] && rowData.id == rentals[0].schedule_id) {
                    arenda = true;
                }
            }

            const rowDataArray = [
                rowData.id,
                rowData.name,
                rowData.classes_time + " " + "h",
                rowData.User.first_name + " " + rowData.User.last_name,
                arenda ? "Арендовано" : "Арендовать",
            ];

            datas.push(rowDataArray);

            rowDataArray.forEach(cellData => {
                const newCell = newRow.insertCell();
                newCell.contentEditable = true;
                newCell.innerHTML = cellData;
            });

            const actionCell = newRow.insertCell();
            const actionButton = document.createElement('button');
            actionButton.textContent = arenda ? 'Отмена' : 'Арендовать';
            actionButton.setAttribute('data-schedule-id', rowDataArray[0]);
            actionButton.setAttribute('class', "buttons");
            actionButton.addEventListener('click', handleRentAction);
            actionCell.appendChild(actionButton);

            console.log("Populate Table");
        });
    } else {
        console.error('Invalid data format from the server:', data);
    }
}


// Вызывает fetchDataFromServer для начальной загрузки данных с сервера
async function loadDataFromServer() {
    try {
        const response = await fetchDataFromServer();
        const responseData = response.data || response;

        console.log("Load Data From Server");

        populateTable(responseData);
        addIDToRows();
    } catch (error) {
        console.error('Error loading data from the server:', error);
    }
}


// Вызывает получение данных из таблицы
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // const updatedData = getDataTable();

    console.log("Event Submit");
});


// Извлекает данные из последней строки таблицы и отправляет пост запрос для добавления данных
document.getElementById('loadButton').addEventListener('click', function () {
    const newScheduleData = getDataFromLastRow();
    if (newScheduleData) {
        const [name, classes_time, user_id] = newScheduleData;
        const dataCreate = {
            name: newScheduleData[1],
            classes_time: newScheduleData[2],
            user_id: 1
        };

        console.log(dataCreate);
        console.log("Event Load Button");
        addScheduleToServer(dataCreate);
    } else {
        console.log("Данных нет");
    }
});


// Получает данные из таблицы и возвращает их в виде массива.
function getDataTable() {
    const data = [];
    const rows = tBody.rows;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowData = [];

        for (let j = 1; j < row.cells.length; j++) {
            const cell = row.cells[j];
            rowData.push(cell.textContent.trim());
        }
        data.push(rowData);
    }

    console.log("Get Data Table");
    return data;
}


// Добавляет идентификаторы к строкам после загрузки данных.
function addIDToRows() {
    const rows = tBody.rows;
    const idValues = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const idCell = row.cells[0];
        if (idCell) {
            const idValue = i + 1;
            idCell.textContent = idValue;
            idValues.push(idValue);
        }
    }

    console.log("Add ID to Rows");

    return idValues;
}

// Отправляет обновленные данные для сервера
async function saveDataToServer(data) {
    try {
        const id = data[0]; 
        const response = await fetch(`http://localhost:5000/schedules/update/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({ data }),
        });
        const result = await response.json();

        console.log("Save Data to Server");
    } catch (error) {
        console.error('Error saving data to the server:', error);
        throw error;
    }
}


// Удаляет последнюю строку в таблице и сохраняет обновленные данные на сервере.
function deleteLastRow() {
    const rows = tBody.rows;
    if (rows.length > 0) {
        tBody.removeChild(rows[rows.length - 1]);
    }

    console.log("Delete Last Row");

    saveDataToServer(getDataTable()); 
}

// Получает данные из последней строки таблицы.
function getDataFromLastRow() {
    const newRow = tBody.lastElementChild;
    if (!newRow) {
        return null;
    }

    const rowData = [];
    for (let j = 0; j < newRow.cells.length; j++) {
        const cell = newRow.cells[j];
        rowData.push(cell.innerText.trim());
    }

    console.log("Get Data From Last Row");

    return rowData;
}


// Получаем все id расписаний с базы данных
async function fetchIdsFromServer() {
    try {
        const response = await fetch('http://localhost:5000/schedules');
        const responseData = await response.json();

        console.log("Fetch Id  From Server");

        if (responseData.data && Array.isArray(responseData.data)) {
            const ids = responseData.data.map(row => row.id);
            return ids;
        } else {
            console.error('Invalid server response:', responseData);
            return [];
        }
    } catch (error) {
        console.error('Error fetching ids from the server:', error);
        throw error;
    }
}


// обновляет расписания на сервере на основе изменений в таблице.
document.getElementById('updateButton').addEventListener('click', async function () {
    console.log("CLick Update Button")
    const ids = await fetchIdsFromServer(); // Получаем массив id
    const updatedData = getDataTable();

    if (ids.length > 0) {
        try {
            await Promise.all(ids.map(async (id, index) => {
                try {
                    console.log('Sending data to server:', updatedData[index]);

                    const response = await fetch(`http://localhost:5000/schedules/update/${id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token,
                        },
                        body: JSON.stringify({ data: { ...updatedData[index], id } }),
                    });

                    const result = await response.json();
                    console.log('Server response:', result);
                } catch (error) {
                    console.error('Error updating schedule on the server:', error);
                    throw error;
                }
            }));

            console.log("Event Update Button");

            // Добавляем await перед вызовами функций
            await loadDataFromServer(); // Ждем, пока данные будут загружены
            addIDToRows(); // Обновляем номера строк
        } catch (error) {
            console.error('Error updating schedule on the server:', error);
        }
    } else {
        console.log('Нет данных для обновления.');
    }
});

// async function updateScheduleInServer(updatedData) {
//     try {
//         const idToUpdate = updatedData[0]; // Используем первый элемент массива
//         const response = await fetch(`http://localhost:5000/schedules/update/${idToUpdate}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': token,
//             },
//             body: JSON.stringify({ data: updatedData }),
//         });

//         const result = await response.json();
//         console.log(result);
//     } catch (error) {
//         console.error('Error updating schedule on the server:', error);
//         throw error;
//     }
// }



// Обрабатывает нажатие кнопки 'Арендовать' или 'Отмена', вызывая создание или удаление аренды.
function handleRentAction(event) {
    const scheduleId = event.target.getAttribute('data-schedule-id');
    const isRented = event.target.textContent === 'Отмена';

    if (isRented) {
        deleteRental(scheduleId);
    } else {
        createRental(scheduleId);
    }
}


// Отправляет POST-запрос для создания аренды для указанного расписания.
async function createRental(scheduleId) {
    try {
        const response = await fetch(`http://localhost:5000/schedules/rentCreate/${scheduleId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        });

        const result = await response.json();
        loadDataFromServer();
    } catch (error) {
        console.error('Error creating rental:', error);
    }
}


// 
async function deleteRental(scheduleId) {
    try {
        const response = await fetch(`http://localhost:5000/schedules/rentDelete/${scheduleId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        });

        const result = await response.json();
        loadDataFromServer();
    } catch (error) {
        console.error('Error deleting rental:', error);
    }
}

loadDataFromServer();
addIDToRows();

