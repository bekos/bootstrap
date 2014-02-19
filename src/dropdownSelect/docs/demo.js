var SelectDemoCtrl = function ($scope) {

    $scope.icons = [
        { id: 1, name:'Clock', icon:'time', type:'Application'},
        { id: 2, name:'Euro', icon:'euro', type:'Currency'},
        { id: 3, name:'Pound', icon:'gbp', type:'Currency'},
        { id: 4, name:'Dollar', icon:'usd', type:'Currency'},
        { id: 5, name:'Phone', icon:'phone-alt', type:'Application'},
        { id: 6, name:'Tree', icon:'tree-conifer', type:'Other'}
    ];

    $scope.singleSelected = 5;
    $scope.multipleSelected = [1, 3];
};
