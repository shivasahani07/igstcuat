/**
 * Enforces at most one Applicant_Proposal_Association__c per Proposal with Is_Coordinator__c = true.
 * Call from trigger on Applicant_Proposal_Association__c (before insert, before update).
 */
public with sharing class ApplicantProposalAssociationTriggerHandler {
    public static void enforceOneCoordinatorPerProposal(List<Applicant_Proposal_Association__c> newList, Map<Id, Applicant_Proposal_Association__c> oldMap) {
        Set<Id> proposalIds = new Set<Id>();
        Map<Id, Integer> proposalIdToNewTrueCount = new Map<Id, Integer>();
        Set<Id> excludeIds = new Set<Id>();

        for (Applicant_Proposal_Association__c apa : newList) {
            if (apa.Proposals__c == null || apa.Is_Coordinator__c != true) continue;
            Boolean changedToTrue = (oldMap == null) || (oldMap.get(apa.Id) != null && oldMap.get(apa.Id).Is_Coordinator__c != true);
            if (!changedToTrue) continue;
            proposalIds.add(apa.Proposals__c);
            if (oldMap != null && apa.Id != null) excludeIds.add(apa.Id);
            proposalIdToNewTrueCount.put(apa.Proposals__c, proposalIdToNewTrueCount.get(apa.Proposals__c) == null ? 1 : proposalIdToNewTrueCount.get(apa.Proposals__c) + 1);
        }

        if (proposalIds.isEmpty()) return;

        Map<Id, Integer> existingCount = new Map<Id, Integer>();
        String soql = 'SELECT Proposals__c p, COUNT(Id) c FROM Applicant_Proposal_Association__c WHERE Proposals__c IN :proposalIds AND Is_Coordinator__c = true';
        if (!excludeIds.isEmpty()) soql += ' AND Id NOT IN :excludeIds';
        soql += ' GROUP BY Proposals__c';
        for (AggregateResult ar : Database.query(soql)) {
            existingCount.put((Id)ar.get('p'), (Integer)ar.get('c'));
        }

        for (Applicant_Proposal_Association__c apa : newList) {
            if (apa.Proposals__c == null || apa.Is_Coordinator__c != true) continue;
            Boolean changedToTrue = (oldMap == null) || (oldMap.get(apa.Id) != null && oldMap.get(apa.Id).Is_Coordinator__c != true);
            if (!changedToTrue) continue;
            Integer existing = existingCount.get(apa.Proposals__c) != null ? existingCount.get(apa.Proposals__c) : 0;
            Integer newTrue = proposalIdToNewTrueCount.get(apa.Proposals__c) != null ? proposalIdToNewTrueCount.get(apa.Proposals__c) : 0;
            if (existing + newTrue > 1) {
                apa.addError('Only one coordinator (Is_Coordinator__c = true) is allowed per proposal. Uncheck the current coordinator before setting another.');
            }
        }
    }
}
