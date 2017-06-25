(function ($, window, document) {
  'use strict';

  var pluginName = 'ariaAccordion', // the name of the plugin
    count = 0, //a plugin global variable used to generate IDs
    a = {
      aCs: 'aria-controls',
      aEx: 'aria-expanded',
      aHi: 'aria-hidden',
      aSe: 'aria-selected',
      aLab: 'aria-labelledby',
      aMu: 'aria-multiselectable',
      aDi: 'aria-disabled',
      r: 'role',
      tbI: 'tabindex',
      dis: 'disabled',
      t: 'true',
      f: 'false'
    }; //object containing wai aria and html attributes


  //-----------------------------------------
  //Private functions

  /*
   * set id of the element passed along
   * if the element does not have one
   * and return the id of the element
   */
  function setId(element, idPrefix, idSuffix) {
    if (!element.is('[id]')) {
      element.attr('id', idPrefix + idSuffix);
    }
    return element.attr('id');
  }


  /*
   * Check if any of the four modifiers keys are pressed.
   * If none is pressed, return true.
   * Else return array with bool values for pressed keys
   */
  function checkForModifierKeys(event) {
    if (!event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
      //none is pressed
      return 'none';
    } else if (!event.shiftKey && event.ctrlKey && !event.altKey && !event.metaKey) {
      //return array
      return 'ctrl';
    }
    return false;
  }



  //-----------------------------------------
  // The actual plugin constructor
  function AriaAccordion(element, userSettings) {
    this.settings = $.extend({}, $.fn[pluginName].defaultSettings, userSettings);
    this.element = $(element); //The accordion group
    this.elements = {
      acc: this.element.find('.' + this.settings.accClass),
      accHead: this.element.find('.' + this.settings.accHeadClass),
      accHeading: this.element.find('.' + this.settings.accHeadingClass),
      accBtn: this.element.find('.' + this.settings.accBtnClass),
      accCollapse: this.element.find('.' + this.settings.accCollapseClass),
      accContent: this.element.find('.' + this.settings.accContentClass)
    }; //Obejct containing all elements needed by the plugin
    this.elementsLenght = this.elements.acc.length; //How many accordions are in the group?
    this.elementsStatus = []; //The status of each array in the group (expanded or collapsed)



    //Initialise the widget
    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(AriaAccordion.prototype, {
    init: function () {
      /*
       * To make the widget accessible to AT
       * is necessary to expose the relations between some of the elements by referencing their IDs
       * in the attributes aria-labelledby and aria-controls.
       * So we first have to check if the elements alredy have an ID, or set the IDs with scripting.
       *
       * First we chek if the element (the accordion group) alredy has an ID. If not, we generate and set one.
       * In order to generate unique IDs for the element, we use the variable 'count' as a suffix.
       * After each initialisation, the variable get incremented by 1.
       * The whole id of the element will then be used as a prefix 
       * to also make sure the ids we are going to set to the elements are unique.
       */
      var self = this,
        elementId = setId(self.element, self.settings.accGroupIdPrefix, count); //check/set/return ID of element

      /*
       * Now we can set the IDs of all the other elements.
       * We perform a loop through each accordion and set the missing IDs.
       * Within the same loop we also reference the ids within the aria-labelledby and aria-controls attrributes
       */
      self.elements.acc.each(function (index) {
        //setId($(this), elementId + '__accordion--', index); Probably we do not need an ID on this element ...
        setId(self.elements.accHead.eq(index), elementId + '__accordion-head--', index);
        setId(self.elements.accHeading.eq(index), elementId + '__accordion-heading--', index);
        setId(self.elements.accCollapse.eq(index), elementId + '__accordion-collapse--', index);
        setId(self.elements.accCollapse.eq(index), elementId + '__accordion-btn--', index);

        /*
         * Now it is possible to refence the ids of the elements
         * with the aria attributes
         * and expose the relationship between this elements to AT.
         * We perform a loop through each accordion and set
         * each attribute within this loop by getting the elements by index with the function .eq
         */
        self.elements.accBtn.eq(index).attr(a.aCs, self.elements.accCollapse.eq(index).attr('id'));
        self.elements.accCollapse.eq(index).attr(a.aLab, self.elements.accHeading.eq(index).attr('id'));
      });

      /*
       * Set the role of the content of each accordion:
       * More informations about the roles model here: https://www.w3.org/TR/wai-aria-1.1/
       * Because each accordion can have a different role,
       * the option accContentRole accepts both a string or an array of strings,
       * wich is used to map the role to each accordion.
       * We need to check if an array or a string is passed,
       * and then set the roles accordingly.
       */
      if (typeof this.settings.accContentRole === 'string') {
        self.elements.accContent.attr(a.r, self.settings.accContentRole);
      } else if (Array.isArray(self.settings.accContentRole)) {
        self.elements.accContent.each(function (index) {
          $(this).attr(a.r, self.settings.accContentRole[index]);
        });
      }


      /*
       * Now it's time to intialise each accordion by expanding or collapsing them,
       * based on the values of the setting expandOnPageLoad
       */
      if (self.settings.expandOnPageLoad) {
        self.elements.acc.each(function (index) {
          if (index > 0) {
            self.hide(index);
          } else {
            self.show(0);
          }
        });
      }


      /*
       * Bind event handlers to accordion buttons.
       * We actually bind the click event to the accordion element and
       * use delegated event to improve code performance.
       * Also we use the plugin name as a namespace for the event
       * to not interfer with other event handlers.
       */
      self.element.on('click.' + pluginName, '.' + self.settings.accBtnClass, function () {
        self.toggle($(this));
      });



      /*
       * Bind keydown event for keyboard navigation.
       * As before, we use delegated events and namespaces
       * for the implemantation of keys navigation
       */
      if (self.settings.keyboardNavigation) {
        self.element.on('keydown.' + pluginName, function (event) {
          self.keyboardNavigation(event);
        });
      }

      //Increment count by one
      count = count + 1;
    },
    toggle: function (accBtn) {
      /*
       * This method checks wheter an accordion is expanded or collapsed,
       * and calls the method to toggle the accordion based on the current state.
       * 
       * The check of the status of the accorsions is made by looking up the value
       * set for the accorsion in the elementsStatus array.
       *
       * PARAM:
       * accBtn: the button of the accordion to toggled
       * 
       */
      var accIndex = this.elements.accBtn.index(accBtn); // the index of the accordion

      if (this.elementsStatus[accIndex] === true) {
        this.slideUp(accIndex);
      } else {
        this.slideDown(accIndex);
      }
    },
    updateElementStatus: function (accIndex, status) {
      /*
       * Update the array elementsStatus:
       * True if the accordion is expanded, false if collapsed.
       * A very simple method, needed to programatically check the status of an accordion.
       */

      this.elementsStatus[accIndex] = status;
    },
    keyboardNavigation: function (event) {
      var focussedElement = this.element.find(':focus'), //the element with keyboard focus
        focussedElementIndex = 0, //placeholder variable for the index of the accordion button
        pressedKey = event.keyCode; // the code of the pressed key

      /*
       * The keyboard interaction model for accordion is described here:
       * https://www.w3.org/TR/wai-aria-practices-1.1/#accordion.
       *
       * The first thing to do is to check whether an accordion's button
       * or another element inside the accordion collapsible region has focus
       */

      if (focussedElement.is('.' + this.settings.accBtnClass)) {

        /*
         * We revitre the position of the element in the set of elements
         * e.g. the index of the button
         */
        focussedElementIndex = this.elements.accBtn.index(focussedElement);

        // Implement the logic for keyboard navigation
        /*
        if (checkForModifierKeys(event) === 'none') {
          switch (pressedKey) {
            case 38:
              //up arrow: focus previous heading
              if (focussedElementIndex > 0) {
                this.elements.accBtn.eq(focussedElementIndex - 1).focus();
              }
              break;
            case 40:
              //down arrow: focus next heading
              if (focussedElementIndex < this.elementsLenght) {
                this.elements.accBtn.eq(focussedElementIndex + 1).focus();
              }
              break;
            case 36:
              //home: focus first heading
              this.elements.accBtn.eq(0).focus();
              break;
            case 35:
              //end: focus last heading
              this.elements.accBtn.eq(this.elementsLenght - 1).focus();
              break;
          }
        } else*/ if (checkForModifierKeys === 'ctrl') {
          switch (pressedKey) {
            case 81:
              //page up: move focus to prev heading
              if (focussedElementIndex > 0) {
                this.elements.accBtn.eq(focussedElementIndex - 1).focus();
              }
              break;
            case 87:
              //page down: focus next heading
              if (focussedElementIndex < this.elementsLenght) {
                this.elements.accBtn.eq(focussedElementIndex + 1).focus();
              }
          }
        }
      } else if (focussedElement.closest('.' + this.settings.accCollapseClass).length > 0) {
        
        
         /*
         * We revitre the position of the accordion in wich the foccused element is contained
         * e.g. the index of the accordion/accordion btn
         */
        focussedElementIndex = this.elements.accCollapse.index(focussedElement.closest('.' + this.settings.accCollapseClass));
        
        
        switch (pressedKey) {
          case 81:
            //page up: move focus to heading of this accordion
            if (focussedElementIndex > 0) {
              this.elements.accBtn.eq(focussedElementIndex).focus();
            }
            break;
          case 87:
            //page down: focus next heading
            if (focussedElementIndex < this.elementsLenght) {
              this.elements.accBtn.eq(focussedElementIndex + 1).focus();
            }
        }
      }
    },
    expand: function (accIndex) {
      /*
       * To expand an accordion following actions must be performed:
       * 1 - update the values of the attributes aria-expanded, aria-hidden and aria-disabled
       * 2 - add the 'expanded' classes to the head, button and collapsible region
       * 3 - perform the slide-down animation on the panel
       * Because we have different methods to animate a collapsible region, the animation
       * is performd from within another method, while this methods only updates the attributes
       */

      //Update attributes and classes
      this.elements.acc.eq(accIndex)
        .addClass(this.settings.accExpandedClass);

      this.elements.accBtn.eq(accIndex)
        .attr(a.aEx, a.t)
        .addClass(this.settings.accBtnExpandedClass);

      this.elements.accCollapse.eq(accIndex)
        .attr(a.aHi, a.f)
        .addClass(this.settings.accCollapseExpandedClass);

      /*
       * The attribute aria-disabled should be set to true on the button
       * if the option oneAlwaysExpanded is set to true.
       * We evaluate the value of this option and of the option expandOnlyOne.
       * If expandOnlyOne is also true, then oneAlwaysExpanded can be applied.
       */
      if (this.settings.expandOnlyOne && this.settings.oneAlwaysExpanded) {
        this.elements.accBtn.eq(accIndex)
          .attr(a.aDi, a.t)
          .prop(a.dis, a.t);
      }

      //Update the status of the element
      this.updateElementStatus(accIndex, true);
    },
    collapse: function (accIndex) {
      /*
       * To collapse an accordion three actions must be performed:
       * 1 - update the values of the attributes aria-expanded, aria-hidden and aria-disabled
       * 2 - remove the 'expanded' classes from the head, button and collapsible region
       * 3 - perform the slide-up animation on the panel
       * Because we have different methods to animate a collapsible region, the animation
       * is performd from within another method, while this methods only updates the attributes
       */

      //Update attributes and classes
      this.elements.acc.eq(accIndex)
        .removeClass(this.settings.accExpandedClass);

      this.elements.accBtn.eq(accIndex)
        .attr(a.aEx, a.f)
        .removeClass(this.settings.accBtnExpandedClass);

      this.elements.accCollapse.eq(accIndex)
        .attr(a.aHi, a.t)
        .removeClass(this.settings.accCollapseExpandedClass);

      /*
       * The attribute aria-disabled should be set to false
       * if the option oneAlwaysExpanded is set to true and the accorsion is going to be collapsed
       * We evaluate the value of this option and of the option expandOnlyOne.
       * If expandOnlyOne is also true, then oneAlwaysExpanded can be applied.
       */
      if (this.settings.expandOnlyOne && this.settings.oneAlwaysExpanded) {
        this.elements.accBtn.eq(accIndex)
          .attr(a.aDi, a.f)
          .prop(a.dis, a.t);
      }

      //Update the status of the element
      this.updateElementStatus(accIndex, false);
    },
    slideDown: function (accIndex) {
      /*
       * Perform the slide-down animation of the plugin
       * The JS animation should be performed, only if cssTransition is set to false.
       * If cssTransition is set to true, then the the animation of the accordion
       * relies only on CSS styles.
       */
      if (!this.settings.cssTransitions) {
        this.elements.accCollapse.eq(accIndex)
          .stop()
          .slideDown(this.settings.slideSpeed, this.settings.transitionTimingFunction);
      }

      //Call this.expand in order to update the attributes of the accordion.
      this.expand(accIndex);
    },
    slideUp: function (accIndex) {
      /*
       * Perform the slide-up animation of the plugin
       * The JS animation should be performed, only if cssTransition is set to false.
       * If cssTransition is set to true, then the the animation of the accordion
       * relies only on CSS styles
       */
      if (!this.settings.cssTransitions) {
        this.elements.accCollapse.eq(accIndex)
          .stop()
          .slideUp(this.settings.slideSpeed, this.settings.transitionTimingFunction);
      }

      //Call this.collapse in order to update the attributes of the accordion.
      this.collapse(accIndex);
    },
    show: function (accIndex) {
      /*
       * In some cases, for example when the widget get first initialised,
       * we do not want the accordions to be animated.
       * For this reason we provide this method and the method hide.
       */

      //Show the accordion
      this.elements.accCollapse.eq(accIndex).show();

      //Call expand to update the attributes
      this.expand(accIndex);
    },
    hide: function (accIndex) {
      /*
       * In some cases, for example when the widget get first initialised,
       * we do not want the accordions to be animated.
       * For this reason we provide this method and the method show.
       */

      //Hide the accordion
      this.elements.accCollapse.eq(accIndex).hide();

      //Call collapse to update the attributes
      this.collapse(accIndex);
    },
    addAccordion: function () {

    },
    removeAccordion: function () {

    }
  });

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (userSettings) {
    return this.each(function () {
      /*
       * If following conditions matches, then the plugin must be initialsied:
       * Check if the plugin is instantiated for the first time
       * Check if the argument passed is an object or undefined (no arguments)
       */
      if (!$.data(this, 'plugin_' + pluginName) && (typeof userSettings === 'object' || typeof userSettings === 'undefined')) {
        $.data(this, 'plugin_' + pluginName, new AriaAccordion(this, userSettings));
      } else if (typeof userSettings === 'string' && arguments.length === 1) {
        switch (userSettings) {
          case 'expand':
            $.data(this, 'plugin_' + pluginName).expand();
            break;
          case 'collapse':
            $.data(this, 'plugin_' + pluginName).collapse();
            break;
          case 'show':
            $.data(this, 'plugin_' + pluginName).show();
            break;
          case 'hide':
            $.data(this, 'plugin_' + pluginName).hide();
            break;
          case 'addAccordion':
            $.data(this, 'plugin_' + pluginName).addAccordion();
            break;
          case 'removeAccordion':
            $.data(this, 'plugin_' + pluginName).removeAccordion();
            break;
          case 'destroy':
            $.data(this, 'plugin_' + pluginName).destroy();
            break;
        }
      }
    });
  };


  //Define default settings
  $.fn[pluginName].defaultSettings = {
    accGroupIdPrefix: 'accordion-group--',
    accClass: 'accordion-group__accordion',
    accHeadClass: 'accordion-group__accordion-head',
    accHeadingClass: 'accordion-group__accordion-heading',
    accBtnClass: 'accordion-group__accordion-btn',
    accCollapseClass: 'accordion-group__accordion-collapse',
    accContentClass: 'accordion-group__accordion-content',
    accContentRole: 'document',
    slideSpeed: 300,
    transitionTimingFunction: 'swing',
    cssTransitions: false,
    accExpandedClass: 'accordion-group__accordion_expanded',
    accBtnExpandedClass: 'accordion-group__accordion-btn_expanded',
    accCollapseExpandedClass: 'accordion-group__accordion-collapse_expanded',
    expandOnPageLoad: true,
    expandOnlyOne: false,
    oneAlwaysExpanded: false,
    keyboardNavigation: true
  };

}(jQuery, window, document));


$(document).ready(function () {
  'use strict';
  $('.accordion-group').ariaAccordion({
    accContentRole: ['document', 'application', 'document']
  });
});
