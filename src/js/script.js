'use strict';

const start = document.querySelector('#start'),
    cancel = document.querySelector('#cancel'),
    btnAdd = document.querySelectorAll('.btn_plus'),
    incomePlus = btnAdd[0],
    expensesPlus = btnAdd[1],
    depositCheck = document.querySelector('#deposit-check'),
    depositBank = document.querySelector('.deposit-bank'),
    depositAmount = document.querySelector('.deposit-amount'),
    depositPercent = document.querySelector('.deposit-percent'),
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
    start() {
        this.blocked();
        this.budget = +salaryAmount.value;
        this.getExpInc();
        this.getExpensesMonth();
        this.getAddExpInc(event);
        this.getInfoDeposit();
        this.getBudget();
        this.showResult();
        this.saveData();
    };
    blocked() {
        const blockedItem = document.querySelectorAll('input');
        blockedItem.forEach((item) => item.disabled = true);
        start.style.display = 'none';
        cancel.style.display = 'block';
    };
    showResult() {
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = Math.ceil(this.budgetDay);
        expensesMonthValue.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionalIncomeValue.value = this.addIncome.join(', ');
        incomePeriodValue.value = this.calcPeriod();
        targetMonthValue.value = Math.ceil(this.getTargetMonth())
        periodSelect.addEventListener('input',() => incomePeriodValue.value = this.calcPeriod());
    };
    getExpInc() {
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
    addExpIncBlock(event) {
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
    getAddExpInc() {
        const addFunc = (item, variable) => (item instanceof Array ) ? 
            item.forEach(ev => {ev.value != '' && variable.push(ev.trim())}) :
            item.forEach(ev => {ev.value != '' && variable.push(ev.value.trim())});
    
        addFunc(additionalIncomeItem, this.addIncome);
        addFunc(additionalExpensesItem.value.split(','), this.addExpenses);
    };
    getBudget() {
        const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
        this.budgetMonth = Math.floor(this.budget + this.incomeMonth - this.expensesMonth + monthDeposit);
        this.budgetDay = Math.floor(this.budgetMonth / 30);
    };
    getExpensesMonth = () => { 
        Object.values(this.expenses).forEach((item) => {this.expensesMonth += +item});
    };
    getTargetMonth = () => targetAmount.value / this.budgetMonth;
    calcPeriod = () => this.budgetMonth * periodSelect.value;
    reset() {
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
        
        incomeItems.forEach ((item,i) => i > 1 && item.parentNode.removeChild(item));
        expensesItems.forEach ((item,i) => i > 1 && item.parentNode.removeChild(item));
            
        incomePlus.style.display = 'block';
        expensesPlus.style.display = 'block';

        depositCheck.checked = false;
        this.depositHandler();

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

        this.clearData();
    };
    getInfoDeposit(){
        if(this.deposit){
            this.percentDeposit = depositPercent.value;
            this.moneyDeposit = depositAmount.value;
        }
    };
    changePercent(){
        const valueSelect = this.value;
        if(valueSelect === 'other'){
            depositPercent.value = '';

            depositPercent.style.display = 'inline-block';
        }else{
            depositPercent.style.display = 'none';
            depositPercent.value = valueSelect;          
        }
    }
    depositHandler(){
        if(depositCheck.checked){
            depositBank.style.display = 'inline-block';
            depositAmount.style.display = 'inline-block';
            this.deposit = true;
            depositBank.addEventListener('change', this.changePercent);
        }else{
            depositBank.style.display = 'none';
            depositAmount.style.display = 'none';
            depositBank.value = '';
            depositAmount.value = '';
            this.deposit = false;
            depositBank.removeEventListener('change', this.changePercent);
        }
    };
    setCookie(name, value, options = {}) {

        options = {
          path: '/',
          ...options
        };
      
        if (options.expires instanceof Date) {
          options.expires = options.expires.toUTCString();
        }
      
        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
      Object.keys(options).map((optionKey) => {
          updatedCookie += "; " + optionKey;
          let optionValue = options[optionKey];
          if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
          }
      });
      
        document.cookie = updatedCookie;
    };
    deleteCookie(name) {
        this.setCookie(name, "", {
          'max-age': 'path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        })
      }
    getCookie(name) {
        let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };      
    saveData(){
        const result = document.querySelectorAll('.result-total');
        result.forEach((item,i) => {
            this.setCookie(`result-${i+1}`,`${item.value}`,{'max-age': 50000});
            localStorage.setItem(`result-${i+1}`, `${item.value}`);
        });

    };
    getData(){
        const result = document.querySelectorAll('.result-total');
        const keys = Object.keys(localStorage);
        keys.forEach((item,i) => {
            result[i].value = localStorage.getItem(item);
        });
    };
    clearData(){    
        localStorage.clear();
        const cookieKeys = document.cookie.split(';').map(item => item.split('=')[0].trim());
        cookieKeys.forEach(delItem => {
            console.log(delItem);
            this.deleteCookie(delItem);
        })
    }
    eventsListeners = () => {
        document.addEventListener("DOMContentLoaded", () => {
            const keys = Object.keys(localStorage);
            console.log(keys);
            const cookieKeys = document.cookie.split(';').map(item => item.split('=')[0].trim());
            keys.forEach(item => {
                if(!(`${this.getCookie(item)}` === `${localStorage.getItem(item)}`) || !item.indexOf(cookieKeys)){
                    this.clearData();
                }
            });
            this.getData();
        });

        salaryAmount.addEventListener('keyup',(event) => {
            event.target.value ? start.disabled = false : start.disabled = true;
            salaryAmount.value = salaryAmount.value.replace(/[^0-9]/g, "");
        });
        depositPercent.addEventListener('keyup', (event) => { if(!(depositPercent.value >= 0 && 100 >= depositPercent.value)) depositPercent.value = ''; });
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
        
        start.addEventListener('click', this.start.bind(this));
        cancel.addEventListener('click', this.reset.bind(this));
        expensesPlus.addEventListener('click', this.addExpIncBlock);
        incomePlus.addEventListener('click', this.addExpIncBlock);
        periodSelect.addEventListener('input', () => periodAmount.textContent = periodSelect.value);
        depositCheck.addEventListener('change', this.depositHandler.bind(this));
    };
};

const appData = new AppData();
appData.eventsListeners();