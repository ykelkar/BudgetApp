export default class Expense {
    constructor(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    calcPercentage(totalIncome) {
        console.log('hit');
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        } else {
            this.percentage = -1;
        }
        console.log(this.percentage);   
        return this.percentage;
    };

    getPercentage() {
        return this.percentage;
    };
}