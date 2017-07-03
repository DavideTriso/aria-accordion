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

* **Google Chrome 57** / macOS Sierra 10
* iPhone 5s **Safari for iOS** 10.3.2


## Options

Name | Default | Type | Description | Required or optional
-----|---------|------|-------------|-----------------------
accGroupIdPrefix | accordion-group-- | string | Prefix used to generate accordion groups IDs, when not present in markup. | optional
accClass | accordion-group__accordion | string | Class of single accordion elements. (This class is used from the plugin to select the elements in the markup). | optional
headingClass | accordion-group__accordion-heading | string | Class of accordion heading elements. (This class is used from the plugin to select the elements in the markup). | optional
btnClass | accordion-group__accordion-btn | string | Class of accordion buttons. (This class is used from the plugin to select the elements in the markup). | optional
panelClass | accordion-group__accordion-panel | string | Class of accordion panel. (This class is used from the plugin to select the elements in the markup). | optional
contentClass | accordion-group__accordion-content | string | Class of accordion content elements. (This class is used from the plugin to select the elements in the markup). | optional
expandedClass | accordion-group__accordion_expanded | string | Class added to expanded accordions. | optional
btnExpandedClass | accordion-group__accordion-btn_expanded | string | Class added to the button of an expanded accordion. | optional
panelExpandedClass | accordion-group__accordion-panel_expanded | string | Class added to panel of an expanded accordion. | optional
groupIdPrefix | accordion-group-- | string | Prefix used to generate accordion group's ID, if no ID is present in markup. | optional 
contentRole | document | token, array | Role of accordion content. Accepted values: document, application. For more information see [https://www.w3.org/TR/wai-aria-1.1/](https://www.w3.org/TR/wai-aria-1.1/). To set different roles to each accordion, pass an accordion. | optional
slideSpeed | 300 | int (>= 0) | Duration of collapse/expand animations. | optional
easing | swing | string | The easing function to use for animation of the accordions. Applies only for jQuery transitions, if **cssTransition** is set to true, this option will not have any effect on the transition. Accepted values are `swing` and `linear`. For more timing functions a jQuery easing plugin is needed. | optional
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
        <h3 class="accordion-group__accordion-heading"><button type="button" class="accordion-group__accordion-btn">Accordion 1</button></h3>
      </header>
      <div class="accordion-group__accordion-panel">
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
      <div class="accordion-group__accordion-panel">
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

The plugin supports following methods: toggle, toggleNoAnimate.
The first parameter passed to the function call is the name of the method to call.
The second parameter can be the index (starting from 0) of the accordion the method should be applied to,
a jQuery selector, or a jQuery element.
Methods can be called just on one element at a time. When passing a selector make sure this matches only one element.
When passing a jQuery object, make sure the lenght of the object is 1.

````javascript

//Following are all valid and lead to the same result

$('#my-accordion-group').ariaAccordion('toggle', 1);
$('#my-accordion-group').ariaAccordion('toggle', '#my-accordion');
$('#my-accordion-group').ariaAccordion('toggle', $('#my-accordion'));

````

### toggle and toggleNoAnimate

**toggle** expands or collapses an accordion based on the current state of the accordion performing a slide-down or slide-up animation.

````javascript
$('#my-accordion-group').ariaAccordion('toggle', 1);
````

**toggleNoAnimate** also expands or collapses an accordion based on the current state, but does not perform any animation.

````javascript
$('#my-accordion-group').ariaAccordion('toggleNoAnimate', 1);
````

## Custom events

The plugin triggers following events:

* **ariaAccordion.slideDown** when an accordion is expanded
* **ariaAccordion.slideUp** when an accordion is collapsed

The custom events are triggered on window and return the accordion group and the index of the toggled accordion as arguments.

```javascript

//listen for ariaAccordion.slideDown
$(window).on('ariaAccordion.slideDown', function(event, accordionGroup, index){
  console.log('Accordion ' + index + ' in accordion group ' + accordionGroup + ' was expanded');
});

```

## Using CSS transitions

By default the plugin is configured to use the jQuery methods `slideDown()`, `slideUp()` to expand/collapse accordions. Setting the option **cssTransitions** to 'true' will disable the JS animations and makes possible to implement the transitions directly with css. In fact, the plugin toggles the classes passed along with the options **expandedClass**, **btnExpandedClass** and **collapseExpandedClass** when an accordion is toggled. 

## Planned features

* Better SCSS: Mixins to quickly build awesome accordions will be provided.
* Better integration with **t** css framework.

## LICENSE

**Aria accordion** is licensed under the terms of the **MIT license**.

See [LICENSE.md](LICENSE.md) for detailed informations.