public without sharing class ContactProfileController {
    
    public Contact con { get; set; }
    public Id recordId { get; set; }
    public List<Education_Details__c> educationList { get; set; }
    public List<Employment_Details__c> employmentList { get; set; }
    public List<Achievement__c> achievementList { get; set; }
    
    
    public Blob profileImage { get; set; }
    public String profileImageName { get; set; }
    public Id profileImageId { get; set; }
    
    public String getProfileImageUrl() {
        if (profileImageId != null) {
            String attId = String.valueOf(profileImageId);
            // Ensure it's 18 characters for the URL
            // if (attId.length() == 15) {
                //     attId = attId + 'AAA';
            // }
            return '/servlet/servlet.FileDownload?file=' + attId;
        }
        return null;
    }
    
    public Boolean getHasProfileImage() {
        return profileImageId != null;
    }
    
    public String getEducationListJSON() {
        return JSON.serialize(educationList);
    }
    
    public String getEmploymentListJSON() {
        return JSON.serialize(employmentList);
    }
    
    public String getAchievementListJSON() {
        return JSON.serialize(achievementList);
    }
    
    
    public ContactProfileController() {
        // Get recordId from page parameters
        recordId = ApexPages.currentPage().getParameters().get('id');
        // Fallback to hardcoded for testing if needed
        //recordId = '003e1000003dj0NAAQ';
        
        //recordId = '003e1000003CAOXAA4';
        if (recordId != null) {
            try {
                // Fetch Contact with related Education and Employment details
                con = [
                    SELECT Id, Salutation, FirstName, LastName, Email, Phone,MobilePhone,
                           MailingCountry, MailingCity, MailingPostalCode,MailingState,
                           MailingStreet, Title,Designation__c,Department,AccountId,Account.Id,Account.Name,
                           Profile_Pic_Attachment_Id__c, Uploaded__c,
                           (SELECT Id, Name, Degree__c, Institution_Name__c, Area_of_specialization__c, 
                                   Start_Year__c, End_Year__c, CGPA__c, Percentage__c, Percentage_cgpa__c,
                                   Start_Date__c, End_Date__c, Nature_of_PhD_Work__c, Nature_of_Thesis_Work__c,
                                   Thesis_Supervisor__c, Thesis_Type__c, Title_Thesis__c
                            FROM Education_Details__r
                            ORDER BY End_Year__c DESC NULLS LAST, Start_Year__c DESC NULLS LAST),
                           (SELECT Id, Name, Organization_Name__c, Position__c, Start_Date__c, End_Date__c,
                                   Start_Year__c, End_Year__c, Nature_of_Job__c, current_employement__c
                            FROM Employment_Details__r
                            ORDER BY End_Date__c DESC NULLS LAST, Start_Date__c DESC NULLS LAST),
                            (SELECT Id, Name, Awards_Honours__c, List_of_Publications__c, Book_Chapters__c, List_of_Patents_filed__c, Any_other_achievements__c                                   
                            FROM Achievements__r
                            ORDER BY CreatedDate DESC)
                    FROM Contact
                    WHERE Id = :recordId
                    LIMIT 1
                ];
                
                // Populate lists from relationship queries
                educationList = con.Education_Details__r != null ? con.Education_Details__r : new List<Education_Details__c>();
                employmentList = con.Employment_Details__r != null ? con.Employment_Details__r : new List<Employment_Details__c>();
                
                // Handle Achievements - try both relationship names in case one doesn't work
                try {
                    achievementList = con.Achievements__r != null && !con.Achievements__r.isEmpty()
                        ? con.Achievements__r
                        : new List<Achievement__c>();
                } catch (Exception ex) {
                    // If Achievements__r doesn't work, try querying directly
                    achievementList = new List<Achievement__c>();
                    try {
                        List<Achievement__c> achList = [
                            SELECT Id, Name, Awards_Honours__c, List_of_Publications__c, 
                                   Book_Chapters__c, List_of_Patents_filed__c, Any_other_achievements__c
                            FROM Achievement__c
                            WHERE Contact__c = :con.Id
                            ORDER BY CreatedDate DESC
                            LIMIT 10
                        ];
                        achievementList = achList;
                    } catch (Exception e2) {
                        achievementList = new List<Achievement__c>();
                    }
                }
                
                
            } catch (Exception e) {
                ApexPages.addMessage(
                    new ApexPages.Message(ApexPages.Severity.ERROR, 'Error loading contact: ' + e.getMessage())
                    );
                con = new Contact();
                educationList = new List<Education_Details__c>();
                employmentList = new List<Employment_Details__c>();
                achievementList= new List<Achievement__c>();
            }
        } else {
            // If no recordId provided, create new contact
            con = new Contact();
            educationList = new List<Education_Details__c>();
            employmentList = new List<Employment_Details__c>();
            achievementList= new List<Achievement__c>();
        }
        
        // Load existing profile image if available
        if (recordId != null && con != null && con.Id != null) {
            try {
                // Check if Profile_Pic_Attachment_Id__c exists
                if (con.Profile_Pic_Attachment_Id__c != null) {
                    String attIdStr = String.valueOf(con.Profile_Pic_Attachment_Id__c);
                    // If it's 15 chars, convert to 18 chars for full ID
                    // if (attIdStr.length() == 15) {
                        //     attIdStr = attIdStr + 'AAA';
                    // }
                    profileImageId = Id.valueOf(attIdStr);
                } else {
                    // Try to find latest attachment
                    List<Attachment> imgs = [
                        SELECT Id, Name
                        FROM Attachment
                        WHERE ParentId = :con.Id
                        AND (Name LIKE '%.jpg' OR Name LIKE '%.jpeg' OR Name LIKE '%.png' OR Name LIKE 'profile%' OR Name LIKE 'photo%')
                        ORDER BY CreatedDate DESC
                        LIMIT 1
                    ];
                    if (!imgs.isEmpty()) {
                        profileImageId = imgs[0].Id;
                        // Update contact with attachment ID (15 chars)
                        String attId = String.valueOf(imgs[0].Id);
                        // if (attId.length() == 18) {
                        //     attId = attId.substring(0, 15);
                        // }
                        con.Profile_Pic_Attachment_Id__c = attId;
                        con.Uploaded__c = true;
                    }
                }
            } catch (Exception e) {
                // Ignore errors in loading image
                System.debug('Error loading profile image: ' + e.getMessage());
            }
        }
    }
    
    
    @RemoteAction
    public static String doUploadProfilePic(String contactId, String attachmentBody, String attachmentName) {
        try {
            if (contactId != null && attachmentBody != null) {
                // Delete old profile picture attachments if any
                Contact con = [SELECT Id, Profile_Pic_Attachment_Id__c FROM Contact WHERE Id = :contactId LIMIT 1];
                
                if (con.Profile_Pic_Attachment_Id__c != null) {
                    try {
                        String oldAttId = con.Profile_Pic_Attachment_Id__c;
                        List<Attachment> oldAtts = [
                            SELECT Id FROM Attachment 
                            WHERE Id = :oldAttId OR (ParentId = :contactId AND (Name LIKE 'Profile_Picture%' OR Name LIKE 'profile%'))
                        ];
                        if (!oldAtts.isEmpty()) {
                            delete oldAtts;
                        }
                    } catch (Exception e) {
                        System.debug('Error deleting old attachment: ' + e.getMessage());
                    }
                }
                
                // Create new Attachment
                Attachment att = new Attachment();
                String newBody = '';
                newBody += attachmentBody;
                att.Body = EncodingUtil.base64Decode(newBody);
                att.Name = attachmentName != null ? attachmentName : 'Profile_Picture_' + System.now().getTime() + '.jpg';
                att.ParentId = contactId;
                
                insert att;
                
                
                String attId = att.Id;
                update new Contact(Id = contactId, Profile_Pic_Attachment_Id__c = attId, Uploaded__c = true);
                
                // Return full 18-char ID for image URL
                return String.valueOf(att.Id);
            }
            return null;
        } catch (Exception e) {
            System.debug('Error in doUploadProfilePic: ' + e.getMessage() + ' Line: ' + e.getLineNumber());
            return 'ERROR: ' + e.getMessage();
        }
    }
    
    // @RemoteAction
    // public static String saveContactProfile(Contact contactData) {
        //     try {
            //         if (contactData != null) {
                //             upsert contactData;
                //             return 'SUCCESS';
            //         }
            //         return 'ERROR: No contact data provided';
        //     } catch (Exception e) {
            //         System.debug('Error saving contact: ' + e.getMessage());
            //         return 'ERROR: ' + e.getMessage();
        //     }
    // }
    @RemoteAction
    public static String saveContactProfile(Map<String, Object> contactData) {
        try {
            
            Contact c = new Contact();
            c.Id = (String) contactData.get('Id');
            c.Salutation = (String) contactData.get('Salutation');
            c.FirstName = (String) contactData.get('FirstName');
            c.LastName = (String) contactData.get('LastName');
            c.Designation__c = (String) contactData.get('Designation__c');
            c.Department = (String) contactData.get('Department');
            c.Email = (String) contactData.get('Email');
            c.MobilePhone = (String) contactData.get('MobilePhone');
            c.MailingCountry = (String) contactData.get('MailingCountry');
            c.MailingStreet = (String) contactData.get('MailingStreet');
            c.MailingState = (String) contactData.get('MailingState');
            c.MailingCity = (String) contactData.get('MailingCity');
            c.MailingPostalCode = (String) contactData.get('MailingPostalCode');
            
            // ✅ HANDLE ACCOUNT
            String accountName = (String) contactData.get('AccountName');
            if (String.isNotBlank(accountName)) {
                Account acc;
                
                List<Account> accList = [
                SELECT Id
                FROM Account
                WHERE Name = :accountName
                LIMIT 1
            ];
                
                if (!accList.isEmpty()) {
                    acc = accList[0];
                } else {
                    acc = new Account(Name = accountName);
                    insert acc;
                }
                
                c.AccountId = acc.Id;
            }
            
            upsert c;
            return 'SUCCESS';
            
        } catch (Exception e) {
            return 'ERROR: ' + e.getMessage();
        }
    }
    
    
    @RemoteAction
    public static String saveEducationDetails(
        String contactId,
    String educationJson
    ) {
        try {
            List<Object> rawList =
                (List<Object>) JSON.deserializeUntyped(educationJson);
            
            List<Education_Details__c> educationList =
                new List<Education_Details__c>();
            
            for (Object obj : rawList) {
                Map<String, Object> row =
                    (Map<String, Object>) obj;
                
                Education_Details__c edu = new Education_Details__c();
                
                edu.Id = (String) row.get('Id');
                edu.Contact__c = contactId;
                edu.Degree__c = (String) row.get('Degree__c');
                edu.Institution_Name__c = (String) row.get('Institution_Name__c');
                edu.Area_of_specialization__c =
                    (String) row.get('Area_of_specialization__c');
                
                // ✅ SAFE DATE HANDLING
                String startDateStr = (String) row.get('Start_Date__c');
                if (String.isNotBlank(startDateStr)) {
                    edu.Start_Date__c = Date.valueOf(startDateStr);
                }
                
                String endDateStr = (String) row.get('End_Date__c');
                if (String.isNotBlank(endDateStr)) {
                    edu.End_Date__c = Date.valueOf(endDateStr);
                }
                
                educationList.add(edu);
            }
            
            if (educationList.isEmpty()) {
                return 'ERROR: No education data provided';
            }
            
            upsert educationList;
            return 'SUCCESS';
            
        } catch (Exception e) {
            System.debug('Error saving education: ' + e.getMessage());
            return 'ERROR: ' + e.getMessage();
        }
    }
    
    
    @RemoteAction
    public static String saveEmploymentDetails(
        String contactId,
    String employmentJson
    ) {
        try {
            List<Employment_Details__c> employmentList =
                (List<Employment_Details__c>) JSON.deserialize(
                employmentJson,
            List<Employment_Details__c>.class
                );
            
            if (employmentList == null || employmentList.isEmpty()) {
                return 'ERROR: No employment data provided';
            }
            
            for (Employment_Details__c emp : employmentList) {
                if (emp.Contact__c == null) {
                    emp.Contact__c = contactId;
                }
            }
            
            upsert employmentList;
            return 'SUCCESS';
            
        } catch (Exception e) {
            return 'ERROR: ' + e.getMessage();
        }
    }

    @RemoteAction
public static String deleteEducationRecord(String recordId) {
    try {
        delete new Education_Details__c(Id = recordId);
        return 'SUCCESS';
    } catch (Exception e) {
        return 'ERROR: ' + e.getMessage();
    }
}

@RemoteAction
public static String deleteEmploymentRecord(String recordId) {
    try {
        delete new Employment_Details__c(Id = recordId);
        return 'SUCCESS';
    } catch (Exception e) {
        return 'ERROR: ' + e.getMessage();
    }
}

    
    
    
    
    
    @RemoteAction
    public static String saveAchievementDetails(
        String contactId,
    String achievementJson
    ) {
        try {
            List<Achievement__c> achievements =
                (List<Achievement__c>) JSON.deserialize(
                achievementJson,
            List<Achievement__c>.class
                );
            
            if (achievements == null || achievements.isEmpty()) {
                return 'ERROR: No achievement data provided';
            }
            
            for (Achievement__c ach : achievements) {
                if (ach.Contact__c == null) {
                    ach.Contact__c = contactId;
                }
            }
            
            upsert achievements;
            return 'SUCCESS';
            
        } catch (Exception e) {
            System.debug('Error saving achievement: ' + e.getMessage());
            return 'ERROR: ' + e.getMessage();
        }
    }
    
    
    
    @RemoteAction
    public static String getProfileImageUrl(String contactId) {
        try {
            Contact con = [SELECT Id, Profile_Pic_Attachment_Id__c FROM Contact WHERE Id = :contactId LIMIT 1];
            if (con.Profile_Pic_Attachment_Id__c != null) {
                String attId = con.Profile_Pic_Attachment_Id__c;
                
                return '/servlet/servlet.FileDownload?file=' + attId;
            }
            return null;
        } catch (Exception e) {
            System.debug('Error getting profile image URL: ' + e.getMessage());
            return null;
        }
    }
    
    
    public void addEducationRow() {
        educationList.add(new Education_Details__c(Contact__c = con.Id));
    }   
           
    public void addEmploymentRow() {
        employmentList.add(new Employment_Details__c(Contact__c = con.Id));
    }
    
    /* ================= ACHIEVEMENTS ================= */
    // public PageReference saveAchievements() {
    //     try {
    //         if (achievementList == null || achievementList.isEmpty()) {
    //             // Create a new achievement record if none exists
    //             Achievement__c newAch = new Achievement__c(Contact__c = con.Id);
    //             insert newAch;
    //             // Reload the contact to get the new achievement
    //             achievementList = [
    //                 SELECT Id, Name, Awards_Honours__c, List_of_Publications__c, 
    //                        Book_Chapters__c, List_of_Patents_filed__c, Any_other_achievements__c
    //                 FROM Achievement__c
    //                 WHERE Contact__c = :con.Id
    //                 ORDER BY CreatedDate DESC
    //                 LIMIT 10
    //             ];
    //         } else {
    //             // Ensure all achievements are linked to the contact
    //             for (Achievement__c ach : achievementList) {
    //                 if (ach.Contact__c == null) {
    //                     ach.Contact__c = con.Id;
    //                 }
    //             }
    //             upsert achievementList;
    //         }
    //         ApexPages.addMessage(
    //             new ApexPages.Message(ApexPages.Severity.CONFIRM, 'Achievements saved successfully')
    //             );
    //     } catch (Exception e) {
    //         ApexPages.addMessage(
    //             new ApexPages.Message(ApexPages.Severity.ERROR, 'Error saving achievements: ' + e.getMessage())
    //             );
    //     }
    //     return null;
    // }
    
    // public PageReference addAchievement() {
    //     try {
    //         if (achievementList == null) {
    //             achievementList = new List<Achievement__c>();
    //         }
    //         Achievement__c newAch = new Achievement__c(Contact__c = con.Id);
    //         achievementList.add(newAch);
    //     } catch (Exception e) {
    //         ApexPages.addMessage(
    //             new ApexPages.Message(ApexPages.Severity.ERROR, 'Error adding achievement: ' + e.getMessage())
    //             );
    //     }
    //     return null;
    // }
    
    
    
    
}