const pollQueryString = window.location.search;
const pollParams = new URLSearchParams(pollQueryString);

if (pollParams.has('id')){
    getPollData(pollParams.get('id'));
}

let optionCount = 0;
let toDelete = [];

document.getElementById('addOption').addEventListener('click', addNewOption);
document.getElementById('deleteLastOption').addEventListener('click', deleteLastOption);
document.forms['editPoll'].addEventListener('submit', modifyPoll);
document.querySelector('fieldset').addEventListener('click', getFieldsetClick);

// Get poll data from database
function getPollData(id){
    console.log(id);
    let ajax = new XMLHttpRequest();
    ajax.onload = function(){
        data = JSON.parse(this.responseText);
        console.log(data);
        populatePollForm(data);
    }
    ajax.open("GET", "backend/getPoll.php?id=" + id);
    ajax.send();
    
}

function populatePollForm(data){
    document.forms['editPoll']['id'].value = data.id;
    document.forms['editPoll']['topic'].value = data.topic;
    document.forms['editPoll']['start'].value = data.start.replace(" ","T");
    document.forms['editPoll']['end'].value = data.end.replace(" ","T");

    const target = document.querySelector('fieldset');

    data.options.forEach(function(option){
    console.log(option);
    optionCount++;
    target.appendChild(createOptionInputDiv(optionCount, option.name, option.id));

    })
}

// createoptionInputDiv -
// Creates new input-field to form
function createOptionInputDiv(count, name, id){

    // Create new div
    const div = document.createElement('div');
    div.classList.add('form-group');

    // Create new label
    const label = document.createElement('label');
    const forAttribute = document.createAttribute('for');
    const labelText = document.createTextNode(`Option ${count}`);
    forAttribute.value = `option${count}`;
    label.setAttributeNode(forAttribute);
    label.appendChild(labelText);


    // Create new input
    const input = document.createElement('input');

    input.classList.add('form-control');

    const inputType = document.createAttribute('type');
    inputType.value = "text";
    input.setAttributeNode(inputType);

    const inputName = document.createAttribute('name');
    inputName.value = `option${count}`;
    input.setAttributeNode(inputName);

    const inputPlaceholder = document.createAttribute('placeholder');
    inputPlaceholder.value = `Option ${count}`;
    input.setAttributeNode(inputPlaceholder);

    input.dataset.optionid = id;

    input.value = name;

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = "btn btn-sm btn-danger float-right";

    const deleteText = document.createTextNode('Delete');
    deleteButton.appendChild(deleteText);
    deleteButton.dataset.action = 'delete';

    div.appendChild(label);
    div.appendChild(input);
    div.appendChild(deleteButton);

    return div;

}

function deleteLastOption(event){

    event.preventDefault();
    
    if (optionCount <= 2) {
        return;
    }

    const optionToDelete = document.querySelector('fieldset').lastElementChild;
    const parentElement = document.querySelector('fieldset');
    parentElement.removeChild(optionToDelete);

    optionCount--;

}


function addNewOption(event){

    event.preventDefault();

    optionCount++;

    // Create new div
    const div = document.createElement('div');
    div.classList.add('form-group');

    // Create new label
    const label = document.createElement('label');
    const forAttribute = document.createAttribute('for');
    const labelText = document.createTextNode(`Option ${optionCount}`);
    forAttribute.value = `option${optionCount}`;
    label.setAttributeNode(forAttribute);
    label.appendChild(labelText);


    // Create new input
    const input = document.createElement('input');

    input.classList.add('form-control');

    const inputType = document.createAttribute('type');
    inputType.value = "text";
    input.setAttributeNode(inputType);

    const inputName = document.createAttribute('name');
    inputName.value = `option${optionCount}`;
    input.setAttributeNode(inputName);

    const inputPlaceholder = document.createAttribute('placeholder');
    inputPlaceholder.value = `Option ${optionCount}`;
    input.setAttributeNode(inputPlaceholder);



    div.appendChild(label);
    div.appendChild(input);

    document.querySelector('fieldset').appendChild(div);
    console.log(div);


}

function modifyPoll(event){
    event.preventDefault();
    console.log('Save changes');

    // Collect polldata from form
    let pollData = {};
    pollData.id = document.forms['editPoll']['id'].value;
    pollData.topic = document.forms['editPoll']['topic'].value;
    pollData.start = document.forms['editPoll']['start'].value;
    pollData.end = document.forms['editPoll']['end'].value;

    // Collect options
    const options = [];
    const inputs = document.querySelectorAll('input');

    inputs.forEach(function(input){
        if(input.name.indexOf('option') == 0){
           options.push({ id: input.dataset.optionid, name: input.value }) 
        }
    })

    pollData.options = options;

    // Deleted options
    pollData.todelete = toDelete;

    console.log(pollData);

    // Send data to backend
    let ajax = new XMLHttpRequest();
    ajax.onload = function(){
        let data = JSON.parse(this.responseText);
        if (data.hasOwnProperty('success')){
            window.location.href = "admin.php?type=success&msg=Poll edited"
        } else {
            showMessage('error', data.error);
        }
    }
    ajax.open("POST", "backend/modifyPoll.php", true);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.send(JSON.stringify(pollData));
}

function getFieldsetClick(event){
    event.preventDefault();

    let btn = event.target;

    if (btn.dataset.action == 'delete'){
        let div = btn.parentElement;
        let input = div.querySelector('input');
        let fieldset = div.parentElement;
        toDelete.push({id: input.dataset.optionid});
        fieldset.removeChild(div);

    }
}