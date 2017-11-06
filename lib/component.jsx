/**
 * React-component: Form, which renders a focussable form based upon
 * elements declared by `props.items`
 *
 * The generated forms have `purecss` styles (see http://purecss.io), but you still need to load purecss
 * yourself to get these styles activated.
 *
 * <i>Copyright (c) 2016 AcceleTrial - https://acceletrial.com</i><br>
 * Proprietary License
 *
 * Using native elements:
 * You can use native elements by specifying a "String" to `component`.
 * Some native elements can use innerHTML, innerText or children, by setting the property: `innerHTML`, `innerText` or `children`.
 *
 * Valid properties are:
 *
 * * type
 * * items
 * * label
 * * labelClass
 * * labelAfterComponent
 * * rowClass
 * * component
 * * props
 * * innerHTML
 * * innerText
 * * children
 *
 * @example
 * items = [
 *     {component: 'legend', innerHTML: '<b>Beautiful</b> items'},
 *     {component: Input, props: {value: 'Clinton'}, label: "name", children: []},
 *     [
 *         [ // column 1
 *             {component: Input, props: {value: 'Clinton'}, label: "name"}
 *         ],
 *         [ // column 2
 *             {component: Input, props: {value: 'Clinton'}, label: "name", labelClass: "red"}
 *         ]
 *     ]
 * ];
 *
 * A special purpose would be to have multiple items in the same row or inside a fieldset. To achieve this, define the type as
 * "row", "control-row" or "fieldset" (String) as well as the property `items`.
 * @example
 * items = [
 *     {component: Input, props: {value: 'Clinton'}, label: "name"},
 *     [
 *         [ // column 1
 *             {component: Input, props: {value: 'Clinton'}, label: "name"}
 *         ],
 *         [ // column 2
 *             {component: Input, props: {value: 'Clinton'}, label: "name"}
 *         ]
 *     ],
 *     {
 *         type: "fieldset",
 *         items: [
 *             {component: Button, props: {buttonText: 'cancel'}},
 *             {component: Button, props: {buttonText: 'save'}}
 *         ]
 *     },
 *     {
 *         type: "row",
 *         items: [
 *             {component: Button, props: {buttonText: 'cancel'}},
 *             {component: Button, props: {buttonText: 'save'}}
 *         ]
 *     }
 * ];
 *
 * @module itsa-react-form
 * @class Form
 * @since 0.0.1
*/

"use strict";

require("itsa-jsext");
require("itsa-dom");

const React = require("react"),
    PropTypes = require("prop-types"),
    FocusContainer = require("itsa-react-focuscontainer"),
    MAIN_CLASS = "itsa-form",
    WARNING_COLUMN_ARRAY = "Form-columns should have an array-item for each column";

class Form extends React.Component {
    constructor(props) {
        super(props);
        const instance = this;
        instance.createFormCols = instance.createFormCols.bind(instance);
        instance.createFormElement = instance.createFormElement.bind(instance);
        instance.createFormRow = instance.createFormRow.bind(instance);
        instance.createFormFieldset = instance.createFormFieldset.bind(instance);
        instance.focusActiveElement = instance.focusActiveElement.bind(instance);
        instance.focusElement = instance.focusElement.bind(instance);
        instance.handleClick = instance.handleClick.bind(instance);
        instance._create1Col = instance._create1Col.bind(instance);
        instance._create2Cols = instance._create2Cols.bind(instance);
        instance._create3Cols = instance._create3Cols.bind(instance);
        instance._create4Cols = instance._create4Cols.bind(instance);
        instance._processItems = instance._processItems.bind(instance);
    }

    /**
     * React render-method --> renders the Component.
     *
     * @method createFormCols
     * @return ReactComponents
     * @since 2.0.0
     */
    createFormCols(cols, i) {
        let formCol;
        const instance = this,
            len = cols.length;
        if (len===1) {
            formCol = instance._create1Col(cols, i);
        }
        else if (len===2) {
            formCol = instance._create2Cols(cols, i);
        }
        else if (len===3) {
            formCol = instance._create3Cols(cols, i);
        }
        else if (len===4) {
            formCol = instance._create4Cols(cols, i);
        }
        if (len>4) {
            console.warn("Form cannot create more than 4 columns (trying to create "+len+" columns)");
        }
        return formCol;
    }

