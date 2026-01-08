public with sharing class ProposalExpenseController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountsWithExpenses(Id proposalId) {
        if (proposalId == null) return new List<Account>();
        List<Account> accounts = [
            SELECT Id, Name, BillingCountry,
                (SELECT Id, Name, Approved_Category__c,
                        Total_Expense_Year1__c, Approved_Expense_Year1__c,
                        Total_Expense_Year2__c, Approved_Expense_Year2__c,
                        Total_Expense_Year3__c, Approved_Expense_Year3__c
                 FROM Expense_Categories__r)
            FROM Account WHERE Proposals__c = :proposalId];
        return accounts;
    }

    @AuraEnabled(cacheable=true)
    public static Map<Id, String> getFirstContactNames(List<Id> accountIds) {
        Map<Id, String> accountContactMap = new Map<Id, String>();
        if (accountIds == null || accountIds.isEmpty()) return accountContactMap;

        for (Contact c : [SELECT AccountId, Name FROM Contact WHERE AccountId IN :accountIds ORDER BY CreatedDate ASC]) {
            if (!accountContactMap.containsKey(c.AccountId)) {
                accountContactMap.put(c.AccountId, c.Name);
            }
        }
        return accountContactMap;
    }

    @AuraEnabled
    public static void saveExpenseCategories(List<Expense_Category__c> expenses) {
        if (expenses == null || expenses.isEmpty()) return;
        update expenses;
    }
}