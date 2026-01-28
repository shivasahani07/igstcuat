public class displayProposalOutputFieldsApexClass {
     
    @AuraEnabled(cacheable=true)
    public static List<contact> getcontact(String proposalId){
        return [SELECT Id, Name,Institution__c,proposals__r.Total_funding_requested_from_IGSTC__c,Tentative_Start_Date__c,Tentative_End_Date__c, Fellowship_Duration__c, Industrial_Fellowship_Type__c, PhD_Enroll_Date__c, CONTACT_ADDRESS_FORMULA__c  FROM contact where Proposals__c=:proposalId ];
         
    }
    @AuraEnabled(cacheable=true)
    public static List<contact> getcontact1(String proposalId){
        List<Applicant_Proposal_Association__c> apas = [SELECT Contact__c FROM Applicant_Proposal_Association__c WHERE Proposals__c = :proposalId AND Is_Coordinator__c = true LIMIT 1];
        if (apas.isEmpty()) return new List<Contact>();
        return [SELECT Id, Name,Institution__c,Proposals__r.Total_funding_requested_from_IGSTC__c,Tentative_Start_Date__c,Tentative_End_Date__c, Fellowship_Duration__c, Industrial_Fellowship_Type__c, PhD_Enroll_Date__c, CONTACT_ADDRESS_FORMULA__c FROM Contact WHERE Id = :apas[0].Contact__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getaccount(String proposalId){
        return [SELECT Id, Name, Industry FROM Account where Proposals__c=:proposalId ];
         
    }
    
}