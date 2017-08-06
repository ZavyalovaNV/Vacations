(function () {
    function Vacation(data, scheduler) {
        this._data = data;
        this._data.dateFrom = new Date(data.dateFrom);
        this._data.dateTo = new Date(data.dateTo);        
        this._scheduler = scheduler;
    }

    // Количество недель в отпуске
    Vacation.prototype.weeksCount = function () {
        return getWeeks(this._data.dateFrom, this._data.dateTo);
    };

    // Номер недели отпуска в году
    Vacation.prototype.weekNumber = function () {
        var dayDiff,
            firstWeekNumber,
            weekNumber;
        // Первый день года
        var firstYearDate = new Date(this._scheduler._year, 0, 1);
        var dayOfWeek = firstYearDate.getDay();
        if (dayOfWeek === 0) {
            dayOfWeek = 7
        }

        // Если первый день - понедельник, то 
        if (dayOfWeek === 1) {
            firstWeekNumber = 0;
            dayDiff = getDaysCount(firstYearDate, this._data.dateFrom);
            weekNumber = Math.ceil(dayDiff / 7);
        } else {
            firstWeekNumber = 1;
            // Дата начала следдующей недели - ближайший понедельник года
            firstYearDate = new Date(this._scheduler._year, 0, 1 + 7 - dayOfWeek + 1);
            if (firstYearDate >= this._data.dateFrom) {
                weekNumber = 0;
            } else {
                dayDiff = getDaysCount(firstYearDate, this._data.dateFrom);
                weekNumber = Math.ceil(dayDiff / 7);
            }
        }
        return (weekNumber + firstWeekNumber)
    }

    // Количество дней в отпуске
    Vacation.prototype.daysCount = function () {
        return getDaysCount(this._data.dateFrom, this._data.dateTo);
    }

    // Отрисовка неделей отпуска
    Vacation.prototype.render = function (row) {
        if (row != null) {
            var cell,
                cellIndex,
                diff,
                colSpan,
                minWidth,
                // Количество дней в отпуске
                daysCount = this.daysCount(),
                // Количество недель в отпуске
                weekCount = this.weeksCount(),
                // Определить номер недели начала отпуска
                weekNumber = this.weekNumber(),
                // Количество дней в году
                daysYearCount = this._scheduler.getYearDaysCount();

            // Объединить в отпуск дни
            // Т.к. первой идет ФИО, но номер недели будет соответствовать номеру ячейки
            // Но нужно учесть объединенные ячейки  
            diff = 0;
            for (var i = 1; i < weekNumber; i++) {
                cell = row.cells[i];
                if (cell != null) {
                    colSpan = cell.colSpan;
                    // Если было объединение, посчитать доп смещение
                    if (colSpan > 7) {
                        colSpan = Math.ceil((colSpan - 7) / 7);
                    } else {
                        colSpan = 0
                    }
                    diff = diff + colSpan;
                }
            }
            // Получить итоговый индекс ячейки
            cellIndex = weekNumber - diff;
            var cellVacation = row.cells[cellIndex];
            // Объединить по неделям
            cellVacation.colSpan = weekCount * 7;
            // Задать минимальную ширину, т.к. иначе большие ячейки уменьшаются до 1 недели - и происходит сдвиг
            minWidth = (20 + (weekCount - 1) * 21) + 'px';
            cellVacation.style.minWidth = minWidth;
            // Создать контейнер отпуска
            var vacation = document.createElement('div');
            vacation.id = this._data.id;
            // Настроить стили
            vacation.classList.add('vacation-container');
            switch(this._data.state.toString()) {
                case '1': { vacation.classList.add('inwork') } break;
                case '2': { vacation.classList.add('matching') } break;
                case '3': { vacation.classList.add('matched') } break;
            }
            // Настроить события
            vacation.addEventListener('click', Vacation.prototype.open);
            vacation.addEventListener('contextmenu', Vacation.prototype.contextMenu);
            // Подсказки
            vacation.setAttribute('title', this._data.dateFrom.toDateString() + ' - ' + this._data.dateTo.toDateString());
            // Прописать кол-во дней отпуска в ячейке
            vacation.innerHTML = this._data.duration;
            cellVacation.appendChild(vacation);
            
            // Удалить лишние ячейки после объединения
            var cell;
            for (var i = 1; i < weekCount; i++) {
                index = cellIndex + 1;
                cell = row.cells[index];
                row.deleteCell(index)
            }
        }
    }
   
    // Открытие отпуска
    Vacation.prototype.open = function () {
        var elementId = this.id;
        if (elementId === undefined) {
            elementId = '';
        }
        executeScript("AK_VSOpenPlanVacation", schedulerId, elementId);
        scheduler.refresh();
    }

    // Создание нового отпуска
    Vacation.prototype.new = function () {
        executeScript("AK_VSCreateNewPlanVacation", schedulerId, 0, employeeId, dateFromStr, dateToStr);
        scheduler.refresh();
    }

    // Удаление отпуска
    Vacation.prototype.delete = function () {
        var elementId = this.id;
        if (elementId === undefined) {
            elementId = '';
        }
        executeScript("AK_VSDeletePlanVacation", schedulerId, elementId);
        scheduler.refresh();
    }

    // Показ контекстного меню
    Vacation.prototype.contextMenu = function () {
        var elementId = this.id;
        
        if (contextMenu == undefined) {
            contextMenu = new ContextMenu()
        }
        contextMenu.add(this, elementId);
        contextMenu.show();

        event.preventDefault();
        event.stopPropagation();
    }

    window.Vacation = Vacation;
})();
