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
           console.log(arguments,this)
            this.setModel(models.createDeviceModel(), "device");
            
            // const currentYear = new Date().getFullYear();
            // const CurrentMonth = new Date().getMonth();
            // const months = [
            //     "January", "February", "March", "April", "May", "June",
            //     "July", "August", "September", "October", "November", "December"
            // ];
            // const MonthWiseArr = [];
            // months.forEach((month, i) => {
            //     //  if(i>=CurrentMonth){ //change according to current month
            //          let monthobj = { Month: month.toString() }, day = 1,
            //         lastDay = new Date(currentYear, i + 1, 0).getDate();
            //     while (day <= lastDay) {
            //         monthobj['D' + day] = `${currentYear}-${i+1}-${day}`
            //         day += 1;
            //     }
            //     MonthWiseArr.push(monthobj);
            //     //  }
              
            // })
            // const TableModel = this.getModel("TableCalendarSelect");
            // // TableModel.setData(MonthWiseArr);
            // TableModel.setProperty("ToDate", new Date());
            // TableModel.setProperty("FromDate", new Date());
            // TableModel.setProperty("ProjectName","welcomt to")
            
              const curtimeRangeSet = this.getModel("RunTimeModel");
              curtimeRangeSet.setData({});
              curtimeRangeSet.refresh(true);
              const ActivityM = this.getModel("ActivityModel");
              ActivityM.setData([]);
              ActivityM.refresh(true);
              var omdeol =this.getModel("ColumnLayout");
              omdeol.setData({FLayout:"OneColumn"})
              omdeol.refresh(true);
            this.getRouter().initialize();
        }
    });
});