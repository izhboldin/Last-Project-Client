export class productValidMixin {
    static isEmpty(data) {
        return (data === "" || data === null || data === undefined)
    }
    static checkLength(data, min, max) {
        return data.length < min || data.length > max
    }

    static validName(name) {
        if (productValidMixin.isEmpty(name)) {
            return 'Напишите название вашего объявления';
        } else if (productValidMixin.checkLength(name, 6, 40)) {
            return 'Название не должно быть меньше 6 и больше 40 символов';
        } else {
            return null
        }
    }

    static validDescription(desc) {
        if (productValidMixin.isEmpty(desc)) {
            return 'Опишите ваше объявление';
        } else if (productValidMixin.checkLength(desc, 30, 500)) {
            return 'Описание не должно быть меньше 30 и больше 500 символов';
        } else {
            return null
        }
    }

    static validPhone(phone) {
        if (productValidMixin.isEmpty(phone)) {
            return 'Напишите ваш телефон';
        } else {
            return null
        }
    }

    static validPrice(price) {
        if (productValidMixin.isEmpty(price)) {
            return 'Заполните поле с ценой';
        } else if (isNaN(price)) {
            return 'Введите число';
        } else {
            return null
        }

    }

}