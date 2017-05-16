(function ($) {
  'use strict';
  var accordionGroupsArray = [],
    methods = {},
    count = 0,
    a = {
      aCs: 'aria-controls',
      aEx: 'aria-expanded',
      aHi: 'aria-hidden',
      aSe: 'aria-selected',
      aLab: 'aria-labelledby',
      aMu: 'aria-multiselectable',
      r: 'role',
      tbI: 'tabindex',
      t: 'true',
      f: 'false'
    };

  //PRIVATE FUNCTIONS
  //-----------------------------------------------
  //set id if element does not have one
  function setId(element, id, i) {
    var elementId = element.id;
    if (elementId === undefined || elementId === '' || elementId === null) {
      element.id = id + (i + 1);
    }
  }
  //set class if element does not have it yet
  function setClass(element, className) {
    if (!element.hasClass(className)) {
      element.addClass(className);
    }
  }

  function getAccordionsIndexes(accordion) {
    var i = 0,
      l = accordionGroupsArray.length,
      accordionId = accordion.attr('id'),
      indexes = {},
      indexAccordion = 0;

    for (i; i < l; i = i + 1) {
      indexAccordion = accordionGroupsArray[i][3].indexOf(accordionId);
      if (indexAccordion !== -1) {
        indexes.indexAccordionGroup = i;
        indexes.indexAccordion = indexAccordion;
        indexes.accordionsLenght = accordionGroupsArray[i][3].length;
        return indexes;
      }
    }
  }


  function checkForSpecialKeys(event) {
    if (!event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
      //none is pressed
      return true;
    }
    return false;
  }
  //-----------------------------------------------


  //PLUGIN METHODS
  //INIT ACCORDION WIDGET
  //-----------------------------------------------
  methods.init = function (userSettings, accordionGroup) {
    var settings = $.extend({
        accClass: 'accordion-group__accordion',
        accHeadClass: 'accordion-group__accordion-head',
        accHeadingClass: 'accordion-group__accordion-heading',
        accBtnClass: 'accordion-group__accordion-btn',
        accCollapseClass: 'accordion-group__accordion-collapse',
        accContentClass: 'accordion-group__accordion-content',
        accContentRole: 'document',
        fadeSpeed: 300,
        accExpandedClass: 'accordion-group__accordion_expanded',
        accBtnExpandedClass: 'accordion-group__accordion-btn_expanded',
        accCollapseExpandedClass: 'accordion-group__accordion-collapse_expanded',
        expandOnPageLoad: true,
        expandOnlyOne: false,
        keyInteraction: true
          //deepLinking: false
      }, userSettings),
      elements = {
        group: accordionGroup,
        acc: accordionGroup.find('.' + settings.accClass),
        accHead: accordionGroup.find('.' + settings.accHeadClass),
        accHeading: accordionGroup.find('.' + settings.accHeadingClass),
        accBtn: accordionGroup.find('.' + settings.accBtnClass),
        accCollapse: accordionGroup.find('.' + settings.accCollapseClass),
        accContent: accordionGroup.find('.' + settings.accContentClass)
      },
      accordionGroupId = '',
      accordionsIds = [],
      accordionsArray = [],
      i = 0,
      l = 0;

    //Set id to accordion group if not set and save id into variable accordionId
    setId(elements.group[0], 'accordion-', count);
    accordionGroupId = elements.group.attr('id');

    //set class to accordion group if not set
    setClass(elements.group, settings.accGroupClass);

    //init accordions by setting ids and attributes
    l = elements.acc.length;
    for (i; i < l; i = i + 1) {
      setId(elements.acc[i], accordionGroupId + '__accordion-', i);
      setId(elements.accHeading[i], accordionGroupId + '__accordion-heading-', i);
      setId(elements.accBtn[i], accordionGroupId + '__accordion-btn-', i);
      setId(elements.accCollapse[i], accordionGroupId + '__accordion-collapse-', i);
      elements.accBtn[i].setAttribute(a.aCs, elements.accCollapse[i].id);
      elements.accCollapse[i].setAttribute(a.aLab, elements.accHeading[i].id);
      elements.accCollapse[i].setAttribute(a.tbI, '0');
      elements.accContent[i].setAttribute(a.r, settings.accContentRole);

      //push each id of accordion and btns into arrays
      accordionsIds.push(elements.acc[i].id);
    }


    //save all accordion data into array
    accordionsArray.push(accordionGroupId, elements, settings, accordionsIds);

    //push array to 1st. level array - accordionGroupsArray
    accordionGroupsArray.push(accordionsArray);

    //ACCORDIONS ARRAY ARCHITECTURE:
    /*
    accordionGroupsArray ---> [i] ---> [0] Id of accordion group
                                  ---> [1] Object wih elements
                                  ---> [2] Object with settings
                                  ---> [3] Array with accordion's ids
    */


    //expand or collapse accordions on load based on settings
    if (settings.expandOnPageLoad) {
      elements.acc.each(function (index) {
        if (index === 0) {
          methods.expand(getAccordionsIndexes($(this)), false);
        } else {
          methods.collapse(getAccordionsIndexes($(this)), false);
        }
      });
    } else {
      elements.acc.each(function (index) {
        methods.collapse(getAccordionsIndexes($(this)), false);
      });
    }

    //bind event handlers
    //handle accordion expand/collapse on click
    elements.accBtn.on('accordion:toggle click', function () {
      var button = $(this),
        expanded = '';
      if (settings.expandOnlyOne && !button.hasClass(settings.accBtnExpandedClass)) {
        expanded = elements.group.find('.' + settings.accExpandedClass);
        if (expanded.length > 0) {
          methods.collapse(getAccordionsIndexes(expanded), true);
        }
      }
      methods.toggle(getAccordionsIndexes(button.closest('.' + settings.accClass)));
    });

    //keyboard navigation
    if (settings.keyInteraction) {
      $(window).unbind('keydown').on('keydown', function (event) {
        var key = event.keyCode,
          activEl = $(':focus'),
          indexes = {},
          elements = {};
        //move focus with arrow keys or special keys if focus is on a button
        if (checkForSpecialKeys(event) === true && activEl.hasClass(settings.accBtnClass)) {
          indexes = getAccordionsIndexes(activEl.closest('.' + settings.accClass));
          elements = accordionGroupsArray[indexes.indexAccordionGroup][1];
          switch (key) {
            case 38: //up arrow
              if (indexes.indexAccordion === 0) {
                $(elements.accBtn[(indexes.accordionsLenght - 1)]).focus();
              } else {
                $(elements.accBtn[(indexes.indexAccordion - 1)]).focus();
              }
              break;
            case 40: //down arrow
              if (indexes.indexAccordion === (indexes.accordionsLenght - 1)) {
                $(elements.accBtn[0]).focus();
              } else {
                $(elements.accBtn[(indexes.indexAccordion + 1)]).focus();
              }
              break;
            case 36: //home
              $(elements.accBtn[0]).focus();
              break;
            case 35: //end
              $(elements.accBtn[(indexes.accordionsLenght - 1)]).focus();
              break;
          }
        }

        //page up and page down when focus is on panel or inside panel or on header
        if (event.ctrlKey && !event.shiftKey && !event.metaKey && !event.altKey &&
          (activEl.hasClass(settings.accCollapseClass) || activEl.closest('.' + settings.accCollapseClass).length > 0 || activEl.hasClass(settings.accBtnClass))) {
          indexes = getAccordionsIndexes(activEl.closest('.' + settings.accClass));
          elements = accordionGroupsArray[indexes.indexAccordionGroup][1];
          switch (key) {
            case 81:
              if (indexes.indexAccordion === 0) {
                $(elements.accBtn[(indexes.accordionsLenght - 1)]).focus();
              } else {
                $(elements.accBtn[(indexes.indexAccordion - 1)]).focus();
              }
              break;
            case 87:
              if (indexes.indexAccordion === (indexes.accordionsLenght - 1)) {
                $(elements.accBtn[0]).focus();
              } else {
                $(elements.accBtn[(indexes.indexAccordion + 1)]).focus();
              }
              break;
          }
        }
      });
    }

    //increment count after every initalisation
    count = count + 1;
  };


  //EXPAND ACCORDION
  //-----------------------------------------------
  methods.expand = function (indexes, animation) {
    var elements = accordionGroupsArray[indexes.indexAccordionGroup][1],
      settings = accordionGroupsArray[indexes.indexAccordionGroup][2],
      accordionCollapse = $(elements.accCollapse[indexes.indexAccordion]);

    $(elements.acc[indexes.indexAccordion])
      .addClass(settings.accExpandedClass);

    $(elements.accBtn[indexes.indexAccordion])
      .addClass(settings.accBtnExpandedClass)
      .attr(a.aEx, a.t)
      .attr(a.aSe, a.t);

    accordionCollapse
      .addClass(settings.accCollapseExpandedClass)
      .attr(a.aHi, a.f)
      .attr(a.tbI, '0');

    if (animation) {
      accordionCollapse.stop().slideDown(settings.fadeSpeed);
    } else {
      accordionCollapse.show();
    }
  };



  //COLLAPSE ACCORDION
  //-----------------------------------------------
  methods.collapse = function (indexes, animation) {
    var elements = accordionGroupsArray[indexes.indexAccordionGroup][1],
      settings = accordionGroupsArray[indexes.indexAccordionGroup][2],
      accordionCollapse = $(elements.accCollapse[indexes.indexAccordion]);

    $(elements.acc[indexes.indexAccordion])
      .removeClass(settings.accExpandedClass);

    $(elements.accBtn[indexes.indexAccordion])
      .removeClass(settings.accBtnExpandedClass)
      .attr(a.aEx, a.f)
      .attr(a.aSe, a.f);

    accordionCollapse
      .removeClass(settings.accCollapseExpandedClass)
      .attr(a.aHi, a.t)
      .attr(a.tbI, '-1');

    if (animation) {
      accordionCollapse.stop().slideUp(settings.fadeSpeed);
    } else {
      accordionCollapse.hide();
    }
  };


  //TOGGLE ACCORDION
  //-----------------------------------------------
  methods.toggle = function (indexes) {
    if ($(accordionGroupsArray[indexes.indexAccordionGroup][1].acc[indexes.indexAccordion])
      .hasClass(accordionGroupsArray[indexes.indexAccordionGroup][2].accExpandedClass)) {
      methods.collapse(indexes, true);
    } else {
      methods.expand(indexes, true);
    }
  };

  //PLUGIN
  //-----------------------------------------------
  $.fn.ariaAccordion = function (userSettings) {
    if (typeof userSettings === 'object' || typeof userSettings === 'undefined') {
      this.each(function () {
        methods.init(userSettings, $(this));
      });
      return;
    } else {
      switch (userSettings) {
        case 'expand':
          this.each(function () {
            methods.expand(getAccordionsIndexes($(this)), true);
          });
          break;
        case 'show':
          this.each(function () {
            methods.expand(getAccordionsIndexes($(this)), false);
          });
          break;
        case 'collapse':
          this.each(function () {
            methods.collapse(getAccordionsIndexes($(this)), true);
          });
          break;
        case 'hide':
          this.each(function () {
            methods.collapse(getAccordionsIndexes($(this)), false);
          });
          break;
        case 'toggle':
          this.each(function () {
            methods.toggle(getAccordionsIndexes($(this)));
          });
          break;
      }
    }
  };
}(jQuery));


$(document).ready(function () {
  'use strict';
  $('#accordion-group-1').ariaAccordion({
    fadeSpeed: 800,
    expandOnPageLoad: true,
    expandOnlyOne: true
  });

  $('#accordion-group-2').ariaAccordion({
    fadeSpeed: 400,
    expandOnPageLoad: false,
    expandOnlyOne: false
  });
});
