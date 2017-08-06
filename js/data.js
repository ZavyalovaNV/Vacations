var form,
    component,
    schedulerId,
    year,
    application,
    contextMenu,
    filterMenu,
    readOnly = true;

try {
    form = window.external.Form;
    if (form === undefined) {
        application = new ActiveXObject("SBLogon.LoginPoint").GetApplication("ServerName=m-sv-p-sql01;DBName=DIRECTUM_DEV;IsOSAuth=true")
        if (application === undefined) {
            throw 'Не удалось подключиться к DIRECTUM. Обратитесь к администратору.'
        }
        component = application.ReferencesFactory.AK_SchedulesVacations.GetObjectByID(1562131);
    } else {
        component = form.View.Component;
        application = component.Application;
    }
    schedulerId = component.Requisites("ИД").Value;
    year = component.Requisites("ISBIntNumber").Value;
    readOnly = component.Params.FindItem('ReadOnly');
} catch (err) {
    alert(err);
    schedulerId = 1562131;
    year = 2016;
}