    /**
     * React render-method --> renders the Component.
     *
     * @method createFormElement
     * @return ReactComponent
     * @since 2.0.0
     */
    createFormElement(item, i, inlineDiv) {
        let label = item.label,
            classname = "itsa-formelement-"+ (item.props.name || "undefined-name"),
            childrenArray, innerHTML, component, Component, style, key, bkp;
        const thisProps = this.props,
            contextItemFns = thisProps.contextItemFns,
            itemComponent = item.component,
            itemProps = item.props,
            props = itemProps.itsa_deepClone(),
            innerText = itemProps.innerText,
            children = itemProps.children,
            itemInnerHTML = itemProps.innerHTML;
        delete props.innerText;
        delete props.children;
        (typeof props.disabled==="boolean") || (props.disabled=thisProps.disabled);
        if (label!==undefined) {
            label = <label className={item.labelClass} htmlFor={props.name}>{label}</label>;
        }
        if (itemInnerHTML) {
            innerHTML = {__html: itemInnerHTML};
        }
        // if we have a different `context` for the callbacks, then bind them:
        if (contextItemFns) {
            props.itsa_each((val, prop) => {
                (typeof val==="function") && (props[prop]=val.bind(contextItemFns));
            });
        }

        if (typeof itemComponent==="string") {
            if (innerText) {
                childrenArray = [];
                innerText && childrenArray.push(innerText);
                children && Array.prototype.push.apply(childrenArray, children);
            }
            else if (innerHTML) {
                props.dangerouslySetInnerHTML = innerHTML;
                delete props.innerHTML;
            }
            component = React.createElement(itemComponent, props, childrenArray);
        }
        else {
            Component = itemComponent;
            component = (
                <Component {...props} >
                    {innerText}
                    {children}
                </Component>
            );
        }
        if (inlineDiv) {
            style={display: "inline-block"};
        }
        else {
            classname += " pure-control-group";
        }
        key = (item.key!==undefined) ? item.key : i;
        if (item.labelAfterComponent) {
            bkp = label;
            label = component;
            component = bkp;
        }
        return (
            <div className={classname} key={key} style={style}>
                {label}
                {component}
            </div>
        );
    }

    /**
     * React render-method --> renders the Component.
     *
     * @method createFormRow
     * @return [ReactComponent]
     * @since 2.0.0
     */
    createFormRow(item, i, isFullRow) {
        let props = item.itsa_deepClone(),
            rowItems = [],
            classname;
        delete props.items;
        item.items.forEach((item, i) => rowItems.push(this.createFormElement(item, i, true)));
        classname = isFullRow ? "pure-control-group" : "pure-controls";
        delete props.className;
        if (item.rowClass) {
            classname += " "+item.rowClass;
            delete props.rowClass;
        }
        return (
            <div {...props} className={classname} key={i}>{rowItems}</div>
        );
    }

    /**
     * React render-method --> renders the Component.
     *
     * @method createFormRow
     * @return [ReactComponent]
     * @since 2.0.0
     */
    createFormFieldset(item, i) {
        let props = item.itsa_deepClone();
        const fieldsetItems = this._processItems(item.items);
        delete props.items;
        return (
            <fieldset {...props} key={i}>{fieldsetItems}</fieldset>
        );
    }

    /**
     * Sets the focus on the active Element of the Form.
     *
     * @method focusActiveElement
     * @chainable
     * @since 0.0.1
     */
    focusActiveElement() {
        this._focusContainer.focusActiveElement();
        return this;
    }

    /**
     * Sets the focus on the specified Element of the Form.
     *
     * @method focusElement
     * @param index {Number} the index of the item to be focussed
     * @chainable
     * @since 0.0.1
     */
    focusElement(index) {
        this._focusContainer.focusActiveElement(index);
        return this;
    }

    handleClick(e) {
        let type, buttonNode,
            node = e.target;
        const instance = this,
            props = instance.props,
            onReset = props.onReset,
            onSubmit = props.onSubmit;

        if (node.tagName!=="BUTTON") {
            buttonNode = node.itsa_inside("button");
            buttonNode && (node=buttonNode);
        }
        type = node.getAttribute("type");
        if (type==="reset") {
            onReset && onReset(e);
        }
        else if (type==="submit") {
            onSubmit && onSubmit(e);
        }
    }

