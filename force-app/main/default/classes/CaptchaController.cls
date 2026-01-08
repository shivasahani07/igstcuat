public without sharing class CaptchaController {

    public String userInput {get; set;}
    public String captchaValue {get; set;}
    public String captchaDisplay {get; set;}
    public String email {get; set;}
    public String password {get; set;}
    private RegistrationController registrationController;
   

    @RemoteAction
    public static CaptchaController generateCaptcha() {
        CaptchaController c = new CaptchaController();
        c.captchaValue = createCaptcha();
        c.captchaDisplay = makeSpaced(c.captchaValue);
        return c;
    }

    @RemoteAction
    public static Map<String, Object> validateFormRemote(String email, String password, String userInput) {
        Map<String, Object> result = new Map<String, Object>();
        result.put('success', false);
        result.put('message', '');
        result.put('redirectUrl', '');

        if(String.isBlank(email) || String.isBlank(password) || String.isBlank(userInput)) {
            result.put('message', 'Please fill all required fields.');
            return result;
        }

        CaptchaController temp = generateCaptcha();

        // You can replace this logic with your actual validation
        Contact c = [SELECT Id, Password__c, Login_Hash_Code__c FROM Contact WHERE Email = :email LIMIT 1];
        if(c == null) {
            result.put('message', 'No account found for this email.');
            return result;
        }
        if(String.valueOf(c.Password__c) != password) {
            result.put('message', 'Incorrect password.');
            return result;
        }

        result.put('success', true);
        result.put('redirectUrl',
            'https://indo-germansciencetechnologycentre--newdevutil.sandbox.my.salesforce-sites.com/ApplicantDashboard/ApplicantPortal?id='
            + c.Login_Hash_Code__c
        );
        return result;
    }

    private static String createCaptcha() {
        String chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
        String captcha = '';
        for(Integer i=0;i<6;i++){
            Integer r = Math.mod(Math.abs(Crypto.getRandomInteger()), chars.length());
            captcha += chars.substring(r, r+1);
        }
        return captcha;
    }

    private static String makeSpaced(String s) {
        return String.join(new List<String>(s.split('')), ' ');
    }
}