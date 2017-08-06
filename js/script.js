// Количество дней мжду датами
function getDaysCount(dateFrom, dateTo) {
    return Math.floor((dateTo.getTime() - dateFrom.getTime())/(1000*60*60*24)) + 1    
}

// Получить количество недель между датами
function getWeeks(firstDay, lastDay) {
    // Получить разницу в днях
    var dayDiff = getDaysCount(firstDay, lastDay);
    var weekCount = Math.ceil(dayDiff / 7);
    return weekCount;
}

function getFirstAndLastDatesByWeek(weekNumber, year, weekCount) {
    var fDateFull = new Date(year, 0, 1);
    var fDay = fDateFull.getDate();
    var fMonth = fDateFull.getMonth();
    var fYear = fDateFull.getFullYear();
    
    var fDayNumber = fDateFull.getDay();

    if (fDayNumber === 0) {
        fDayNumber = 7
    }

    var days1,
        days2;

    if (weekNumber === 0) {
        days1 = fDay;
        days2 = days1 + 7 - fDayNumber
    } else {
        // количество дней с начала года
        days1 = weekNumber * 7 - fDayNumber + 1 + fDay;
        days2 = days1 + 6
    }

    var date1 = new Date(fYear, fMonth, days1);
    var date2 = new Date(fYear, fMonth, days2);
    
    if (weekNumber === (weekCount - 1)) {
        date2 = new Date(fYear, 11, 31);
    }
    
    var date = [];
    date[0] = date1;
    date[1] = date2;

    return date;
}

function stopChangeSize(event, ui) {
    var width = ui.size.width;
    var element = ui.element.context;
    var parent = element.parentElement;

    parent.style.width = width;
}

function getCoords(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset,
    };

}

// Выполнить скрипт
function executeScript(scriptName, schedulerId, vacationId, employeeId, dateFrom, dateTo) {
    try {
        if (application === undefined) {
            throw 'Не удалось подключиться к DIRECTUM. Обратитесь к администратору.'
        }
        var getTextData = application.ScriptFactory.GetObjectByName(scriptName);
        if (getTextData === undefined) {
            throw 'Не найден сценарий ' + scriptName + ' либо у Вас нет на него прав. Обратитесь к администратору.'
        }

        getTextData.Params.Add('SchedulerID', schedulerId);
        getTextData.Params.Add('VacationID', vacationId);
        getTextData.Params.Add('EmployeeID', employeeId);
        getTextData.Params.Add('DateFrom', dateFrom);
        getTextData.Params.Add('DateTo', dateTo);
        
        return getTextData.Execute()
    }
    catch (err) {
        alert(err);
        throw err
    }
}
