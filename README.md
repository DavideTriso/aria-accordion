# ARIA ACCORDION

## About

jQuery plugin for **accessible** accordions: **WAI ARIA 1.1** compliant.

* Easy to customize tanks to a small but usefull set of options.
* SASS/SCSS files for simple and quick UI customisations.
* Only 5KB (minified).
* Fully compatible with [**t** css-framework](https://github.com/DavideTriso/t-css-framework)
* Runs in strict mode.

## Dependencies

**jQuery**

Developed and tested with jQuery 3.2.1

## Cross-browser tests

* Tested on **Google Chrome 57** / macOS Sierra 10.
* Tested on **Safari for iOS 10.3.x** / iPhone 5s.


## Options

Name | Default | Type | Description | Required or optional
-----|---------|------|-------------|-----------------------
accGroupClass | accordion-group | string | Class of accordion group elements. | optional
accClass | accordion-group__accordion | string | Class of single accordion elements. (This class is used from the plugin to select the elements in the markup). | optional
accHeadClass | accordion-group__accordion-head | string | Class of accordion head region. (This class is used from the plugin to select the elements in the markup). | optional
accHeadingClass | accordion-group__accordion-heading | string | Class of accordion heading elements. (This class is used from the plugin to select the elements in the markup). | optional
accBtnClass | accordion-group__accordion-btn | string | Class of accordion buttons. (This class is used from the plugin to select the elements in the markup). | optional
accCollapseClass | accordion-group__accordion-collapse | string | Class of accordion collapse regions. (This class is used from the plugin to select the elements in the markup). | optional
accContentClass | accordion-group__accordion-content | string | Class of accordion content elements. (This class is used from the plugin to select the elements in the markup). | optional
accExpandedClass | accordion-group__accordion_expanded | string | Class added to expanded accordions. | optional
accBtnExpandedClass | accordion-group__accordion-btn_expanded | string | Class added to the button of an expanded accordion. | optional
accCollapseExpandedClass | accordion-group__accordion-collapse_expanded | string | Class added to collapse region of an expanded accordion. | optional
accGroupIdPrefix | accordion-group-- | string | Prefix used to generate accordion group's ID, if no ID is present in markup. | optional 
accContentRole | document | token, array | Role of accordion content. Accepted values: document, application. For more information see [https://www.w3.org/TR/wai-aria-1.1/](https://www.w3.org/TR/wai-aria-1.1/). To set different roles to each accordion, pass an accordion. | optional
slideSpeed | 300 | int (>= 0) | Duration of collapse/expand animations. | optional
transitionEasingFunction | swing | string | The easing function to use for animation of the accordions. Applies only for jQuery transitions, if **cssTransition** is set to true, this option will not have any effect on the transition. Accepted values are `swing` and `linear`. For more timing functions a jQuery easing plugin is needed. | optional
cssTransition | false | bool | Use css transitions to expand/collapse accordion instead of jQuery slide animation. Read section 'Using CSS transitions' for more infos | optional
expandOnPageLoad | false | bool | Show or hide first accordion of group when page is loaded. | optional
expandOnlyOne | false | bool | Allow only one accordion to be expanded in a group at the same time. One accordion should always be expanded. | optional
keyboardNavigation | true | bool | Allow user to move focus with arrow keys and other shortcuts. For more information see [https://www.w3.org/TR/wai-aria-practices-1.1/#accordion](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion). | optional

## Usage

1. Include the JS script **aria-accordion.js** - or the minified production script **aria-accordion.min.js** - in the head or the body of your HTML file.
2. Include the CSS file  **aria-accordion.css** in the head of your HTML file or include the SCSS files in your project. Adapt the CSS rules to match your website's design. 
3. Initialise the widget within an inline script tag, or in an external JS file.


### HTML

Use following HTML markup to implement an acordion widget:

```html
<!-- WIDGET BEGIN / GROUP OF ACCORDIONS -->
<div class="accordion-group" id="accordion-group-1">

    <!-- ACCORDION BEGIN -->
    <section class="accordion-group__accordion">
      <header class="accordion-group__accordion-head">
        <h3 class="accordion-group__accordion-heading"><button type="button" class="accordion-group__accordion-btn">Accordion 1 <span>Expand/Close</span></button></h3>
      </header>
      <div class="accordion-group__accordion-collapse">
        <div class="accordion-group__accordion-content">
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled it to make a type 
          specimen book.</p>
          <button type="button">Test focus</button>
        </div>
      </div>
    </section>
    <!-- ACCORDION END -->
    
    
    <!-- ACCORDION BEGIN -->
    <section class="accordion-group__accordion">
      <header class="accordion-group__accordion-head">
        <h3 class="accordion-group__accordion-heading"><button type="button" class="accordion-group__accordion-btn">Accordion 1</button></h3>
      </header>
      <div class="accordion-group__accordion-collapse">
        <div class="accordion-group__accordion-content">
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled it to make a type 
          specimen book.</p>
          <button type="button">Test focus</button>
        </div>
      </div>
    </section>
    <!-- ACCORDION END -->
    
  </div>
```

*IMPORTANT: do not replace the `<button>` element and do not use any other html element than heading to wrap the button. More informations are available [here](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion).  

### JS: Initialise

Use following code to initalise the widget:

```javascript
$('.accordion-group').ariaAccordion({
  option1: value1,
  option2: value2
});
```

## Methods:

Methods can be called on the initialised accordion group with following syntax:

````javascript
$('#my-accordion-group').ariaAccordion('methodName', parameter2);
````

The plugin supports following methods: toggleAnimate, toggleNoAnimate, slideDown, slideUp, show, hide.
The first parameter passed to the function call is the name of the method to call.
The second parameter can be an index (starting from 0) of the accordion the method should be applied to,
a jQuery selector or a jQuery element.
Methods can be called just on one element at a time. When passing a selector make sure this matches only one element.
Wen passing a jQuery object, make sure the lenght of the object is 1.

````javascript
//Following are all valid and lead to the same result
$('#my-accordion-group').ariaAccordion('slideDown', 1);
$('#my-accordion-group').ariaAccordion('slideDown', '#my-accordion');
$('#my-accordion-group').ariaAccordion('slideDown', $('#my-accordion'));
````

### slideDown and show

The method **slideDown** expands an accordion by sliding-down the accordion collapsible region.

````javascript
$('#my-accordion-group').ariaAccordion('slideDown', 2);
````

The method **show** leads to th same results as **slideDown**, but instead does not perform any animation.

````javascript
$('#my-accordion-group').ariaAccordion('show', 2);
````

### slideUp and hide

The method **slideUp** collapses an accordion by sliding-up the accordion collapsible region.

````javascript
$('#my-accordion-group').ariaAccordion('slideUp', 1);
````

The method **hide** leads to the same results as **collapse**,  but instead does not perform any animation.

````javascript
$('#my-accordion-group').ariaAccordion('hide', 1);
````


### toggleAnimate and toggleNoAnimate

**toggleAnimate** expands or collapses an accordion based on the current state of the accordion performing a slide-down or slide-up animation.

````javascript
$('#my-accordion-group').ariaAccordion('toggleAnimate', 1);
````

**toggleNoAnimate** also expands or collapses an accordion based on the current state, but does not perform any animation.

````javascript
$('#my-accordion-group').ariaAccordion('toggleNoAnimate', 1);
````


## Using CSS transitions

By default the plugin is configured to use the jQuery methods `slideDown()`, `slideUp to`, `show()`and `hide()` to expand/collapse accordions. Setting the option **cssTransitions** to 'true' will disable the JS animations and makes possible to implement the transitions directly with css. In fact, the plugin toggles the classes passed along with the options **accExpandedClass**, **accBtnExpandedClass** and **accCollapseExpandedClass** when an accordion is toggled. 

## Planned features

* Better SCSS: Mixins to quickly build awesome accordions will be provided.
* Better integration with **t** css framework.
* Url hash navigation / deep linking.

## LICENSE

**Aria accordion** is licensed under the terms of the **MIT license**.

See [LICENSE.md](LICENSE.md) for detailed informations.