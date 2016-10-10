(function(angular, $, _) {
  angular.module('komiFac', []);
  //* ===============================================
  //* FACTORIES Classes
  //* ==============================================
  angular.module('komiFac')
      // Pagging table
      .factory('orderTable', function($filter, NgTableParams) {
          var orderTable = function (t) {
              return new NgTableParams({
                      page: 1,            // show first page
                      count: 20,
                  }, {
                      total: t.length, // length of data
                      getData: function($defer, params) {
                          // use built-in angular filter
                           $defer.resolve(t.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                  })
          }
          return orderTable;
      })

})(angular, CRM.$, CRM._);