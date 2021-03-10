const formReg = document.querySelector('#formReg');
const usersList = document.querySelector('#usersList');
    // Get form values
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const email = document.querySelector('#email');

const users = []

class User {
    constructor(firstName, lastName, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.id = Date.now().toString()
    }
}

class UI {
    static addUser = (user) => {

        users.push(user);
        console.log(users);

        usersList.insertAdjacentHTML('beforeend', 
        `
            <div class="card mb-3 animate__animated animate__backInLeft" id="${user.id}">
                <div class="card-body d-flex flex-wrap justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title">${user.firstName} ${user.lastName}</h5>
                        <p class="card-text">${user.email}</p>
                    </div>
                    <div>
                        <button type="button" class="btn btn-secondary btn-change">Change</button>
                        <button type="button" class="btn btn-danger btn-delete">Delete</button>
                    </div>
                </div>
            </div>
        `)
    }

    static deleteOrChangeUser = (element) => {
        // Get the user
        const wholeUser = element.parentElement.parentElement.parentElement;

        //* PRESSED DELETE BUTTON 
        if (element.classList.contains('btn-delete')) {
            // Delete the user from the array with id
            users.forEach(user => {
                if(user.id === wholeUser.id) {
                    users.splice(users.indexOf(user), 1);
                    console.log(users);
                }
            })
            // Delete user from UI
            wholeUser.classList.add('animate__backOutRight')
            wholeUser.addEventListener('animationend', () => wholeUser.remove())

        //* PRESSED CHANGE BUTTON
        } else if (element.classList.contains('btn-change')) {
            const u = users.find(user => {
                return user.id === wholeUser.id;
            })
            // Return values to form
            firstName.value = u.firstName;
            lastName.value = u.lastName;
            email.value = u.email;

            // Disable Submit-button
            document.querySelector('#submit').classList.add('disabled');

            // Enable Cancel-button
            document.querySelector('#cancel').classList.remove('disabled');

            // Disable buttons in list of Users
            usersList.querySelectorAll('button').forEach(button => {
                button.classList.add('disabled');
            })

            // Insert Save-button
            element.insertAdjacentHTML('afterend',
            `
            <button type="button" class="btn btn-success btn-save" id="save">Save</button>
            `)

            // Remove all form validation
            document.querySelectorAll('input').forEach(input => {
                input.classList.remove('is-valid');
                input.classList.remove('is-invalid');
            })

        //* PRESSED SAVE BUTTON 
        } else if (element.classList.contains('btn-save')) {
            const u = users.find(user => {
                return user.id === wholeUser.id;
            })

            if (validateText('firstName') && validateText('lastName')) {
                if (email.value === u.email || validateEmail('email', email.value)) {
                    // Change values to Array
                    u.email = email.value;
                    u.firstName = firstName.value;
                    u.lastName = lastName.value;

                    // Change values in List
                    element.parentElement.previousElementSibling.firstElementChild.innerHTML = u.firstName + ' ' + u.lastName;
                    element.parentElement.previousElementSibling.lastElementChild.innerHTML = u.email;

                    // Remove disable Submit-button
                    document.querySelector('#submit').classList.remove('disabled');
            
                    // Remove disable from buttons in list of Users
                    usersList.querySelectorAll('button').forEach(button => {
                        button.classList.remove('disabled');
                    })
                    
                    // Disable Cancel-button
                    document.querySelector('#cancel').classList.add('disabled');

                    // Remove Save-button
                    document.querySelector('#save').remove();
            
                    this.clearFields();
                }
                else {
                    email.nextSibling.innerText = 'A user with that email address already exists';
                    email.classList.add('is-invalid');
                } 
            }
        }   
    }

    static clearFields() {
        document.querySelectorAll('input').forEach(input => {
            input.value = '';
            input.classList.remove('is-valid');
            input.classList.remove('is-invalid');
          })
    }
}

const validateText = (id) => {
    const input = document.querySelector('#' + id);
    const error = input.nextElementSibling;

    if(input.value.trim() === '') {
        input.classList.add('is-invalid');
        return false;
    } else if(input.value.length < 2) {
        error.innerText = 'The name must be at least 2 characters long';
        input.classList.add('is-invalid');
        return false;
    } else {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
        return true;
    }
}

const validateEmail = (id, email) => {
    const input = document.querySelector('#' + id);
    const error = input.nextElementSibling;

    let regEx = /^\w+@[a-zA-Z]+?\.[a-zA-Z-]{2,}$/

    if(regEx.test(input.value)) {
        if (users.length === 0 ) {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
            return true;
        }
        if (users.some(user => user.email === email)) {
            error.innerText = 'A user with that email address already exists';
            input.classList.add('is-invalid');
            return false;
        } else {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
            return true;
        }
    } else {
        error.innerText = 'Please provide a valid email.';
        input.classList.add('is-invalid');
        return false;
    }
}

const validate = () => {
    document.querySelectorAll('input').forEach(input => {
        if(input.type === 'text') {
            validateText(input.id);
        }

        if(input.type === 'email') {
            validateEmail(input.id, email);
        }
    })
}

//* EVENTS
formReg.addEventListener('submit', (e) => {
    // Prevent submit
    e.preventDefault();
  
    console.log("Sumbittat");
    
    validate();

    if (validateText('firstName') && validateText('lastName') && validateEmail('email', email.value)) {
        const user = new User(firstName.value, lastName.value, email.value);

        UI.addUser(user);
        UI.clearFields();
    }
});

formReg.addEventListener('reset', () => {
    document.querySelector('#cancel').classList.add('disabled');

    // Remove disable from buttons in list of Users
    usersList.querySelectorAll('button').forEach(button => {
        button.classList.remove('disabled');
    })

    // Change Submit-button
    document.querySelector('#submit').classList.remove('disabled');

    // Remove Save-button
    document.querySelector('#save').remove();

    UI.clearFields();
});

usersList.addEventListener('click', (e) => {
    // Remove or change a user
    UI.deleteOrChangeUser(e.target);
});