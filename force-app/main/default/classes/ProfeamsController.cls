public with sharing class ProfeamsController {
    
    public String email { get; set; }
    public String password { get; set; }
    public Boolean isLoggedIn { get; set; }
    public Contact loggedInContact { get; set; }

    public ProfeamsController() {
        isLoggedIn = false; // default not logged in
    }

    // Login method
    public PageReference login() {
        List<Contact> cons = [
            SELECT Id, FirstName, LastName, Email
            FROM Contact
            WHERE Email = :email AND Password__c = :password
            LIMIT 1
        ];

        if (!cons.isEmpty()) {
            loggedInContact = cons[0];
            isLoggedIn = true;
        } else {
            ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'Invalid credentials'));
            isLoggedIn = false;
        }

        return null; // stay on same page
    }

    // Logout method
    public PageReference logout() {
        loggedInContact = null;
        isLoggedIn = false;
        email = '';
        password = '';
        return null;
    }
    
   }