/*
 * dropdownToggle - Provides dropdown menu functionality in place of bootstrap js
 */

angular.module('ui.bootstrap.dropdownToggle', [])

.factory('dropdownOpenScope', function() {
  var _scope = null;

  return {
    get: function() {
      return _scope;
    },
    set: function(scope) {
      _scope = scope;
    },
    clear: function() {
      _scope = null;
    }
  };
})

.controller('DropdownToggleController', ['$scope', '$element', '$attrs', '$document', '$location', 'dropdownOpenScope',
  function (scope, element, attrs, $document, $location, dropdownOpenScope) {
    var initiallyOpen = (angular.isDefined(attrs.opened)) ? scope.$eval(attrs.opened) : false;

    scope.isOpen = function() {
      return ( scope.open === true );
    };

    scope.toggleClose = function(isDocumentClick) {
      scope.open = false;
      $document.unbind('click', scope.toggleClose);
      dropdownOpenScope.clear();

      if ( isDocumentClick !== false ) {
        scope.$apply();
      }
    };

    scope.toggleOpen = function() {
      scope.open = true;
      $document.bind('click', scope.toggleClose);

      var openScope = dropdownOpenScope.get();

      if ( openScope ) {
        openScope.toggleClose(false);
      }
      dropdownOpenScope.set(scope);
    };

    scope.toggle = function(event) {
      event.preventDefault();
      event.stopPropagation();

      // Check if i was open
      if ( scope.isOpen() ) {
        scope.toggleClose(false);
      } else {
        scope.toggleOpen();
      }
      scope.onToggle({ open: scope.isOpen() });
    };

    scope.$watch(function dropdownTogglePathWatch() {
      return $location.path();
    }, function dropdownTogglePathWatchAction(newPath, oldPath) {
      if ( newPath !== oldPath && scope.isOpen() ) {
        scope.toggleClose(false);
      }
    });

    if ( initiallyOpen ) {
        scope.toggleOpen();
    }
}])

.directive('dropdownToggle', function () {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {
      heading: '@',
      placement: '@',
      onToggle: '&'
    },
    controller: 'DropdownToggleController',
    templateUrl: 'template/dropdownToggle/dropdownToggle.html',
    replace: true
  };
})

.directive('dropdownList', function () {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {
      heading: '@',
      placement: '@',
      onToggle: '&'
    },
    controller: 'DropdownToggleController',
    templateUrl: 'template/dropdownToggle/dropdownList.html',
    replace: true
  };
})

.directive('dropdownButton', function () {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {
      heading: '@',
      placement: '@',
      type: '@',
      size: '@',
      onToggle: '&'
    },
    controller: 'DropdownToggleController',
    templateUrl: 'template/dropdownToggle/dropdownButton.html',
    replace: true
  };
})

.directive('dropdownSplitButton', function () {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {
      heading: '@',
      placement: '@',
      type: '@',
      size: '@',
      onToggle: '&'
    },
    controller: 'DropdownToggleController',
    templateUrl: 'template/dropdownToggle/dropdownSplitButton.html',
    replace: true
  };
});
