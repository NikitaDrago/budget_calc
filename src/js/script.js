'use strict';

const start = document.querySelector('#start'),
    cancel = document.querySelector('#cancel'),
    btnAdd = document.querySelectorAll('.btn_plus'),
    incomePlus = btnAdd[0],
    expensesPlus = btnAdd[1],
    depositeCheckBox = document.querySelector('.deposit-checkmark'),
    additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
    budgetMonthValue = document.querySelector('.budget_month-value'),
    budgetDayValue = document.querySelector('.budget_day-value'),
    expensesMonthValue = document.querySelector('.expenses_month-value'),
    additionalIncomeValue = document.querySelector('.additional_income-value'),
    additionalExpensesValue = document.querySelector('.additional_expenses-value'),
    incomePeriodValue = document.querySelector('.income_period-value'),
    targetMonthValue = document.querySelector('.target_month-value'),
    salaryAmount = document.querySelector('.salary-amount'),
    incomeAmount = document.querySelector('.income-amount'),
    expensesTitle = document.querySelector('.expenses-title'),
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    targetAmount = document.querySelector('.target-amount'),
    periodSelect = document.querySelector('.period-select'),
    periodAmount = document.querySelector('.period-amount');

let incomeItems = document.querySelectorAll('.income-items'),
    expensesItems = document.querySelectorAll('.expenses-items');
 

const AppData = class {
    constructor() {
        this.budget = 0;
        this.income = {};
        this.addIncome = [];
        this.incomeMonth = 0;
        this.expenses = {};
        this.addExpenses = [];
        this.deposit = false;
        this.percentDeposit = 0;
        this.moneyDeposit = 0;
        this.budgetDay = 0;
        this.budgetMonth = 0;
        this.expensesMonth = 0;
    }
    isNumber = n => !isNaN(parseFloat(n)) && isFinite(n);
    start = () => {
        this.blocked();
        this.budget = +salaryAmount.value;
        this.getExpInc();
        this.getExpensesMonth();
        this.getAddExpInc(event);
        this.getBudget();
        this.showResult();
    };
    blocked = () => {
        const blockedItem = document.querySelectorAll('input');
        blockedItem.forEach((item) => item.disabled = true);
        start.style.display = 'none';
        cancel.style.display = 'block';
    };
    showResult = () => {
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = Math.ceil(appData.budgetDay);
        expensesMonthValue.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionalIncomeValue.value = this.addIncome.join(', ');
        incomePeriodValue.value = this.calcPeriod();
        targetMonthValue.value = Math.ceil(this.getTargetMonth())
        !isNaN(targetMonthValue.value) ? targetMonthValue.value = 'Срок' :  targetMonthValue.value = Math.ceil(this.getTargetMonth()); 
        periodSelect.addEventListener('input',() => incomePeriodValue.value = this.calcPeriod());
    };
    getExpInc = () => {
        const count = item => {
            const startStr = item.className.split('-')[0];
            const itemTitle = item.querySelector(`.${startStr}-title`).value;
            const itemAmount = item.querySelector(`.${startStr}-amount`).value;
            if(itemTitle != '' && itemAmount != '')
                this[startStr][itemTitle] = itemAmount;
        };
            
        incomeItems.forEach(count);
        expensesItems.forEach(count);

        for(let key in this.income){
            this.incomeMonth += +this.income[key];
        }   
    };
    addExpIncBlock = (event) => {
        const classes = event.target.className.split(' ')[1].split('_')[0];
        const button = document.querySelector(`.${classes}_add`);

        let item = document.querySelectorAll(`.${classes}-items`);

        const cloneIncomeitem = item[0].cloneNode(true);
        cloneIncomeitem.childNodes.forEach((item) => item.value = '');
        item[0].parentNode.insertBefore(cloneIncomeitem, button);
        item = document.querySelectorAll(`.${classes}-items`);

        if(item.length === 3){
            button.style.display = 'none';
        }
    };
    getAddExpInc = () => {
        const addFunc = (item, variable) => (item instanceof Array ) ? 
            item.forEach(ev => {ev.value != '' && variable.push(ev.trim())}) :
            item.forEach(ev => {ev.value != '' && variable.push(ev.value.trim())});
    
        addFunc(additionalIncomeItem, this.addIncome);
        addFunc(additionalExpensesItem.value.split(','), this.addExpenses);
    };
    getBudget = () => {
        this.budgetMonth = Math.floor(this.budget + this.incomeMonth - this.expensesMonth);
        this.budgetDay = Math.floor(this.budgetMonth / 30);
    };
    getExpensesMonth = () => {
        Object.values(this.expenses).forEach((item) => {this.expensesMonth += +item});
    };
    getTargetMonth = () => {
        return this.period = targetAmount.value / this.budgetMonth;    
    };
    calcPeriod = () => {
        return this.budgetMonth * periodSelect.value;
    };
    reset = () => {
        const resetItem = document.querySelectorAll('input');
        resetItem.forEach(item => {
            item.disabled = false;
            item.value = '';
        });
        start.style.display = 'block';
        cancel.style.display = 'none';
        start.disabled = true
        periodSelect.value = 1;
        periodAmount.textContent = 1;
        
        incomeItems = document.querySelectorAll('.income-items');
        expensesItems = document.querySelectorAll('.expenses-items');
        
        incomeItems.forEach ((item,i) => i != 1 && item.parentNode.removeChild(item));
        expensesItems.forEach ((item,i) => i != 1 && item.parentNode.removeChild(item));
            
        incomePlus.style.display = 'block';
        expensesPlus.style.display = 'block';

        this.budget = 0;
        this.income = {};
        this.addIncome = [];
        this.incomeMonth = 0;
        this.expenses = {};
        this.addExpenses = [];
        this.deposit = false;
        this.percentDeposit = 0;
        this.moneyDeposit = 0;
        this.budgetDay = 0;
        this.budgetMonth = 0;
        this.expensesMonth = 0;
    };
    eventsListeners = () => {
        salaryAmount.addEventListener('keyup',(event) => {
            event.target.value ? start.disabled = false : start.disabled = true;
            salaryAmount.value = salaryAmount.value.replace(/[^0-9]/g, "");
        });
        incomeAmount.addEventListener('keyup',(event)=>{
            incomeAmount.value = incomeAmount.value.replace(/[^0-9]/g, "");
        });
        const exAmount = document.querySelector('.expenses-amount');
        exAmount.addEventListener('keyup',(event)=>{
            exAmount.value = exAmount.value.replace(/[^0-9]/g, "");
        });
        const incomeTit = document.querySelector('.income-title');
        incomeTit.addEventListener('keyup',function() {
            incomeTit.value = incomeTit.value.replace(/^[а-я]*$/, "");
        });
        
        start.addEventListener('click', this.start.bind(appData));
        cancel.addEventListener('click', this.reset.bind(appData));
        expensesPlus.addEventListener('click', this.addExpIncBlock);
        incomePlus.addEventListener('click', this.addExpIncBlock);
        periodSelect.addEventListener('input', () => periodAmount.textContent = periodSelect.value);
    };
};  

const appData = new AppData();
appData.eventsListeners();