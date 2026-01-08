import { LightningElement, api, wire, track } from 'lwc';
import getAccountsWithExpenses from '@salesforce/apex/ProposalExpenseController.getAccountsWithExpenses';
import getFirstContactNames from '@salesforce/apex/ProposalExpenseController.getFirstContactNames';
import saveExpenseCategories from '@salesforce/apex/ProposalExpenseController.saveExpenseCategories';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import IndiaFlag from '@salesforce/resourceUrl/indiaFlag';
import GermanyFlag from '@salesforce/resourceUrl/germanyFlag';

export default class ApprovedExpenseComponent extends LightningElement {
    @api recordId;
    @track accounts = [];

    @wire(getAccountsWithExpenses, { proposalId: '$recordId' })
    wiredAccounts({ data, error }) {
        if (data) {
            const accountIds = data.map(acc => acc.Id);

            getFirstContactNames({ accountIds })
                .then(contactMap => {
                    this.accounts = data.map(acc => ({
                        accountId: acc.Id,
                        accountName: acc.Name,
                        billingCountry: acc.BillingCountry,
                        contactName: contactMap[acc.Id] || '',
                        isOpen: false,
                        iconName: 'utility:add',
                        flagUrl: acc.BillingCountry === 'India' ? IndiaFlag :
                                 acc.BillingCountry === 'Germany' ? GermanyFlag : '',
                        expenses: (acc.Expense_Categories__r || []).map((exp, index) => ({
                            ...exp,
                            approvedExpenseYear1Value: exp.Approved_Expense_Year1__c,
                            approvedExpenseYear2Value: exp.Approved_Expense_Year2__c,
                            approvedExpenseYear3Value: exp.Approved_Expense_Year3__c,
                            rowClass: index % 2 === 0 ? 'even-row' : 'odd-row'
                        }))
                    }));
                })
                .catch(err => console.error('Error fetching contacts', err));
        } else if (error) {
            console.error(error);
        }
    }

    toggleAccordion(event) {
        const id = event.currentTarget.dataset.id;
        this.accounts = this.accounts.map(acc => {
            if (acc.accountId === id) {
                acc.isOpen = !acc.isOpen;
                acc.iconName = acc.isOpen ? 'utility:dash' : 'utility:add';
            } else {
                acc.isOpen = false;
                acc.iconName = 'utility:add';
            }
            return acc;
        });
    }

    handleInputChange(event) {
        const expId = event.target.dataset.id;
        const field = event.target.dataset.field;
        let value;

        if (event.target.type === 'checkbox') {
            value = event.target.checked;
        } else if (event.target.type === 'number') {
            value = event.target.value ? parseFloat(event.target.value) : null;
        } else {
            value = event.target.value;
        }

        this.accounts = this.accounts.map(acc => {
            acc.expenses = acc.expenses.map(exp => {
                if (exp.Id === expId) {
                    switch (field) {
                        case 'Approved_Category__c':
                            exp.Approved_Category__c = value;
                            break;
                        case 'Approved_Expense_Year1__c':
                            exp.approvedExpenseYear1Value = value;
                            break;
                        case 'Approved_Expense_Year2__c':
                            exp.approvedExpenseYear2Value = value;
                            break;
                        case 'Approved_Expense_Year3__c':
                            exp.approvedExpenseYear3Value = value;
                            break;
                        default:
                            exp[field] = value;
                    }
                }
                return exp;
            });
            return acc;
        });
    }

    handleSave(event) {
        const accId = event.currentTarget.dataset.id;
        const account = this.accounts.find(acc => acc.accountId === accId);

        const expensesToUpdate = account.expenses.map(exp => ({
            Id: exp.Id,
            Approved_Category__c: exp.Approved_Category__c,
            Approved_Expense_Year1__c: exp.approvedExpenseYear1Value,
            Approved_Expense_Year2__c: exp.approvedExpenseYear2Value,
            Approved_Expense_Year3__c: exp.approvedExpenseYear3Value
        }));

        if (!expensesToUpdate.length) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Info',
                message: 'No Expense Categories to save for this account',
                variant: 'info'
            }));
            return;
        }

        saveExpenseCategories({ expenses: expensesToUpdate })
            .then(() => {
                 console.log('Save succeeded, showing toast');
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Expenses updated successfully',
                    variant: 'success'
                }));
            })
            .catch(error => {
                let message = 'Unknown error';
                if (error.body && error.body.message) {
                    message = error.body.message;
                }
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error saving expenses',
                    message,
                    variant: 'error'
                }));
            });
    }
}