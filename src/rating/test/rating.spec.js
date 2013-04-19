describe('rating directive', function () {
  var $rootScope, element;
  beforeEach(module('ui.bootstrap.rating'));
  beforeEach(module('template/rating/rating.html'));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $rootScope.rate = 3;
    element = $compile('<rating value="rate"></rating>')($rootScope);
    $rootScope.$digest();
  }));

  it('contains the default number of icons', function() {
    expect(element.find('i').length).toBe(5);
  });

  it('initializes the default star icons as selected', function() {
    var stars = element.find('i');
    expect(stars.eq(0).hasClass('icon-star')).toBe(true);
    expect(stars.eq(1).hasClass('icon-star')).toBe(true);
    expect(stars.eq(2).hasClass('icon-star')).toBe(true);

    expect(stars.eq(3).hasClass('icon-star')).toBe(false);
    expect(stars.eq(3).hasClass('icon-star-empty')).toBe(true);

    expect(stars.eq(4).hasClass('icon-star')).toBe(false);
    expect(stars.eq(4).hasClass('icon-star-empty')).toBe(true);
  });

  it('handles correcty the click event', function() {
    var stars = element.find('i');

    var star2 = stars.eq(1);
    star2.click();
    $rootScope.$digest();

    expect(stars.eq(0).hasClass('icon-star')).toBe(true);
    expect(stars.eq(1).hasClass('icon-star')).toBe(true);
    expect(stars.eq(2).hasClass('icon-star-empty')).toBe(true);
    expect(stars.eq(3).hasClass('icon-star-empty')).toBe(true);
    expect(stars.eq(4).hasClass('icon-star-empty')).toBe(true);
    expect($rootScope.rate).toBe(2);

    var star5 = stars.eq(4);
    star5.click();
    $rootScope.$digest();

    expect(stars.eq(0).hasClass('icon-star')).toBe(true);
    expect(stars.eq(1).hasClass('icon-star')).toBe(true);
    expect(stars.eq(2).hasClass('icon-star')).toBe(true);
    expect(stars.eq(3).hasClass('icon-star')).toBe(true);
    expect(stars.eq(4).hasClass('icon-star')).toBe(true);
    expect($rootScope.rate).toBe(5);
  });

  it('handles correcty the hover event', function() {
    var stars = element.find('i');

    var star2 = stars.eq(1);
    star2.trigger('mouseover');
    $rootScope.$digest();

    expect(stars.eq(0).hasClass('icon-star')).toBe(true);
    expect(stars.eq(1).hasClass('icon-star')).toBe(true);
    expect(stars.eq(2).hasClass('icon-star-empty')).toBe(true);
    expect(stars.eq(3).hasClass('icon-star-empty')).toBe(true);
    expect(stars.eq(4).hasClass('icon-star-empty')).toBe(true);
    expect($rootScope.rate).toBe(3);

    var star5 = stars.eq(4);
    star5.trigger('mouseover');
    $rootScope.$digest();

    expect(stars.eq(0).hasClass('icon-star')).toBe(true);
    expect(stars.eq(1).hasClass('icon-star')).toBe(true);
    expect(stars.eq(2).hasClass('icon-star')).toBe(true);
    expect(stars.eq(3).hasClass('icon-star')).toBe(true);
    expect(stars.eq(4).hasClass('icon-star')).toBe(true);
    expect($rootScope.rate).toBe(3);

    element.trigger('mouseout');
    expect(stars.eq(0).hasClass('icon-star')).toBe(true);
    expect(stars.eq(1).hasClass('icon-star')).toBe(true);
    expect(stars.eq(2).hasClass('icon-star')).toBe(true);
    expect(stars.eq(3).hasClass('icon-star-empty')).toBe(true);
    expect(stars.eq(4).hasClass('icon-star-empty')).toBe(true);
    expect($rootScope.rate).toBe(3);
  });

  it('changes the number of selected icons when value changes', function() {
    $rootScope.rate = 2;
    $rootScope.$digest();

    var stars = element.find('i');
    expect(stars.eq(0).hasClass('icon-star')).toBe(true);
    expect(stars.eq(1).hasClass('icon-star')).toBe(true);
    expect(stars.eq(2).hasClass('icon-star-empty')).toBe(true);
    expect(stars.eq(3).hasClass('icon-star-empty')).toBe(true);
    expect(stars.eq(4).hasClass('icon-star-empty')).toBe(true);
  });

  it('shows different number of icons when `max` attribute is set', function() {
    element = $compile('<rating value="rate" max="7"></rating>')($rootScope);
    $rootScope.$digest();

    expect(element.find('i').length).toBe(7);
  });

  it('handles readonly attribute', function() {
    $rootScope.isReadonly = true;
    element = $compile('<rating value="rate" readonly="isReadonly"></rating>')($rootScope);
    $rootScope.$digest();

    var stars = element.find('i');
    expect(stars.eq(0).hasClass('icon-star')).toBe(true);
    expect(stars.eq(1).hasClass('icon-star')).toBe(true);
    expect(stars.eq(2).hasClass('icon-star')).toBe(true);
    expect(stars.eq(3).hasClass('icon-star-empty')).toBe(true);
    expect(stars.eq(4).hasClass('icon-star-empty')).toBe(true);

    var star5 = stars.eq(4);
    star5.trigger('mouseover');
    $rootScope.$digest();
    expect(stars.eq(3).hasClass('icon-star-empty')).toBe(true);
    expect(stars.eq(4).hasClass('icon-star-empty')).toBe(true);

    $rootScope.isReadonly = false;
    $rootScope.$digest();

    star5.trigger('mouseover');
    $rootScope.$digest();
    expect(stars.eq(3).hasClass('icon-star-empty')).toBe(false);
    expect(stars.eq(4).hasClass('icon-star-empty')).toBe(false);
  });

});

describe('setting ratingConfig', function() {
  var $rootScope, element;
  var originalConfig = {};
  beforeEach(module('ui.bootstrap.rating'));
  beforeEach(module('template/rating/rating.html'));
  beforeEach(inject(function(_$compile_, _$rootScope_, ratingConfig) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $rootScope.rate = 5;
    angular.extend(originalConfig, ratingConfig);
    ratingConfig.max = 10;
    element = $compile('<rating value="rate"></rating>')($rootScope);
    $rootScope.$digest();
  }));
  afterEach(inject(function(ratingConfig) {
    // return it to the original state
    angular.extend(ratingConfig, originalConfig);
  }));

  it('should change number of icon elements', function () {
    expect(element.find('i').length).toBe(10);
  });

});

