// Инициализация режима по умолчанию
let currentMode = "Массив";

// Элементы DOM
const modeSelect = document.getElementById('modeSelect');
const processButton = document.getElementById('processButton');
const copyButton = document.getElementById('copyButton');
const pasteButton = document.getElementById('pasteButton');
const inputField = document.getElementById('inputField');
const outputField = document.getElementById('outputField');
const removeDuplicatesCheckbox = document.getElementById('removeDuplicates');

// Функция для установки режима
function setMode(mode) {
    currentMode = mode;
    inputField.value = '';
    outputField.value = '';
}

// Обработчик изменения выбора режима
modeSelect.addEventListener('change', (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "3x3") {
        setMode("3x3");
        // При смене режима "3x3" отключаем чекбокс
        removeDuplicatesCheckbox.checked = false;
        removeDuplicatesCheckbox.disabled = true;
        removeDuplicatesCheckbox.parentElement.style.opacity = 0.5;
    } else {
        setMode("Массив");
        // Включаем чекбокс при режиме "Массив"
        removeDuplicatesCheckbox.disabled = false;
        removeDuplicatesCheckbox.parentElement.style.opacity = 1;
    }
});

// Функция для обработки режима 3x3
function processInput3x3() {
    const inputText = inputField.value.trim();

    // Регулярное выражение для поиска предмета и матрицы
    const pattern = /addShaped\(([^,]+),\s*\[\[\s*(.*?)\s*\]\]\);/s;
    const match = inputText.match(pattern);

    if (match) {
        const item = match[1].trim();
        const matrixText = match[2];

        // Разбиваем матрицу на строки
        let rows = matrixText.split("],");
        rows = rows.map(row => row.trim());

        // Обрабатываем каждую строку
        const newRows = [];
        for (let row of rows) {
            row = row.replace(/\[|\]/g, '').trim();
            const items = row.split(",").map(item => item.trim()).filter(item => item && item !== 'null');
            if (items.length > 0) {
                newRows.push(items);
            }
        }

        // Оставляем только первые три строки и три элемента в каждой строке
        const limitedRows = newRows.slice(0, 3).map(row => row.slice(0, 3));

        // Формируем выходной текст
        let outputText = `recipes.addShaped(${item}, [\n`;
        limitedRows.forEach(row => {
            outputText += `    [${row.join(', ')}],\n`;
        });
        outputText += ']);';

        // Заполняем поле вывода
        outputField.value = outputText;
    } else {
        alert("Не удалось найти предмет и матрицу 3x3 в тексте");
    }
}

// Функция для обработки режима Массив
function processInputArray() {
    const inputText = inputField.value;

    // Обновленное регулярное выражение для поиска элементов с .withTag
    const pattern = /<[^>]+>\.withTag\(\{[^}]*\}\)|<[^>]+>/g;
    const matches = inputText.match(pattern) || [];

    let uniqueMatches = matches;
    if (removeDuplicatesCheckbox.checked) {
        // Удаляем дубликаты и сортируем
        uniqueMatches = Array.from(new Set(matches)).sort();
    }

    // Формируем выходной текст с запятой после последнего элемента
    if (uniqueMatches.length > 0) {
        outputField.value = uniqueMatches.join(',\n') + ',';
    } else {
        outputField.value = '';
    }
}

// Функция для обработки текста
function processInput() {
    if (currentMode === "3x3") {
        processInput3x3();
    } else {
        processInputArray();
    }
}

// Обработчик кнопки обработки текста
processButton.addEventListener('click', processInput);

// Функция для копирования текста в буфер обмена
function copyToClipboard() {
    const outputText = outputField.value.trim();
    if (outputText) {
        navigator.clipboard.writeText(outputText)
            .then(() => {
                // Уведомление отключено
                // alert("Текст скопирован в буфер обмена");
            })
            .catch(() => {
                alert("Не удалось скопировать текст");
            });
    }
}

// Обработчик кнопки копирования
copyButton.addEventListener('click', copyToClipboard);

// Функция для вставки текста из буфера обмена
async function pasteFromClipboard() {
    try {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText) {
            inputField.value = clipboardText;
            outputField.value = '';
            processInput();
            copyToClipboard();
        } else {
            alert("Буфер обмена пуст или содержит неверные данные");
        }
    } catch (err) {
        alert("Не удалось вставить текст из буфера обмена");
    }
}

// Обработчик кнопки вставки
pasteButton.addEventListener('click', pasteFromClipboard);

// Инициализация состояния чекбокса при загрузке страницы
window.addEventListener('load', () => {
    if (currentMode === "3x3") {
        removeDuplicatesCheckbox.checked = false;
        removeDuplicatesCheckbox.disabled = true;
        removeDuplicatesCheckbox.parentElement.style.opacity = 0.5;
    } else {
        removeDuplicatesCheckbox.checked = true;
        removeDuplicatesCheckbox.disabled = false;
        removeDuplicatesCheckbox.parentElement.style.opacity = 1;
    }
});