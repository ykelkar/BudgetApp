import Budget from './models/Budget';
import * as budgetView from './views/budgetView';
import { elements } from './views/base';

// DOUGHNUT CHART CONTROLLER

const doughnutChartController = (function () {

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title:{
            text: "Expenses Split",
            horizontalAlign: "center"
        },
        data: [{
            type: "doughnut",
            startAngle: 60,
            indexLabelFontSize: 17,
            indexLabel: "{label} - #percent%",
            toolTipContent: "<b>{label}:</b> {y} (#percent%)",
            dataPoints: [
                
            ]
        }]
    });
    chart.render();
    
    return {
        addData: function(value, category) {
            chart.data[0].dataPoints.push(
                {
                    y: value, 
                    label: category
                }
            );
            console.log(chart.data[0].dataPoints);
            chart.render();
        },
    }
})();

/*
// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0, 
        percentage: -1
    }

    return {
        data,
        addItem: function(type, des, val) {
            var newItem,id;

            // Create new ID
            if (data.allItems[type].length > 0) {
                id =  data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }
            
            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(id, des, val);
            } else if (type === 'inc') {
                newItem = new Income(id, des, val);
            }

            // Push it into our data structure 
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;
            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            }); 

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            // calculate total income and expenses 
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget: income - expenses 
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });
            return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }
    };
})();

// UI CONTROLLER
var UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    // Passing a callback function into it, each iteration callback function is called
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //will be inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function(obj, type) {
            var html, element;
            var percentageHtml = '<div class="item__percentage">21%</div>';
            // 1. Create HTML string with placeholder text
            if (type === 'inc') {
                percentageHtml = '';
                element = DOMstrings.incomeContainer;
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                
            }
            html = `
                <div class="item clearfix" id="${type}-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${formatNumber(obj.value, type)}</div>
                        ${percentageHtml}
                        <div class="item__delete">
                            <button class="item__delete--btn">
                                <i class="ion-ios-close-outline"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // 3. Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) 
                {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function() {
            var now, year, month, months;
            
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();

            year = now.getFullYear();

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(fields, function(current) {
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }
})();
*/

const state = {};

elements.inputBtn.addEventListener('click', () => {
    ctrlAddItem();
});

function ctrlAddItem() {
    // 1. Get the field input data
    const input = budgetView.getInput();
    
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
        // 2. Add the item to the budget controller
        const newItem = state.budget.addItem(input.type, input.description, input.value);
        
        // 3. Add the new item to the UI
        budgetView.addListItem(newItem, input.type);

        // 4. Add to doughnut chart
        if (input.type === 'exp') {
            //state.chart.addData(newItem.value, newItem.description);
            //state.chart.chart.render();
            doughnutChartController.addData(newItem.value, newItem.description);
        }

        // 5. Clear the fields 
        budgetView.clearFields();
        
        // 6. Calculate and update budget
        updateBudget();

        // 7. Calculate and update percentages
        updatePercentages();
    }
};

function updateBudget() {
    // 1. Calculate the budget
    state.budget.calculateBudget();

    // 2. Return the budget 
    const budget = state.budget.getBudget();

    // 3. Display the budget on the UI
    budgetView.displayBudget(budget);
};

function updatePercentages() {
    // 1. Calculate percentages
    state.budget.calculatePercentages();

    // 2. Read percentages from the budget controller
    const percentages = state.budget.getPercentages();

    // 3. Update the UI with the new percentages
    budgetView.displayPercentages(percentages);
};

document.addEventListener('keypress', e => {
    if (e.keyCode === 13 || e.which === 13)  ctrlAddItem();
});

elements.container.addEventListener('click', e => {
    const itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
        const splitID = itemID.split('-');
        const type = splitID[0];
        const id = parseInt(splitID[1]);

        // 1. delete the item from the data structure
        state.budget.deleteItem(type, id);

        // 2. Delete the item from the UI
        budgetView.deleteListItem(itemID)

        // 3. Update and show the new budget
        updateBudget();

        // 4. Calculate and update percentages
        updatePercentages();
    }
});

document.querySelector(elements.inputType).addEventListener('change', () => {
    budgetView.changedType();
});
// GLOBAL APP CONTROLLER
//const controller = (budgetCtrl, UICtrl) => {
    //var setupEventListeners = function() {
        //var DOM = UICtrl.getDOMstrings();
        //document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // document.addEventListener('keypress', function(event) {
        //     if (event.keyCode === 13 || event.which === 13)  ctrlAddItem();
        // });

        //document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        //document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    //};

    /*
    var updateBudget = function() {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget 
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. Get the field input data
        input = UICtrl.getInput();
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            
            // 3. Add the new item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Add to doughnut chart
            if (input.type === 'exp') doughnutChartController.addData(newItem.value, newItem.description);

            // 5. Clear the fields 
            UICtrl.clearFields();
            
            // 6. Calculate and update budget
            updateBudget();

            // 7. Calculate and update percentages
            updatePercentages();
        }
    };
    */

    // Using event delegation
    // var ctrlDeleteItem = function(event) {
    //     var itemID, splitID, type, id;

    //     itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    //     if (itemID) {
    //         splitID = itemID.split('-');
    //         type = splitID[0];
    //         id = parseInt(splitID[1]);

    //         // 1. delete the item from the data structure
    //         budgetCtrl.deleteItem(type, id);

    //         // 2. Delete the item from the UI
    //         UICtrl.deleteListItem(itemID)

    //         // 3. Update and show the new budget
    //         updateBudget();

    //         // 4. Calculate and update percentages
    //         updatePercentages();
    //     }
    // };

//     return {
//         init: function() {
//             console.log('Application has started.');
//             UICtrl.displayMonth();
//             UICtrl.displayBudget({
//                 budget: 0,
//                 totalInc: 0,
//                 totalExp: 0,
//                 percentage: 0
//             });
//             setupEventListeners();
//         }
//     }
// })(budgetController, UIController, doughnutChartController);

//controller.init()
const init = () => {
    console.log('Application has started.');
    state.budget = new Budget();
    window.state = state;
    budgetView.displayMonth();
    budgetView.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0
    });
}
init();