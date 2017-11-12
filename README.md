# ARIA ACCORDION

## About
HTML, CSS and JS **accordion** UI-component for scalable projects. **User-friendly** and **accessible**: **WAI ARIA 1.1** compliant. [Go to demo page](https://davidetriso.github.io/aria-accordion/) or [check on npm](https://www.npmjs.com/package/t-aria-accordion).

* Developed following BEM methodology
* User-friendly and accessible
* Only 5KB JS (minified)
* JS plugin runs in strict mode
* Compatible with UMD


## Dependencies

**jQuery**

Developed and tested with jQuery 3.2.1

## Cross-browsers tests

* **Google Chrome 57** / macOS Sierra 10
* iPhone 5s **Safari for iOS** 10.3.2


## Options

Name | Default | Type | Description
-----|---------|------|-------------
accGroupIdPrefix | accordion-group-- | string | Prefix used to generate the IDs of the accordion's widgets
accClass | accordion-group__accordion | string | Class of single accordion elements. (This class is used from the plugin to select the elements in the markup).
headingClass | accordion-group__accordion-heading | string | Class of accordion's heading elements. (This class is used from the plugin to select the elements in the markup).
btnClass | accordion-group__accordion-btn | string | Class of accordion's buttons. (This class is used from the plugin to select the elements in the markup).
panelClass | accordion-group__accordion-panel | string | Class of accordion's panels. (This class is used from the plugin to select the elements in the markup).
contentClass | accordion-group__accordion-content | string | Class of accordion's content elements. (This class is used from the plugin to select the elements in the markup).
expandedClass | accordion-group__accordion_expanded | string | Class added to an expanded accordions.
btnExpandedClass | accordion-group__accordion-btn_expanded | string | Class added to the button of an expanded accordion.
panelExpandedClass | accordion-group__accordion-panel_expanded | string | Class added to a panel of an expanded accordion.
contentRole | document | token, array of tokens | Role of accordion's content. Accepted values: document, application. For more information see [https://www.w3.org/TR/wai-aria-1.1/](https://www.w3.org/TR/wai-aria-1.1/). To set different roles on each accordion, pass an array of tokens.
slideSpeed | 300 | int (>= 0) | Duration of collapse/expand animations.
easing | swing | string | The easing function used for the slide-up and slide-down animation of the accordions. Applies only if **cssTransition** is set to false, otherwise this option will not have any effect on the transition. Accepted values are `swing` and `linear`. For more timing functions a jQuery easing plugin is needed.
cssTransitions | false | bool | Use css transitions to expand/collapse accordions instead of jQuery slide animations. Read section 'Using CSS transitions' for more informations.
expandOnPageLoad | true | bool | Show or hide first accordion in an accordion's group when widget is initialised.
expandOnlyOne | false | bool | Only one accordion in the accordion's group can be expanded and one accordion must always be expanded.
keyboardNavigation | true | bool | Allow user to move focus with arrow keys and other shortcuts. For more information see [https://www.w3.org/TR/wai-aria-practices-1.1/#accordion](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion).

## Installation

Download the package from **GitHub** and get the compiled files from the `dist` folder.

The plugin is also available on **npm**:
```
npm install t-aria-accordion
```

## Usage

1. Include the JS script **aria-accordion.js** - or the minified production script **aria-accordion.min.js** - in the head or the body of your HTML file.
2. Include the CSS file  **aria-accordion.css** in the head of your HTML file or use the SCSS files in your project. Adapt the CSS rules to match your website's design.
3. Initialize the widget within an inline script tag, or in an external JS file.


### HTML

Use following HTML markup to implement an accordion widget:

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
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
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
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <button type="button">Test focus</button>
        </div>
      </div>
    </section>
    <!-- ACCORDION END -->

  </div>

```

IMPORTANT: do not replace the `<button>` and do not use any other html element than heading to wrap the button. More information are available at [https://www.w3.org/TR/wai-aria-practices-1.1/#accordion](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion).  

### JS: Initialise

Use following code to initalize the widget:

```javascript
$('.accordion-group').ariaAccordion({
  option1: value1,
  option2: value2
});
```

## Methods:

Methods can be called on an initialised accordion widget with following syntax:

````javascript
$('#my-accordion-group').ariaAccordion('methodName', parameter);
````

The plugin supports following methods: toggle, toggleNoAnimate.
The second parameter of the function can be the index (starting from 0) of the accordion, a jQuery selector, or a jQuery element.
Methods can be called just on one element at a time: when passing a selector make sure this matches only one element.
When passing a jQuery object the length of the object should be 1.

````javascript

//The following are all valid method's call and lead to the same result

$('#my-accordion-group').ariaAccordion('toggle', 1);
$('#my-accordion-group').ariaAccordion('toggle', '#my-accordion');
$('#my-accordion-group').ariaAccordion('toggle', $('#my-accordion'));

````

### toggle and toggleNoAnimate

**toggle** expands or collapses an accordion based on the current state of the accordion performing a slide-down or slide-up animation.

````javascript
$('#my-accordion-group').ariaAccordion('toggle', 1);
````

**toggleNoAnimate** also expands or collapses an accordion based on the current state, but instead does not perform any animation.

````javascript
$('#my-accordion-group').ariaAccordion('toggleNoAnimate', 1);
````

## Custom events

The plugin triggers following events:

* **ariaAccordion.initialised** after an accordion's group is initialised
* **ariaAccordion.slideDown** when an accordion is expanded
* **ariaAccordion.slideUp** when an accordion is collapsed


### ariaAccordion.initialised

This event is triggered on window and returns the accordion's group object as arguments.

```javascript

//listen for ariaAccordion.initialised
$(window).on('ariaAccordion.initialised', function(event, accordionGroup){
  //When an accordion's group is initialised, perform an action
  accordionGroup.element.addClass('aria-accordion_initialised');
});

//Initialise the accordion's groups
$('.accordion-group').ariaAccordion();

```

### ariaAccordion.slideDown and ariaAccordion.slideUp

This events are triggered on window and return the accordion's group object and the index of the toggled accordion as arguments.

```javascript

//listen for ariaAccordion.slideDown
$(window).on('ariaAccordion.slideDown', function(event, accordionGroup, index){
  console.log('Accordion ' + index + ' in accordion group ' + accordionGroup.element + ' was expanded');
});

```

## Using CSS transitions

By default the plugin is configured to use the jQuery methods `slideDown()`, `slideUp()` to expand/collapse accordions. Setting the option **cssTransitions** to 'true' will disable the JS animations. This will make possible to implement the transitions with css. In fact, the plugin toggles the classes passed along with the options **expandedClass**, **btnExpandedClass** and **panelExpandedClass** when an accordion is toggled.

## Planned features

* Support for disclosure pattern.

## LICENSE

**Aria accordion** is licensed under the terms of the **MIT license**.

See [LICENSE.md](LICENSE.md) for detailed informations.
