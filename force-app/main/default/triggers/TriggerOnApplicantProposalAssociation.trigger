trigger TriggerOnApplicantProposalAssociation on Applicant_Proposal_Association__c (before insert, before update) {
    if (Trigger.isBefore) {
        if (Trigger.isInsert) {
            ApplicantProposalAssociationTriggerHandler.enforceOneCoordinatorPerProposal(Trigger.new, null);
        } else if (Trigger.isUpdate) {
            ApplicantProposalAssociationTriggerHandler.enforceOneCoordinatorPerProposal(Trigger.new, Trigger.oldMap);
        }
    }
}
