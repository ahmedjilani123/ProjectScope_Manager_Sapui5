sap.ui.define([
    "sap/ui/core/UIComponent",
    "cal/as/sap/calendarcustom/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("cal.as.sap.calendarcustom.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },
        init() {
            UIComponent.prototype.init.apply(this, arguments);
            this.setModel(models.createDeviceModel(), "device");
            const currentYear = new Date().getFullYear();
            const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            const MonthWiseArr = [];
            months.forEach((month, i) => {
                let monthobj = { Month: month.toString() }, day = 1,
                    lastDay = new Date(currentYear, i + 1, 0).getDate();
                while (day <= lastDay) {
                    monthobj['D' + day] = `${currentYear}-${i+1}-${day}`
                    day += 1;
                }
                MonthWiseArr.push(monthobj);
            })
            const TableModel = this.getModel("TableCalendarSelect");
            TableModel.setData(MonthWiseArr);

            // enable routing
            this.getRouter().initialize();
        }
    });
});