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
            const newValue = {
                y: value, 
                label: category
            };
            chart.data[0].dataPoints.push(newValue);
            chart.render();
        },

        deleteData: function(category) {
            chart.data[0].dataPoints.forEach((dp, i) => {
                if (dp.label === category) chart.data[0].dataPoints.splice(i, 1);
            });
            chart.render();
        }, 

        updateData: function(category, val) {
            chart.data[0].dataPoints.forEach((dp, i) => {
                if (dp.label === category) chart.data[0].dataPoints[i].y = val;
            });
            chart.render();
        }
    }
})();

const state = {};

elements.inputBtn.addEventListener('click', () => {
    ctrlAddItem();
});

document.addEventListener('keypress', e => {
    if (e.keyCode === 13 || e.which === 13)  ctrlAddItem();
});

document.querySelector(elements.inputType).addEventListener('change', () => {
    budgetView.changedType();
});

// Restore budget on page load
window.addEventListener('load', () => {
    state.budget = new Budget();
    window.budget = state.budget;

    // Restore budget
    state.budget.readStorage();
    
    budgetView.displayMonth();

    budgetView.displayPercentages();

    // Render budget
    budgetView.displayBudget({
        budget: state.budget.data.budget,
        totalInc: state.budget.data.totals.inc,
        totalExp: state.budget.data.totals.exp,
        percentage: state.budget.data.percentage
    });

    state.budget.data.allItems.inc.forEach(item => {
        budgetView.addListItem(item, 'inc');
    });

    state.budget.data.allItems.exp.forEach(item => {
        budgetView.addListItem(item, 'exp');
        doughnutChartController.addData(item.value, item.description, item.id);
    });
});

// Delete event listener
elements.container.addEventListener('click', e => {
    let node = e.target.parentNode.parentNode.parentNode.parentNode;
    const itemID = node.id;
    
    if (itemID) {
        node = type === 'exp' ? e.target.parentNode.parentNode.parentNode.parentNode : e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
        const des = node.querySelector('.item__description').innerHTML;
        const splitID = itemID.split('-');
        const type = splitID[0];
        const id = parseInt(splitID[1]);

        // 1. delete the item from the data structure
        state.budget.deleteItem(type, id);

        // 2. Delete the item from the UI
        budgetView.deleteListItem(itemID)

        // 3. Delete from doughnut chart if exp
        if (type === 'exp') doughnutChartController.deleteData(des);

        // 3. Update and show the new budget
        updateBudget();

        // 4. Calculate and update percentages
        updatePercentages();
    }
});

function ctrlAddItem() {
    // 1. Get the field input data
    const input = budgetView.getInput();
    let newInput = true;
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
        state.budget.data.allItems[input.type].forEach(item => {
            if (item.description === input.description) {
                const id = item.id;
                const itemID = `${input.type}-${id}`;

                // 2. Update the item to the budget controller
                const newValue = state.budget.updateItem(input.type, id, input.value);

                // 3. Update the new item to the UI
                budgetView.updateListItem(itemID, newValue, input.type);
                
                // 4. Update doughnut chart
                if (input.type === 'exp') doughnutChartController.updateData(input.description, newValue);

                newInput = false;
            }
        });
        if (newInput) {
            // 2. Add the item to the budget controller
            const [newItem, id] = state.budget.addItem(input.type, input.description, input.value);

            // 3. . Add the new item to the UI
            budgetView.addListItem(newItem, input.type);

            // 4. Add to doughnut chart
            if (input.type === 'exp') doughnutChartController.addData(newItem.value, newItem.description, id);
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
