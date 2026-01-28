var workingDaysValues = [];
var siteURL;
var candidateId;
var gender;
var country;
var nationality;
var available_followship;
var associated_with_igstc;
var profilePicURL;
var isCoordinator;
var partnerSubmission;

var app = angular.module('cp_app');
debugger;
var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard';    // ======================>
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('');
    var rp = $routeProvider;

    for (var i = 0; i < tabValues.length; i++) {
        var pageName = '/' + tabValues[i].Name;

        if (tabValues[i].Apex_class_Name__c != undefined) {
            rp.when(pageName, {

                templateUrl: sitePrefix + pageName,
                controller: tabValues[i].Apex_class_Name__c
            });
        } else {
            rp.when(pageName, {
                templateUrl: sitePrefix + pageName,
            })
        }

    }
});
app.filter('specialChar', function () {
    return function (input) {
        return input ? input.replace(/&amp;/g, '&').replace(/&#39;/g, '\'').replaceAll('&amp;amp;', '&').replaceAll('&amp;gt;', '>').replaceAll('&lt;', '<').replaceAll('lt;', '<').replaceAll('&gt;', '>').replaceAll('gt;', '>').replaceAll('&amp;', '&').replaceAll('amp;', '&').replaceAll('&quot;', '\'') : input;
    }
});

function wysiwygeditor($scope) {
    $scope.orightml = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>';
    $scope.htmlcontent = $scope.orightml;
    $scope.disabled = false;
};

app.controller('cp_dashboard_ctrl', function ($scope, $rootScope, $timeout, $window, $location, $element,$sce) {
    $scope.config = {};
    debugger;
    $scope.isLoading = false;

    // Helper function to check if current route is the dashboard route
    // Only dashboard routes should load getContactName() and getApplicantData()
    var isDashboardRoute = function () {
        var path = $location.path();
        // Dashboard routes: empty path, root path, or /Home
        return path === '' || path === '/' || path === '/Home';
    };

    // Helper function to check if current route should skip dashboard functions
    // Returns true if NOT on dashboard route (i.e., on any child/routed page)
    var shouldSkipDashboardFunctions = function () {
        return !isDashboardRoute();
    };
    console.log('shiva----', $rootScope.proposalStage)
    // Initialize isRoutedView immediately based on current path
    $rootScope.isRoutedView = $location.path() !== '' && $location.path() !== '/';

    $scope.$on('$locationChangeSuccess', function () {
        $scope.$evalAsync(function () {
            $rootScope.isRoutedView = $location.path() !== '' && $location.path() !== '/';
            // Re-initialize secondStage when route changes (in case proposalId changes)
            $scope.initializeSecondStageFromStorage();
        });
    });
    $scope.load = function () {
        const hashCode = localStorage.getItem('hashCode');
        if (hashCode == null || hashCode == '') {
            window.location.href = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard';
            history.pushState(null, null, window.location.href);
        }
    };
    $scope.load();
    $scope.selectedMenu = 'Programs';

    $scope.config.toolbarGroups = [
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
        { name: 'forms', groups: ['forms'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
        { name: 'links', groups: ['links'] },
        { name: 'insert', groups: ['insert'] },
        { name: 'styles', groups: ['styles'] },
        { name: 'colors', groups: ['colors'] },
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'others', groups: ['others'] },
        { name: 'about', groups: ['about'] }
    ];
    $scope.configg = {
        options: "",
        trackBy: 'Id',
        displayBy: ['Name'],
        multiSelect: true,
        preSelectItem: true,
        preSelectAll: false
    };
    $scope.allPrograms = [];
    $scope.appliedPrograms = [];
    $scope.config.removeButtons = 'BGColor,Anchor,Subscript,Superscript,Paste,Copy,Cut,Undo,Redo';
    $rootScope.countrytype = countrytype;
    $rootScope.campaignId;
    $rootScope.countryCode = countryCode;
    $rootScope.availingFellowship = availingFellowship;
    $rootScope.pairedApplicant = pairedApplicant;
    $rootScope.participantType = participantType;
    $rootScope.bankType = bankType;
    $rootScope.participatingWorkshop = participatingWorkshop;
    $rootScope.presentingWorkshop = presentingWorkshop;
    $rootScope.candidateId = candidateId;
    $rootScope.campaigntype = campaigntype;
    $rootScope.siteURL = siteURL;
    $rootScope.profilePicURL = profilePicURL;
    $rootScope.thematicAreaList = thematicAreaList;
    $rootScope.gender = gender;

    $rootScope.proposalId = '';
    $rootScope.yearlyCallId = '';
    //$rootScope.apaId='';

    $rootScope.currencyPickList = currencyPickList;
    //  $rootScope.accList = accList;
    $rootScope.country = country;
    $rootScope.nationality = nationality;
    $rootScope.available_followship = available_followship;
    $rootScope.associated_with_igstc = associated_with_igstc;
    $rootScope.applicantName = applicantName;
    $rootScope.applicantEmail = applicantEmail;
    $rootScope.isPrimaryContact = isPrimaryContact;
    $rootScope.accountId = accountId;
    $rootScope.natureOfThesisWork = natureOfThesisWork;
    $rootScope.natureOfPhDWork = natureOfPhDWork;
    $rootScope.percentCGPA = percentCGPA;
    $rootScope.states = states;
    $rootScope.signDate = signDate;
    $rootScope.secondStage = false;

    $scope.applicantAssociationListData;
    $scope.contactName;
    $scope.showUserDropdown = false;
    $scope.userEmail = '';
    $scope.userProfilePicId = null;
    $scope.profilePicUrl = '';

    // Toggle user dropdown menu
    $scope.toggleUserDropdown = function (event) {
        if (event) {
            event.stopPropagation();
        }
        $scope.showUserDropdown = !$scope.showUserDropdown;
    };

    // Close dropdown when clicking outside
    $scope.$on('$locationChangeSuccess', function () {
        $scope.showUserDropdown = false;
    });

    // Close dropdown when clicking outside (document click handler)
    angular.element(document).on('click', function(event) {
        if ($scope.showUserDropdown && !angular.element(event.target).closest('.user-profile-dropdown').length) {
            $scope.$apply(function() {
                $scope.showUserDropdown = false;
            });
        }
    });

    // Get user email and profile picture
    $scope.getUserDetails = function () {
        const hashCode = localStorage.getItem('hashCode');
        if (!hashCode) {
            console.error('hashCode not found in localStorage');
            // Use existing data if available
            $scope.userEmail = $rootScope.applicantEmail || '';
            return;
        }

        ApplicantPortal_Contoller.getUserDetails(hashCode, function (result, event) {
            if (event.status && result != null) {
                $scope.userEmail = result.email || $rootScope.applicantEmail || '';
                $scope.userProfilePicId = result.profilePicId || null;
                
                if ($scope.userProfilePicId) {
                    var baseURL = window.location.origin;
                    $scope.profilePicUrl = baseURL + '/ApplicantDashboard/servlet/servlet.FileDownload?file=' + $scope.userProfilePicId;
                }
                $scope.$apply();
            } else {
                // Fallback to existing data
                $scope.userEmail = $rootScope.applicantEmail || '';
            }
        });
    };

    // Navigate to reset password page
    $scope.navigateToResetPassword = function () {
        var baseURL = window.location.origin;
        var resetPasswordUrl = baseURL + '/ApplicantDashboard/PortalResetPassword';
        window.location.href = resetPasswordUrl;
    };

    //**********************Added BY Karthik For Dropdown
    $scope.yearList = yearList;
    $scope.selectedYear = null;
    $scope.selectedYearId = null;
    debugger

    // Find current active year
    $scope.currentYear = $scope.yearList.find(function (y) {
        return y.Is_Active__c && y.Is_Current_Year__c;
    });
    debugger

    // Set default selected year to current active year
    if ($scope.currentYear) {
        $scope.selectedYear = $scope.currentYear.Id;  // Store Id for ng-model binding
        $scope.selectedYearId = $scope.currentYear.Id; // Store Id for Apex call
        console.log('Default Selected Year Id:', $scope.selectedYearId);
    } else if ($scope.yearList && $scope.yearList.length > 0) {
        // If no current year, select first year
        $scope.selectedYear = $scope.yearList[0].Id;
        $scope.selectedYearId = $scope.yearList[0].Id;
        console.log('Default Selected Year Id (first year):', $scope.selectedYearId);
    }
    debugger

    $scope.onYearChange = function (selectedYearValue) {
        debugger;
        // Get the selected year value passed as parameter from ng-change
        // If parameter is not provided, fallback to scope variable
        var yearId = selectedYearValue || $scope.selectedYear;

        console.log("onYearChange triggered");
        console.log("Year passed as parameter:", selectedYearValue);
        console.log("Year from scope:", $scope.selectedYear);
        console.log("YearId to use:", yearId);
        console.log("Previous selectedYearId:", $scope.selectedYearId);

        // Update selectedYearId with the newly selected year
        if (yearId) {
            // Ensure we're using the new value
            $scope.selectedYearId = yearId;
            $scope.selectedYear = yearId; // Keep in sync
            console.log("Updated selectedYearId to:", $scope.selectedYearId);

            // Call Apex method with the newly selected year Id directly
            // Pass the yearId as parameter to ensure we use the correct value
            $scope.getApplicantData(yearId);
        } else {
            console.warn("No year selected, clearing data");
            $scope.selectedYearId = null;
            $scope.selectedYear = null;
            $scope.allPrograms = [];
            $scope.appliedPrograms = [];
        }
    };

    //*********************Added BY Karthik For Dropdown


    $scope.proposalWrapperList = proposalWrapperList
        .replace(/^\[|\]$/g, '')
        .split(/proposalWrap:/)
        .filter(s => s.trim())
        .map(item => {
            const obj = {};
            item
                .replace(/^\[|\]$/g, '')
                .split(',')
                .forEach(pair => {
                    const [key, value] = pair.split('=').map(v => v.trim());
                    if (key) obj[key] = (value === 'null') ? null : value;
                });
            return obj;
        });

    // Function to set secondStage from localStorage proposalId on page load/refresh
    // This ensures secondStage is set even when redirectToForm doesn't run (e.g., on page refresh)
    $scope.initializeSecondStageFromStorage = function () {
        var proposalIdFromStorage = localStorage.getItem('proposalId');
        if (proposalIdFromStorage && $scope.proposalWrapperList && $scope.proposalWrapperList.length > 0) {
            const proposalData = $scope.proposalWrapperList.find(item => item.Id == proposalIdFromStorage);
            if (proposalData) {
                // Set proposalId in rootScope if not already set
                if (!$rootScope.proposalId) {
                    $rootScope.proposalId = proposalData.Id;
                }

                // Determine if it's second stage
                if (proposalData.stage == "1st Stage") {
                    $rootScope.secondStage = false;
                } else if (proposalData.stage == "2nd Stage" || proposalData.stage == "2nd stage" || proposalData.stage == "2ndStage") {
                    $rootScope.secondStage = true;
                } else {
                    $rootScope.secondStage = false;
                }

                if (proposalData.stage == '' || proposalData.stage == undefined) {
                    $rootScope.secondStage = false;
                }

                // Set proposalStage as well
                if (proposalData.proposalStage != "Draft" || (proposalData.proposalStage == "Draft" && partnerSubmission == "true")) {
                    $rootScope.proposalStage = true;
                    if (typeof CKEDITOR !== 'undefined' && CKEDITOR.config) {
                        CKEDITOR.config.readOnly = true;
                    }
                } else {
                    $rootScope.proposalStage = false;
                }
                if (proposalData.proposalStage == undefined || proposalData.proposalStage == '') {
                    $rootScope.proposalStage = false;
                    if (typeof CKEDITOR !== 'undefined' && CKEDITOR.config) {
                        CKEDITOR.config.readOnly = false;
                    }
                }

                console.log('Initialized secondStage from localStorage:', $rootScope.secondStage, 'for proposal:', proposalIdFromStorage);
            }
        }
    };

    // Call this function on controller initialization to set secondStage on page load/refresh
    $scope.initializeSecondStageFromStorage();

    // if(secondstage == "1st Stage"){
    //     $rootScope.secondStage = false;
    // }else{
    //     $rootScope.secondStage = true;
    // }
    // if(secondstage == '' || secondstage == undefined){
    //     $rootScope.secondStage = false;
    // }

    $rootScope.contactId = contactId;
    $rootScope.projectId = '';
    $rootScope.campaignName = '';
    $rootScope.isCoordinator = isCoordinator;
    $rootScope.partnerSubmission = partnerSubmission;
    $rootScope.secondstage = false;
    $rootScope.emailVerified;
    $rootScope.proposalStage = false;
    // if(secondstage == "2nd Stage"){
    //     $rootScope.secondstage = true;
    // }else{
    //     $rootScope.secondstage = false;
    // }

    //added by Aman 4th September
    // Desc: to account for Per partner submission.
    // if(proposalStage != "Draft" || (proposalStage == "Draft" && partnerSubmission == "true")){
    //     // if(proposalStage != "Draft"){
    //     $rootScope.proposalStage = true;
    //     CKEDITOR.config.readOnly = true;
    // }else{
    //     $rootScope.proposalStage = false;
    // }
    // if(proposalStage==undefined || proposalStage==''){
    //     $rootScope.proposalStage = false;
    //     CKEDITOR.config.readOnly = false;
    // }
    //  CKEDITOR.replace( 'Resolution', {
    //     height: 800
    // } );
    //  $scope.checkCampaign = function(){
    //     debugger;
    //     if($rootScope.campaigntype.toUpperCase() != $scope.programmeHeaderName){
    //         swal(
    //             '',
    //             'incorrect',
    //             'error'
    //         );
    //         if($rootScope.campaigntype == "pecfar"){
    //             var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_Pecfar';
    //             setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);
    //         }
    //         if($rootScope.campaigntype == "wiser"){
    //             var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=LANDING_PAGE_WISER';
    //             setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);
    //         }
    //         if($rootScope.campaigntype == "if"){
    //             var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_Industrial_Fellowship';
    //             setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);
    //         }
    //         if($rootScope.campaigntype == "sing"){
    //             var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=LANDING_PAGE_SING';
    //             setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);
    //         }
    //         if($rootScope.campaigntype == "workshop"){
    //             var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_Workshop';
    //             setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);
    //         }
    //         if($rootScope.campaigntype == "2plus2"){
    //             var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_Two_Plus_Two';
    //             setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);
    //         }
    //         return;
    //     }else{
    //     }
    // }
    // $scope.checkCampaign();

    CKEDITOR.addCss('border:solid 1px red !important;');
    // $scope.redirect = function(){
    //     debugger;
    //     if($scope.res == "workshop"){
    //         var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_Workshop';
    //         setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);

    //     }else if($scope.res == "pecfar"){
    //         var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_Pecfar';
    //         setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);

    //     }else if($scope.res == "if"){
    //         var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_Industrial_Fellowship';
    //         setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);

    //     }
    //     else if($scope.res == "sing"){
    //         var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=LANDING_PAGE_SING';
    //         setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);

    //     }
    //     else if($scope.res == "wiser"){
    //         var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=LANDING_PAGE_WISER';
    //         setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);

    //     }
    //     else if($scope.res == "2plus2"){
    //         var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_Two_Plus_Two';
    //         setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);
    //     }
    //     else if($scope.res == "connect"){
    //         var sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard?campaign=Landing_Page_CONNECT_PLUS';
    //         setTimeout(function() {window.location.replace(window.location.origin + sitePrefix )}, 5000);
    //     }

    //         var sitePrefix; 
    //         // switch($rootScope.CampainURL.toUpperCase()){
    //         //         case 'if':
    //         //             sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/?campaign=Landing_Page_Industrial_Fellowship';
    //         //             break;
    //         //         case 'pecfar':
    //         //             sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/?campaign=Landing_Page_Pecfar';
    //         //             break;
    //         //         case 'workshop':
    //         //             sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/?campaign=Landing_Page_Workshop';
    //         //             break;
    //         //         case '2plus2':
    //         //             sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/?campaign=Landing_Page_Two_Plus_Two';
    //         //             break;
    //         //         case 'wiser':
    //         //             sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/?campaign=LANDING_PAGE_WISER';
    //         //             break;
    //         //         case 'sing':
    //         //             sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/?campaign=LANDING_PAGE_SING';
    //         //             break;
    //         //             // default:
    //         //             //     sitePrefix = window.location.href.includes('/apex') ? '/apex' : '/?campaign=Landing_Page_Industrial_Fellowship';
    //         //             //     break;
    //         // }  
    //         // window.location.replace(window.location.origin +sitePrefix);
    // }
    // $scope.LogoutApplicant=function(){        
    //     ApplicantPortal_Contoller.LogoutApplicant($rootScope.candidateId, function (result, event) {
    //         debugger
    //         console.log(result);
    //         console.log(event);
    //         if(event.status){
    //             $rootScope.applicantEmail='';
    //             $rootScope.applicantName='';
    //             $rootScope.campaignId = '';
    //             $scope.res=result;
    //             $scope.redirect();
    //             $scope.$apply();
    //         }
    //     });   
    // }

    $scope.getContactName = function () {
        // Always load contact name for global header (visible on all pages)
        // No need to skip - contactName should be available everywhere
        debugger;
        if (localStorage.getItem('applicantName')) {
            $rootScope.contactName = localStorage.getItem('applicantName');
        }
        console.log($rootScope.proposalStage + 'proposalStage');
        // Skip if on a routed view that should not load dashboard functions
        if (shouldSkipDashboardFunctions()) {
            return;
        }
        // Use hashCode from localStorage (required by getContactName method)
        const hashCode = localStorage.getItem('hashCode');
        if (!hashCode) {
            console.error('hashCode not found in localStorage, cannot fetch contact name');
            return;
        }

        //$scope.isLoading = true;
        ApplicantPortal_Contoller.getContactName(hashCode, function (result, event) {
            if (event.status && result != null) {
                $rootScope.contactName = result;
                localStorage.setItem('applicantName', result);
            }
        });
    }
    $scope.getContactName();
    $scope.getUserDetails();

    /*$scope.getApplicantData = function () {
        debugger;
        $scope.isLoading = true;
        ApplicantPortal_Contoller.getApplicantData($scope.candidateId, function (result, event) {
            debugger;
            if (event.status && result != null) {
                debugger;
                console.log('campaign::=>');
                console.log(result);
                $scope.allCamapigns = result.campaignList;
                $scope.appliedCampaigns = result.appliedCampaign;

                $scope.appliedPrograms = $scope.appliedCampaigns ? $scope.appliedCampaigns.map(item => {
                    return {
                        name: item?.Proposals__r?.Campaign__r?.Name ?? "",
                        desc: item?.Proposals__r?.Campaign__r?.Description ?? "",
                        deadline: item.Proposals__r?.Campaign__r?.Actual_End_Date__c ? new Date(item.Proposals__r?.Campaign__r?.Actual_End_Date__c).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }) : 'Not mentioned',
                        icon: item.Proposals__r?.Campaign__r?.Icon__c ?? "",
                        redirectUrl: item?.Proposals__r?.Campaign__r?.RedirectPage__c ?? "",
                        campaignId: item?.Proposals__r?.Campaign__r?.Id ?? "",
                        proposalId: item?.Proposals__c ?? "",
                        category: 'applied'
                    }
                }) : [];

                if (!$scope.appliedPrograms || !$scope.appliedPrograms.length) {
                    // If no applied programs → keep all campaigns
                    $scope.allPrograms = $scope.allCamapigns.map(item => ({
                        name: item.Name,
                        desc: item.Description,
                        deadline: item.Actual_End_Date__c
                            ? new Date(item.Actual_End_Date__c).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            })
                            : 'Not mentioned',
                        icon: item.Icon__c,
                        redirectUrl: item.RedirectPage__c,
                        campaignId: item.Id,
                        proposalId: '',
                        category: 'not applied'
                    }));
                } else {
                    // Build a Set of applied program names
                    const appliedNames = new Set(
                        $scope.appliedPrograms
                            .filter(a => a && a.name) // safety filter
                            .map(a => a.name)
                    );

                    // Exclude already applied campaigns
                    $scope.allPrograms = $scope.allCamapigns
                        .filter(item => !appliedNames.has(item.Name)) // not equal condition
                        .map(item => ({
                            name: item.Name,
                            desc: item.Description,
                            deadline: item.Actual_End_Date__c
                                ? new Date(item.Actual_End_Date__c).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                })
                                : 'Not mentioned',
                            icon: item.Icon__c,
                            redirectUrl: item.RedirectPage__c,
                            campaignId: item.Id,
                            category: 'not applied'
                        }));
                }
                $scope.isLoading = false;
                $scope.$apply();
            }
        },
            { escape: true }
        );
    }
    $scope.getApplicantData();*/



    // *******************************************************************************    
    //Added By karthik


    function isPastDate(dateStr) {
        if (!dateStr) return false; // treat no date as not expired
        var d = new Date(dateStr);
        if (isNaN(d)) return false;
        var today = new Date();
        d.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return d < today;
    }


    $scope.getApplicantData = function (yearIdParam) {
        // Skip if on a routed view that should not load dashboard functions
        if (shouldSkipDashboardFunctions()) {
            return;
        }

        // Use parameter if provided, otherwise use scope variable
        var yearIdToUse = yearIdParam || $scope.selectedYearId;

        // Ensure we have a year selected before making the call
        if (!yearIdToUse) {
            console.warn('No year selected, cannot fetch applicant data');
            return;
        }

        console.log('getApplicantData called with yearId:', yearIdToUse);
        $scope.isLoading = true;
        ApplicantPortal_Contoller.getApplicantData($scope.candidateId, yearIdToUse, function (result, event) {
            debugger
            if (event.status && result != null) {
                $scope.allCamapigns = result.campaignList; // Campaigns in this YearlyCall__c 
                $scope.appliedCampaigns = result.appliedCampaign;

                

                // Applied programs 
                $scope.appliedPrograms = $scope.appliedCampaigns ? $scope.appliedCampaigns.map(item => ({
                    
                    name: item?.Proposals__r?.Campaign__r?.Name ?? "",
                    PropName: item?.Proposals__r?.Name ?? "",
                    //titleOfProject: item?.Contact__r?.Title_Of_Project__c ?? "",
                    titleOfProject: item?.Proposals__r?.Title_Of__c ?? item?.Contact__r.Title_Of_Project__c ?? "",
                    desc: item?.Proposals__r?.Campaign__r?.Description ?? "",
                    deadline: item.Proposals__r?.yearly_Call__r?.Campaign_End_Date__c ?
                        new Date(item.Proposals__r?.yearly_Call__r?.Campaign_End_Date__c).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }) : 'Not mentioned',
                    icon: item.Proposals__r?.Campaign__r?.Icon__c ?? "",
                    redirectUrl: item?.Proposals__r?.Campaign__r?.RedirectPage__c ?? "",
                    campaignId: item?.Proposals__r?.Campaign__r?.Id ?? "",
                    proposalId: item?.Proposals__c ?? "",
                    apaId: item?.Id ?? "",
                    yearlyCallId: item?.Proposals__r?.yearly_Call__c ?? "",
                    proposalStage: item?.Proposals__r?.Proposal_Stages__c ?? "",
                    category: 'applied',
                    id:item?.Proposals__r?.Id ?? "",
                })) : [];

                // Simple helper for YearlyCall__c → Campaign data              
                function getCampaignData(item) {
                    var rawDeadline = item.Campaign_End_Date__c || null;
                    return {
                        name: item.Campaign__r?.Name ?? "",
                        desc: item.Campaign__r?.Description ?? "",
                        deadline: rawDeadline ?
                            new Date(rawDeadline).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            }) : 'Not mentioned',
                        icon: item.Campaign__r?.Icon__c ?? "",
                        redirectUrl: item.Campaign__r?.RedirectPage__c ?? "",
                        campaignId: item.Campaign__r?.Id ?? "",
                        yearlyCallId: item.Id,
                        yearlyCall: item.Name,
                        isExpired: isPastDate(rawDeadline)
                    };
                }


                if (!$scope.appliedPrograms.length) {
                    $scope.allPrograms = $scope.allCamapigns.map(item => ({
                        ...getCampaignData(item),
                        proposalId: '',
                        category: 'not applied'
                    }));
                } else {
                    const appliedCampaignIds = new Set(
                        // $scope.appliedPrograms.filter(a => a.campaignId).map(a => a.campaignId)
                    );

                    $scope.allPrograms = $scope.allCamapigns
                        .filter(item => {
                            const campaignId = item.Campaign__r?.Id;
                            return campaignId && !appliedCampaignIds.has(campaignId);
                        })
                        .map(item => ({
                            ...getCampaignData(item),
                            proposalId: '',
                            category: 'not applied'
                        }));
                }

                $scope.isLoading = false;
                $scope.$apply();
            } else {
                $scope.isLoading = false;
                $scope.$apply();
            }
        }, { escape: true });
    };

    // Call getApplicantData on initial load if year is selected
    if ($scope.selectedYearId) {
        $scope.getApplicantData();
    }


    // $scope.onYearChange = function () {
    //     if (!$scope.selectedYear) {
    //         return;
    //     }
    //     $scope.getApplicantData();
    // };

    //************************************************************************************************** */
    $scope.redirectToForm = function (val) {
        debugger;
        var redirectPage = val.redirectUrl;
        var isSecondStage = false;

        if (val.category == 'applied' && (val.proposalId != undefined && val.proposalId != '')) {
            localStorage.setItem('proposalId', val.proposalId);
            localStorage.setItem('yearlyCallId', val.yearlyCallId);
            localStorage.setItem('apaId', val.apaId);
            const proposalData = $scope.proposalWrapperList.find(item => item.Id == val.proposalId);

            if (!proposalData) {
                console.error('Proposal data not found for ID:', val.proposalId);
                $rootScope.campaignId = val.campaignId;
                $location.path('/' + redirectPage);
                return;
            }

            $rootScope.proposalId = proposalData.Id;

            // Determine if it's second stage
            if (proposalData.stage == "1st Stage") {
                $rootScope.secondStage = false;
                isSecondStage = false;
            } else if (proposalData.stage == "2nd Stage" || proposalData.stage == "2nd stage" || proposalData.stage == "2ndStage") {
                $rootScope.secondStage = true;
                isSecondStage = true;
            } else {
                $rootScope.secondStage = false;
                isSecondStage = false;
            }

            if (proposalData.stage == '' || proposalData.stage == undefined) {
                $rootScope.secondStage = false;
                isSecondStage = false;
            }

            // When in 2nd Stage, prevent redirecting to declaration pages
            // Declaration pages should only be reached through the normal application flow
            if (isSecondStage) {
                var declarationPages = ['Declartion_2plus2', 'ExpenseDeclaration', 'Declaration'];
                if (declarationPages.indexOf(redirectPage) !== -1) {
                    // If redirectUrl is a declaration page, we need to find the actual starting page
                    // Check if we can get the campaign's actual starting page from allPrograms
                    var campaignData = $scope.allPrograms.find(p => p.campaignId == val.campaignId);
                    if (campaignData && campaignData.redirectUrl && declarationPages.indexOf(campaignData.redirectUrl) === -1) {
                        redirectPage = campaignData.redirectUrl;
                    } else {
                        // Fallback: For 2+2 Call, default to ProjectDetailPage; for others, use Dashboard_IF or similar
                        // This is a safety measure - ideally the Campaign's RedirectPage__c should be the starting page
                        console.warn('2nd Stage proposal redirecting to declaration page. Campaign RedirectPage__c may be incorrectly configured.');
                        // Keep the original redirectUrl but log a warning
                    }
                }
            }

            if (proposalData.proposalStage != "Draft" || (proposalData.proposalStage == "Draft" && partnerSubmission == "true")) {
                // if(proposalStage != "Draft"){
                $rootScope.proposalStage = true;
                CKEDITOR.config.readOnly = true;
            } else {
                $rootScope.proposalStage = false;
            }
            if (proposalData.proposalStage == undefined || proposalData.proposalStage == '') {
                $rootScope.proposalStage = false;
                CKEDITOR.config.readOnly = false;
            }
        } else {
            $rootScope.secondStage = false;
            $rootScope.proposalStage = false;
            localStorage.setItem('proposalId', '');
            localStorage.setItem('yearlyCallId', val.yearlyCallId);
        }
        $rootScope.campaignId = val.campaignId;
        $location.path('/' + redirectPage);
    }

    $scope.showSection = function (menu) {
        $scope.selectedMenu = menu;
        $scope.selectedFAQ = null; // Reset FAQ detail view when switching sections

        if (menu === 'Help') {
            $scope.loadMyTickets();
            $scope.loadProposalsForContact();
        }
    };

    // FAQ data
    $scope.faqData = {
        '2+2 CALL': {
            name: 'IGSTC 2+2 Call - 2025',
            title: '2+2 CALL',
            description: 'A flagship funding scheme supporting joint R&D projects with two partners each from India and Germany.',
            hasCallText: true,
            hasBasicGuidelines: true,
            hasFAQs: true,
            callTextUrl: 'https://www.igstc.org/projects_call_text',
            basicGuidelinesUrl: 'https://www.igstc.org/home/projects_basic_guideline',
            faqUrl: 'https://www.igstc.org/home/faqs',
            hasProjectDetailsFormat: true,
            hasStandingInstructions: true,
            hasDocumentsRequired: false,
            documentsRequired: [],
            email: 'info.igstc@igstc.org',
            deadline: 'Application Deadline: 15th February 2026',
            hasRefreshNote: true
        },
        'PECFAR': {
            name: 'Paired Early Career Fellowship in Applied Research (PECFAR) - Call 2025',
            title: 'PECFAR',
            description: 'Facilitates exchange of young Indian and German researchers and clinicians in the medical field.',
            hasCallText: true,
            hasBasicGuidelines: true,
            hasFAQs: true,
            hasProjectDetailsFormat: false,
            hasStandingInstructions: false,
            hasDocumentsRequired: true,
            documentsRequired: [
                'No Objection Certificate from the Parent institution.',
                'Invitation Letter from the host institution.',
                'Proof of Date of Birth (Scan copy of Passport/ Aadhar Card).',
                'Proof of Education Qualifications arranged in reverse chronological order.',
                'Proof of Current Employment/Fellowship Award Letter.'
            ],
            email: 'pecfar@igstc.org',
            deadline: 'Application Deadline: 31st March 2025',
            hasRefreshNote: false
        },
        'WISER': {
            name: 'Women Involvement in Science and Engineering Research (WISER)',
            title: 'WISER',
            description: 'Empowers Indian women scientists through international exposure and Indo-German research partnerships.',
            hasCallText: true,
            hasBasicGuidelines: true,
            hasFAQs: true,
            callTextUrl: 'https://www.igstc.org/home/wiser_2025',
            basicGuidelinesUrl: 'https://www.igstc.org/home/wiser_basic_guidelines_2025',
            faqUrl: 'https://www.igstc.org/home/wiser_faq_2025',
            hasProjectDetailsFormat: false,
            hasStandingInstructions: false,
            hasDocumentsRequired: true,
            documentsRequired: [
                'No Objection Certificate (NOC)/Endorsement letter from the head of the institution(present organisation).',
                'Endorsement/consent letter from the Indian/German pairing collaborator'
            ],
            email: 'wiser@igstc.org',
            deadline: 'Application submission: 1 February to 31 March every year',
            hasRefreshNote: false
        },
        'SING': {
            name: 'IGSTC SING - Call 2025',
            title: 'SING',
            description: 'Supports the creation of Indo-German research network centres in strategic areas.',
            hasCallText: true,
            hasBasicGuidelines: false,
            hasFAQs: false,
            hasProjectDetailsFormat: false,
            hasStandingInstructions: false,
            hasDocumentsRequired: true,
            documentsRequired: [
                'Consent Letter/No Objection Certificate from the Parent Institution.',
                'Invitation/Support Letter from the Host Institution.',
                'Supporting documents in favour of your application, including CV.'
            ],
            email: 'sing@igstc.org',
            deadline: 'Application submission: Open throughout the year',
            hasRefreshNote: false
        },
        'WORKSHOPS': {
            name: 'IGSTC Workshop - Call 2026',
            title: 'WORKSHOPS',
            description: 'Funds thematic workshops and exploratory meetings to initiate Indo-German collaboration.',
            hasCallText: true,
            hasBasicGuidelines: false,
            hasFAQs: false,
            hasProjectDetailsFormat: false,
            hasStandingInstructions: false,
            hasDocumentsRequired: false,
            documentsRequired: [],
            email: 'info.igstc@igstc.org',
            deadline: 'Cut-off dates: 31st January 2026 and 31st July 2026',
            hasRefreshNote: false
        },
        'IF': {
            name: 'IGSTC Industrial Fellowships - Call 2025',
            title: 'IF',
            description: 'This programme is aimed at encouraging PhD students/researchers in S&T with an appreciable track record.',
            hasCallText: true,
            hasBasicGuidelines: true,
            hasFAQs: true,
            hasProjectDetailsFormat: false,
            hasStandingInstructions: false,
            hasDocumentsRequired: true,
            documentsRequired: [
                'Consent Letter from the Host Institution.',
                'The applicant having institutional affiliation needs to submit NOC from the Head of the institution at the time of application. NOC Format',
                'Applicants needs to submit recommendation letter from the mentor at parent organisation.',
                'PDIF applicant not having affiliation with an institution needs to submit 2 letters of reference.',
                'Proof of Date of Birth (Scan copy of Passport/ Aadhar Card).',
                'Proof of Education Qualifications arranged in reverse chronological order.',
                'Proof of Employment.'
            ],
            email: 'industrial.fellowship@igstc.org',
            deadline: 'Application Deadline: 31st March 2025',
            hasRefreshNote: false
        }
    };

    $scope.showFAQDetail = function(faqTitle) {
        $scope.selectedFAQ = $scope.faqData[faqTitle];
    };

    $scope.backToFAQ = function() {
        $scope.selectedFAQ = null;
    };


    //**************************************Fetch Tickets (Cases) for Logged-in Contact***********************************************

    $scope.tickets = [];
    $scope.isTicketsLoading = false;

    $scope.loadMyTickets = function () {
        $scope.isTicketsLoading = true;

        ApplicantPortal_Contoller.getMyTickets(
            $rootScope.contactId,
            function (result, event) {
                if (event.status && result) {
                    $scope.tickets = result;
                } else {
                    $scope.tickets = [];
                }
                $scope.isTicketsLoading = false;
                $scope.$apply();
            }
        );
    };

    // ---------------- View Comments ----------------
       $scope.showViewCommentsModal = false;
        $scope.selectedTicketComments = '';

        $scope.openViewCommentsModal = function (ticket) {
            if (ticket && ticket.comments) {
                // TRUST HTML so Angular renders it
                $scope.selectedTicketComments = $sce.trustAsHtml(ticket.comments);
            } else {
                $scope.selectedTicketComments = $sce.trustAsHtml('<i>No comments available</i>');
            }
            $scope.showViewCommentsModal = true;
        };

        $scope.closeViewCommentsModal = function () {
            $scope.showViewCommentsModal = false;
        };


    //**************************************Fetch Tickets (Cases) for Logged-in Contact***********************************************



    // ************************************** Raise Ticket **************************************

        // ---------------- Proposals Autocomplete ----------------
            $scope.proposals = [];
            $scope.filteredProposals = [];
            $scope.showProposalDropdown = false;

            $scope.loadProposalsForContact = function () {
                ApplicantPortal_Contoller.getProposalsForContact(
                    $rootScope.contactId,
                    function (result, event) {
                        if (event.status && result) {
                            $scope.proposals = result;
                        }
                        $scope.$apply();
                    }
                );
            };


            $scope.filterProposals = function () {
                if (!$scope.ticket.proposalNumber) {
                    $scope.filteredProposals = [];
                    $scope.showProposalDropdown = false;
                    return;
                }

                var search = $scope.ticket.proposalNumber.toLowerCase();

                $scope.filteredProposals = $scope.proposals.filter(function (p) {
                    return p.proposalNumber.toLowerCase().includes(search);
                });

                $scope.showProposalDropdown = true;
            };

            $scope.selectProposal = function (proposal) {
                $scope.ticket.proposalNumber = proposal.proposalNumber;
                $scope.showProposalDropdown = false;
            };

 // ---------------- Proposals Autocomplete ----------------


        $scope.showRaiseTicketModal = false;
        $scope.isTicketSaving = false;

        $scope.ticket = {
            proposalNumber: '',
            comments: ''
        };

        $scope.openRaiseTicketModal = function () {
            $scope.ticket = {
                proposalNumber: '',
                comments: ''
            };
            $scope.showRaiseTicketModal = true;
        };

        $scope.closeRaiseTicketModal = function () {
            $scope.showRaiseTicketModal = false;
        };

        // Submit ticket
        $scope.submitTicket = function () {
            if (!$scope.ticket.comments) {
                alert('Please enter comments');
                return;
            }
            $scope.isTicketSaving = true;          
            ApplicantPortal_Contoller.createTicket(
                $rootScope.contactId,
                $scope.ticket.proposalNumber,
                $scope.ticket.comments,
                function (result, event) {
                    if (event.status) {
                        if (result === 'SUCCESS') {
                            //alert('Ticket raised successfully');
                             $scope.showToast('Ticket raised successfully', 'success');
                            $scope.closeRaiseTicketModal();
                            $scope.loadMyTickets();
                        } else if (result === 'INVALID_PROPOSAL') {
                           // alert('Invalid Application / Proposal Number');
                             $scope.showToast('Invalid Application / Proposal Number', 'error');
                        } else {
                           // alert('Error while creating ticket');
                            $scope.showToast('Error while creating ticket', 'error');
                        }
                    }
                    $scope.$apply();
                }
            );

        };




        // ---------------- Toast Popup ----------------
        $scope.toast = {
            show: false,
            message: '',
            type: 'success'
        };

        $scope.showToast = function (message, type) {
            $scope.toast.message = message;
            $scope.toast.type = type || 'success';
            $scope.toast.show = true;

            // Auto hide after 3 seconds
            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.toast.show = false;
                });
            }, 3000);
        };

    // ************************************** Raise Ticket **************************************


    // Navigate to home/dashboard - removes hash but keeps query params
    $scope.navigateToHome = function () {
        // Reset to dashboard view
        $scope.selectedMenu = 'Programs';
        $scope.selectedFAQ = null;
        $rootScope.isRoutedView = false;
        
        // Clear any route and navigate to base URL
        var baseUrl = window.location.origin + window.location.pathname;
        if (window.location.search) {
            baseUrl += window.location.search;
        }
        
        // Remove hash from URL
        if (window.location.hash) {
            window.location.href = baseUrl;
        } else {
            // If already on base URL, just reset the view
            $location.path('');
            $scope.$apply();
        }
    };

    $scope.downloadApplicationPdf = function (id) {
        debugger;
        ApplicantPortal_Contoller.downloadApplicationPdf(id, function (result, event) {
            debugger;
            if (event.status && result != null) {
                window.open('/servlet/servlet.FileDownload?file='+result, '_blank');
            } else {
                console.error('Error downloading application pdf:', event.message);
            }
        });
        
    };

    $scope.logout = function () {
        // Redirect to login page after logout
        debugger;
        /*
        $scope.isLoading = true;
        ApplicantPortal_Contoller.LogoutApplicant($rootScope.candidateId,function(result,event){
            debugger;
            if(event.status && result == 'Success'){
                localStorage.setItem('hashCode','');
                window.location.href = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard';
                history.pushState(null, null, window.location.href);
                // history.back();
                $scope.isLoading = false;
            }else if(result == 'Error'){
                window.location.href = window.location.href.includes('/apex') ? '/apex' : '/ApplicantDashboard';
                history.pushState(null, null, window.location.href);
                // history.back();
                $scope.isLoading = false;
            }else{
                alert('Error logging Out !');
                console.log('Error ---> '+event.message);
                $scope.isLoading = false;
            }
            $scope.$apply();
        });
    };
   */
        $scope.isLoading = true;
        ApplicantPortal_Contoller.LogoutApplicant($rootScope.candidateId, function (result, event) {
            debugger;
            if (event.status && result === 'Success') {
                localStorage.setItem('hashCode', '');
                window.location.href = 'https://indo-germansciencetechnologycentre--uatdev.sandbox.my.salesforce-sites.com/ApplicantDashboard/';
                $scope.isLoading = false;
            } else if (result === 'Error') {
                window.location.href = 'https://indo-germansciencetechnologycentre--uatdev.sandbox.my.salesforce-sites.com/ApplicantDashboard/';
                $scope.isLoading = false;
            } else {
                alert('Error logging Out!');
                console.log('Error ---> ' + event.message);
                $scope.isLoading = false;
            }
            $scope.$apply();
        });
    };


});



