'use strict';

const start = document.querySelector('#start'),
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
    incomeItems = document.querySelectorAll('.income-items'),
    incomeAmount = document.querySelector('.income-amount'),
    expensesTitle = document.querySelector('.expenses-title'),
    expensesItems = document.querySelectorAll('.expenses-items'),
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    targetAmount = document.querySelector('.target-amount'),
    periodSelect = document.querySelector('.period-select'),
    periodAmount = document.querySelector('.period-amount'),
    input = document.querySelectorAll('input');


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
    start: () => {
        appData.budget = +salaryAmount.value;
        appData.getExpenses();
        appData.getIncome();
        appData.getExpensesMonth();
        appData.getAddExpenses();
        appData.getAddIncome();

        appData.getBudget();
        appData.showResult();
    },
    showResult: () =>{
        budgetMonthValue.value = appData.budgetMonth;
        budgetDayValue.value = Math.ceil(appData.budgetDay);
        expensesMonthValue.value = appData.expensesMonth;
        additionalExpensesValue.value = appData.addExpenses.join(', ');
        additionalIncomeValue.value = appData.addIncome.join(', ');
        targetMonthValue.value = Math.ceil(appData.getTargetMonth());
        incomePeriodValue.value = appData.calcPeriod();
        periodSelect.addEventListener('input',() => incomePeriodValue.value = appData.calcPeriod());
    },
    addExpensesBlock: () => {
        const cloneExpensesItem = expensesItems[0].cloneNode(true);
        expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
        expensesItems = document.querySelectorAll('.expenses-items');

        if(expensesItems.length === 3){
            expensesPlus.style.display = 'none';
        }
    },
    getExpenses: () =>{
        expensesItems.forEach((item) => {
            const itemExpenses = item.querySelector('.expenses-title').value,
                  cashExpenses = item.querySelector('.expenses-amount').value;
            if(itemExpenses != '' && cashExpenses != '')
                appData.expenses[itemExpenses] = cashExpenses;
        });
    },
    addIncomeBlock: () => {
        const cloneIncomeitem = incomeItems[0].cloneNode(true);
        cloneIncomeitem.childNodes.forEach((item) => item.value = '');
        incomeItems[0].parentNode.insertBefore(cloneIncomeitem, incomePlus);
        incomeItems = document.querySelectorAll('.income-items');

        if(incomeItems.length === 3){
            incomePlus.style.display = 'none';
        }
    },
    getIncome: () => {
        incomeItems.forEach((item) => {
            const itemIncome = item.querySelector('.income-title').value,
                  cashIncome = item.querySelector('.income-amount').value;
            if(itemIncome != '' && cashIncome != '')
                appData.income[itemIncome] = cashIncome;
        });
        for(let key in appData.income) 
            appData.incomeMonth += +appData.income[key];
    },
    getAddExpenses: () => {
        const addExpenses = additionalExpensesItem.value.split(',');
        addExpenses.forEach((item) => {
            item = item.trim();
            if(item != '')
                appData.addExpenses.push(item);
        });
    },
    getAddIncome: () => {
        additionalIncomeItem.forEach((item) => {
            const itemValue = item.value.trim();
            if(itemValue != '')
                appData.addIncome.push(itemValue);
        });
    },

    getBudget: function() {
        appData.budgetMonth = Math.floor(appData.budget + appData.incomeMonth - appData.expensesMonth);
        appData.budgetDay = Math.floor(appData.budgetMonth / 30);
    },
    getExpensesMonth: () => {
        Object.values(appData.expenses).forEach((item) => appData.expensesMonth += +item);
    },
    getTargetMonth: () => {
        return appData.period = targetAmount.value / appData.budgetMonth;    
    },
    getInfoDeposit: () => {
        if(appData.deposit){
            do{
                appData.percentDeposit = prompt('Какой годовой депозит?');
            }while(!isNumber(appData.percentDeposit));
            do{
                appData.moneyDeposit = prompt('Какая сумма заложена?');
            }while(!isNumber(appData.moneyDeposit));
        }
    },
    calcPeriod: () => {
        return appData.budgetMonth * periodSelect.value;
    }
};

salaryAmount.addEventListener('keyup',(event)=>{
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
incomeTit.addEventListener('keyup',(event)=>{
    incomeTit.value = incomeTit.value.replace(/[^0-9]/g, "");
});

start.addEventListener('click', appData.start);


expensesPlus.addEventListener('click',appData.addExpensesBlock);
incomePlus.addEventListener('click',appData.addIncomeBlock);
periodSelect.addEventListener('input', () => periodAmount.textContent = periodSelect.value);