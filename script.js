var pbxDom = angular.module('PbxDom', []);

// Define the `pbxDomController` controller on the `pbxDom` module
pbxDom.controller('PbxDomController', function PbxDomController($scope, $http) {
  $scope.reportId = null;
  $scope.wichWidget = null;
  $scope.fromDate = moment()
    .startOf('day')
    .format('YYYY-MM-DD HH:mm:ss');
  $scope.toDate = moment()
    .endOf('day')
    .format('YYYY-MM-DD HH:mm:ss');

  // get combobox values from server
  $http({
    url: 'https://api.pbxdom.com/Features/reports',
    method: 'GET',
    params: {
      access_token: 'HO5C56vCEskvGUDyRlSXtUjh5gPGZ64j8HnhYI2oF9i9bT70BqlpV2SRUyrprXMO'
    }
  }).then(function (response) {
    $scope.reports = response.data;
  });

  // draw table with data from callApi()
  $scope.TableDraw = function (JasonData, columnsData) {
    $('#pbxDomTable').DataTable({
      dom: 'tp',
      destroy: true,
      select: 'multi',
      pageType: 'simple',
      // Json data from server
      data: JasonData.data.calls,
      // columns title that get from response data keys
      columns: columnsData,
      order: [
        [0, 'desc']
      ]
    });
  };

  // Get Data From Server
  $scope.callApi = function () {
    $http({
      url: 'https://api.pbxdom.com/Calls',
      method: 'GET',
      params: {
        access_token: 'HO5C56vCEskvGUDyRlSXtUjh5gPGZ64j8HnhYI2oF9i9bT70BqlpV2SRUyrprXMO',
        rptType: 1,
        rptId: $scope.reportId,
        fromDate: $scope.fromDate,
        toDate: $scope.toDate
      }
    }).then(
      function (response) {
        // if table was already exist distroy it and clean html
        if ($.fn.dataTable.isDataTable('#pbxDomTable')) {
          $('#pbxDomTable').DataTable().destroy();
          $('#pbxDomTable').html("");
        }
        var columnsData = [];
        // if response has value asign them to columnsData otherwise set columnsData to null
        var reportDetails =
          response.data.calls.length > 0 ? response.data.calls[0] : null;

        if (reportDetails !== null) {
          // get response data keys
          $scope.reportDetails = Object.keys(reportDetails);
          for (let key in $scope.reportDetails) {
            columnsData.push({
              data: $scope.reportDetails[key],
              title: $scope.reportDetails[key],
              orderable: true
            });
          }
          $scope.TableDraw(response, columnsData);
        } else {
          alert('There is no data for Today to show!');
        }
      },
      function (error) {
        alert(error);
      }
    );
  };
});