    /**
     * React render-method --> renders the Component.
     *
     * @method render
     * @return ReactComponents
     * @since 2.0.0
     */
    render() {
        let classname = MAIN_CLASS,
            handleClick;
        const instance = this,
            props = instance.props,
            items = instance._processItems(props.items),
            propsClassname = props.className;
        propsClassname && (classname+=" "+propsClassname);
        if (props.onSubmit || props.onReset) {
            handleClick = instance.handleClick;
        }
        return (
            <FocusContainer
                {...props}
                className={classname}
                onClick={handleClick}
                ref={inst => instance._focusContainer = inst} >
                {items}
            </FocusContainer>
        );
    }

    /**
     * React render-method --> renders the Component.
     *
     * @method createFormCols
     * @return ReactComponents
     * @since 2.0.0
     */
    _create1Col(cols, i) {
        let formitems;
        const instance = this,
            items = cols[0];
        if (!Array.isArray(items)) {
            console.warn(WARNING_COLUMN_ARRAY);
        }
        else {
            formitems = instance._processItems(items);
            return (
                 <div className="pure-g" key={i} >
                    <div className="pure-u-1">{formitems}</div>
                </div>
           );
        }
    }

    /**
     * React render-method --> renders the Component.
     *
     * @method createFormCols
     * @return ReactComponents
     * @since 2.0.0
     */
    _create2Cols(cols, i) {
        let formitemsCol1, formitemsCol2;
        const instance = this,
            itemsCol1 = cols[0],
            itemsCol2 = cols[1];
        if (!Array.isArray(itemsCol1) || !Array.isArray(itemsCol2)) {
            console.warn(WARNING_COLUMN_ARRAY);
        }
        else {
            formitemsCol1 = instance._processItems(itemsCol1);
            formitemsCol2 = instance._processItems(itemsCol2);
            return (
                 <div className="pure-g" key={i}>
                    <div className="pure-u-1 pure-u-md-1-2">{formitemsCol1}</div>
                    <div className="pure-u-1 pure-u-md-1-2">{formitemsCol2}</div>
                </div>
           );
        }
    }

    /**
     * React render-method --> renders the Component.
     *
     * @method createFormCols
     * @return ReactComponents
     * @since 2.0.0
     */
    _create3Cols(cols, i) {
        let formitemsCol1, formitemsCol2, formitemsCol3;
        const instance = this,
            itemsCol1 = cols[0],
            itemsCol2 = cols[1],
            itemsCol3 = cols[2];
        if (!Array.isArray(itemsCol1) || !Array.isArray(itemsCol2) || !Array.isArray(itemsCol3)) {
            console.warn(WARNING_COLUMN_ARRAY);
        }
        else {
            formitemsCol1 = instance._processItems(itemsCol1);
            formitemsCol2 = instance._processItems(itemsCol2);
            formitemsCol3 = instance._processItems(itemsCol3);
            return (
                 <div className="pure-g" key={i}>
                    <div className="pure-u-1 pure-u-md-1-3">{formitemsCol1}</div>
                    <div className="pure-u-1 pure-u-md-1-3">{formitemsCol2}</div>
                    <div className="pure-u-1 pure-u-md-1-4">{formitemsCol3}</div>
                </div>
           );
        }
    }

    /**
     * React render-method --> renders the Component.
     *
     * @method createFormCols
     * @return ReactComponents
     * @since 2.0.0
     */
    _create4Cols(cols, i) {
        let formitemsCol1, formitemsCol2, formitemsCol3, formitemsCol4;
        const instance = this,
            itemsCol1 = cols[0],
            itemsCol2 = cols[1],
            itemsCol3 = cols[2],
            itemsCol4 = cols[3];
        if (!Array.isArray(itemsCol1) || !Array.isArray(itemsCol2) || !Array.isArray(itemsCol3) || !Array.isArray(itemsCol4)) {
            console.warn(WARNING_COLUMN_ARRAY);
        }
        else {
            formitemsCol1 = instance._processItems(itemsCol1);
            formitemsCol2 = instance._processItems(itemsCol2);
            formitemsCol3 = instance._processItems(itemsCol3);
            formitemsCol4 = instance._processItems(itemsCol4);
            return (
                 <div className="pure-g" key={i}>
                    <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">{formitemsCol1}</div>
                    <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">{formitemsCol2}</div>
                    <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">{formitemsCol3}</div>
                    <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">{formitemsCol4}</div>
                </div>
           );
        }
    }

