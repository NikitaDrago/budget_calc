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
 
const blocked = () => {
    const blockedItem = document.querySelectorAll('input');
    blockedItem.forEach((item) => item.disabled = true);
    start.style.display = 'none';
    cancel.style.display = 'block';
};

const reset = () => {
    const resetItem = document.querySelectorAll('input');
    resetItem.forEach(item => {
        item.disabled = false;
        item.value = '';
    });
    periodSelect.value = 1;
    start.style.display = 'block';
    cancel.style.display = 'none';
    start.disabled = true
};

const isNumber = n => !isNaN(parseFloat(n)) && isFinite(n);

const appData = {
    budget: 0,
    income: {},
    addIncome: [],
    incomeMonth: 0,
    expenses: {},
    addExpenses: [],
    deposit: false,
    percentDeposit: 0,
    moneyDeposit: 0,
    budgetDay: 0,
    budgetMonth: 0,
    expensesMonth: 0,
    start: function() {
        blocked();
        this.budget = +salaryAmount.value;
        this.getExpenses();
        this.getIncome();
        this.getExpensesMonth();
        this.getAddExpenses();
        this.getAddIncome();

        this.getBudget();
        this.showResult();
    },
    cancel: function(){
        reset();
    },
    showResult: function(){
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = Math.ceil(appData.budgetDay);
        expensesMonthValue.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionalIncomeValue.value = this.addIncome.join(', ');
        incomePeriodValue.value = this.calcPeriod();
        targetMonthValue.value = Math.ceil(this.getTargetMonth())
        // !isNaN(targetMonthValue.value) ? targetMonthValue.value = 'Срок' :  targetMonthValue.value = Math.ceil(this.getTargetMonth()); 
        periodSelect.addEventListener('input',() => incomePeriodValue.value = this.calcPeriod());
    },
    addExpensesBlock: function() {
        const cloneExpensesItem = expensesItems[0].cloneNode(true);
        expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
        expensesItems = document.querySelectorAll('.expenses-items');

        if(expensesItems.length === 3){
            expensesPlus.style.display = 'none';
        }
    },
    getExpenses: function(){
        expensesItems.forEach((item) => {
            const itemExpenses = item.querySelector('.expenses-title').value,
                  cashExpenses = item.querySelector('.expenses-amount').value;
            if(itemExpenses != '' && cashExpenses != '')
                appData.expenses[itemExpenses] = cashExpenses;
        });
    },
    addIncomeBlock: function() {
        const cloneIncomeitem = incomeItems[0].cloneNode(true);
        cloneIncomeitem.childNodes.forEach((item) => item.value = '');
        incomeItems[0].parentNode.insertBefore(cloneIncomeitem, incomePlus);
        incomeItems = document.querySelectorAll('.income-items');
        if(incomeItems.length === 3){
            incomePlus.style.display = 'none';
        }
    },
    getIncome: function() {
        incomeItems.forEach((item) => {
            const itemIncome = item.querySelector('.income-title').value,
                  cashIncome = item.querySelector('.income-amount').value;
            if(itemIncome != '' && cashIncome != '')
            this.income[itemIncome] = cashIncome;
        });
        for(let key in appData.income) 
            this.incomeMonth += +this.income[key];
    },
    getAddExpenses: function() {
        const addExpenses = additionalExpensesItem.value.split(',');
        addExpenses.forEach((item) => {
            item = item.trim();
            if(item != '')
                this.addExpenses.push(item);
        });
    },
    getAddIncome: function() {
        additionalIncomeItem.forEach((item) => {
            const itemValue = item.value.trim();
            if(itemValue != '')
                this.addIncome.push(itemValue);
        });
    },

    getBudget: function() {
        this.budgetMonth = Math.floor(this.budget + this.incomeMonth - this.expensesMonth);
        this.budgetDay = Math.floor(this.budgetMonth / 30);
    },
    getExpensesMonth: function() {
        Object.values(this.expenses).forEach((item) => {this.expensesMonth += +item});
    },
    getTargetMonth: function() {
        return this.period = targetAmount.value / this.budgetMonth;    
    },
    getInfoDeposit: function() {
        if(this.deposit){
            do{
                this.percentDeposit = prompt('Какой годовой депозит?');
            }while(!isNumber(this.percentDeposit));
            do{
                this.moneyDeposit = prompt('Какая сумма заложена?');
            }while(!isNumber(this.moneyDeposit));
        }
    },
    calcPeriod: function() {
        return this.budgetMonth * periodSelect.value;
    }
};

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

start.addEventListener('click', appData.start.bind(appData));
cancel.addEventListener('click', appData.cancel);
expensesPlus.addEventListener('click',appData.addExpensesBlock);
incomePlus.addEventListener('click',appData.addIncomeBlock);
periodSelect.addEventListener('input', () => periodAmount.textContent = periodSelect.value);