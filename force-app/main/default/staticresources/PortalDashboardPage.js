var app = angular.module('cp_app', []);
app.controller('ap_dashboard_ctrl', function($scope) {
    $scope.selectedMenu = 'Programs';
    
    $scope.showSection = function(menu) {
        $scope.selectedMenu = menu;
    };
    
    $scope.ongoingPrograms = [
        { name: "2+2 CALL", deadline: "26 Sep, 2025", desc: "A flagship funding scheme supporting joint R&D projects with partners from India and Germany.", icon: "fa-solid fa-people-group" },
        { name: "PECFAR", deadline: "26 Sep, 2025", desc: "Facilitates exchange of young Indian and German researchers in the medical field.", icon: "fa-solid fa-flask" },
        { name: "WISER", deadline: "06 Aug, 2025", desc: "Empowers Indian women scientists through international exposure.", icon: "fa-solid fa-person-dress" },
        { name: "SING", deadline: "06 Mar, 2025", desc: "Supports creation of Indo-German research networks in strategic areas.", icon: "fa-solid fa-network-wired" },
        { name: "WORKSHOPS", deadline: "06 Jul, 2025", desc: "Funds thematic workshops to initiate Indo-German collaboration.", icon: "fa-solid fa-chalkboard-user" },
        { name: "IF", deadline: "06 Aug, 2025", desc: "Encourages PhD researchers in S&T with strong research aptitude.", icon: "fa-solid fa-graduation-cap" }
    ];
    
    $scope.underGrant = [
        { name: "2+2 CALL", details: "CR/2022/006881 | Development of automated deposition head for 3D Printing | 36 Months", icon: "fa-solid fa-people-group" },
        { name: "PECFAR", details: "CR/2022/006881 | Development of automated deposition head for 3D Printing | 26 Months", icon: "fa-solid fa-flask" },
        { name: "WISER", details: "CR/2022/006881 | Development of automated deposition head for 3D Printing | 12 Months", icon: "fa-solid fa-person-dress" }
    ];
          $scope.isSidebarOpen = false;
});