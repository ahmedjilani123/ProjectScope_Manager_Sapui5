sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], (Controller, MessageBox,MessageToast) => {
    "use strict";
    let TableSelctObj = {};
    return Controller.extend("cal.as.sap.calendarcustom.controller.Range1", {
        onInit() {},
        onAfterRendering() {
            // var oTable = this.getView().byId("ProjectTableCalId"),dates=0;
            // let arr=["Tablet","Large","Small","Desktop"];
            // while(dates<= 31) {
            //     const Dates =  dates <=20 ? "Desktop":"Tablet";
            //     const dd = dates <=12 
            //     var oColumn = new sap.m.Column({
            //         hAlign:'Center',
            //         importance:(dates == 0 ? "High" : "Medium"),
            //         width: (dates == 0 ? "6em" : "4em"),
            //         demandPopin:(dates == 0 ? false : dd),
            //         minScreenWidth:(dates == 0 ? "" : `${Dates}`),
            //         header: new sap.m.Label({
            //             text: (dates == 0 ? "Months" : dates)
            //         })
            //     });
            //     oTable.addColumn(oColumn);
            //     dates += 1;
            // }
            // const Cells = [];
            // let date = 0;
            // while (date <= 31) {
            //     let controls = date == 0 ? new sap.m.Text({ text: "{TableCalendarSelect>Month}" }) : new sap.m.Button({ fieldGroupIds: `{TableCalendarSelect>D${date}}`, visible: "{= ${TableCalendarSelect>D" + date + "} ? true : false}" });
            //     Cells.push(controls);
            //     date += 1;
            // }
            // const ColumnListItem = new sap.m.ColumnListItem({cells: Cells})
            // oTable.bindItems("TableCalendarSelect>/", ColumnListItem);
            var oUiTable = this.getView().byId("UiTable");
           
            var dates = 0;
            while (dates <= 31) {
                var columss;
                if (dates == 0) {
                    columss = new sap.ui.table.Column({
                        width: "6em",
                        label: new sap.m.Text({ text: "Months 2024" }),
                        template: new sap.m.Text({ text: "{TableCalendarSelect>Month}" }),
                    });
                } else {
                    columss = new sap.ui.table.Column({
                        width: "4em",
                        label: new sap.m.Text({ text: dates }),
                        template: new sap.m.Button({ fieldGroupIds: `{TableCalendarSelect>D${dates}}`, visible: "{= ${TableCalendarSelect>D" + dates + "} ? true : false}", press: this.UiButtonHandler }),
                    });
                }
                oUiTable.addColumn(columss);
                dates += 1;
            }
            oUiTable.bindRows("TableCalendarSelect>/");
        },
        NavigationPress(e){
debugger
        },
        UiButtonHandler: function (e) {
            if (TableSelctObj?.from) {
                if (TableSelctObj.submit) {
                    MessageBox.alert("please submit the selected date first");
                    return;
                }
                if (TableSelctObj.Month === e.getSource().getParent().getAggregation("cells")[0].getText()) {
                    let from = parseInt(TableSelctObj.from.split("-").pop());
                    let to = parseInt(e.getSource().getProperty("fieldGroupIds")[0].split("-").pop());
                    const toCheck = new Date(e.getSource().getProperty("fieldGroupIds")[0]);
                    const fromCheck =new Date(TableSelctObj.from);
                    if(toCheck < fromCheck) {
                        MessageToast.show("you must select a above date");
                        return;
                    }
                    while (from <= to) {
                        e.getSource().getParent().getAggregation("cells")[from].setType("Emphasized");
                        e.getSource().getParent().getAggregation("cells")[from].setEnabled(false);
                        from += 1;
                    }
                    TableSelctObj.to = e.getSource().getProperty("fieldGroupIds")[0];
                    TableSelctObj.submit="yes"

                } else {
                    MessageBox.alert("Please select a correct month");
                }
            } else {
                    var currentDate = new Date();
                    var from =new Date(e.getSource().getProperty("fieldGroupIds")[0]);
        if(from < currentDate){
        MessageToast.show("previous date selected");
        return 
        }
                TableSelctObj.Month = e.getSource().getParent().getAggregation("cells")[0].getText();
                TableSelctObj.from = e.getSource().getProperty("fieldGroupIds")[0];
                e.getSource().setType("Emphasized");
            }
        },
        SubmitDateRangePress(e) {
            debugger
            var oCalendar = this.getView().byId("SetCalendarId");
            var oDateRange = new sap.ui.unified.DateRange({
                startDate: new Date(TableSelctObj.from),
                endDate: new Date(TableSelctObj.to)
            });

            oCalendar.addSelectedDate(oDateRange);
            TableSelctObj = {};
            MessageToast.show("Submit Date Range")
        }
    });
});
