// Data Migration Script - Populate APA.Is_Coordinator__c from Contact.Is_Primary__c
// Run in Anonymous Apex. Test in sandbox first.

List<Applicant_Proposal_Association__c> apaToUpdate = new List<Applicant_Proposal_Association__c>();

for (Applicant_Proposal_Association__c apa : [
    SELECT Id, Is_Coordinator__c, Contact__c, Contact__r.Is_Primary__c, Proposals__c
    FROM Applicant_Proposal_Association__c
    WHERE Contact__r.Is_Primary__c != null
]) {
    if (apa.Is_Coordinator__c != apa.Contact__r.Is_Primary__c) {
        apa.Is_Coordinator__c = apa.Contact__r.Is_Primary__c;
        apaToUpdate.add(apa);
    }
}

if (!apaToUpdate.isEmpty()) {
    update apaToUpdate;
    System.debug('Updated ' + apaToUpdate.size() + ' APA records with Is_Coordinator__c from Contact.Is_Primary__c');
} else {
    System.debug('No APA records required updates.');
}
