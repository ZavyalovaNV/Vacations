(function () {
    // Конструктор календаря
    function Scheduler(schedulerId, year) {
        this._schedulerId = schedulerId;
        this._year = year;

        this._vacations = [];
        this._employeeList = [];
        this._departmentList = [];

        // Фильтры
        this.filterEmployees = [];
        this.filterDepartments = [];
    }

    // Количество недель в году
    Scheduler.prototype.getWeekCount = function () {
        // Первый день года
        var firstDay = new Date(this._year, 0, 1);
        var lastDay = new Date(this._year, 11, 31);
        // Количество недель между датами
        weekCount = getWeeks(firstDay, lastDay);
        return weekCount
    }

    // Количество дней в году
    Scheduler.prototype.getYearDaysCount = function () {
        var count = 0,
            date;
        for (var month = 1; month <= 12; month++) {
          date = new Date(this._year, month, 0);
          count += date.getDate();
        }
        return count;
    }

    // Отрисовать дни года
    Scheduler.prototype.renderDays = function (row) {
        if (row != undefined) {
            for (var i = 1; i <= this.getYearDaysCount() ; i++) {
                var dayContainer = document.createElement('th');
                dayContainer.classList.add('scheduler-day');
                row.appendChild(dayContainer)
            }
        }
    }

    // Отрисовать месяцы года
    Scheduler.prototype.renderMonths = function (row) {
        var date,
            dayCount,
            monthName,
            seasonClass;

        for (var month = 1; month <= 12; month++) {
            date = new Date(year, month, 0);
            dayCount = date.getDate();
            monthName = date.getMonthName();
            // Определить стиль для месяцев по временам года
            switch (month) {
                case 3:
                case 4:
                case 5:
                    seasonClass = CLASS_SPRING; break;
                case 6:
                case 7:
                case 8:
                    seasonClass = CLASS_SUMMER; break;
                case 9:
                case 10:
                case 11:
                    seasonClass = CLASS_AUTUMN; break;
                default:
                    seasonClass = CLASS_WINTER
            }

            var monthContainer = document.createElement('td');
            monthContainer.classList.add('scheduler-month');
            monthContainer.classList.add(seasonClass);
            monthContainer.colSpan = dayCount;
            monthContainer.innerHTML = monthName;
            row.appendChild(monthContainer)
        }
    }

    // Отрисовать недели
    Scheduler.prototype.renderWeeks = function (row, addNumber, employeeId) {
        var weekCount = this.getWeekCount();

        // Создать столбцы по неделям
        for (var i = 0; i < weekCount; i++) {
            // Сформировать подсказку как начало и конец недели
            date = getFirstAndLastDatesByWeek(i, this._year);
            dateFrom = date[0];
            dateTo = date[1];
            var dayCount = getDaysCount(dateFrom, dateTo);

            // Сформировать ячейку
            weekContainer = document.createElement('td');
            if (addNumber) {
                weekContainer.innerHTML = i + 1;
            }
            weekContainer.colSpan = dayCount;
            // Настроить события
            weekContainer.addEventListener('dblclick', Scheduler.prototype.new);
            weekContainer.addEventListener('contextmenu', Scheduler.prototype.contextMenu);
            // Подсказки
            weekContainer.setAttribute('title', dateFrom.toDateString() + ' - ' + dateTo.toDateString());
            // Настроить стили
            weekContainer.classList.add('scheduler-week');
            weekContainer.id = "week-" + (i + 1) + '-' + employeeId;

            row.appendChild(weekContainer);
        }
    }

    // Отрисовать заголовки
    Scheduler.prototype.renderHeader = function (table) {
        //----------------1 строка-------------------------
        // Добавить строку для дней
        var row = document.createElement('tr');
        row.classList.add('scheduler-header-row');
        table.appendChild(row);        
        var rowSpan = 1;
        // Добавить ячейку для работника
        var employeeContainer = document.createElement('th');
        employeeContainer.classList.add('scheduler-employee');
        row.appendChild(employeeContainer);
        // Нарисовать остальную часть строки - дни
        this.renderDays(row);

        //----------------2 строка-------------------------
        // Добавить строку для месяцев
        var row = document.createElement('tr');
        row.classList.add('scheduler-header-row');
        table.appendChild(row);
        // Отрисовать месяцы
        this.renderMonths(row);
        rowSpan++;

        //----------------2 строка-------------------------
        // Добавить строку для недель
        var row = document.createElement('tr');
        table.appendChild(row);
        // Нарисовать недели
        this.renderWeeks(row, true, 0);
        rowSpan++;
        
        // Объединить ячейки для ФИО
        employeeContainer.rowSpan = rowSpan;
    }

    // Отрисовать по работнику
    Scheduler.prototype.renderEmployee = function(employee, containerParent) {
        var employeeId = employee.id;
        var emplDepartmentId = employee.departmentId;

        var departmentList = scheduler.filterDepartments;
        var employeeList = scheduler.filterEmployees;

        var inFilterDepartments = ($.inArray(emplDepartmentId, departmentList) > -1) || (departmentList.length == 0);
        var inFilterEmployees = ($.inArray(employeeId, employeeList) > -1) || (employeeList.length == 0);

        if (inFilterDepartments && inFilterEmployees) {
            // Контейнер-строка для работника и его данных
            var container = document.createElement('div');
            container.classList.add('scheduler-employee-content');
            container.id = 'employee-' + employeeId;

            // Контейнер как фон
            var containerBg = document.createElement('div');
            containerBg.classList.add('vacation-list-bg');
            //containerBg.id = 'employee-bg-' + employeeId;
            container.appendChild(containerBg);

            // Таблица под работника
            var table = document.createElement('table');
            table.classList.add('vacation-table-bg');
            //table.id = 'vacation-table-bg' + employeeId;

            // Добавить строку для дней
            var row = document.createElement('tr');
            row.classList.add('scheduler-day-row');
            //row.id = 'scheduler-day-row-bg-' + employeeId;
            table.appendChild(row);
            var rowSpan = 1;

            // Добавить пустую ячейку соответствующую работнику
            var emptyContainer = document.createElement('th');
            emptyContainer.classList.add('scheduler-day');
            row.appendChild(emptyContainer);

            // Нарисовать часть календаря - дни
            this.renderDays(row);

            // Нарисовать недели
            var row = document.createElement('tr');
            row.classList.add('scheduler-week-row-bg');
            table.appendChild(row);

            // Добавить ячейку для работника
            var employeeContainer = document.createElement('td');
            employeeContainer.classList.add('scheduler-employee');
            //employeeContainer.id = 'employee-name-' + employeeId;
            var nameContainer = document.createElement('span');
            employeeContainer.appendChild(nameContainer);
            nameContainer.innerHTML = employee.name;
            row.appendChild(employeeContainer);

            rowSpan++;
            this.renderWeeks(row, false, employeeId);

            // Объединить ячейки для ФИО
            //employeeContainer.rowSpan = rowSpan;
            containerBg.appendChild(table);
            containerParent.appendChild(container);
        }
    };

    // Отрисовать контейнер под отпуска
    Scheduler.prototype.renderVacationContainer = function (containerParent, employeeId) {
        var container,
            table,
            daysRow,
            weeksRow,
            rowSpan = 1;

        // Контейнер для отпусков
        // Если не был создан ранее - создать
        container = containerParent.querySelector('.vacation-list');
        if (container === null) {
            container = document.createElement('div');
            container.classList.add('vacation-list');
            containerParent.appendChild(container);
        }

        // Таблица под работника
        table = container.querySelector('.vacation-table');
        if (table === null) {
            table = document.createElement('table');
            table.classList.add('vacation-table');
            container.appendChild(table);
        }

        // Добавить строку для дней
        daysRow = table.querySelector('.scheduler-day-row');
        if (daysRow === null) {
            daysRow = document.createElement('tr');
            daysRow.classList.add('scheduler-day-row');
            table.appendChild(daysRow);

            // Добавить пустую ячейку соответствующую работнику
            var emptyContainer = document.createElement('th');
            emptyContainer.classList.add('scheduler-day');
            daysRow.appendChild(emptyContainer);

            // Нарисовать часть календаря - дни
            this.renderDays(daysRow);
        }

        // Нарисовать недели
        weeksRow = table.querySelector('.scheduler-week-row');
        if (weeksRow === null) {
            var weeksRow = document.createElement('tr');
            weeksRow.classList.add('scheduler-week-row');
            table.appendChild(weeksRow);

            // Добавить ячейку для работника
            var employeeContainer = document.createElement('td');
            employeeContainer.classList.add('scheduler-employee');
            weeksRow.appendChild(employeeContainer);

            rowSpan++;
            this.renderWeeks(weeksRow, false, employeeId);
        }

        // Объединить ячейки для ФИО
        //employeeContainer.rowSpan = rowSpan;
        container.appendChild(table);

        return weeksRow;
    }

    // Отрисовать календарь
    Scheduler.prototype.render = function () {
        // Отрисовать шапку календаря
        var container = document.querySelector('.scheduler-header');
        if (container != null) {
            var table = document.createElement('table');
            table.classList.add('scheduler-header-table');
            container.appendChild(table);
            this.renderHeader(table, null);
        }

        container = document.querySelector('.scheduler-content');
        if (container != null) {
            var employeeList = this._employeeList;

            employeeList.forEach(function (employee, i, employeeList) {
                row = this.renderEmployee(employee, container);
                if (row != undefined) {
                    container.appendChild(row);
                }
            }, this);
           
            var vacations = this._vacations;
            var containerVacation;
            vacations.forEach(function (_vacation, i, vacations) {
                vacation = new window.Vacation(_vacation, this);
                // Получить контейнер по ИД работника
                container = document.getElementById('employee-' + vacation._data.employeeId);
                if (container != null) {
                    containerVacation = this.renderVacationContainer(container, vacation._data.employeeId);
                    vacation.render(containerVacation);
                }
            }, this)
        }
    }

    // Создание нового отпуска
    Scheduler.prototype.new = function () {
        var elementId = this.id;
        var weekNumber,
            elementId,
            dateFromStr,
            dateToStr,
            employeeId;

        if (elementId === undefined) {
            elementId = '';
            weekNumber = -1;
            employeeId = '';
        } else {
            var arr = elementId.split("-");
            employeeId = arr[0];
            weekNumber = arr[1];
        }

        // Получить даты на основе номера 
        if (weekNumber > -1) {
            var weekCount = scheduler.getWeekCount();
            var dateArr = getFirstAndLastDatesByWeek(weekNumber - 1, scheduler._year, weekCount);
            // Конвертировать дату
            var dateFrom = dateArr[0];
            dateFromStr = dateFrom.getDate() + '.' + (dateFrom.getMonth() + 1) + '.' + dateFrom.getFullYear();
            var dateTo = dateArr[1];
            dateToStr = dateTo.getDate() + '.' + (dateTo.getMonth() + 1) + '.' + dateTo.getFullYear();
        } else {
            dateFromStr = '';
            dateToStr = '';
        }
        
        var data = executeScript("AK_VSCreateNewPlanVacation", schedulerId, 0, employeeId, dateFromStr, dateToStr);
        scheduler.refresh();
    }
    
    // Создание контекстного меню
    Scheduler.prototype.contextMenu = function () {
        var elem = document.querySelector('.context-menu');
        if (elem == null) {
            contextMenu = new ContextMenu()
        }
        contextMenu.add(this);
        contextMenu.show();

        event.preventDefault();
        event.stopPropagation();
    }

    // Очистить календарь
    Scheduler.prototype.clear = function () {
        var container = document.querySelector('.scheduler-header');
        container.innerHTML = "";
        var container = document.querySelector('.scheduler-content');
        container.innerHTML = "";
    }

    // Обновить календарь
    Scheduler.prototype.refresh = function () {
        this.getData();
        this.clear();
        this.render();
    }

    // Получение данных с сервера
    Scheduler.prototype.getData = function () {
        var textData;
        if (this._schedulerId != undefined) {
            // Отпуска по ИД графика
            try {
                textData = executeScript('AK_VSGetPlanVacationData', this._schedulerId);
            } catch (err) {
                textData = '[ { "id":"3", "schedulerId":"1562928", "employeeId":"1", "dateFrom":"2017-01-01", "dateTo":"2017-01-02", "duration":"2", "state":"2", "isAcademic":"Н" }, { "id":"4", "schedulerId":"1562928", "employeeId":"1", "dateFrom":"2017-02-09", "dateTo":"2017-02-21", "duration":"20", "state":"2", "isAcademic":"Н" } ]'
            }
            this._vacations = JSON.parse(textData);
            // Все работники
            try {
                textData = executeScript('AK_VSGetEmployeeData');
            } catch (err) {
                textData = '[ { "id":"1", "name":"Первый человек", "departmentId":"1151901" }]'
            }            
            this._employeeList = JSON.parse(textData);
            // Все подразделения
            try {
                textData = executeScript('AK_VSGetDepartmentData');
            } catch (err) {
                textData = '[ { "id":"1151901", "name":"Группа внедрения DIRECTUM" }]'
            }
            this._departmentList = JSON.parse(textData);
        }        
    }

    // Получить объект по его ИД
    Scheduler.prototype.getVacationById = function(vacationId) {
        // Графики отпусков
        var vacations = this._vacations;
        var vacation;
        vacations.forEach(function (_vacation, i, vacations) {
            if (_vacation.id === vacationId) {
                vacation = _vacation;
                return vacation
            }
        }, this)
        return vacation
    }

    window.Scheduler = Scheduler;
})();