// Здесь действия
document.addEventListener("click", function (e) {
    var button = e.which || e.button;
    if (button === 1) {
        if (contextMenu != undefined) {
            contextMenu.hide();
        }
    }
});

Date.prototype.getMonthName = function() {
    var month = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
    return month[this.getMonth()];
}

contextMenu = new ContextMenu();
contextMenu.hide();
filterMenu = new FilterMenu();
filterMenu.hide();

// Создать новый календарь
scheduler = new window.Scheduler(schedulerId, year);
scheduler.getData();
scheduler.render();

filterMenu.addDepartments(scheduler);
filterMenu.addEmployees(scheduler);