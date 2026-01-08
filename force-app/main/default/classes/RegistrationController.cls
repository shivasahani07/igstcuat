global with sharing class RegistrationController {
  
    global class RegResult {
        public Boolean success;
        public String message;
        public Id accountId;
        public Id contactId;
    }

    @RemoteAction
    global static RegistrationController.RegResult register(
        String firstName,
        String lastName,
        String email,
        String password,
        String captchaInput,   // NEW
        String captchaShown    // NEW (server-rendered text the user saw)
    ) {
        RegistrationController.RegResult res = new RegistrationController.RegResult();
        try {
            // Basic required checks
            if (String.isBlank(firstName) || String.isBlank(lastName) || String.isBlank(email) || String.isBlank(password)) {
                return error('All fields are required.');
            }
            if (!isValidEmail(email)) {
                return error('Please enter a valid email address.');
            }

            // CAPTCHA VALIDATION (case-insensitive, ignore spaces)
            String inNorm = captchaInput == null ? '' : captchaInput.replaceAll('\\s+','').toLowerCase();
            String shNorm = captchaShown == null ? '' : captchaShown.replaceAll('\\s+','').toLowerCase();
            if (String.isBlank(inNorm) || String.isBlank(shNorm) || inNorm != shNorm) {
                return error('Invalid captcha. Please try again.');
            }

            // Duplicate email check
            if (![SELECT Id FROM Contact WHERE Email = :email LIMIT 1].isEmpty()) {
                return error('An account already exists with this email.');
            }

            // Create Account
            Account acc = new Account(
                Name = (String.isBlank(lastName) ? '' : lastName.trim()) +
                       (String.isBlank(firstName) ? '' : ', ' + firstName.trim())
            );
            insert acc;

            // Create Contact (example: storing a hash of password in a custom field)
            Contact con = new Contact(
                FirstName   = firstName != null ? firstName.trim() : null,
                LastName    = lastName  != null ? lastName.trim()  : null,
                Email       = email     != null ? email.trim()     : null,
                AccountId   = acc.Id,
                Password__c = secureHash(password)
            );
            insert con;

            res.success   = true;
            res.message   = 'Registration successful.';
            res.accountId = acc.Id;
            res.contactId = con.Id;
            return res;

        } catch (DmlException dmlEx) {
            return error('Save failed: ' + dmlEx.getDmlMessage(0));
        } catch (Exception ex) {
            return error('Unexpected error: ' + ex.getMessage());
        }
    }

    private static RegistrationController.RegResult error(String msg) {
        RegistrationController.RegResult r = new RegistrationController.RegResult();
        r.success = false; r.message = msg; return r;
    }

    private static Boolean isValidEmail(String email) {
        if (String.isBlank(email)) return false;
        Pattern p = Pattern.compile('(?i)^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$');
        return p.matcher(email).matches();
    }

    private static String secureHash(String input) {
        Blob digest = Crypto.generateDigest('SHA-256', Blob.valueOf(input));
        return EncodingUtil.convertToHex(digest);
    }
   
}