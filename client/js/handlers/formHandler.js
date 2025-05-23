import { loginUser, registerUser } from '../services/authService.js';
import { FormValidate } from '../validate/form-validate.js';

//
import { refreshTokenRequest } from "../api/userApi.js";

export function setupFormHandlers() {
    const forms = document.querySelectorAll('[data-js-form]');

    forms.forEach((formEl) => {
        const validator = new FormValidate(formEl);

        formEl.addEventListener('submit', async (event) => {
            event.preventDefault();

            const loadingElement = formEl.querySelector('.form-loading');
            loadingElement.classList.remove('hide');
            const fieldErrorsElement = formEl.querySelector('[data-js-form-field-error]');

            if (validator.isValid) {
                const formData = Object.fromEntries(new FormData(formEl).entries());
                const formId = formEl.id;

                try {
                    const result = formId === 'login-form'
                        ? await loginUser(formData)
                        : await registerUser(formData);
                    const data = await result.json();

                    if (data.success) {
                        localStorage.setItem('accessToken', data.accessToken);
                        window.location.replace('chat.html');
                    } else {
                        fieldErrorsElement.textContent = data.error || 'Ошибка';
                    }

                } catch (err) {
                    console.error(err);
                    fieldErrorsElement.textContent = 'Ошибка при отправке запроса';
                }
            }

            loadingElement.classList.add('hide');
        });
    });
}