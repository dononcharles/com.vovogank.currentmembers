 (function(angular, $, _) {

  angular.module('currentmembers').config(function($routeProvider) {
      $routeProvider.when('/cmembership', {
        controller: 'CurrentmembersCmembershipCtrl',
        templateUrl: '~/currentmembers/CmembershipCtrl.html',

        // If you need to look up data when opening the page, list it out
        // under "resolve".
        resolve: {
          myStatusAll: function(crmApi) {
                return crmApi('Membership_status', 'get', {
                  options:{
                     limit:0
                  },
                  return: ['id','name']
                });
          },
          myContactAll: function(crmApi) {
                return crmApi('Contact', 'get', {
                  options:{
                     limit:0
                  },
                  return: ['id','display_name']
                });
          },
          myCurrentMembers: function(crmApi) {
              return crmApi('Membership', 'get',{
                options:{
                  limit:0
                }
              });
          },
        }
      });
    }
  );
  //Directive to back to current membership
  angular.module('currentmembers').directive('reload', ['$route', function($route) {
      return {
          restrict: 'A',
          link: function(scope, element, attrs) {
              element.bind('click', function() {
                  scope.$apply(function(){
                    $route.reload();
                  });
              });
          }
      }
  }]);

  // The controller uses *injection*. This default injects a few things:
  //   $scope -- This is the set of variables shared between JS and HTML.
  //   crmApi, crmStatus, crmUiHelp -- These are services provided by civicrm-core.
  //   myContact -- The current contact, defined above in config().
  angular.module('currentmembers').controller('CurrentmembersCmembershipCtrl', function($rootScope,myStatusAll, $scope, myContactAll, orderTable, crmApi, crmStatus, crmUiHelp, myCurrentMembers, $filter, NgTableParams) {
    // The ts() and hs() functions help load strings for this module.
    var ts = $scope.ts = CRM.ts('currentmembers');

    $('#page-title').html('Memberships List');
    /**
    * Get All data from Table Status to an Object
    **/
    var tab1 = {};
    for (var k = 1; k <= Object.keys(myStatusAll.values).length; k++) {
        var tmp = {};
        tmp[myStatusAll.values[k].id] = myStatusAll.values[k].name;
        tab1[k] = tmp;
    }

    /**
    * Get All data from Table Contact to an Object
    **/
    var tab2 = {};
    for (var k = 1; k <= Object.keys(myContactAll.values).length; k++) {
        var tmp = {};
        tmp[myContactAll.values[k].id] =  myContactAll.values[k].display_name;             
        tab2[k] = tmp;
    }

    var tabM = [];
    /** Data to send to template for listing of membership **/
    for (var i = 1; i <= Object.keys(myCurrentMembers.values).length; i++) {
       var t = {};
       t['end_date']    = myCurrentMembers.values[i].end_date;
       t['join_date']   = myCurrentMembers.values[i].join_date;
       t['start_date']  = myCurrentMembers.values[i].start_date;
       t['source']      = myCurrentMembers.values[i].source;
       t['status']      = myCurrentMembers.values[i].status_id?tab1[myCurrentMembers.values[i].status_id][myCurrentMembers.values[i].status_id]:'not defined';
       t['display_name'] = myCurrentMembers.values[i].contact_id?tab2[myCurrentMembers.values[i].contact_id][myCurrentMembers.values[i].contact_id]:'not defined';
       tabM[i] = t;
    }

     $scope.c_membership = tabM;
     $scope.tableFilterC = orderTable(tabM);
    
    /**
    * Search by filtring
    */
    $("#b3").html("");
    $scope.se = {};
    $scope.search = function search() {
      $("#b3").html("");
      $("#t1").css({display:'none'});
      var html="";
      var tabS = [];
      /** Data to send to template for listing of membership **/
      html = '<div class="card" style="padding:5px"><div class="card-header bgm-brown"><h2>'+ts('Results from searching')+'</h2></div><div class="card-body"><div class="table-responsive"><table ng-table="tableFilterS" class="table table-bordered table-striped table-vmiddle"><thead><tr><th>'+ts('Display name')+'</th><th>'+ts('Start date')+'</th><th>'+ts('Join date')+'</th><th>'+ts('End date')+'</th><th>'+ts('Source')+'</th><th>'+ts('Status')+'</th></tr></thead>';
      for (var i = 1; i <= Object.keys(myCurrentMembers.values).length; i++) {
           var t = {};
           if (myCurrentMembers.values[i].start_date >= $scope.se.from && myCurrentMembers.values[i].start_date <= $scope.se.to) {
              t['end_date']    = myCurrentMembers.values[i].end_date;
              t['join_date']   = myCurrentMembers.values[i].join_date;
              t['start_date']  = myCurrentMembers.values[i].start_date;
              t['source']      = myCurrentMembers.values[i].source;
              t['status']      = myCurrentMembers.values[i].status_id?tab1[myCurrentMembers.values[i].status_id][myCurrentMembers.values[i].status_id]:'not defined';
              t['display_name'] = myCurrentMembers.values[i].contact_id?tab2[myCurrentMembers.values[i].contact_id][myCurrentMembers.values[i].contact_id]:'not defined';
          
              tabS[i] = t;

              html += '<tr><td>'+t['display_name']+'</td>';
              html += '<td>'+t['start_date']+'</td>';
              html += '<td>'+t['join_date']+'</td>';
              html += '<td>'+t['end_date']+'</td>';
              html += '<td>'+t['source']+'</td>';
              html += '<td>'+t['status']+'</td></tr>';
           }
      }
      html += '</table></div></div></div>';
      $scope.tableFilterS = orderTable(tabS);
      if(tabS.length > 0){
        $("#b3").html(html);
      }else $("#b3").html('<div class="card" style="padding:5px"><div class="card-header bgm-brown"><h2>'+ts('No current membership found!')+'</h2></div></div>');
      
    };

  });

})(angular, CRM.$, CRM._);
