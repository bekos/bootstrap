function DropdownCtrl($scope) {
  $scope.items = [
    "The first choice!",
    "And another choice for you.",
    "but wait! A third!"
  ];

  $scope.log = function() {
    console.log('This is executed');
  };
}
