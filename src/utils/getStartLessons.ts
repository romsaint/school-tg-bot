export async function getStartLessons(dayPlus?: number, minutesToAdd: number = 0) {
    const now = new Date();

    // Устанавливаем время на 8:30 сегодняшнего дня
    now.setHours(8, 30, 0, 0);

    // Прибавляем дни, если указано
    if (dayPlus) {
        now.setDate(now.getDate() + dayPlus);
    }

    // Прибавляем минуты
    now.setMinutes(now.getMinutes() + minutesToAdd);

    // Форматируем дату и время
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Возвращаем отформатированную дату и время
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}