public with sharing class ReviwerReport {
    public static List<AggregateResult> fetchReviewers() {
        return [
            SELECT Reviewer__r.Name reviewerName, COUNT(Id) mappingCount
            FROM Reviewer_Mapping__c
            GROUP BY Reviewer__r.Name
        ];
    }
}


/*public with sharing class ReviewerMappingService {
    
    public class ReviewerMappingCount {
        @AuraEnabled public Id reviewerId { get; set; }
        @AuraEnabled public String reviewerName { get; set; }
        @AuraEnabled public Integer mappingCount { get; set; }
        
        public ReviewerMappingCount(Id id, String name, Integer count) {
            this.reviewerId = id;
            this.reviewerName = name;
            this.mappingCount = count;
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static List<ReviewerMappingCount> getReviewerMappingCounts() {
        List<ReviewerMappingCount> results = new List<ReviewerMappingCount>();
        
        for (AggregateResult ar : [
            SELECT Reviewer__c reviewerId, Reviewer__r.Name reviewerName, COUNT(Id) mappingCount
            FROM Reviewer_Mapping__c
            GROUP BY Reviewer__c, Reviewer__r.Name
            ORDER BY COUNT(Id) DESC
        ]) {
            results.add(new ReviewerMappingCount(
                (Id)ar.get('reviewerId'),
                (String)ar.get('reviewerName'),
                (Integer)ar.get('mappingCount')
            ));
        }
        
        return results;
    }
}
<template>
    <lightning-card title="Reviewer Mapping Counts">
        <template if:true={data}>
            <table class="slds-table slds-table_bordered slds-table_cell-buffer">
                <thead>
                    <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">Reviewer Name</th>
                        <th scope="col">Count</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <template for:each={data} for:item="item" for:index="index">
                        <tr key={item.reviewerName}>
                            <td>{index + 1}</td>
                            <td>{item.reviewerName}</td>
                            <td>{item.mappingCount}</td>
                            <td>
                                <lightning-button 
                                    label="View Details" 
                                    variant="brand-outline"
                                    onclick={handleViewDetails}
                                    data-name={item.reviewerName}>
                                </lightning-button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </template>
        <template if:true={error}>
            <p class="slds-text-color_error">Error loading data</p>
        </template>
    </lightning-card>
</template>


import { LightningElement, wire, track } from 'lwc';
import getReviewerMappingCounts from '@salesforce/apex/ReviewerMappingService.getReviewerMappingCounts';

export default class ReviewerMappingTable extends LightningElement {
    @track data = [];
    @track error;

    @wire(getReviewerMappingCounts)
    wiredData({ error, data }) {
        if (data) {
            this.data = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = [];
        }
    }

    handleViewDetails(event) {
        const reviewerName = event.target.dataset.name;
        // For now, just log — you can replace with navigation or modal
        console.log('View details for:', reviewerName);

        // Example: Navigate to Reviewer record page (if you have Id in data)
        // this[NavigationMixin.Navigate]({...});
    }
}

*/