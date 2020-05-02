import { elements } from './base';

const formatNumber = (num, type) => {
    num = Math.abs(num);
    num = num.toFixed(2);

    const numSplit = num.split('.');

    let int = numSplit[0];
    if (int.length > 3) int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    
    const dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
};

export const getInput = () => {
    return {
        type: document.querySelector(elements.inputType).value, //will be inc or exp
        description: document.querySelector(elements.inputDescription).value,
        value: parseFloat(document.querySelector(elements.inputValue).value)
    }
};

export const addListItem = (obj, type) => {
    let element;
    console.log(obj);
    let percentageHtml = `<div class="item__percentage">${obj.percentage}</div>`;
    // 1. Create HTML string with placeholder text
    if (type === 'inc') {
        percentageHtml = '';
        element = elements.incomeContainer;
    } else if (type === 'exp') {
        element = elements.expensesContainer;
    }
    const html = `
        <div class="item clearfix" id="${type}-${obj.id}">
            <div class="item__description">${obj.description}</div>
            <div class="right clearfix">
                <div class="item__value">${formatNumber(obj.value, type)}</div>
                ${percentageHtml}
                <div class="item__delete">
                    <button class="item__delete--btn btn-tiny">
                        <svg id="delete__btn--icon-${type}">
                            <use href="img/icons.svg#icon-circle-with-cross"></use>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    // 3. Insert the HTML into the DOM
    element.insertAdjacentHTML('beforeend', html);
};

export const deleteListItem = selectorID => {
    let el = document.getElementById(selectorID);
    el.parentNode.removeChild(el);
};

export const clearFields = () => {
    const fields = document.querySelectorAll(elements.inputDescription + ', ' + elements.inputValue);

    let fieldsArr = Array.prototype.slice.call(fields);

    fieldsArr.forEach((current, index, array) => current.value = "");

    fieldsArr[0].focus();
};

export const displayBudget = obj => {
    let type = obj.budget > 0 ? type = 'inc' : type = 'exp';
    elements.budgetLabel.textContent = formatNumber(obj.budget, type);
    elements.incomeLabel.textContent = formatNumber(obj.totalInc, 'inc');
    elements.expenseLabel.textContent = formatNumber(obj.totalExp, 'exp');

    if (obj.percentage > 0) {
        elements.percentageLabel.textContent = obj.percentage + '%';
    } else {
        elements.percentageLabel.textContent = '---';
    }
};

export const displayPercentages = percentages => {
    const fields = document.querySelectorAll('.item__percentage');
            
    fields.forEach((current, index) => {
        if (percentages[index] > 0) {
            current.textContent = percentages[index] + '%';
        } else {
            current.textContent = '---';
        }
    });
};

export const displayMonth = () => {
    const now = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = now.getMonth();

    const year = now.getFullYear();
    
    elements.dateLabel.textContent = `${months[month]} ${year}`;
};

export const changedType = () => {
    const fields = document.querySelectorAll(`${elements.inputType},${elements.inputDescription},${elements.inputValue}`);

    fields.forEach(current => current.classList.toggle('red-focus'));

    elements.inputBtnSvg.classList.toggle('red');
};

export const getDOMstrings = () => {
    return DOMstrings;
};