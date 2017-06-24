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
transitionTimingFunction | swing | string | The timing function to use for the slide animation of the plugin. Applies only for jQuery transitions, if **cssTransition** is set to true, this option will not have any effect on the transition. Accepted values are `swing` and `linear`. For more timing functions a jQuery plugin is needed. | optional
cssTransition | false | bool | Use css transitions to expand/collapse accordion instead of jQuery slide animation. Read section 'Using CSS transitions' for more infos | optional
expandOnPageLoad | false | bool | Show or hide first accordion of group when page is loaded. | optional
expandOnlyOne | false | bool | Allow only one accordion to be expanded in a group. | optional
oneAlwaysExpanded | false | bool | Ensure one accordion in the group is always epanded. **expandOnlyOne** must be set to **true** for this option to apply. The value of **expandOnPageLoad** is ignored, if this option is set to true | optional 
keyboardNavigation | true | bool | Allow user to move focus with arrow keys and other shortcuts. For more information see [https://www.w3.org/TR/wai-aria-practices-1.1/#accordion](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion). | optional

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


### Toggle

**Toggle** expands or collapses an accordion based on the state of the accordion.

````javascript
$('#accordion-id').ariaAccordion('toggle');
````

**NOTE:** All the methods can be called both on a single accordion element, or on a set of elements.

## Using CSS transitions

By default the plugin is configured to use JS to expand/collapse accordion panels. Setting the option **cssTransitions** to 'true' will disable the JS animations and it is possible to implement the transitions directly in the css. In fact, the plugin toggles the classes passed along with the options **accExpandedClass**, **accBtnExpandedClass** and **accCollapseExpandedClass** when an accordion is toggled.

## Planned features

* Better SCSS: Mixins to quickly build awesome accordions will be provided.
* Better integration with **t** css framework.
* Hash navigation and deep linking.

## LICENSE

This project is licensed under the terms of the **MIT license**.

See [LICENSE.md](LICENSE.md) for detailed informations.