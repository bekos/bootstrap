describe('dropdownSelect', function() {
  var $compile, $rootScope, $document, element;

  beforeEach(module('ui.bootstrap.dropdownSelect'));
  beforeEach(module('ui.bootstrap.dropdown'));
  beforeEach(module('template/dropdownSelect/select.html'));
  beforeEach(module('template/dropdownSelect/option.html'));
  beforeEach(module('template/dropdownSelect/placeholder-empty.html'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$document_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $document = _$document_;
  }));


  function findButton(element) {
    return element.find('button.dropdown-toggle');
  }

  function findLabel(element) {
    return findButton(element).find('span').eq(0);
  }

  function findDropdown(element) {
    return element.find('ul.dropdown-menu');
  }

  function findMatches(element) {
    return findDropdown(element).find('li[role=option]');
  }

  function findActiveMatch(element) {
    return findDropdown(element).find('li.active');
  }

  function isClosed(element) {
    return findDropdown(element).length === 0 && !element.hasClass('open');
  }

  function isOpen(element) {
    var dropdownEl = findDropdown(element);
    return dropdownEl.length === 1 && element.hasClass('open');
  }

  function clickButton(element) {
    findButton(element).trigger('click');
  }

  function triggerKeyDown(element, keyCode, pressEnter) {
    var e = $.Event('keydown');
    e.which = keyCode;
    element.trigger(e);
  }

  describe('single', function() {
    beforeEach(function() {
      $rootScope.source = ['foo', 'bar', 'baz', 'tab'];
      $rootScope.result = 'bar';
      element = $compile('<dropdown-select ng-model="result" ng-options="item for item in source"></dropdown-select>')($rootScope);
      $rootScope.$digest();
    });

    it('should render correctly the initial state', function () {
      expect(findLabel(element).text()).toBe('bar');
      expect(isClosed(element)).toBe(true);
    });

    it('should open when clicking on it', function () {
      clickButton(element);
      expect(isOpen(element)).toBe(true);
    });

    it('should show empty placeholder when clearing', function () {
      $rootScope.result = null;
      $rootScope.$digest();
      expect(findLabel(element).text()).toBe('Nothing selected');
    });

    describe('keyboard interaction', function() {
      beforeEach(function() {
        clickButton(element);
      });

      it('should focus the correct element', function() {
        expect(findActiveMatch(element).text().trim()).toBe('bar');
        expect($rootScope.result).toBe('bar');
      });

      it('should be able to select next option', function () {
        triggerKeyDown(element, 40);
        triggerKeyDown(element, 13);
        expect(findLabel(element).text()).toBe('baz');
        expect($rootScope.result).toBe('baz');
      });

      it('should be able to select previous option', function () {
        triggerKeyDown(element, 38);
        triggerKeyDown(element, 13);
        expect(findLabel(element).text()).toBe('foo');
        expect($rootScope.result).toBe('foo');
      });

      it('should not loop from the beginning', function () {
        triggerKeyDown(element, 40);
        expect(findActiveMatch(element).text().trim()).toBe('baz');
        triggerKeyDown(element, 40);
        expect(findActiveMatch(element).text().trim()).toBe('tab');
        triggerKeyDown(element, 40);
        expect(findActiveMatch(element).text().trim()).toBe('tab');
      });

      it('should not loop from the end', function () {
        triggerKeyDown(element, 38);
        triggerKeyDown(element, 13);
        expect($rootScope.result).toBe('foo');
        triggerKeyDown(element, 38);
        triggerKeyDown(element, 13);
        expect($rootScope.result).toBe('foo');
      });
    });

    describe('dropdown', function() {
      var matches;
      beforeEach(function() {
        clickButton(element);
        matches = findMatches(element);
      });

      it('should have the correct options', function () {
        expect(matches.length).toBe(4);
        for (var i=0; i<matches.length; i++) {
          expect(matches.eq(i).text().trim()).toEqual($rootScope.source[i]);
        }
      });

      it('should mark the selected option', function () {
        for (var i=0; i<matches.length; i++) {
          expect(matches.eq(i).hasClass('active')).toBe(i === 1);
        }
      });

      it('should update model when an option is clicked', function () {
        matches.eq(2).click();
        expect($rootScope.result).toBe('baz');
      });

      it('should update label and close when an option is clicked', function () {
        matches.eq(2).click();
        expect(findLabel(element).text()).toBe('baz');
        expect(isClosed(element)).toBe(true);
      });

      it('should support dynamic options with valid model', function () {
        $rootScope.source = ['abc', 'def', 'bar'];
        $rootScope.$digest();

        matches = findMatches(element);
        for (var i=0; i<matches.length; i++) {
          expect(matches.eq(i).text().trim()).toEqual($rootScope.source[i]);
          expect(matches.eq(i).hasClass('active')).toBe(i === 2);
        }
        expect(findLabel(element).text()).toBe('bar');
      });

      it('should support dynamic options with invalid model', function () {
        $rootScope.source = ['abc', 'def', 'etc'];
        $rootScope.$digest();

        matches = findMatches(element);
        for (var i=0; i<matches.length; i++) {
          expect(matches.eq(i).text().trim()).toEqual($rootScope.source[i]);
          expect(matches.eq(i).hasClass('active')).toBe(false);
        }
        expect(findLabel(element).text()).toBe('Nothing selected');
      });

      describe('keyboard interaction', function() {
        beforeEach(function() {
          $document.find('body').append(element);
        });

        afterEach(function() {
          element.remove();
        });

        function isFocused(i) {
          return matches.eq(i).hasClass('active');
        }

        it('should focus next option without updating the model', function () {
          triggerKeyDown(element, 40);
          expect(findLabel(element).text()).toBe('bar');
          expect($rootScope.result).toBe('bar');
          expect(isFocused(2)).toBe(true);
        });

        it('should focus previous option without updating the model', function () {
          triggerKeyDown(element, 38);
          expect(findLabel(element).text()).toBe('bar');
          expect($rootScope.result).toBe('bar');
          expect(isFocused(0)).toBe(true);
        });

        it('should not loop from the beginning', function () {
          triggerKeyDown(element, 40);
          triggerKeyDown(element, 40);
          triggerKeyDown(element, 40);
          expect(isFocused(3)).toBe(true);
        });

        it('should not loop from the end', function () {
          triggerKeyDown(element, 38);
          triggerKeyDown(element, 38);
          expect(isFocused(0)).toBe(true);
        });

        it('should close when pressing Escape', function () {
          triggerKeyDown(element, 27);
          expect(isClosed(element)).toBe(true);
        });

        it('should not close when pressing another key', function () {
          triggerKeyDown(element, 65); // a
          expect(isOpen(element)).toBe(true);
        });

        it('should focus first option on key down if nothing is selected', function () {
          $rootScope.result = null;
          $rootScope.$digest();

          triggerKeyDown(element, 40);
          expect($rootScope.result).toBe(null);
          expect(isFocused(0)).toBe(true);
        });
      });
    });
  });

  describe('grouping', function() {
    var matches, groups;

    beforeEach(function() {
      $rootScope.source = [
        { value: 1, label: 'foo', group: 'g1' },
        { value: 2, label: 'bar', group: 'g2' },
        { value: 3, label: 'baz', group: 'g3' },
        { value: 4, label: 'tab', group: 'g2' },
      ];
      $rootScope.result = 2;
      element = $compile('<dropdown-select ng-model="result" ng-options="item.value as item.label group by item.group for item in source"></dropdown-select>')($rootScope);
      $rootScope.$digest();

      clickButton(element);
      matches = findMatches(element);
      groups = findDropdown(element).find('li.dropdown-header');
    });

    it('should render correctly the initial state', function () {
      expect(findLabel(element).text()).toBe('bar');
      expect(isClosed(element)).toBe(false);
    });

    it('should render correctly the groups', function () {
      expect(groups.length).toBe(3);
      var labels = ['g1', 'g2', 'g3'];
      for (var i=0; i<groups.length; i++) {
        expect(groups.eq(i).text()).toBe(labels[i]);
      }
    });

    it('should render correctly the options', function () {
      expect(matches.length).toBe(4);
      var labels = ['foo', 'bar', 'tab', 'baz'];
      for (var i=0; i<matches.length; i++) {
        expect(matches.eq(i).text().trim()).toBe(labels[i]);
      }
    });

    it('should not close when clicking a group', function () {
      groups.eq(1).click();
      expect(isOpen(element)).toBe(true);
    });
  });

  describe('`ng-disabled`', function() {
    beforeEach(function() {
      $rootScope.source = ['foo', 'bar', 'baz'];
      $rootScope.result = 'bar';
      $rootScope.isdisabled = true;
      element = $compile('<dropdown-select ng-model="result" ng-options="item for item in source" ng-disabled="isdisabled"></dropdown-select>')($rootScope);
      $rootScope.$digest();
    });

    it('should have the correct disabled state', function () {
      expect(findButton(element).prop('disabled')).toBe(true);
    });

    it('should not open dropdown if true', function () {
      clickButton(element);
      expect(isOpen(element)).toBe(false);
    });

    it('should render correctly when enabling', function () {
      $rootScope.isdisabled = false;
      $rootScope.$digest();

      expect(findButton(element).prop('disabled')).toBe(false);
      clickButton(element);
      expect(isOpen(element)).toBe(true);
    });
  });

  describe('parser', function() {
    it('should throw error on invalid expression', function () {
      var prepareInvalid = function () {
        element = $compile('<dropdown-select ng-model="result" ng-options="an invalid expression"></dropdown-select>')($rootScope);
        $rootScope.$digest();
      };
      expect(prepareInvalid).toThrow();
    });
  });

  describe('`empty-placeholder-text`', function() {
    it('should throw error on invalid expression', function () {
      $rootScope.source = ['foo', 'bar', 'baz'];
      $rootScope.result = null;
      $rootScope.emptyText = 'Please select...';
      element = $compile('<dropdown-select ng-model="result" ng-options="item for item in source" empty-placeholder-text="{{emptyText}}"></dropdown-select>')($rootScope);
      $rootScope.$digest();
      expect(findLabel(element).text()).toBe($rootScope.emptyText);
    });
  });

  describe('multiple', function() {
    function findLabel(element) {
      var span = findButton(element).children('span'), text = '';
      for (var i=0; i<span.length-1; i++) {
        text += span.eq(i).text();
      }
      return text;
    }

    beforeEach(function() {
      $rootScope.source = [
        { value: 1, label: 'foo' },
        { value: 2, label: 'bar' },
        { value: 3, label: 'baz' },
        { value: 4, label: 'tab' },
      ];
      $rootScope.result = [2, 4];
      element = $compile('<dropdown-select ng-model="result" ng-options="item.value as item.label for item in source" multiple="true"></dropdown-select>')($rootScope);
      $rootScope.$digest();
    });
    it('should render correctly the initial state', function () {
      expect(findLabel(element)).toBe('bar, tab');
      expect(isClosed(element)).toBe(true);
    });

    it('should show empty placeholder when clearing', function () {
      $rootScope.result = null;
      $rootScope.$digest();
      expect(findLabel(element)).toBe('Nothing selected');
    });

    it('should not interact with keyboard if not open', function () {
      triggerKeyDown(element, 40);
      expect($rootScope.result).toEqual([2, 4]);
      expect(isClosed(element)).toBe(true);
    });

    describe('dropdown', function() {
      var matches;
      beforeEach(function() {
        clickButton(element);
        matches = findMatches(element);
      });

      it('should have the correct options', function () {
        expect(matches.length).toBe(4);
        for (var i=0; i<matches.length; i++) {
          expect(matches.eq(i).text().trim()).toEqual($rootScope.source[i].label);
        }
      });

      it('should mark with tick the selecteded options', function () {
        for (var i=0; i<matches.length; i++) {
          expect(matches.eq(i).find('i.glyphicon-ok').length).toBe(i === 1 || i === 3 ? 1 : 0);
        }
      });

      it('should update model when an unselected option is clicked', function () {
        matches.eq(0).click();
        expect($rootScope.result).toEqual([2, 4, 1]);
      });

      it('should update label and not close when an unselected option is clicked', function () {
        matches.eq(0).click();
        expect(findLabel(element)).toBe('foo, bar, tab');
        expect(isOpen(element)).toBe(true);
      });

      it('should update model when a selected option is clicked', function () {
        matches.eq(1).click();
        expect($rootScope.result).toEqual([4]);
      });

      it('should update label and not close when an unselected option is clicked', function () {
        matches.eq(1).click();
        expect(findLabel(element)).toBe('tab');
        expect(isOpen(element)).toBe(true);
      });

      it('should create an array if model is empty', function () {
        $rootScope.result = null;
        $rootScope.$digest();
        matches.eq(0).click();
        expect($rootScope.result).toEqual([1]);
      });

      it('should unselect all options when clearing', function () {
        $rootScope.result = null;
        $rootScope.$digest();
        for (var i=0; i<matches.length; i++) {
          expect(matches.eq(i).find('i.glyphicon-ok').length).toBe(0);
        }
      });

      describe('keyboard interaction', function() {
        beforeEach(function() {
          $document.find('body').append(element);
        });

        afterEach(function() {
          element.remove();
        });

        function isFocused(i) {
          return matches.eq(i).hasClass('active');
        }

        it('should have nothing focused initially', function () {
          for (var i=0; i<matches.length; i++) {
            expect(isFocused(0)).toBe(false);
          }
        });

        it('should focus first option on key "down" without updating the model', function () {
          triggerKeyDown(element, 40);
          expect($rootScope.result).toEqual([2, 4]);
          expect(isFocused(0)).toBe(true);
        });
      });
    });
  });
});
