//variables 
const alert=document.querySelector('.alert');
const form=document.querySelector('.todo-form');
const todo=document.getElementById('todo');
const submitBtn=document.querySelector('.submit-btn');
const container=document.querySelector('.todo-container');
const list=document.querySelector('.todo-list');
const clearBtn=document.querySelector('.clear-btn');

// edit option
let editElement;
let checked=false;
let editFlag=false;
let editID="";

//submit form
form.addEventListener('submit', addItem);
//clear all items
clearBtn.addEventListener('click',clearItems);

window.addEventListener('DOMContentLoaded',setupItems); // every time page is refreshed it grabs the localStorage content and renders it

function addItem(e){
    /* console.log("submit button clicked");
    console.log(e.type);
    console.log(e.target); */
    e.preventDefault();

    const value=todo.value.trim();
    const id=new Date().getTime().toString(); //unique number
    
    if(value && !editFlag){
        createListItem(id,value);
        container.classList.add('show-container');
        addToLocalStorage(id,value);
        setBackToDefault();
        displayAlert("Item added to list",'success');
    }else if(value && editFlag){
        editElement.innerHTML=value;
        displayAlert('Item Edited','success');
        editLocalStorage(editID,value);
        setBackToDefault();
    }else{
        displayAlert("please enter item","danger");
    }
}

function displayAlert(text, action){
    //display alert
    alert.textContent=text
    alert.classList.add(`alert-${action}`)

    //remove alert
    setTimeout(function(){
        alert.textContent=""
        alert.classList.remove(`alert-${action}`)
    },1500)
}

function clearItems(){
    //console.log("clear all button clicked");
    const items=document.querySelectorAll('.todo-item');
    if(items.length>0){
        items.forEach(item=>list.removeChild(item));
    }
    container.classList.remove("show-container");
    displayAlert('All items cleared','danger');
    localStorage.removeItem('list');
    setBackToDefault();
}
function deleteItem(e){
    const element=e.currentTarget.parentElement.parentElement;
    const id=element.dataset.id;
    list.removeChild(element);

    if(list.children.length===0){
        container.classList.remove('show-container');
    }
    displayAlert('Item deleted', 'danger');
    setBackToDefault();
    //remove from local storage
    removeFromLocalStorage(id);
}
function editItem(e){
    const element=e.currentTarget.parentElement.parentElement;
    editElement=e.currentTarget.parentElement.previousElementSibling;
    todo.value=editElement.innerHTML;
    editFlag=true;
    editID=element.dataset.id;
    submitBtn.textContent='edit';
}
function checkItem(e){
    const parentElement=e.currentTarget.parentElement.parentElement;
    const siblingElement=e.currentTarget.parentElement.
    previousElementSibling;
    const id=parentElement.dataset.id;

    let items=getLocalStorage();
    items = items.map(function (item) {
        if (item.id === id) {
            item.checked = !item.checked; // toggle the checked property 
            siblingElement.style.textDecoration=item.checked ? 'line-through' : 'none';
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items));
    displayAlert('Item checked off', 'success');
    setBackToDefault();

}
//reset the form
function setBackToDefault(){
    todo.value='';
    editFlag=false;
    editID='';
    submitBtn.textContent='add';
}
// ****** LOCAL STORAGE **********
//when add item to list add to ls
function addToLocalStorage(id,value){
    const todo={id, value, checked: false};
    let items=getLocalStorage();
    items.push(todo);
    localStorage.setItem('list',JSON.stringify(items));
} 
//when deleting item remove that from ls
function removeFromLocalStorage(id){
    let items=getLocalStorage();
    items=items.filter(function(item){
        if(item.id!==id){
            return item;
        }
    })
    localStorage.setItem('list',JSON.stringify(items));

}
//when item is being edited update in ls
function editLocalStorage(id, value){
    let items=getLocalStorage();
    items=items.map(function(item){
        if(item.id==id){
            item.value=value;
        }
        return item;
    })
    localStorage.setItem('list',JSON.stringify(items));
}
//to get list from ls
function getLocalStorage(){
    return localStorage.getItem('list')?JSON.parse(localStorage.getItem('list')):[];
    
}
// to set up page after dom is loaded and render previous content
function setupItems(){
    let items=getLocalStorage();
    if(items.length>0){
        items.forEach(function(item){
            createListItem(item.id, item.value, item.checked);
        });
        container.classList.add('show-container');
    }
}
//to add  your list item dynamically into the container by creating it
function createListItem(id, value, checked=false){
    const element=document.createElement('article');
        element.classList.add('todo-item')
        element.setAttribute('data-id',id);
        
        element.innerHTML=`
            <p class="title" style="text-decoration:${checked?'line-through':'none'};">${value}</p>
            <div class="btn-container">
                <button type="button" class="check-btn">
                <i class="fas fa-check"></i>
              </button>
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;

        const checkBtn=element.querySelector('.check-btn');
        const deleteBtn=element.querySelector('.delete-btn')
        const editBtn=element.querySelector('.edit-btn')

        checkBtn.addEventListener('click', checkItem);
        deleteBtn.addEventListener('click',deleteItem);
        editBtn.addEventListener('click',editItem);

        list.appendChild(element);
}