    _processItems(items) {
        let newItems = [];
        const instance = this;
        items.forEach((item, i) => {
            if (Array.isArray(item)) {
                // create a multicolumn div
                newItems.push(instance.createFormCols(item, i));
            }
            else {
                // found an object
                if ((item.type==="row") || (item.type==="control-row")) {
                    // create a row with items
                    newItems.push(instance.createFormRow(item, i, (item.type==="row")));
                }
                else if (item.type==="fieldset") {
                    // create a row with items
                    newItems.push(instance.createFormFieldset(item, i));
                }
                else {
                    // single item
                    newItems.push(instance.createFormElement(item, i));
                }
            }
        });
        return newItems;
    }
}

Form.propTypes = {
    /**
     * The Component its children
     *
     * @property children
     * @type String || Object || Array
     * @since 15.0.0
    */
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),

    /**
     * The classname for the container
     *
     * @property className
     * @type String
     * @since 15.0.0
    */
    className: PropTypes.string,

    /**
     * The context for the callback-props of the items.
     *
     * @property contextItemFns
     * @type Object
     * @since 15.0.0
    */
    contextItemFns: PropTypes.object,

    /**
     * Whether the focuscontainer is disabled (doesn't response to focusevents)
     *
     * @property disabled
     * @type Boolean
     * @since 15.0.0
    */
    disabled: PropTypes.bool,

    /**
     * Whether a click on the container (outside its elements,
     * should lead into focussing the container
     *
     * @property focusOnContainerClick
     * @default false
     * @type Boolean
     * @since 15.0.10
    */
    focusOnContainerClick: PropTypes.bool,

    /**
     * A `selector` or `index` of the focussable items that should get the initial focus.
     * In case of a selector, it might return multiple nodes: the one that is being used
     * is determined by
     *
     * @property initialFocus
     * @type String|Number
     * @since 15.0.0
    */
    initialFocus: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * In case `initialFocus` is a selector, it might return multiple nodes: the one that is being used.
     * In case of "last", it will return the last node.
     *
     * @property initialFocusIndex
     * @type Number|"last"
     * @default 0
     * @since 15.0.0
    */
    initialFocusIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * The list of the items that should be rendered. Each item consist of an object like this:
     * {component: ReactComponent, props: this.props, label: "mylabel"},
     * where the label is optional.
     *
     * If an item is an array, then this row will become devided in the number of columns that equal the array-size.
     * Inside the array, there should be ONLY array-items, defining the content of the column,
     *
     * Using native elements:
     * You can use native elements by specifying a "String" to `component`.
     * Some native elements can use innerHTML, innerText or children, by setting the property: `innerHTML`, `innerText` or `children`.
     *
     * Valid properties are:
     *
     * * type
     * * items
     * * label
     * * labelClass
     * * rowClass
     * * component
     * * props
     * * innerHTML
     * * innerText
     * * children
     *
     * @example
     * items = [
     *     {component: 'legend', innerHTML: '<b>Beautiful</b> items'},
     *     {component: Input, props: {value: 'Clinton'}, label: "name", children: []},
     *     [
     *         [ // column 1
     *             {component: Input, props: {value: 'Clinton'}, label: "name"}
     *         ],
     *         [ // column 2
     *             {component: Input, props: {value: 'Clinton'}, label: "name", labelClass: "red"}
     *         ]
     *     ]
     * ];
     *
     * A special purpose would be to have multiple items in the same row or inside a fieldset. To achieve this, define the type as
     * "row", "control-row" or "fieldset" (String) as well as the property `items`.
     * @example
     * items = [
     *     {component: Input, props: {value: 'Clinton'}, label: "name"},
     *     [
     *         [ // column 1
     *             {component: Input, props: {value: 'Clinton'}, label: "name"}
     *         ],
     *         [ // column 2
     *             {component: Input, props: {value: 'Clinton'}, label: "name"}
     *         ]
     *     ],
     *     {
     *         type: "fieldset",
     *         items: [
     *             {component: Button, props: {buttonText: 'cancel'}},
     *             {component: Button, props: {buttonText: 'save'}}
     *         ]
     *     },
     *     {
     *         type: "row",
     *         items: [
     *             {component: Button, props: {buttonText: 'cancel'}},
     *             {component: Button, props: {buttonText: 'save'}}
     *         ]
     *     }
     * ];
     *
     * @property items
     * @type Array
     * @default 0
     * @since 15.0.0
    */
    items: PropTypes.array,

    /**
     * What key/keys are responsible for re-focussing `down`. Valid values are charcodes possible prepende with
     * a special key: 9 or `shift+9` or `ctrl+shift+9`. Multiple key combinations can be defined bydefining an array of keyDown-values.
     *
     * @property keyDown
     * @default 9
     * @type String|number|Array
     * @since 15.0.0
    */
    keyDown: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),

    /**
     * Whenever `keyEnter` is set, then the focus-container will become a `nested`- focuscontainer.
     * Nested focuscontainers will automaticcaly become focussable by their parent-container.
     *
     * The `keyEnter` determines what key/keys are responsible for `entering` this container. Valid values are charcodes possible prepende with
     * a special key: 39 or `shift+39` or `ctrl+shift+39`. Multiple key combinations can be defined bydefining an array of keyUp-values.
     *
     * @property keyEnter
     * @type String|number|Array
     * @since 15.0.0
    */
    keyEnter: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),

    /**
     * The `keyLeave` determines what key/keys are responsible for `leaving` this container and go to the parent focus-container.
     * Valid values are charcodes possible prepende with
     * a special key: 39 or `shift+39` or `ctrl+shift+39`. Multiple key combinations can be defined bydefining an array of keyUp-values.
     *
     * @property keyLeave
     * @default 27
     * @type String|number|Array
     * @since 15.0.0
    */
    keyLeave: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),

    /**
     * What key/keys are responsible for re-focussing `up`. Valid values are charcodes possible prepended with
     * a special key: 9 or `shift+9` or `ctrl+shift+9`. Multiple key combinations can be defined bydefining an array of keyUp-values.
     *
     * @property keyUp
     * @default "shift+9"
     * @type String|number|Array
     * @since 15.0.0
    */
    keyUp: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),

    /**
     * Whether the loop the focus when the last/first item is reached.
     *
     * @property loop
     * @default true
     * @type Boolean
     * @since 15.0.0
    */
    loop: PropTypes.bool,

    /**
     * Callback for when the component did mount.
     *
     * @property onMount
     * @type Function
     * @since 15.0.8
    */
    onMount: PropTypes.func,

    /**
     * Callback whenever the forms needs to submit (button[type="reset"] gets pressed)
     *
     * @property onClick
     * @type Function
     * @since 0.0.1
    */
    onReset: PropTypes.func,

    /**
     * Callback whenever the forms needs to submit (button[type="submit"] gets pressed)
     *
     * @property onClick
     * @type Function
     * @since 0.0.1
    */
    onSubmit: PropTypes.func,

    /**
     * Whether to focus on the next item whenever a `enter` is pressed on an input-element.
     *
     * @property refocusOnEnterInput
     * @default true
     * @type Boolean
     * @since 15.0.0
    */
    refocusOnEnterInput: PropTypes.bool,

    /**
     * Whether the focussed item should be scrolled into the view when the focusselector focuses it.
     *
     * @property scrollIntoView
     * @default true
     * @type String
     * @since 15.0.30
    */
    scrollIntoView: PropTypes.bool,

    /**
     * Selector on which the focusmanager should check against when refocussing
     *
     * @property selector
     * @type String
     * @since 15.0.0
    */
    selector: PropTypes.string,

    /**
     * Inline styles for the focus-container
     *
     * @property style
     * @type Object
     * @since 15.0.0
    */
    style: PropTypes.object,

    /**
     * The tabIndex
     *
     * @property tabIndex
     * @type Number
     * @since 0.0.1
    */
    tabIndex: PropTypes.number,

    /**
     * The transition-time when the window needs to be scrolled in order to get the focussable node into the view.
     *
     * @property transitionTime
     * @type Number
     * @since 15.0.0
    */
    transitionTime: PropTypes.number
};

Form.defaultProps = {
    items: []
};

module.exports = Form;
