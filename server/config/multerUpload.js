import multer from 'multer';
import path from 'path';

// Конфигурация для загрузки аватаров
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Указываем папку для хранения
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);  // Уникальное имя файла
    }
});

const uploadAvatar = multer({ storage }).single('avatar'); // 'avatar' - это имя поля в форме

export { uploadAvatar };
