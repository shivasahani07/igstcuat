import { LightningElement } from 'lwc';

export default class TestComp extends LightningElement {
    handleLaunchConga() {
        const accountIds = '001e1000000tZl7AAE,001e1000000tZl8AAE,001e1000000tZl9AAE';

        const congaUrl =
            '/apex/APXTConga4__Conga_Composer?SolMgr=1' +
            '&serverUrl=https://indo-germansciencetechnologycentre--newdevutil.sandbox.my.salesforce.com/services/Soap/u/58.0' +
            '&Id=001e1000000tZl7AAE' + 
            '&QueryId=[GetAllAccFields]0Q_211EAI387132' +
            '&TemplateId=0T_046EAI602138' +
            '&pv0=' + accountIds;

        window.open(congaUrl, '_blank');
    }
}