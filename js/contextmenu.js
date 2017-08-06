function ContextMenu() {
    var element;
    element = document.querySelector("context-menu");
    if (element === null) {
        var element = document.createElement('div');        
        element.classList.add("context-menu");

        var TEMPLATE = document.querySelector('#template_contextmenu').innerHTML;
        element.innerHTML = TEMPLATE;
    }
    this.element = element;
    this.vacationId = null;
}

ContextMenu.prototype.show = function () {
    this.element.classList.remove(CLASS_HIDDEN)
    //this.element.style.display = 'block';
}

ContextMenu.prototype.hide = function () {
    //this.element.style.display = 'none';
    this.element.classList.add(CLASS_HIDDEN)
}

ContextMenu.prototype.add = function (container, vacationId) {
    this.container = container;
    var item;
    var element = this.element;
    this.vacationId = vacationId;

    if (this.vacationId != undefined) {        
        var vacation;
        this.vacation = scheduler.getVacationById(this.vacationId);

        item = element.querySelector('.item-open')
        if (item != null) {
            item.classList.remove('disable');
        }
        item = element.querySelector('.item-delete')
        if (item != null) {
            item.classList.remove('disable');
        }
        item = element.querySelector('.item-new')
        if (item != null) {
            item.classList.add('disable');
        }
    } else {
        item = element.querySelector('.item-open')
        if (item != null) {
            item.classList.add('disable');
        }
        item = element.querySelector('.item-delete')
        if (item != null) {

            item.classList.add('disable');
        }
        item = element.querySelector('.item-new')
        if (item != null) {
            item.classList.remove('disable');
        }
    }

    var coord = getCoords(container);
    element.style.top = (coord.top + container.clientHeight - 10) + 'px';
    element.style.left = (coord.left + container.clientWidth - 10) + 'px';

    document.body.appendChild(element);
}

ContextMenu.prototype.createNewVacation = function () {
    this.hide();
    if (this.container != undefined) {
        scheduler.new.call(this.container);
    }
    event.stopPropagation()
}

ContextMenu.prototype.deleteVacation = function () {
    this.hide();
    if (this.vacation != undefined) {
        window.Vacation.prototype.delete.call(this.vacation);
    }
    event.stopPropagation()
}

ContextMenu.prototype.openVacation = function () {
    this.hide();
    if (this.vacation != undefined) {
        window.Vacation.prototype.open.call(this.vacation);
    }
    event.stopPropagation()
}

ContextMenu.prototype.refreshData = function () {
    this.hide();

    scheduler.getData();
    scheduler.clear();
    scheduler.render();

    event.stopPropagation();
}