describe('accordion', function () {
  var $scope, element, $compile;

  beforeEach(module('ui.bootstrap.accordion'));
  beforeEach(module('template/accordion/accordion.html'));
  beforeEach(module('template/accordion/accordion-group.html'));

  beforeEach(inject(function ($rootScope, _$compile_) {
    $scope = $rootScope;
    $compile = _$compile_;
  }));
  
  function findGroups() {
    return element.find('.accordion-group');
  }
  function findGroupLink(index) {
    return findGroups().eq(index).find('a').eq(0);
  }
  function findGroupBody(index) {
    return findGroups().eq(index).find('.accordion-body').eq(0);
  }
  function getGroupsState() {
    var groups = element.find('.accordion-body');
    var state = [];
    angular.forEach(groups, function(group, index) {
      state.push(groups.eq(index).eq(0).scope().isOpen);
    });
    return state;
  }

  describe('controller', function () {

    var ctrl, $element, $attrs;
    beforeEach(inject(function($controller) {
      $attrs = {}; $element = {};
      ctrl = $controller('AccordionController', { $scope: $scope, $element: $element, $attrs: $attrs });
    }));

    describe('addGroup', function() {
      it('adds a the specified group to the collection', function() {
        var group1, group2;
        ctrl.addGroup(group1 = $scope.$new());
        ctrl.addGroup(group2 = $scope.$new());
        expect(ctrl.groups.length).toBe(2);
        expect(ctrl.groups[0]).toBe(group1);
        expect(ctrl.groups[1]).toBe(group2);
      });
    });

    describe('removeGroup', function() {
      it('should remove the specified group', function () {
        var group1, group2, group3;
        ctrl.addGroup(group1 = $scope.$new());
        ctrl.addGroup(group2 = $scope.$new());
        ctrl.addGroup(group3 = $scope.$new());
        ctrl.removeGroup(group2);
        expect(ctrl.groups.length).toBe(2);
        expect(ctrl.groups[0]).toBe(group1);
        expect(ctrl.groups[1]).toBe(group3);
      });
      it('should ignore remove of non-existing group', function () {
        var group1, group2;
        ctrl.addGroup(group1 = $scope.$new());
        ctrl.addGroup(group2 = $scope.$new());
        expect(ctrl.groups.length).toBe(2);
        ctrl.removeGroup({});
        expect(ctrl.groups.length).toBe(2);
      });
    });
  });

  describe('`close-others` attribute', function() {
    var groupScopes = [];
    beforeEach(function() {
      $scope.close = true;
      element = $compile(
        '<accordion close-others="close">' +
          '<accordion-group heading="title 1">Content 1</accordion-group>' +
          '<accordion-group heading="title 2" is-open="true">Content 2</accordion-group>' +
          '<accordion-group heading="title 3">Content 3</accordion-group>' +
        '</accordion>')($scope);
      angular.element(document.body).append(element);
      $scope.$digest();
    });
    afterEach(function() {
      element.remove();
    });
  
    it('does not change the initial state', function() {
      expect(getGroupsState()).toEqual([false, true, false]);
    });
    
    it('should close other groups if true', function() {
      findGroupLink(2).click();
      $scope.$digest();
      expect(getGroupsState()).toEqual([false, false, true]);
    });
    
    it('should not close other groups if false', function() {
      $scope.close = false;
      $scope.$digest();

      findGroupLink(2).click();
      $scope.$digest();

      expect(getGroupsState()).toEqual([false, true, true]);
    });
  
    it('should close other groups if not defined', function() {
      element = $compile(
        '<accordion>' +
          '<accordion-group heading="title 1">Content 1</accordion-group>' +
          '<accordion-group heading="title 2" is-open="true">Content 2</accordion-group>' +
          '<accordion-group heading="title 3">Content 3</accordion-group>' +
        '</accordion>')($scope);
      angular.element(document.body).append(element);
      $scope.$digest();
      
      findGroupLink(2).click();
      $scope.$digest();

      expect(getGroupsState()).toEqual([false, false, true]);
    });

    describe('setting accordionConfig', function() {
      var originalCloseOthers;
      beforeEach(inject(function(accordionConfig) {
        originalCloseOthers = accordionConfig.closeOthers;
        accordionConfig.closeOthers = false;
        
        element = $compile(
          '<accordion>' +
            '<accordion-group heading="title 1">Content 1</accordion-group>' +
            '<accordion-group heading="title 2" is-open="true">Content 2</accordion-group>' +
            '<accordion-group heading="title 3">Content 3</accordion-group>' +
          '</accordion>')($scope);
        angular.element(document.body).append(element);
        $scope.$digest();
      }));
      afterEach(inject(function(accordionConfig) {
        // return it to the original value
        accordionConfig.closeOthers = originalCloseOthers;
      }));

      it('should not close other groups if accordionConfig.closeOthers is false', function() {
        findGroupLink(2).click();
        $scope.$digest();
        expect(getGroupsState()).toEqual([false, true, true]);
      });
    });
  });

  describe('accordion-group', function () {

    var scope, groups;
    
    beforeEach(inject(function(_$rootScope_) {
      scope = _$rootScope_;
    }));

    afterEach(function () {
      element = groups = scope = undefined;
    });

    describe('with static groups', function () {
      beforeEach(function () {
        var tpl =
          "<accordion>" +
            "<accordion-group heading=\"title 1\">Content 1</accordion-group>" +
            "<accordion-group heading=\"title 2\">Content 2</accordion-group>" +
            "</accordion>";
        element = angular.element(tpl);
        angular.element(document.body).append(element);
        $compile(element)(scope);
        scope.$digest();
        groups = findGroups();
      });
      afterEach(function() {
        element.remove();
      });

      it('should create accordion groups with content', function () {
        expect(groups.length).toEqual(2);
        expect(findGroupLink(0).text()).toEqual('title 1');
        expect(findGroupBody(0).text().trim()).toEqual('Content 1');
        expect(findGroupLink(1).text()).toEqual('title 2');
        expect(findGroupBody(1).text().trim()).toEqual('Content 2');
      });

      it('should change selected element on click', function () {
        findGroupLink(0).click();
        scope.$digest();
        expect(findGroupBody(0).scope().isOpen).toBe(true);

        findGroupLink(1).click();
        scope.$digest();
        expect(findGroupBody(0).scope().isOpen).toBe(false);
        expect(findGroupBody(1).scope().isOpen).toBe(true);
      });

      it('should toggle element on click', function() {
        findGroupLink(0).click();
        scope.$digest();
        expect(findGroupBody(0).scope().isOpen).toBe(true);
        findGroupLink(0).click();
        scope.$digest();
        expect(findGroupBody(0).scope().isOpen).toBe(false);
      });
    });

    describe('with dynamic groups', function () {
      var model;
      beforeEach(function () {
        var tpl =
          "<accordion>" +
            "<accordion-group ng-repeat='group in groups' heading='{{group.name}}'>{{group.content}}</accordion-group>" +
          "</accordion>";
        element = angular.element(tpl);
        model = [
          {name: 'title 1', content: 'Content 1'},
          {name: 'title 2', content: 'Content 2'}
        ];

        $compile(element)(scope);
        scope.$digest();
      });

      it('should have no groups initially', function () {
        groups = findGroups();
        expect(groups.length).toEqual(0);
      });

      it('should have a group for each model item', function() {
        scope.groups = model;
        scope.$digest();
        groups = findGroups();
        expect(groups.length).toEqual(2);
        expect(findGroupLink(0).text()).toEqual('title 1');
        expect(findGroupBody(0).text().trim()).toEqual('Content 1');
        expect(findGroupLink(1).text()).toEqual('title 2');
        expect(findGroupBody(1).text().trim()).toEqual('Content 2');
      });

      it('should react properly on removing items from the model', function () {
        scope.groups = model;
        scope.$digest();
        groups = findGroups();
        expect(groups.length).toEqual(2);

        scope.groups.splice(0,1);
        scope.$digest();
        groups = findGroups();
        expect(groups.length).toEqual(1);
      });
    });

    describe('is-open attribute', function() {
      beforeEach(function () {
        var tpl =
          "<accordion>" +
            "<accordion-group heading=\"title 1\" is-open=\"open1\">Content 1</accordion-group>" +
            "<accordion-group heading=\"title 2\" is-open=\"open2\">Content 2</accordion-group>" +
            "</accordion>";
        element = angular.element(tpl);
        scope.open1 = false;
        scope.open2 = true;
        $compile(element)(scope);
        scope.$digest();
        groups = findGroups();
      });

      it('should open the group with isOpen set to true', function () {
        expect(findGroupBody(0).scope().isOpen).toBe(false);
        expect(findGroupBody(1).scope().isOpen).toBe(true);
      });

      it('should toggle variable on element click', function() {
        findGroupLink(0).click();
        scope.$digest();
        expect(scope.open1).toBe(true);

        findGroupLink(0).click();
        scope.$digest();
        expect(scope.open1).toBe(false);
      });
    });

    describe('is-open attribute with dynamic content', function() {
      beforeEach(function () {
        var tpl =
          "<accordion>" +
            "<accordion-group heading=\"title 1\" is-open=\"open1\"><div ng-repeat='item in items'>{{item}}</div></accordion-group>" +
            "<accordion-group heading=\"title 2\" is-open=\"open2\">Static content</accordion-group>" +
            "</accordion>";
        element = angular.element(tpl);
        scope.items = ['Item 1', 'Item 2', 'Item 3'];
        scope.open1 = true;
        scope.open2 = false;
        angular.element(document.body).append(element);
        $compile(element)(scope);
        scope.$digest();
        groups = findGroups();
      });

      afterEach(function() {
        element.remove();
      });

      it('should have visible group body when the group with isOpen set to true', function () {
        expect(findGroupBody(0)[0].clientHeight).not.toBe(0);
        expect(findGroupBody(1)[0].clientHeight).toBe(0);
      });
    });

    describe('accordion-heading element', function() {
      beforeEach(function() {
        var tpl = 
          '<accordion ng-init="a = [1,2,3]">' +
            '<accordion-group heading="I get overridden">' +
              '<accordion-heading>Heading Element <span ng-repeat="x in a">{{x}}</span> </accordion-heading>' +
              'Body' +
            '</accordion-group>' +
          '</accordion>';
        element = $compile(tpl)(scope);
        scope.$digest();
        groups = findGroups();
      });
      it('transcludes the <accordion-heading> content into the heading link', function() {
        expect(findGroupLink(0).text()).toBe('Heading Element 123 ');
      });
      it('attaches the same scope to the transcluded heading and body', function() {
        expect(findGroupLink(0).find('span').scope().$id).toBe(findGroupBody(0).find('span').scope().$id);
      });

    });

    describe('accordion-heading attribute', function() {
      beforeEach(function() {
        var tpl = 
          '<accordion ng-init="a = [1,2,3]">' +
            '<accordion-group heading="I get overridden">' +
              '<div accordion-heading>Heading Element <span ng-repeat="x in a">{{x}}</span> </div>' +
              'Body' +
            '</accordion-group>' +
          '</accordion>';
        element = $compile(tpl)(scope);
        scope.$digest();
        groups = findGroups();
      });
      it('transcludes the <accordion-heading> content into the heading link', function() {
        expect(findGroupLink(0).text()).toBe('Heading Element 123 ');
      });
      it('attaches the same scope to the transcluded heading and body', function() {
        expect(findGroupLink(0).find('span').scope().$id).toBe(findGroupBody(0).find('span').scope().$id);
      });

    });

    describe('accordion-heading, with repeating accordion-groups', function() {
      it('should clone the accordion-heading for each group', function() {
        element = $compile('<accordion><accordion-group ng-repeat="x in [1,2,3]"><accordion-heading>{{x}}</accordion-heading></accordion-group></accordion>')(scope);
        scope.$digest();
        groups = findGroups();
        expect(groups.length).toBe(3);
        expect(findGroupLink(0).text()).toBe('1');
        expect(findGroupLink(1).text()).toBe('2');
        expect(findGroupLink(2).text()).toBe('3');
      });
    });


    describe('accordion-heading attribute, with repeating accordion-groups', function() {
      it('should clone the accordion-heading for each group', function() {
        element = $compile('<accordion><accordion-group ng-repeat="x in [1,2,3]"><div accordion-heading>{{x}}</div></accordion-group></accordion>')(scope);
        scope.$digest();
        groups = findGroups();
        expect(groups.length).toBe(3);
        expect(findGroupLink(0).text()).toBe('1');
        expect(findGroupLink(1).text()).toBe('2');
        expect(findGroupLink(2).text()).toBe('3');
      });
    });

  });
});
