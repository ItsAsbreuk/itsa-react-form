[![Build Status](https://travis-ci.org/ItsAsbreuk/COMPONENT_NAME.svg?branch=master)](https://travis-ci.org/ItsAsbreuk/COMPONENT_NAME)

React Form which renders a focussable form based upon elements declared by `props.items`

##Advantage of using itsa-react-form

* You can define a form based upon an object (props.items)
* Has a focusmanager
* Up to 4 columns even for separate rows
* Responsive by using purecss classes

## Example:

```js
"use strict";

import "purecss";
import "itsa-jsext/lib/object";
import "itsa-jsext/lib/string";

import "itsa-react-checkbox/css/component.scss";
import "itsa-react-button/css/component.scss";
import "itsa-react-input/css/component.scss";
import "itsa-react-input/css/purecss-component.scss";
import "itsa-react-textarea/css/component.scss";

import "purecss/build/grids-responsive-min.css";

const React = require("react"),
    ReactDOM = require("react-dom"),
    Form = require("itsa-react-form"),
    Button = require("itsa-react-button"),
    Input = require("itsa-react-input"),
    MaskedInput = require("itsa-react-maskedinput"),
    Checkbox = require("itsa-react-checkbox"),
    Textarea = require("itsa-react-textarea"),
    REG_EXP_PHONE = /^\(\d{0,3}\) \d{0,3}\-\d{0,4}$/;


/*******************************************************
 * Custom form-Component
 *******************************************************/
const MyForm = React.createClass({

    focusUnvalidated() {
        const instance = this;
        const validated = instance.props.validated;
        if (!validated.name) {
            instance.refs.myform.refs.name.focus();
        }
        else if (!validated.email) {
            instance.refs.myform.refs.email.focus();
        }
        else if (!validated.phone) {
            instance.refs.myform.refs.phone.focus();
        }
        else if (!validated.password) {
            instance.refs.myform.refs.password.focus();
        }
        else if (!validated.termsAccepted) {
            instance.refs.myform.refs.terms.focus();
        }
    },

    formValid() {
        const validated = this.props.validated;
        return validated.name && validated.email && validated.phone && validated.password && validated.termsAccepted;
    },

    getInitialState() {
        return {
            formValid: false,
            formValidated: false
        };
    },

    handleSubmit(e) {
        const formValid = this.formValid();
        e.preventDefault();
        this.setState({
            formValid,
            formValidated: true
        });
        this.props.onSubmit && this.props.onSubmit({
            formValid,
            target: this
        });
    },

    render() {
        let formClass = "pure-form pure-form-stacked", items;
        const props = this.props,
              formValid = this.state.formValid,
              formValidated = this.state.formValidated,
              validatedText = formValid ? "valid" : "invalid",
              generalTermsMsgClass = "checkbox-text" + ((formValidated && !props.termsAccepted) ? " checkbox-error-text" : "");

        formValid || (formClass+=" invalid");
        items = [
            {
                component: "legend",
                props: {
                    className: "formheader",
                    innerText: "Form is " + validatedText
                }
            },
            {
                type: "fieldset",
                items: [
                    {
                        component: Input,
                        props: {
                            className: "pure-input-1",
                            errorMsg: "Enter your name",
                            formValidated: formValidated,
                            markRequired: true,
                            markValidated: true,
                            onChange: props.onChangeName,
                            placeholder: "Name",
                            ref: "name",
                            validated: props.validated.name,
                            value: props.name
                        }
                    },
                    {
                        component: Input,
                        props: {
                            className: "pure-input-1",
                            errorMsg: "Emailformat is: user@example.com",
                            formValidated: formValidated,
                            markRequired: true,
                            markValidated: true,
                            onChange: props.onChangeEmail,
                            placeholder: "Email address",
                            ref: "email",
                            validated: props.validated.email,
                            value: props.email
                        }
                    },
                    {
                        component: MaskedInput,
                        props: {
                            className: "pure-input-1",
                            errorMsg: "Phone number format: (555) 555-5555",
                            formValidated: formValidated,
                            helpText: "format: (555) 555-5555",
                            markRequired: true,
                            markValidated: true,
                            mask: "(111) 111-1111",
                            onChange: props.onChangePhone,
                            placeholder: "Phone",
                            ref: "phone",
                            validated: props.validated.phone,
                            value: props.phone
                        }
                    },
                    {
                        component: Input,
                        props: {
                            className: "pure-input-1",
                            errorMsg: "Use at least 5 characters",
                            formValidated: formValidated,
                            markRequired: true,
                            markValidated: true,
                            onChange: props.onChangePassword,
                            placeholder: "Password",
                            ref: "password",
                            type: "password",
                            validated: props.validated.password,
                            value: props.password
                        }
                    },
                    {
                        component: Textarea,
                        props: {
                            className: "pure-input-1 last",
                            onChange: props.onChangeComment,
                            placeholder: "Comment",
                            ref: "comment",
                            value: props.comment
                        }
                    },
                    {
                        type: "row",
                        items: [
                            {
                                component: Checkbox,
                                props: {
                                    checked: props.termsAccepted,
                                    formValidated: formValidated,
                                    onChange: props.onTermsAccepted,
                                    ref: "terms",
                                    validated: props.validated.termsAccepted
                                }
                            },
                            {
                                component: "span",
                                props: {
                                    className: "itsa-input-required-msg-after",
                                    innerText: "General terms accepted"
                                }
                            }
                        ]
                    },
                    {
                        component: "div",
                        props: {
                            className: generalTermsMsgClass,
                            innerText: "You need to accept our terms"
                        }
                    },
                    {
                        component: "div",
                        props: {
                            className: "itsa-input-required-msg-before",
                            innerText: "required fields"
                        }
                    },
                    {
                        type: "control-row",
                        items: [
                            {
                                component: "button",
                                props: {
                                    className: "pure-button pure-button-primary",
                                    innerText: "Validate",
                                    type: "submit"
                                }
                            },
                            {
                                component: "button",
                                props: {
                                    className: "pure-button pure-button-primary",
                                    innerText: "Reset",
                                    type: "reset"
                                }
                            }
                        ]
                    },
                    {
                        type: "control-row",
                        items: [
                            {
                                component: Button,
                                props: {
                                    buttonText: "Validate",
                                    type: "submit"
                                }
                            },
                            {
                                component: Button,
                                props: {
                                    buttonText: "Reset",
                                    type: "reset"
                                }
                            }
                        ]
                    }
                ]
            }
        ];
        return (
            <Form
                className={formClass}
                onSubmit={this.handleSubmit}
                ref="myform"
                items={items} />
        );
    }

});


const handleChangeName = (e) => {
    redefineProps('name', e.target.value);
};

const handleChangeEmail = (e) => {
    redefineProps('email', e.target.value);
};

const handleChangePassword = (e) => {
    redefineProps('password', e.target.value);
};

const handleChangePhone = (e) => {
    redefineProps('phone', e.target.value);
};

const handleChangeComment = (e) => {
    redefineProps('comment', e.target.value);
};

const handleSubmit = (e) => {
    const formValid = e.formValid,
          form = e.target;
    formValid || form.focusUnvalidated();
};

const handleTermsAccepted = (e) => {
    redefineProps('termsAccepted');
};


/*******************************************************
 * Validation
 *******************************************************/
const validate = (value, validators) => {
    let valid;
    if (!validators) {
        return true;
    }
    validators.some(validatorKey => {
        validatorsDefinition[validatorKey] && (valid=validatorsDefinition[validatorKey](value));
        return !valid;
    });
    return !!valid;
};

const validatorsDefinition = {
    checked(val) {
        return !!val
    },

    email(val) {
        return val.itsa_isValidEmail(); // comes from itsa/lib/string
    },

    password(val) {
        return val && (val.length>=5);
    },

    phone(val) {
        return REG_EXP_PHONE.test(val) || !val;
    },

    required(val) {
        return !!val;
    }
};

const validateProps = props => {
    props.itsa_each((value, key) => {
        // only inspect primary type-properties
        if (typeof props[key]!=="object") {
            props.validated[key] = validate(props[key], props.validators[key]);
        }
    });
};


/*******************************************************
 * props
 *******************************************************/
let props = {
    name: '',
    email: '',
    password: '',
    comment: '',
    phone: '',
    termsAccepted: false,
    onChangeName: handleChangeName,
    onChangeEmail: handleChangeEmail,
    onChangePassword: handleChangePassword,
    onChangePhone: handleChangePhone,
    onChangeComment: handleChangeComment,
    onSubmit: handleSubmit,
    onTermsAccepted: handleTermsAccepted,
    validated: {},
    validators: {
        email: ["required", "email"],
        name: ["required"],
        phone: ["required", "phone"],
        termsAccepted: ["checked"],
        password: ["required", "password"]
    }
};

const redefineProps = (key, value) => {
    if (key==='termsAccepted') {
        props.termsAccepted = !props.termsAccepted;
    }
    else {
        props[key] = value;
    }
    validateProps(props);
    renderForm(props);
};


/*******************************************************
 * React render form
 *******************************************************/
const renderForm = props => {
    ReactDOM.render(
        <MyForm {...props} />,
        document.getElementById("component-container")
    );
};


/*******************************************************
 * Initialization
 *******************************************************/
validateProps(props);
renderForm(props);
```


#### If you want to express your appreciation

Feel free to donate to one of these addresses; my thanks will be great :)

* Ether: 0xE096EBC2D19eaE7dA8745AA5D71d4830Ef3DF963
* Bitcoin: 37GgB6MrvuxyqkQnGjwxcn7vkcdont1Vmg
