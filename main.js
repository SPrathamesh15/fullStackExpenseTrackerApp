var form = document.getElementById('addForm');
var itemList = document.getElementById('items');

// creating a event listener for Adding items:
form.addEventListener('submit', addItem);
function addItem(e){
    e.preventDefault();
    // get expense amount
    var expenseAmt = document.getElementById('expenseamt').value;
    // get expense description value
    var expenseDescription = document.getElementById('description').value;
    // get category value
    var categoryValue = document.getElementById('category').value;
    // creating a new list item
    var li = document.createElement('li');
    // Add class
    li.className = 'list-group-item';
    // Add text node with input value
    var bigSpace = '  -  ';
    li.appendChild(document.createTextNode('Expense Amount: ' + expenseAmt));
    li.appendChild(document.createTextNode(bigSpace));
    li.appendChild(document.createTextNode('Expense Description: ' + expenseDescription));
    li.appendChild(document.createTextNode(bigSpace));
    li.appendChild(document.createTextNode('Category: ' + categoryValue));
    // create del button element 
    var deleteBtn = document.createElement('button');
    // Add class to del button
    deleteBtn.className = 'btn btn-danger btn-sm float-right delete';
    // Append text node
    deleteBtn.appendChild(document.createTextNode('X'));
    // Append btn to li
    li.appendChild(deleteBtn);
    // create edit btn
    var editBtn = document.createElement('button');
    // add class to edit btn
    editBtn.className = 'editbutton'
    // Append text node
    editBtn.appendChild(document.createTextNode('Edit Expense'))
    // append btn to li
    li.appendChild(editBtn)
    // Append li to list
    itemList.appendChild(li);

    // adding in local storage
    var expenseDetails = {
        ExpenseAmount: expenseAmt,
        ExpenseDescription: expenseDescription,
        Category: categoryValue
    };

    localStorage.setItem(expenseDescription, JSON.stringify(expenseDetails));

    console.log('Expense details added to local storage', expenseDetails);
}

// creating eventlistener for deleting elements
itemList.addEventListener('click', removeItem);
function removeItem(e) {
    if (e.target.classList.contains('delete')) {
        if (confirm('Are You Sure? You want to delete this Expense?')) {
            var li = e.target.parentElement;
            itemList.removeChild(li);
            // Removing corresponding userData from the localStorage
            var expenseDescription = document.getElementById('description').value;
            var userData = JSON.parse(localStorage.getItem(expenseDescription));
            if (userData) {
                // Updating the localStorage after deleting the user
                localStorage.removeItem(expenseDescription);
            }
        }
    }
}

// Creating EventListener for editing items
itemList.addEventListener('click', editItem);
function editItem(e) {
    if (e.target.classList.contains('editbutton')) {
        var li = e.target.parentElement;
        var expenseDescription = document.getElementById('description').value;
        var userData = JSON.parse(localStorage.getItem(expenseDescription));
        if (userData) {
            // Populate the form fields with existing data
            document.getElementById('expenseamt').value = userData.ExpenseAmount;
            document.getElementById('description').value = userData.ExpenseDescription;
            document.getElementById('category').value = userData.Category;

            // Remove the existing user data from local storage
            localStorage.removeItem(expenseDescription);

            // Remove the corresponding list item
            itemList.removeChild(li);
        }
    }
}