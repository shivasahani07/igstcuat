import { LightningElement, api } from 'lwc';

export default class PaginationTwo extends LightningElement {
    _records = [];
    pageContacts = [];
    currentPage = 1;
    pageSize = 5;
    totalPages = 0;
    pagesList = [];
    recordsInitialized = false;

    @api
    get records() {
        return this._records;
    }
    set records(value) {
        this._records = value;
        this.currentPage = 1;
        this.recordsInitialized = false;

        if (value && value.length > 0) {
            this.totalPages = Math.ceil(value.length / this.pageSize);
            this.preparePages();
            this.updateContactsToShow();
            this.recordsInitialized = true;
        }
    }

    get isNextDisabled() {
        return this.currentPage === this.totalPages;
    }

    get isPrevDisabled() {
        return this.currentPage === 1;
    }

    preparePages() {
        this.pagesList = [];

        let startPage = Math.max(1, this.currentPage - 1);
        let endPage = startPage + 3;

        if (endPage > this.totalPages) {
            endPage = this.totalPages;
            startPage = Math.max(1, endPage - 3);
        }

        for (let i = startPage; i <= endPage; i++) {
            this.pagesList.push({
                pageNumber: i,
                isClass: i === this.currentPage ? 'current-page' : ''
            });
        }
    }

    updateContactsToShow() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.pageContacts = this._records.slice(start, end);

        this.preparePages();

        this.dispatchEvent(new CustomEvent('update', { detail: this.pageContacts }));
    }

    handlePageChange(event) {
        this.currentPage = parseInt(event.target.dataset.page, 10);
        this.updateContactsToShow();
    }

    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updateContactsToShow();
        }
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updateContactsToShow();
        }
    }
}