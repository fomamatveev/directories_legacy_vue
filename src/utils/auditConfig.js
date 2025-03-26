export default {
    // Поля, которые нужно игнорировать при отображении изменений
    ignoredFields: [
        'Id',
        'CreatedAt',
        'UpdatedAt',
        'CreatedBy',
        'UpdatedBy',
        'PasswordHash',
        'PasswordSalt'
    ],

    // Поля, которые требуют специального форматирования
    customFormatters: {
        // Можно добавить специальные форматеры для определенных полей
        // Например:
        // Status: (value) => STATUS_LABELS[value] || value
    }
};