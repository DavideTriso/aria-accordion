/*
MIT License

Copyright (c) 2017 Davide Trisolini

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function ($) {
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
    var self = this;

    self.element = $(element); //The accordion group
    self.settings = $.extend({}, $.fn[pluginName].defaultSettings, userSettings);
    self.elementId = setId(self.element, self.settings.accGroupIdPrefix, count); // the id of the element
    self.elements = {
      acc: self.element.find('.' + self.settings.accClass),
      heading: self.element.find('.' + self.settings.headingClass),
      btn: self.element.find('.' + self.settings.btnClass),
      panel: self.element.find('.' + self.settings.panelClass),
      content: self.element.find('.' + self.settings.contentClass)
    }; //Obejct containing all elements needed by the plugin
    self.elementsLenght = self.elements.acc.length; //How many accordions are in the group?
    self.elementsStatus = []; //The status of each array in the group (expanded or collapsed)

    //Initialise the widget
    self.init();
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
        element = self.element,
        elementId = self.elementId,
        elements = self.elements,
        settings = self.settings;

      /*
       * Now we can set the IDs of all the other elements.
       * We perform a loop through each accordion and set the missing IDs.
       * Within the same loop we also reference the ids within the aria-labelledby and aria-controls attrributes
       */
      elements.acc.each(function (index) {
        setId(elements.heading.eq(index), elementId + '__accordion-heading--', index);
        setId(elements.panel.eq(index), elementId + '__accordion-panel--', index);
        setId(elements.btn.eq(index), elementId + '__accordion-btn--', index);

        /*
         * Now it is possible to refence the ids of the elements
         * with the aria attributes
         * and expose the relationship between this elements to AT.
         * We perform a loop through each accordion and set
         * each attribute within this loop by getting the elements by index with the function .eq
         */
        elements.btn.eq(index).attr(a.aCs, elements.panel.eq(index).attr('id'));
        elements.panel.eq(index).attr(a.aLab, elements.heading.eq(index).attr('id'));
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
      if (typeof settings.contentRole === 'string') {
        elements.content.attr(a.r, settings.contentRole);
      } else if (Array.isArray(settings.contentRole)) {
        elements.content.each(function (index) {
          $(this).attr(a.r, settings.contentRole[index]);
        });
      }

      /*
       * Now it's time to intialise each accordion by expanding or collapsing them,
       * based on the values of the setting expandOnPageLoad and expandOnlyOne
       */
      if (settings.expandOnPageLoad || settings.expandOnlyOne) {
        elements.acc.each(function (index) {
          if (index > 0) {
            self.slideUp(index, false);
          } else {
            self.slideDown(0, false);
          }
        });
      } else {
        elements.acc.each(function (index) {
          self.slideUp(index, false);
        });
      }

      /*
       * Bind event handlers to accordion buttons.
       * We actually bind the click event to the accordion element and
       * use delegated events to improve code performance.
       * Also we use the plugin name as a namespace for the event
       * to not interfer with other event handlers.
       */
      element.on('click.' + pluginName + '.' + count, '.' + settings.btnClass, function () {
        self.toggle(elements.btn.index($(this)), true);
      });


      /*
       * Bind keydown event for keyboard navigation.
       * As before, we use delegated events and namespaces
       * for the implemantation of keys navigation
       */
      if (settings.keyboardNavigation) {
        element.on('keydown.' + pluginName + '.' + count, function (event) {
          self.keyboardNavigation(event);
        });
      }

      //Increment count by one
      count = count + 1;
    },
    toggle: function (accIndex, animate) {
      /*
       * This method checks wheter an accordion is expanded or collapsed,
       * and calls the method to toggle the accordion based on the current state.
       * 
       * The check of the status of the accorsions is made by looking up the value
       * set for the accordion in the elementsStatus array.
       *
       */
      var self = this,
        settings = self.settings,
        elementsStatus = self.elementsStatus;


      //Implement the toggle logic for default mode and for expandOnlyOne      
      if (settings.expandOnlyOne) {
        /*
         * When expandOnlyOne is set to true, then the expanded accordion
         * should not be directly collapsed, because one accordion should always be expanded.
         * When slideDown is triggered on a collapsed accordion, then the currently expanded accordion
         * should be collapsed
         */
        if (elementsStatus[accIndex] === true) {
          return false; //Stop execution 
        } else {
          self.slideUp(elementsStatus.indexOf(true), animate); //collapse expande accordion
          self.slideDown(accIndex, animate); //Expand accordion
        }
      } else {
        /*
         * Normal mode: whenever an accordion is triggerd, change the status
         * by collapsing it if expanded and expanding it if collapsed
         */
        if (elementsStatus[accIndex] === true) {
          self.slideUp(accIndex, animate);
        } else {
          self.slideDown(accIndex, animate);
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

      /*
       * The keyboard interaction model for accordion is described here:
       * https://www.w3.org/TR/wai-aria-practices-1.1/#accordion.
       *
       * The first thing to do is to check whether an accordion's button
       * or another element inside the accordion collapsible region has focus
       */

      var self = this,
        settings = self.settings,
        elements = self.elements,
        btn = elements.btn,
        elementsLenght = self.elementsLenght,
        focussedElement = self.element.find(':focus'), //the element with keyboard focus
        focussedElementIndex = 0, //placeholder variable for the index of the accordion button
        pressedKey = event.keyCode; // the code of the pressed key



      if (focussedElement.is('.' + settings.btnClass)) {
        /*
         * We revitre the position of the element in the set of elements
         * e.g. the index of the button
         */
        focussedElementIndex = btn.index(focussedElement);

        // Implement the logic for keyboard navigation
        if (checkForModifierKeys(event) === 'none') {
          switch (pressedKey) {
            case 38:
              //up arrow: focus previous heading
              if (focussedElementIndex > 0) {
                btn.eq(focussedElementIndex - 1).focus();
              }
              break;
            case 40:
              //down arrow: focus next heading
              if (focussedElementIndex < elementsLenght) {
                btn.eq(focussedElementIndex + 1).focus();
              }
              break;
            case 36:
              //home: focus first heading
              elements.btn.eq(0).focus();
              break;
            case 35:
              //end: focus last heading
              btn.eq(elementsLenght - 1).focus();
              break;
          }
        } else if (checkForModifierKeys(event) === 'ctrl') {
          switch (pressedKey) {
            case 81:
              //page up: move focus to prev heading
              if (focussedElementIndex > 0) {
                btn.eq(focussedElementIndex - 1).focus();
              }
              break;
            case 87:
              //page down: focus next heading
              if (focussedElementIndex < elementsLenght) {
                btn.eq(focussedElementIndex + 1).focus();
              }
              break;
          }
        }
      } else if (focussedElement.closest('.' + settings.panelClass).length > 0 && checkForModifierKeys(event) === 'ctrl') {
        /*
         * We revitre the position of the accordion in wich the foccused element is contained
         * e.g. the index of the accordion/accordion btn
         */
        focussedElementIndex = elements.panel.index(focussedElement.closest('.' + settings.panelClass));

        switch (pressedKey) {
          case 81:
            //page up: move focus to heading of this accordion
            btn.eq(focussedElementIndex).focus();
            break;
          case 87:
            //page down: focus next heading
            if (focussedElementIndex < elementsLenght) {
              btn.eq(focussedElementIndex + 1).focus();
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
      var self = this,
        elements = self.elements,
        settings = self.settings;

      //Update attributes and classes
      elements.acc.eq(accIndex)
        .addClass(settings.accExpandedClass);

      elements.btn.eq(accIndex)
        .attr(a.aEx, a.t)
        .addClass(settings.btnExpandedClass);

      elements.panel.eq(accIndex)
        .attr(a.aHi, a.f)
        .addClass(settings.panelExpandedClass);

      /*
       * The attribute aria-disabled should be set to true on the button
       * if the option expandOnlyOne is set to true.
       */
      if (settings.expandOnlyOne) {
        elements.btn.eq(accIndex).attr(a.aDi, a.t);
      }

      //Update the status of the element
      self.updateElementStatus(accIndex, true);
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

      var self = this,
        elements = self.elements,
        settings = self.settings;

      //Update attributes and classes
      elements.acc.eq(accIndex)
        .removeClass(settings.accExpandedClass);

      elements.btn.eq(accIndex)
        .attr(a.aEx, a.f)
        .removeClass(settings.btnExpandedClass);

      elements.panel.eq(accIndex)
        .attr(a.aHi, a.t)
        .removeClass(settings.panelExpandedClass);

      /*
       * The attribute aria-disabled should be set to false
       * if the option expandOnlyOne is set to true and the accorsion is collapsed
       */
      if (settings.expandOnlyOne) {
        self.elements.btn.eq(accIndex).attr(a.aDi, a.f);
      }

      //Update the status of the element
      self.updateElementStatus(accIndex, false);
    },
    slideDown: function (accIndex, animate) {
      /*
       * Perform the slide-down animation of the plugin
       * The JS animation should be performed, only if cssTransition is set to false.
       * If cssTransition is set to true, then the  animation of the accordion
       * relies only on CSS styles.
       */
      var self = this,
        settings = self.settings,
        slideSpeed = animate ? settings.slideSpeed : 0;

      if (!settings.cssTransitions) {
        self.elements.panel.eq(accIndex)
          .stop()
          .slideDown(slideSpeed, settings.easing);
      }

      //Call this.expand in order to update the attributes of the accordion.
      self.expand(accIndex);
    },
    slideUp: function (accIndex, animate) {
      /*
       * Perform the slide-up animation of the plugin
       * The JS animation should be performed, only if cssTransition is set to false.
       * If cssTransition is set to true, then the the animation of the accordion
       * relies only on CSS styles
       */
      var self = this,
        settings = self.settings,
        slideSpeed = animate ? settings.slideSpeed : 0;


      if (!settings.cssTransitions) {
        self.elements.panel.eq(accIndex)
          .stop()
          .slideUp(slideSpeed, settings.easing);
      }

      //Call this.collapse in order to update the attributes of the accordion.
      self.collapse(accIndex);
    },
    methodCaller: function (methodName, methodArg) {

      /*
       * This function is the control center for any method call implemented in the plugin.
       * Because each method accepts different arguments types, the function checks the type of
       * the passed arguments and performs the needed operations in order to make a function call
       */

      var self = this,
        elementsStatus = self.elementsStatus;

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
            methodArg.hasClass(self.settings.accClass) &&
            methodArg.closest(self.element).length === 1) {
            methodArg = self.elements.acc.index(methodArg);
          }
        }
      }


      /*
       * Now we have the index of the element and can perform the method call:
       * let us check wich wethod the developer want to call, by comparing the
       * first parameter passed along with the function.
       */
      switch (methodName) {
        case 'toggle':
          self.toggle(methodArg, true); //call toggle
          break;
        case 'toggleNoAnimate':
          self.toggle(methodArg, false); //call toggle
          break;
      }
    }
  });


  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (userSettings, methodArg) {
    return this.each(function () {
      var self = this;
      /*
       * If following conditions matches, then the plugin must be initialsied:
       * Check if the plugin is instantiated for the first time
       * Check if the argument passed is an object or undefined (no arguments)
       */
      if (!$.data(self, 'plugin_' + pluginName) && (typeof userSettings === 'object' || typeof userSettings === 'undefined')) {
        $.data(self, 'plugin_' + pluginName, new AriaAccordion(self, userSettings));
      } else if (typeof userSettings === 'string' && typeof methodArg !== 'undefined') {
        $.data(self, 'plugin_' + pluginName).methodCaller(userSettings, methodArg);
      }
    });
  };


  //Define default settings
  $.fn[pluginName].defaultSettings = {
    accGroupIdPrefix: 'accordion-group--',
    accClass: 'accordion-group__accordion',
    headingClass: 'accordion-group__accordion-heading',
    btnClass: 'accordion-group__accordion-btn',
    panelClass: 'accordion-group__accordion-panel',
    contentClass: 'accordion-group__accordion-content',
    contentRole: 'document',
    slideSpeed: 300,
    easing: 'swing',
    cssTransitions: false,
    expandedClass: 'accordion-group__accordion_expanded',
    btnExpandedClass: 'accordion-group__accordion-btn_expanded',
    panelExpandedClass: 'accordion-group__accordion-panel_expanded',
    expandOnPageLoad: true,
    expandOnlyOne: false,
    keyboardNavigation: true
  };

}(jQuery));
