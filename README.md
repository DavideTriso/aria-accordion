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
accContentRole | document | token | Role of accordion content. Accepted values: document, application. For more information see [https://www.w3.org/TR/wai-aria-1.1/](https://www.w3.org/TR/wai-aria-1.1/). | optional
fadeSpeed | 300 | int (>= 0) | Duration of collapse/expand animations. | optional
expandOnPageLoad | false | bool | Show or hide first accordion of group when page is first loaded. | optional
expandOnlyOne | false | bool | Allow only one accordion to be expanded in a group. | optional
keyInteraction | true | bool | Allow user to move focus with arrow keys and other shortcuts. For more information see [https://www.w3.org/TR/wai-aria-practices-1.1/#accordion](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion). Do not set this option to false, except if you have a good reason to do so. | optional
*deepLinking | false | bool | Enable deep linking and history states. **Important:** This feature is planned for future versions of the plugin | optional

## Usage

1. Include the JS script **aria-accordion.js** - or the minified production script **aria-accordion.min.js** - in the head or the body of your HTML file.
2. Include the CSS file  **aria-accordion.css** in the head of your HTML file or include the SCSS files in your project. Adapt the CSS rules to match your website's design. 
3. Initialise the widget within an inline script tag, or in an external JS file.


### HTML

Use following HTML markup to implement an acordion widget:

```html
<!-- WIDGET BEGIN / GROUP OF ACCORDIONS -->
<section class="accordion-group" id="accordion-group-1">

    <!-- ACCORDION BEGIN -->
    <div class="accordion-group__accordion">
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
    </div>
    <!-- ACCORDION END -->
    
    
    <!-- ACCORDION BEGIN -->
    <div class="accordion-group__accordion">
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
    </div>
    <!-- ACCORDION END -->
    
  </section>
```

### JS: Initialise

Use following code to initalise the widget:

```javascript
$('.accordion-group').ariaAccordion({
  option1: value1,
  option2: value2
});
```

## Methods:

The plugin supports following methods: expand, show, collapse, hide and trigger.

### Expand and open

The method **expand** expands an accordion by sliding-down the accordion collapsible region.

````javascript
$('#accordion-id').ariaAccordion('expand');
````

The method **show** leads to th same results as **expand**, but without applying any animation.

````javascript
$('#accordion-id').ariaAccordion('open');
````

### Collapse and hide

The method **collapse** collapses an accordion by sliding-up the accordion collapsible region.

````javascript
$('#accordion-id').ariaAccordion('collapse');
````

The method **hide** leads to the same results as **collapse**, but without applying any animation.

````javascript
$('#accordion-id').ariaAccordion('hide');
````


### Trigger

**Trigger** expands or collapses an accordion based on the state of the accordion.

````javascript
$('#accordion-id').ariaAccordion('trigger');
````

**NOTE:** All the methods can be called both on a single accordion element, or on a set of elements.


## LICENSE

This project is licensed under the terms of the **MIT license**.

See [LICENSE.md](LICENSE.md) for detailed informations.