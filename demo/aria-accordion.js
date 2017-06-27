/*
MIT License

Copyright (c) 2017 Davide Trisolini

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function ($, window, document) {
  'use strict';

  var pluginName = 'ariaAccordion', // the name of the plugin
    count = 0, //a plugin global variable used to generate IDs
    a = {
      aCs: 'aria-controls',
      aEx: 'aria-expanded',
      aHi: 'aria-hidden',
      aLab: 'aria-labelledby',
      aDi: 'aria-disabled',
      r: 'role',
      tbI: 'tabindex',
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
    } else if (event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
      //only control is pressed
      return 'ctrl';
    }
    return false;
  }


  //-----------------------------------------
  // The actual plugin constructor
  function AriaAccordion(element, userSettings) {
    this.settings = $.extend({}, $.fn[pluginName].defaultSettings, userSettings);
    this.element = $(element); //The accordion group
    this.elementId = ''; //the element id
    this.elements = {
      acc: this.element.find('.' + this.settings.class),
      head: this.element.find('.' + this.settings.headClass),
      heading: this.element.find('.' + this.settings.headingClass),
      btn: this.element.find('.' + this.settings.btnClass),
      collapse: this.element.find('.' + this.settings.collapseClass),
      content: this.element.find('.' + this.settings.contentClass)
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
      var self = this;

      self.elementId = setId(self.element, self.settings.accGroupIdPrefix, count); //check/set/return ID of element

      /*
       * Now we can set the IDs of all the other elements.
       * We perform a loop through each accordion and set the missing IDs.
       * Within the same loop we also reference the ids within the aria-labelledby and aria-controls attrributes
       */
      self.elements.acc.each(function (index) {
        setId(self.elements.heading.eq(index), self.elementId + '__accordion-heading--', index);
        setId(self.elements.collapse.eq(index), self.elementId + '__accordion-collapse--', index);
        setId(self.elements.collapse.eq(index), self.elementId + '__accordion-btn--', index);

        /*
         * Now it is possible to refence the ids of the elements
         * with the aria attributes
         * and expose the relationship between this elements to AT.
         * We perform a loop through each accordion and set
         * each attribute within this loop by getting the elements by index with the function .eq
         */
        self.elements.btn.eq(index).attr(a.aCs, self.elements.collapse.eq(index).attr('id'));
        self.elements.collapse.eq(index).attr(a.aLab, self.elements.heading.eq(index).attr('id'));
      });

      /*
       * Set the role of the content of each accordion:
       * More informations about the roles model here: https://www.w3.org/TR/wai-aria-1.1/
       * Because each accordion can have a different role,
       * the option contentRole accepts both a string or an array of strings,
       * wich is used to map the role to each accordion.
       * We need to check if an array or a string is passed,
       * and then set the roles accordingly.
       */
      if (typeof this.settings.contentRole === 'string') {
        self.elements.content.attr(a.r, self.settings.contentRole);
      } else if (Array.isArray(self.settings.contentRole)) {
        self.elements.content.each(function (index) {
          $(this).attr(a.r, self.settings.contentRole[index]);
        });
      }

      /*
       * Now it's time to intialise each accordion by expanding or collapsing them,
       * based on the values of the setting expandOnPageLoad and expandOnlyOne
       */
      if (self.settings.expandOnPageLoad || self.settings.expandOnlyOne) {
        self.elements.acc.each(function (index) {
          if (index > 0) {
            self.hide(index);
          } else {
            self.show(0);
          }
        });
      } else {
        self.elements.acc.each(function (index) {
          self.hide(index);
        });
      }

      /*
       * Bind event handlers to accordion buttons.
       * We actually bind the click event to the accordion element and
       * use delegated event to improve code performance.
       * Also we use the plugin name as a namespace for the event
       * to not interfer with other event handlers.
       */
      self.element.on('click.' + pluginName, '.' + self.settings.btnClass, function () {
        self.toggleAnimate(self.elements.btn.index($(this)));
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
    toggleAnimate: function (accIndex) {
      /*
       * This method checks wheter an accordion is expanded or collapsed,
       * and calls the method to toggle the accordion based on the current state.
       * 
       * The check of the status of the accorsions is made by looking up the value
       * set for the accorsion in the elementsStatus array.
       *
       */

      //Implement the toggle logic for default mode and for expandOnlyOne      
      if (this.settings.expandOnlyOne) {
        /*
         * When expandOnlyOne is set to true, then the expanded accordion
         * should not be directly collapsed, because one accordion should always be expanded.
         * When slideDown is triggered on a collapsed accordion, then the currently expanded accordion
         * should be collapsed
         */
        if (this.elementsStatus[accIndex] === true) {
          return false; //Stop execution 
        } else {
          this.slideUp(this.elementsStatus.indexOf(true)); //collapse expande accordion
          this.slideDown(accIndex); //Expand accordion
        }
      } else {
        /*
         * Normal mode: whenever an accordion is triggerd, change the status
         * by collapsing it if expanded and expanding it if collapsed
         */
        if (this.elementsStatus[accIndex] === true) {
          this.slideUp(accIndex);
        } else {
          this.slideDown(accIndex);
        }
      }
    },
    toggleNoAnimate: function (accIndex) {
      /*
       * This method checks wheter an accordion is expanded or collapsed,
       * and calls the method to toggle the accordion based on the current state.
       * 
       * The check of the status of the accorsions is made by looking up the value
       * set for the accorsion in the elementsStatus array.
       *
       */

      //Implement the toggle logic for default mode and for expandOnlyOne      
      if (this.settings.expandOnlyOne) {
        /*
         * When expandOnlyOne is set to true, then the expanded accordion
         * should not be directly collapsed, because one accordion should always be expanded.
         * When slideDown is triggered on a collapsed accordion, then the currently expanded accordion
         * should be collapsed
         */
        if (this.elementsStatus[accIndex] === true) {
          return false; //Stop execution 
        } else {
          this.hide(this.elementsStatus.indexOf(true)); //collapse expande accordion
          this.show(accIndex); //Expand accordion
        }
      } else {
        /*
         * Normal mode: whenever an accordion is triggerd, change the status
         * by collapsing it if expanded and expanding it if collapsed
         */
        if (this.elementsStatus[accIndex] === true) {
          this.hide(accIndex);
        } else {
          this.show(accIndex);
        }
      }
    },
    updateElementStatus: function (accIndex, status) {
      /*
       * Update the array elementsStatus:
       * True if the accordion is expanded, false if collapsed.
       * A very simple method, needed to programatically update
       * the status of an accordion.
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

      if (focussedElement.is('.' + this.settings.btnClass)) {
        /*
         * We revitre the position of the element in the set of elements
         * e.g. the index of the button
         */
        focussedElementIndex = this.elements.btn.index(focussedElement);

        // Implement the logic for keyboard navigation
        if (checkForModifierKeys(event) === 'none') {
          switch (pressedKey) {
            case 38:
              //up arrow: focus previous heading
              if (focussedElementIndex > 0) {
                this.elements.btn.eq(focussedElementIndex - 1).focus();
              }
              break;
            case 40:
              //down arrow: focus next heading
              if (focussedElementIndex < this.elementsLenght) {
                this.elements.btn.eq(focussedElementIndex + 1).focus();
              }
              break;
            case 36:
              //home: focus first heading
              this.elements.btn.eq(0).focus();
              break;
            case 35:
              //end: focus last heading
              this.elements.btn.eq(this.elementsLenght - 1).focus();
              break;
          }
        } else if (checkForModifierKeys(event) === 'ctrl') {
          switch (pressedKey) {
            case 81:
              //page up: move focus to prev heading
              if (focussedElementIndex > 0) {
                this.elements.btn.eq(focussedElementIndex - 1).focus();
              }
              break;
            case 87:
              //page down: focus next heading
              if (focussedElementIndex < this.elementsLenght) {
                this.elements.btn.eq(focussedElementIndex + 1).focus();
              }
              break;
          }
        }
      } else if (focussedElement.closest('.' + this.settings.collapseClass).length > 0 && checkForModifierKeys(event) === 'ctrl') {
        /*
         * We revitre the position of the accordion in wich the foccused element is contained
         * e.g. the index of the accordion/accordion btn
         */
        focussedElementIndex = this.elements.collapse.index(focussedElement.closest('.' + this.settings.collapseClass));

        switch (pressedKey) {
          case 81:
            //page up: move focus to heading of this accordion
            this.elements.btn.eq(focussedElementIndex).focus();
            break;
          case 87:
            //page down: focus next heading
            if (focussedElementIndex < this.elementsLenght) {
              this.elements.btn.eq(focussedElementIndex + 1).focus();
            }
            break;
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

      this.elements.btn.eq(accIndex)
        .attr(a.aEx, a.t)
        .addClass(this.settings.btnExpandedClass);

      this.elements.collapse.eq(accIndex)
        .attr(a.aHi, a.f)
        .addClass(this.settings.collapseExpandedClass);

      /*
       * The attribute aria-disabled should be set to true on the button
       * if the option expandOnlyOne is set to true.
       */
      if (this.settings.expandOnlyOne) {
        this.elements.btn.eq(accIndex).attr(a.aDi, a.t);
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

      this.elements.btn.eq(accIndex)
        .attr(a.aEx, a.f)
        .removeClass(this.settings.btnExpandedClass);

      this.elements.collapse.eq(accIndex)
        .attr(a.aHi, a.t)
        .removeClass(this.settings.collapseExpandedClass);

      /*
       * The attribute aria-disabled should be set to false
       * if the option expandOnlyOne is set to true and the accorsion is collapsed
       */
      if (this.settings.expandOnlyOne) {
        this.elements.btn.eq(accIndex).attr(a.aDi, a.f);
      }

      //Update the status of the element
      this.updateElementStatus(accIndex, false);
    },
    slideDown: function (accIndex) {
      /*
       * Perform the slide-down animation of the plugin
       * The JS animation should be performed, only if cssTransition is set to false.
       * If cssTransition is set to true, then the  animation of the accordion
       * relies only on CSS styles.
       */
      if (!this.settings.cssTransitions) {
        this.elements.collapse.eq(accIndex)
          .stop()
          .slideDown(this.settings.slideSpeed, this.settings.transitionEasingFunction);
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
        this.elements.collapse.eq(accIndex)
          .stop()
          .slideUp(this.settings.slideSpeed, this.settings.transitionEasingFunction);
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

      /*
       * Show the accordion, only if css transitions are disabled,
       * otherwise the animation should rely only on css transitions.
       */
      if (!this.settings.cssTransitions) {
        this.elements.collapse.eq(accIndex).show();
      }
      //Call expand to update the attributes
      this.expand(accIndex);
    },
    hide: function (accIndex) {
      /*
       * In some cases, for example when the widget get first initialised,
       * we do not want the accordions to be animated.
       * For this reason we provide this method and the method show.
       */

      /*
       * Hide the accordion, only if css transitions are disabled,
       * otherwise the animation should rely only on css transitions.
       */
      if (!this.settings.cssTransitions) {
        this.elements.collapse.eq(accIndex).hide();
      }
      //Call collapse to update the attributes
      this.collapse(accIndex);
    },
    methodCaller: function (methodName, methodArg) {

      /*
       * This function is the control center for any method call implemented in the plugin.
       * Because each method accepts different arguments types, the function checks the type of
       * the passed arguments and performs the needed operations in order to make a function call
       */
      if (typeof methodArg !== 'number') {
        if (typeof methodArg === 'string') {
          /*
           * If the user passes a string we assum this is a jQuery selector.
           * We perform a call to the jQuery function and get the element
           */
          methodArg = $(methodArg);
        }

        if (typeof methodArg === 'object') {
          /*
           * If the user passes an object we assum this is a jQuery obejct.
           * In order to perform a method call,
           * we need to retrive the index of the passed accordion object.
           * The passed element must:
           * - be a single jQuery element object (no collection and non empty),
           * - be an accordion (it must have the accordion class),
           * - must be a child element of the accordion group,
           */
          if (methodArg.length === 1 &&
            methodArg.hasClass(this.settings.class) &&
            methodArg.closest(this.element).length === 1) {
            methodArg = this.elements.acc.index(methodArg);
          }
        }
      }


      /*
       * Now we have the index of the element and can perform the method call:
       * let us check wich wethod the developer want to call, by comparing the
       * first parameter passed along with the function.
       */
      switch (methodName) {
        case 'toggleAnimate':
          this.toggleAnimate(methodArg); //call toggle
          break;
        case 'toggleNoAnimate':
          this.toggleNoAnimate(methodArg); //call toggle
          break;
        case 'slideDown':
          if (this.elementsStatus[methodArg] === false) {
            this.toggleAnimate(methodArg);
          }
          break;
        case 'slideUp':
          if (this.elementsStatus[methodArg] === true) {
            this.toggleAnimate(methodArg);
          }
          break;
        case 'show':
          if (this.elementsStatus[methodArg] === true) {
            this.toggleNoAnimate(methodArg);
          }
          break;
        case 'hide':
          if (this.elementsStatus[methodArg] === true) {
            this.toggleNoAnimate(methodArg);
          }
          break;
      }
    }
  });


  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (userSettings, methodArg) {
    return this.each(function () {
      /*
       * If following conditions matches, then the plugin must be initialsied:
       * Check if the plugin is instantiated for the first time
       * Check if the argument passed is an object or undefined (no arguments)
       */
      if (!$.data(this, 'plugin_' + pluginName) && (typeof userSettings === 'object' || typeof userSettings === 'undefined')) {
        $.data(this, 'plugin_' + pluginName, new AriaAccordion(this, userSettings));
      } else if (typeof userSettings === 'string' && typeof methodArg !== 'undefined') {
        $.data(this, 'plugin_' + pluginName).methodCaller(userSettings, methodArg);
      }
    });
  };


  //Define default settings
  $.fn[pluginName].defaultSettings = {
    accGroupIdPrefix: 'accordion-group--',
    class: 'accordion-group__accordion',
    headClass: 'accordion-group__accordion-head',
    headingClass: 'accordion-group__accordion-heading',
    btnClass: 'accordion-group__accordion-btn',
    collapseClass: 'accordion-group__accordion-collapse',
    contentClass: 'accordion-group__accordion-content',
    contentRole: 'document',
    slideSpeed: 300,
    easingFunction: 'swing',
    cssTransitions: false,
    expandedClass: 'accordion-group__accordion_expanded',
    btnExpandedClass: 'accordion-group__accordion-btn_expanded',
    collapseExpandedClass: 'accordion-group__accordion-collapse_expanded',
    expandOnPageLoad: true,
    expandOnlyOne: false,
    keyboardNavigation: true
  };

}(jQuery, window, document));


$(document).ready(function () {
  'use strict';

  $('.accordion-group').ariaAccordion({
    contentRole: ['document', 'application', 'document'],
    expandOnPageLoad: true,
    expandOnlyOne: false,
    slideSpeed: 900
  });


  $('.accordion-group').last().ariaAccordion('toggleNoAnimate', 2);
});
