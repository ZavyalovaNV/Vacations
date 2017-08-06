function FilterMenu() {
    var element = document.querySelector('.submenu-settings');
    this.element = element;
}

FilterMenu.prototype.show = function () {
    this.element.classList.toggle(CLASS_HIDDEN)    
}

FilterMenu.prototype.hide = function () {
    this.element.classList.add(CLASS_HIDDEN);
}

FilterMenu.prototype.addDepartments = function (scheduler) {
    var departmentList = scheduler._departmentList;
    var department;

    var select = this.element.querySelector('.select-department');
    select.innerText = '';
    for (var i = 0; i < departmentList.length; i++) {
        department = departmentList[i];

        departmentId = department.id;
        departmentName = department.name;

        var option = document.createElement("option");
        option.classList.add('select-department-option');
        
        option.value = departmentId;
        option.innerHTML = departmentName;

        select.appendChild(option);
    }
}

FilterMenu.prototype.addEmployees = function (scheduler) {
    var employeeList = scheduler._employeeList;
    var departmentList = scheduler.filterDepartments;
    var employee;

    var select = this.element.querySelector('.select-employee');
    select.innerText = '';
    for (var i = 0; i < employeeList.length; i++) {
        employee = employeeList[i];

        employeeId = employee.id;
        employeeName = employee.name;
        emplDepartmentId = employee.departmentId;
        var inFilterDepartments = ($.inArray(emplDepartmentId, departmentList) > -1) || (departmentList.length == 0);

        if (inFilterDepartments) {
            var option = document.createElement("option");
            option.classList.add('select-employee-option');
            
            option.value = employeeId;
            option.innerHTML = employeeName;

            select.appendChild(option);
        }
    }
}

FilterMenu.prototype.changeFilterDepartment = function () {
    var filterValue = $(".select-department").val();
    if (filterValue === null) {
        filterValue = []
    }
    scheduler.filterDepartments = filterValue;
    this.addEmployees(scheduler, filterValue);

    scheduler.clear();
    scheduler.render();
}

FilterMenu.prototype.changeFilterEmployee = function () {
    filterValue = $(".select-employee").val();
    if (filterValue === null) {
        filterValue = []
    }
    scheduler.filterEmployees = filterValue;
    scheduler.clear();
    scheduler.render();
}