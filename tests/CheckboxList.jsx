/** @jsx React.DOM */

require('node-jsx').install();

var jsdom = require("jsdom");
var assert = require("assert");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var tape = require('tape');

var CheckboxList = require('../CheckboxList.jsx');

function setupDom () {
    global.window = jsdom.jsdom().createWindow();
    global.document = window.document;
}

/**
 * To workaround a quirk in jsdom we need to manually call the `click()` function
 * as well as simulating a react `change` event
 */
function simulateToggleCheckbox (element) {
    TestUtils.Simulate.change(element);
    element.click();
}

function createItems (num) {
    var items = [];
    for (var i=0; i<num; i+=1) {
        items.push({
            key: i,
            label: 'Item #' + i
        });
    }
    return items;
}

tape('CheckboxList: Creating items', function (t) {
    setupDom();

    var changes = [];
    var onChange = function (event, key, value) {
        changes.push({
            key: key,
            value: value
        });
    };

    var items = createItems(5);
    items[1].isChecked = true;

    var component = TestUtils.renderIntoDocument(
        <CheckboxList items={items} onChange={onChange} />
    );

    var inputs = component.getDOMNode().querySelectorAll('input[type=checkbox]');
    t.equal(
        inputs.length,
        5,
        'A CheckboxListItem component is created for each item in props');


    t.equal(
        inputs[1].checked,
        true,
        'Can set default checked-flag');

    t.equal(
        component.getDOMNode().querySelectorAll('input[type=checkbox]:checked').length,
        1,
        'Items are unchecked by default');

    // click the first 3 items
    simulateToggleCheckbox(inputs[0]);
    simulateToggleCheckbox(inputs[1]);
    simulateToggleCheckbox(inputs[2]);

    t.equal(
        changes.length,
        3,
        'onChange handler is called for every change');

    t.equal(
        inputs[1].checked,
        false,
        'Default checked item is unchecked after clicking');

    t.equal(
        component.getDOMNode().querySelectorAll('input[type=checkbox]:checked').length,
        2,
        'Items become checked after clicking');

    t.end();
});

tape('CheckboxList: no items', function (t) {
    setupDom();

    var items = [];
    var component = TestUtils.renderIntoDocument(
        <CheckboxList items={items} />
    );

    var inputs = component.getDOMNode().querySelectorAll('input[type=checkbox]');
    t.equal(
        inputs.length,
        0,
        'Can create a CheckboxList with no items');

    t.end();
});
