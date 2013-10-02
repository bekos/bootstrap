angular.module('ui.bootstrap.accordion', ['ui.bootstrap.collapse'])

.constant('accordionConfig', {
  closeOthers: true,
  isOpen: false,
  disabled: false
})

.controller('AccordionController', ['$scope', '$attrs', '$parse', 'accordionConfig', function ($scope, $attrs, $parse, accordionConfig) {
  var self = this;

  // This array keeps track of the accordion groups
  this.groups = [];

  // Ensure that all the other groups in this accordion are closed, unless close-others explicitly says not to
  this.closeOthers = function(openGroup) {
    var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
    if ( closeOthers ) {
      angular.forEach(this.groups, function (group) {
        if ( group !== openGroup ) {
          self.toggleGroup(group, false);
        }
      });
    }
  };

  // This is called from the accordion-group directive to add itself to the accordion
  this.addGroup = function(group, isOpenAttribute, isDisabledAttribute) {
    var unregisterIsOpenWatch = angular.noop, unregisterDisabledWatch = angular.noop;
    this.groups.push(group);

    group.isOpen = accordionConfig.isOpen;
    if ( isOpenAttribute ) {
      var getIsOpen = $parse(isOpenAttribute);
      group.setIsOpen = getIsOpen.assign;

      unregisterIsOpenWatch = $scope.$watch(getIsOpen, function(value) {
        group.isOpen = !!value;
      });
    }

    group.disabled = accordionConfig.disabled;
    if ( isDisabledAttribute ) {
      unregisterDisabledWatch = $scope.$watch($parse(isDisabledAttribute), function(value) {
        group.disabled = !!value;
      });
    }

    group.toggle = function(value) {
      if ( !group.disabled ) {
        self.toggleGroup(group, value);
      }
    };

    group.$on('$destroy', function (event) {
      self.removeGroup(group);
      unregisterIsOpenWatch();
      unregisterDisabledWatch();
    });
  };

  // This is called from the accordion-group directive to open/close itself
  this.toggleGroup = function(group, value) {
    group.isOpen = (angular.isUndefined(value) || value === null) ? !group.isOpen : !!value;

    if ( group.isOpen ) {
      this.closeOthers(group);
    }
    if ( group.setIsOpen ) {
      group.setIsOpen($scope, group.isOpen);
    }
  };

  // This is called from the accordion-group directive when to remove itself
  this.removeGroup = function(group) {
    var index = this.groups.indexOf(group);
    if ( index > -1 ) {
      this.groups.splice(index, 1);
    }
  };
}])

// The accordion directive simply sets up the directive controller
// and adds an accordion CSS class to itself element.
.directive('accordion', function () {
  return {
    restrict:'EA',
    controller:'AccordionController',
    transclude: true,
    replace: false,
    templateUrl: 'template/accordion/accordion.html'
  };
})

// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
.directive('accordionGroup', function() {
  return {
    require:'^accordion',         // We need this directive to be inside an accordion
    restrict:'EA',
    transclude:true,              // It transcludes the contents of the directive into the template
    replace: true,                // The element containing the directive will be replaced with the template
    templateUrl:'template/accordion/accordion-group.html',
    scope:{                       // Create an isolated scope
      heading: '@'                // and interpolate the heading attribute onto this scope
    },
    controller: function() {
      this.setHeading = function(element) {
        this.heading = element;
      };
    },
    link: function(scope, element, attrs, accordionCtrl) {
      accordionCtrl.addGroup(scope, attrs.isOpen, attrs.disabled);
    }
  };
})

// Use accordion-heading below an accordion-group to provide a heading containing HTML
// <accordion-group>
//   <accordion-heading>Heading containing HTML - <img src="..."></accordion-heading>
// </accordion-group>
.directive('accordionHeading', function() {
  return {
    restrict: 'EA',
    transclude: true,   // Grab the contents to be used as the heading
    template: '',       // In effect remove this element!
    replace: true,
    require: '^accordionGroup',
    compile: function(element, attr, transclude) {
      return function link(scope, element, attr, accordionGroupCtrl) {
        // Pass the heading to the accordion-group controller
        // so that it can be transcluded into the right place in the template
        // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
        accordionGroupCtrl.setHeading(transclude(scope, function() {}));
      };
    }
  };
})

// Use in the accordion-group template to indicate where you want the heading to be transcluded
// You must provide the property on the accordion-group controller that will hold the transcluded element
// <div class="accordion-group">
//   <div class="accordion-heading" ><a ... accordion-transclude="heading">...</a></div>
//   ...
// </div>
.directive('accordionTransclude', function() {
  return {
    require: '^accordionGroup',
    link: function(scope, element, attr, controller) {
      scope.$watch(function() { return controller[attr.accordionTransclude]; }, function(heading) {
        if ( heading ) {
          element.html('');
          element.append(heading);
        }
      });
    }
  };
});
