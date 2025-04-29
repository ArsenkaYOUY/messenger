'use strict'

import { loadUserProfile} from "../services/userService.js";
import { saveProfileData } from "../services/userService.js";
import { generateDefaultAvatar } from "../utils/avatarUtils.js"

export function setupIconActiveSectionSwitch() {
    const sideMenuLinks = document.querySelectorAll('.side-menu-link')
    sideMenuLinks.forEach(linkEl => {
        linkEl.addEventListener('click', (e) => {
            e.preventDefault();
            sideMenuLinks.forEach(linkEl => {
                linkEl.classList.remove("active");
            })
            e.currentTarget.classList.add("active");
            const targetElement = e.currentTarget.dataset.target;
            loadSectionContent(targetElement);
        })
    })
}

export async function loadSectionContent(targetElement) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hide');
    });

    const activeSection = document.getElementById(targetElement);
    if (activeSection) {
        activeSection.classList.remove('hide');

        if (targetElement === 'profile') {
            const profileData = await loadUserProfile();
            renderProfileData(profileData.user);
        }
    }
}

function renderProfileData(profileData) {

    console.log(profileData);
    document.querySelector('[data-field="username"] .info-value').textContent = profileData.username;
    document.querySelector('[data-field="email"] .info-value').textContent = profileData.email;
    document.querySelector('[data-field="fullname"] .info-value').textContent = profileData.full_name;
    document.getElementById('profile-fullname').textContent = profileData.full_name;
    document.getElementById('desc-input').value = profileData.about;

    const avatarElement = document.getElementById('avatar-image');
    // Удаляем предыдущие классы, если они есть
    avatarElement.className = '';
    // avatarElement.alt = 'Аватар пользователя';

    if (profileData.avatar_url) {
        avatarElement.src = "http://localhost:3000/" + profileData.avatar_url;
    } else {
        avatarElement.src = ''; // Очищаем src
        avatarElement.classList.add('default-avatar');
        const { initials, color } = generateDefaultAvatar(profileData.full_name);
        avatarElement.dataset.initials = initials;
        avatarElement.style.backgroundColor = color;
    }

    const profileStatusElement = document.querySelector('.profile-status');

    profileStatusElement.textContent = profileData.status === "online" ? 'в сети' : 'не в сети';
    if (profileStatusElement.textContent  === 'не в сети') {
        profileStatusElement.classList.remove('online');
        profileStatusElement.classList.add('offline');

    }
    else {
        profileStatusElement.classList.remove('offline');
        profileStatusElement.classList.add('online');

    }
}


