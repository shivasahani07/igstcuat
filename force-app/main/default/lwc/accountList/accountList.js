import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAllAccounts from '@salesforce/apex/AccountController.getAllAccounts';
import getAccountCount from '@salesforce/apex/AccountController.getAccountCount';

const COLUMNS = [
    { label: 'Account Name', fieldName: 'Name', type: 'text', sortable: true },
    { label: 'Type', fieldName: 'Type', type: 'text', sortable: true },
    { label: 'Industry', fieldName: 'Industry', type: 'text', sortable: true },
    { label: 'Phone', fieldName: 'Phone', type: 'phone', sortable: true },
    { 
        label: 'Website', 
        fieldName: 'Website', 
        type: 'url', 
        sortable: true,
        typeAttributes: { target: '_blank' }
    },
    { label: 'Billing City', fieldName: 'BillingCity', type: 'text', sortable: true },
    { label: 'Billing State', fieldName: 'BillingState', type: 'text', sortable: true },
    { label: 'Billing Country', fieldName: 'BillingCountry', type: 'text', sortable: true },
    { 
        label: 'Created Date', 
        fieldName: 'CreatedDate', 
        type: 'date', 
        sortable: true,
        typeAttributes: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }
    }
];

export default class AccountList extends LightningElement {
    @track accounts = [];
    @track filteredAccounts = [];
    @track totalAccounts = 0;
    @track isLoading = true;
    @track searchKey = '';
    @track sortedBy = 'Name';
    @track sortDirection = 'asc';
    
    columns = COLUMNS;

    @wire(getAllAccounts)
    wiredAccounts({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.accounts = data;
            this.filteredAccounts = [...data];
            this.showToast('Success', `${data.length} accounts loaded successfully`, 'success');
        } else if (error) {
            this.showToast('Error', 'Error loading accounts: ' + error.body.message, 'error');
            console.error('Error loading accounts:', error);
        }
    }

    @wire(getAccountCount)
    wiredAccountCount({ error, data }) {
        if (data) {
            this.totalAccounts = data;
        } else if (error) {
            console.error('Error getting account count:', error);
        }
    }

    handleSearch(event) {
        this.searchKey = event.target.value.toLowerCase();
        this.filterAccounts();
    }

    filterAccounts() {
        if (this.searchKey) {
            this.filteredAccounts = this.accounts.filter(account => 
                account.Name?.toLowerCase().includes(this.searchKey) ||
                account.Type?.toLowerCase().includes(this.searchKey) ||
                account.Industry?.toLowerCase().includes(this.searchKey) ||
                account.BillingCity?.toLowerCase().includes(this.searchKey) ||
                account.BillingState?.toLowerCase().includes(this.searchKey) ||
                account.BillingCountry?.toLowerCase().includes(this.searchKey)
            );
        } else {
            this.filteredAccounts = [...this.accounts];
        }
    }

    handleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.filteredAccounts];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.filteredAccounts = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }

    sortBy(field, reverse) {
        const key = function(x) { return x[field]; };
        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    handleRefresh() {
        this.isLoading = true;
        // Refresh the wired data
        eval("$A.get('e.force:refreshView').fire();");
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }

    get displayedAccountsCount() {
        return this.filteredAccounts.length;
    }

    get hasAccounts() {
        return this.filteredAccounts && this.filteredAccounts.length > 0;
    }
}