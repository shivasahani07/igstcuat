({
    doInit: function (component, event, helper) {
        var recordId = component.get("v.recordId");
        var url = '/lightning/cmp/c__ExpenseHeadCompWISER?c__recordId=' + recordId;
        window.open(url, '_blank'); // opens in new tab
        $A.get("e.force:closeQuickAction").fire();
    }
})