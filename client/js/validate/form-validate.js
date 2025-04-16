'use strict';

export class FormValidate {
    #formElement;
    isValid = false;

    errorMessages = {
        tooLong: ( { maxLength } ) => `Слишком длинное значение, ограничение символов - ${maxLength}`,
        tooShort: ( { minLength } ) => `Слишком короткое значение, минимум символов - ${minLength}`,
        patternMismatch: ( { title } ) => title || 'Данные не соответствуют формату',
        valueMissing: () =>  'Пожалуйста, заполните это поле',
    }

    constructor(formElement) {
        this.#formElement = formElement
        this.bindEvents()
    }

    bindEvents() {
        this.#formElement.addEventListener('focusout', (event) => {
            this.onBlur(event);
        })
        this.#formElement.addEventListener('submit', (event) => {
            this.onSubmit(event)
        })

    }

    onSubmit(event) {
        const requiredControlElements = [...event.target.elements]
            .filter((element) => element.required );

        let isFormValid = true;
        let firstInvalidFieldControl = null

        requiredControlElements.forEach((element) => {
            const isFieldValid = this.validateField(element);

            if (!isFieldValid) {
                isFormValid = false;
                if (!firstInvalidFieldControl) {
                    firstInvalidFieldControl = element;
                }
            }
        })

        this.isValid = isFormValid;
        if (!isFormValid){
            event.preventDefault()
            firstInvalidFieldControl.focus()
        }
    }

    onBlur(event) {
        const isRequired = event.target.required;
        if (isRequired) {
            this.validateField(event.target);
        }
    }

    validateField(fieldControlElement) {
        const errors = fieldControlElement.validity;
        let errorMessage = '';

        for (const [errorType, getErrorMessage] of Object.entries(this.errorMessages)) {
            if (errors[errorType]) {
                errorMessage = getErrorMessage(fieldControlElement);
                break;
            }
        }

        const confirmAttr = fieldControlElement.dataset.confirmPassword
        if (confirmAttr) {
            const passwordInputElement =  this.#formElement.querySelector(`[name=${confirmAttr}]`);
            if (passwordInputElement && passwordInputElement.value !== fieldControlElement.value) {
                errorMessage = 'Пароли не совпадают';
            }
        }

        const isValid = errorMessage === '';
        fieldControlElement.ariaInvalid = !isValid;
        this.manageErrors(fieldControlElement, errorMessage);

        return isValid;
    }

    manageErrors(fieldControlElement, errorMessage) {
        const fieldErrorsElement = fieldControlElement.parentElement.querySelector('[data-js-form-field-error]')
        fieldErrorsElement.innerHTML = errorMessage;
    }
}
