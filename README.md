# ARIA ACCORDION

## About

**Aria Accordion** is a jQuery plugin. It is useful to implement accessible accordions in websites. It has basic configuration options and is fully accessible for screen-reader users and keyboard-only users.

## Dependencies

**jQuery**
Developed and tested with jQuery 3.2.1

## Settings / Options

Name | Default | Type | Description
-----|---------|------|-------------
accGroupClass | accordion-group | string | Class name of accordion group elements.
accClass | accordion-group__accordion | string | Class name of single accordion elements.
accHeadClass | accordion-group__accordion-head | string | Class name of accordion head region.
accHeadingClass | accordion-group__accordion-heading | string | Class name of accordion heading elements.
accBtnClass | accordion-group__accordion-btn | string | Class name od accordion button elements.
accCollapseClass | accordion-group__accordion-collapse | string | Class name of accordion collapse regions.
accContentClass | accordion-group__accordion-content | string | Class name of accordion content elements.
accExpandedClass | accordion-group__accordion_expanded | string | Class added to expanded accordions.
accBtnExpandedClass | accordion-group__accordion-btn_expanded | string | Class added to button of an expanded accordion.
accCollapseExpandedClass | accordion-group__accordion-collapse_expanded | string | Class added to collapse region of an expanded accordion.
accContentRole | document | token | Role of accordion content. Accepted values: document, application. For more information see [https://www.w3.org/TR/wai-aria-1.1/](https://www.w3.org/TR/wai-aria-1.1/). If you are not sure which role you have to choose, then go for **document**.
animationSpeed | 300 | int (>= 0) | Duration of collapse/expand animations.
expandOnPageLoad | false | bool | Show or hide first accordion of group when page is first loaded.
expandOnlyOne | false | bool | Allow only one accordion to be expanded in a group.
specialKeysNavigation | true | bool | Allow user to move focus with arrow keys and other special shortcuts. For more information see [https://www.w3.org/TR/wai-aria-practices-1.1/#accordion](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion). Do not set this option to false, except if you have a good reason to do so.
deepLinking | false | bool | Enable deep linking and history states. **Important:** This feature is planned for future versions of the plugin

## Usage

Include the JS script _aria-accordion.js_ in the head or the body of your HTML file.

Include the CSS file  _aria-accordion.css_ in the head of your HTML file. Adapt the CSS rules to match your website's design.  

Use following HTML markup in your HTML file to create an acordion group:

```
<section class="accordion-group">
    <div class="accordion-group__accordion">
      <header class="accordion-group__accordion-head">
        <h3 class="accordion-group__accordion-heading"><button type="button" class="accordion-group__accordion-btn">Accordion 1 <span>Expand/Close</span></button></h3>
      </header>
      <div class="accordion-group__accordion-collapse">
        <div class="accordion-group__accordion-content">
          <p>Accordion text</p>
          <button type="button">Test focus</button>
        </div>
      </div>
    </div>
    <div class="accordion-group__accordion">
      <header class="accordion-group__accordion-head">
        <h3 class="accordion-group__accordion-heading"><button type="button" class="accordion-group__accordion-btn">Accordion 2 <span>Expand/Close</span></button></h3>
      </header>
      <div class="accordion-group__accordion-collapse">
        <div class="accordion-group__accordion-content">
          <p>Accordion text</p>
        </div>
      </div>
    </div>
    <div class="accordion-group__accordion">
      <header class="accordion-group__accordion-head">
        <h3 class="accordion-group__accordion-heading"><button type="button" class="accordion-group__accordion-btn">Accordion 3 <span>Expand/Close</span></button></h3>
      </header>
      <div class="accordion-group__accordion-collapse">
        <div class="accordion-group__accordion-content">
          <p>Accordion text</p>
        </div>
      </div>
    </div>
  </section>
```


## Initialise

```
$('.accordion-group').ariaAccordion({
  option1: value1,
  option2: value2
});
```

## Methods

### Expand and open


### Collapse and hide


### Trigger
