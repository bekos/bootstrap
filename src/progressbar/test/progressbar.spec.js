describe('progressbar directive', function () {
  var $rootScope, element;
  beforeEach(module('ui.bootstrap.progressbar'));
  beforeEach(module('template/progressbar/progress.html', 'template/progressbar/bar.html'));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $rootScope.value = 22;
    element = $compile('<progress animate="false"><bar value="value">{{value}} %</bar></progress>')($rootScope);
    $rootScope.$digest();
  }));

  function getBar(i) {
    return element.children().eq(i);
  }

  it('has a "progress" css class', function() {
    expect(element).toHaveClass('progress');
  });

  it('contains one child element with "bar" css class', function() {
    expect(element.children().length).toBe(1);
    expect(getBar(0)).toHaveClass('bar');
  });

  it('has a "bar" element with expected width', function() {
    expect(getBar(0).css('width')).toBe('22%');
  });

  it('transcludes "bar" text', function() {
    expect(getBar(0).text()).toBe('22 %');
  });

  it('it should be possible to add additional classes', function () {
    element = $compile('<progress class="progress-striped active" max="200"><bar class="pizza"></bar></progress>')($rootScope);
    $rootScope.$digest();

    expect(element).toHaveClass('progress-striped');
    expect(element).toHaveClass('active');

    expect(getBar(0)).toHaveClass('pizza');
  });

  describe('"max" attribute', function () {
    beforeEach(inject(function() {
      $rootScope.max = 200;
      element = $compile('<progress max="max" animate="false"><bar value="value">{{value}}/{{max}}</bar></progress>')($rootScope);
      $rootScope.$digest();
    }));

    it('adjusts the "bar" width', function() {
      expect(element.children().eq(0).css('width')).toBe('11%');
    });

    it('adjusts the "bar" width when value changes', function() {
      $rootScope.value = 60;
      $rootScope.$digest();
      expect(getBar(0).css('width')).toBe('30%');

      $rootScope.value += 12;
      $rootScope.$digest();
      expect(getBar(0).css('width')).toBe('36%');

      $rootScope.value = 0;
      $rootScope.$digest();
      expect(getBar(0).css('width')).toBe('0%');
    });

    it('transcludes "bar" text', function() {
      expect(getBar(0).text()).toBe('22/200');
    });
  });

  describe('"type" attribute', function () {
    beforeEach(inject(function() {
      $rootScope.type = 'success';
      element = $compile('<progress><bar value="value" type="type"></bar></progress>')($rootScope);
      $rootScope.$digest();
    }));

    it('should use correct classes', function() {
      expect(getBar(0)).toHaveClass('bar');
      expect(getBar(0)).toHaveClass('bar-success');
    });

    it('should change classes if type changed', function() {
      $rootScope.type = 'warning';
      $rootScope.value += 1;
      $rootScope.$digest();

      var barEl = getBar(0); 
      expect(barEl).toHaveClass('bar');
      expect(barEl).not.toHaveClass('bar-success');
      expect(barEl).toHaveClass('bar-warning');
    });
  });

  describe('stacked', function () {
    beforeEach(inject(function() {
      $rootScope.objects = [
        { value: 10, type: 'success' },
        { value: 50, type: 'warning' },
        { value: 20 }
      ];
      element = $compile('<progress animate="false"><bar ng-repeat="o in objects" value="o.value" type="o.type">{{o.value}}</bar></progress>')($rootScope);
      $rootScope.$digest();
    }));

    it('contains the right number of bars', function() {
      expect(element.children().length).toBe(3);
      for (var i = 0; i < 3; i++) {
        expect(getBar(i)).toHaveClass('bar');
      }
    });

    it('renders each bar with the appropriate width', function() {
      expect(getBar(0).css('width')).toBe('10%');
      expect(getBar(1).css('width')).toBe('50%');
      expect(getBar(2).css('width')).toBe('20%');
    });

    it('uses correct classes', function() {
      expect(getBar(0)).toHaveClass('bar-success');
      expect(getBar(0)).not.toHaveClass('bar-warning');

      expect(getBar(1)).not.toHaveClass('bar-success');
      expect(getBar(1)).toHaveClass('bar-warning');

      expect(getBar(2)).not.toHaveClass('bar-success');
      expect(getBar(2)).not.toHaveClass('bar-warning');
    });

    it('should change classes if type changed', function() {
      $rootScope.objects = [
        { value: 20, type: 'warning' },
        { value: 50 },
        { value: 30, type: 'info' }
      ];
      $rootScope.$digest();

      expect(getBar(0)).not.toHaveClass('bar-success');
      expect(getBar(0)).toHaveClass('bar-warning');

      expect(getBar(1)).not.toHaveClass('bar-success');
      expect(getBar(1)).not.toHaveClass('bar-warning');

      expect(getBar(2)).toHaveClass('bar-info');
      expect(getBar(2)).not.toHaveClass('bar-success');
      expect(getBar(2)).not.toHaveClass('bar-warning');
    });

    it('should change classes if type changed', function() {
      $rootScope.objects = [
        { value: 70, type: 'info' }
      ];
      $rootScope.$digest();

      expect(element.children().length).toBe(1);

      expect(getBar(0)).toHaveClass('bar-info');
      expect(getBar(0)).not.toHaveClass('bar-success');
      expect(getBar(0)).not.toHaveClass('bar-warning');
    });
  });


});