export function setupEditProfileInfo() {
    const editableRows = document.querySelectorAll('.info-row');

    const errorContainer = document.querySelector('.profile-errors');
    const successContainer = document.querySelector('.profile-success');
    const loadingContainer = document.querySelector('.profile-loading');

    const avatarUpload = document.getElementById('avatar-upload');
    const avatarImage = document.getElementById('avatar-image');

    const descInput = document.getElementById('desc-input');

    let currentlyEditing = null;
    let isProcessing = false; // Флаг для отслеживания состояния запроса

    // Регулярные выражения для валидации
    const validations = {
        email: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Введите корректный email адрес'
        },
        username: {
            regex: /^[a-zA-Z0-9_]{3,15}$/,
            message: 'Имя пользователя должно содержать 3-15 символов (буквы, цифры, _)'
        }
    };
    hideMessages();

    descInput.addEventListener('blur', handleDescriptionSave);
    descInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') await handleDescriptionSave();
    });

    // Обработчик для текстовых полей
    editableRows.forEach((row) => {
        const editButton = row.querySelector('.info-edit-btn');
        const valueElement = row.querySelector('.info-value');
        const inputElement = row.querySelector('.info-edit');
        const field = row.dataset.field;

        editButton.addEventListener('click', (e) => {
            if (isProcessing) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            if (currentlyEditing && currentlyEditing !== row) {
                cancelCurrentlyEditing();
            }

            startEditing(row, field, valueElement, inputElement);
        });

        inputElement.addEventListener('blur', () => {
            if (!isProcessing) {
                handleFieldSave(row, field, valueElement, inputElement, editButton);
            }
        });

        inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !isProcessing) {
                handleFieldSave(row, field, valueElement, inputElement, editButton);
            }
        });
    });

    async function handleDescriptionSave() {
        if (isProcessing) return;

        const newValue = descInput.value.trim();

        // Если значение не изменилось, ничего не делаем
        if (newValue === descInput.dataset.lastValue) return;

        isProcessing = true;
        hideMessages();
        descInput.disabled = true;
        loadingContainer.classList.remove('hide');

        try {
            await saveProfileData('about', newValue);

            // Сохраняем текущее значение для сравнения при следующем изменении
            descInput.dataset.lastValue = newValue;
            showSuccess('Описание успешно сохранено');
        } catch (error) {
            showError("Ошибка отправки данных. Повторите позже");
        } finally {
            isProcessing = false;
            descInput.disabled = false;
            loadingContainer.classList.add('hide');
        }
    }

    // Функция для отмены текущего редактирования
    function cancelCurrentlyEditing() {
        if (!currentlyEditing || isProcessing) return;

        const valueElement = currentlyEditing.querySelector('.info-value');
        const inputElement = currentlyEditing.querySelector('.info-edit');
        const editButton = currentlyEditing.querySelector('.info-edit-btn');

        inputElement.value = valueElement.textContent;
        cancelEdit(valueElement, inputElement, editButton);

        currentlyEditing = null;
    }

    // Обработчик для аватарки
    avatarUpload.addEventListener('change', async (e) => {
        console.log('start');
        if (!e.target.files?.[0] || isProcessing) return;

        const file = e.target.files[0];
        const oldSrc = avatarImage.src;

        try {
            isProcessing = true;
            avatarImage.src = URL.createObjectURL(file);
            hideMessages();
            loadingContainer.classList.remove('hide');

            await saveProfileData('avatar', file);
            showSuccess('Аватар успешно обновлен');

            avatarUpload.value = '';
        } catch (error) {
            avatarImage.src = oldSrc;
            showError('Ошибка отправки данных. Повторите позже');
        } finally {
            isProcessing = false;
            loadingContainer.classList.add('hide');
        }
    });

    function startEditing(row, field, valueElement, inputElement) {
        if (isProcessing) return;

        if (currentlyEditing && currentlyEditing !== row) {
            cancelCurrentlyEditing();
        }

        inputElement.value = field === 'username'
            ? valueElement.textContent.replace(/^@/, '')
            : valueElement.textContent;

        valueElement.classList.add('hide');
        inputElement.classList.remove('hide');
        row.querySelector('.info-edit-btn').classList.add('hide');
        inputElement.focus();

        currentlyEditing = row;
    }

    async function handleFieldSave(row, field, valueElement, inputElement, editButton) {
        if (isProcessing) return;

        const newValue = inputElement.value.trim();
        const oldValue = valueElement.textContent;

        if (!newValue || newValue === oldValue) {
            cancelEdit(valueElement, inputElement, editButton);
            currentlyEditing = null;
            return;
        }

        // Валидация перед отправкой
        if (validations[field]) {
            const validation = validations[field];
            if (!validation.regex.test(newValue)) {
                showError(validation.message);
                inputElement.focus();
                return;
            }
        }

        isProcessing = true;
        hideMessages();
        inputElement.disabled = true;
        loadingContainer.classList.remove('hide');

        try {
            const formattedValue = field === 'username'
                ? '@' + newValue
                : newValue;

            console.log(field, formattedValue);
            await saveProfileData(field, formattedValue);

            if (field === 'fullname') {
                document.getElementById('profile-fullname').textContent = formattedValue;
                if (avatarImage.classList.contains('default-avatar')) {
                    const { initials, color } = generateDefaultAvatar(formattedValue);
                    avatarImage.dataset.initials = initials;
                    avatarImage.style.backgroundColor = color;
                }
            }
            valueElement.textContent = formattedValue;
            cancelEdit(valueElement, inputElement, editButton);
            currentlyEditing = null;
            showSuccess(`Данные успешно сохранены`);
        } catch (error) {
            inputElement.value = oldValue.startsWith('@')
                ? oldValue.substring(1)
                : oldValue;
            showError(error.message);
            inputElement.focus();
        } finally {
            isProcessing = false;
            inputElement.disabled = false;
            loadingContainer.classList.add('hide');
        }
    }

    function cancelEdit(valueElement, inputElement, editButton) {
        valueElement.classList.remove('hide');
        inputElement.classList.add('hide');
        editButton.classList.remove('hide');
    }

    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hide');
        successContainer.classList.add('hide');
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        setTimeout(() => {
            errorContainer.classList.add('hide');
        }, 5000);
    }

    function showSuccess(message) {
        successContainer.textContent = message;
        successContainer.classList.remove('hide');
        errorContainer.classList.add('hide');

        setTimeout(() => {
            successContainer.classList.add('hide');
        }, 5000);
    }

    function hideMessages() {
        errorContainer.classList.add('hide');
        successContainer.classList.add('hide');
    }
}