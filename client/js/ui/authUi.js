'use strict';

// ОБРАБОТКА ВИДИМОСТИ ПАРОЛЕЙ, ИКОНКИ
export function setupPasswordToggle() {
    const eyeElements = document.querySelectorAll('.password-input-eye');
    eyeElements.forEach(eyeElement => {
        eyeElement.addEventListener('click', () => {
            eyeElement.classList.toggle('password-visible');
            const container = eyeElement.closest('.password-input-wrapper');
            const passwordInput = container.querySelector('.password-input');
            passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.focus();
        })
    })
}

// СОЗДАТЬ АККАУНТ - КНОПКА
export function setupFormSwitching() {
    const createAccountElement = document.querySelector('.create-account-btn');
    createAccountElement.addEventListener('click', ()  => {
        const loginCard = document.querySelector('.login-card');
        const registerCard = document.querySelector('.register-card');
        loginCard.classList.add('hide-login');
        loginCard.classList.remove('show-login');
        setTimeout( () => {
            loginCard.classList.add('hide');
        }, 500)

        setTimeout( () => {
            registerCard.classList.remove('hide');
            registerCard.classList.remove('hide-register');
            registerCard.classList.add('show-register');
        }, 500)
    })

    // ВЕРНУТЬСЯ К ВХОДУ В АККАУНТ КНОПКИ
    const backToLoginElements = document.querySelectorAll('.back-to-login');
    backToLoginElements.forEach(backToLoginElement => {
        backToLoginElement.addEventListener('click', () => {
            const loginCard = document.querySelector('.login-card');
            const registerCard = document.querySelector('.register-card');
            registerCard.classList.add('hide-register');
            registerCard.classList.remove('show-register');
            setTimeout( () => {
                registerCard.classList.add('hide');
            }, 500)

            setTimeout( () => {
                loginCard.classList.remove('hide');
                loginCard.classList.remove('hide-login');
                loginCard.classList.add('show-login');
            }, 500)
        })
    });
}
