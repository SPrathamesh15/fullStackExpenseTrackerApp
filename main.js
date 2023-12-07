var form = document.getElementById('addForm');
var itemList = document.getElementById('items');

// Adding a single event listener to handle form submission
form.addEventListener('submit', handleFormSubmission);

// delete event
itemList.addEventListener('click', removeItem);
itemList.addEventListener('click', editItem); // Adding event listener for edit

function removeItem(e) {
    if (e.target.classList.contains('delete-btn')) {
        if (confirm('Are You Sure? You want to delete this item?')) {
            var li = e.target.parentElement;
            itemList.removeChild(li);
        }
    }
}

function editItem(e) {
    if (e.target.classList.contains('editbutton')) {
        var li = e.target.parentElement;
        var expenseAmount = li.querySelector('.expenseAmount').innerText.split(': ')[1];
        var description = li.querySelector('.description').innerText.split(': ')[1];
        var category = li.querySelector('.category').innerText.split(': ')[1];

        // Populate the form fields with existing data
        document.getElementById('expenseamt').value = expenseAmount;
        document.getElementById('description').value = description;
        document.getElementById('category').value = category;

        // Remove the corresponding list item
        itemList.removeChild(li);
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    // Get expense details from the form
    var expenseAmt = document.getElementById('expenseamt').value;
    var expenseDescription = document.getElementById('description').value;
    var categoryValue = document.getElementById('category').value;

    var li = document.createElement('li');
    li.className = 'list-group-item';


    var bigSpace = ' - ';

    var expenseAmts = 'Exepense Amount: ' + expenseAmt;
    var expenseDescriptions = 'Exepense Description: ' + expenseDescription;
    var categoryValues = 'Exepense Category: ' + categoryValue;

    li.appendChild(document.createTextNode(expenseAmts));
    li.appendChild(document.createTextNode(bigSpace));
    li.appendChild(document.createTextNode(expenseDescriptions));
    li.appendChild(document.createTextNode(bigSpace));
    li.appendChild(document.createTextNode(categoryValues));

    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.appendChild(document.createTextNode('X'));
    var editBtn = document.createElement('button'); // Create an edit button
    editBtn.className = 'editbutton';
    editBtn.appendChild(document.createTextNode('Edit'));

    li.appendChild(deleteBtn);
    li.appendChild(editBtn); // Appending the edit button

    itemList.appendChild(li);

    var expenseDetails = {
        expenseAmount: expenseAmt,
        expenseDescription: expenseDescription,
        category: categoryValue
    };
    console.log('ExpenseDetails:', expenseDetails);
    axios.post("http://localhost:3000/expense/add-expense", expenseDetails)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            document.body.innerHTML = document.body.innerHTML +
                "<h3 style='color:red'> Something Went wrong!!!</h4>",
                console.log(err);
        });

    // Creating a new list item
    var li = document.createElement('li');
    li.className = 'list-group-item';
    // Clear the form fields
    document.getElementById('expenseamt').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';
    // localStorage.setItem(email, JSON.stringify(userDetails));
    console.log('Expense details added to Our server!!', expenseDetails);
}

document.addEventListener('DOMContentLoaded', handlePageLoad);

function handlePageLoad() {
    // Making a GET request to retrieve data from the backend server
    axios.get("http://localhost:3000/expense/get-expenses")
        .then((response) => {
            // Displaying the data on the screen and in the console
            showNewExpenseOnScreen(response.data.allExpenses);
            console.log('handlepageload data', response.data.allExpenses);
        })
        .catch((err) => {
            console.error('Error while fetching data:', err);
        });
}

function showNewExpenseOnScreen(expenses) {
    const parentNode = document.getElementById('items');
    parentNode.innerHTML = '';
    console.log('showing expenses on the screen', expenses)
    for (var i = 0; i < expenses.length; i++) {
        console.log('showing the user details on page: ', expenses[i])
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.id = expenses[i].id;

        // Creating elements with appropriate classes
        const expenseAmountElement = document.createElement('span');
        expenseAmountElement.className = 'expenseAmount';
        expenseAmountElement.innerText = `Expense Amount: ${expenses[i].expenseAmount}  - `;

        const descriptionElement = document.createElement('span');
        descriptionElement.className = 'description';
        descriptionElement.innerText = `Expense Description: ${expenses[i].expenseDescription}  - `;

        const categoryElement = document.createElement('span');
        categoryElement.className = 'category';
        categoryElement.innerText = `Expense Category: ${expenses[i].category}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.appendChild(document.createTextNode('X'));
        // Using a closure to capture the current value of userId
        deleteBtn.onclick = (function (expensesId) {
            return function () {
                deleteExpense(expensesId);
            };
        })(expenses[i].id);

        const editBtn = document.createElement('button');
        editBtn.className = 'editbutton';
        editBtn.appendChild(document.createTextNode('Edit'));
        // Using a closure to capture the current values of expenses[i]
        editBtn.onclick = (function (expenseId, expenseAmount, description, category) {
            return function () {
                editExpenseDetails(expenseId, expenseAmount, description, category);
            };
        })(expenses[i].id, expenses[i].expenseAmount, expenses[i].expenseDescription, expenses[i].category);

        // Appending elements to the li
        li.appendChild(expenseAmountElement);
        li.appendChild(descriptionElement);
        li.appendChild(categoryElement);
        li.appendChild(deleteBtn);
        li.appendChild(editBtn);

        parentNode.appendChild(li);
    }
}

function editExpenseDetails(expenseId, expenseAmount, description, category){
    // Populate the form fields with existing data
    document.getElementById('expenseamt').value = expenseAmount;
    document.getElementById('description').value = description;
    document.getElementById('category').value = category;

    // Delete the expense
    deleteExpense(expenseId);
}


function deleteExpense(expenseId) {
    axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`)
        .then((response) => {
            removeExpenseFromScreen(expenseId);
        })
        .catch((err) => err);
}

function removeExpenseFromScreen(expenseId) {
    const parentNode = document.getElementById('items');
    const childNodeTobeDeleted = document.getElementById(expenseId);
    if (childNodeTobeDeleted) {
        parentNode.removeChild(childNodeTobeDeleted);
    }
}