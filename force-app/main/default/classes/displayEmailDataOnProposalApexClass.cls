public class displayEmailDataOnProposalApexClass {
     
    @AuraEnabled(cacheable=true)
    public static List<EmailMessage> getEmailMessagesBasedOnContact(String proposalId){
        List<Id> contactIds = new List<Id>();
        for (Applicant_Proposal_Association__c apa : [SELECT Contact__c FROM Applicant_Proposal_Association__c WHERE Proposals__c = :proposalId AND Is_Coordinator__c = true LIMIT 1]) {
            contactIds.add(apa.Contact__c);
        }
        List<EmailMessage> emailList = contactIds.isEmpty() ? new List<EmailMessage>() : new List<EmailMessage>([SELECT Id, Subject,Status,messagedate, Name, Contact__c,Contact__r.Name FROM EmailMessage WHERE Contact__c IN :contactIds]);
        if(!emailList.isEmpty()) {
            return emailList;
        }
        return emailList;
    }
    
}