sap.ui.define([
    "./Basecontroller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    'sap/ui/model/json/JSONModel',
    "sap/ui/core/library",
    "sap/ui/unified/library",
    'sap/ui/unified/CalendarLegendItem',
    'sap/ui/unified/DateTypeRange'
], (Basecontroller, MessageBox, MessageToast, JSONModel, CoreLibrary, UnifiedLibrary, CalendarLegendItem, DateTypeRange) => {
    "use strict";
    let TableSelctObj = {};
    var ActivityAdd=2;
    var CalendarDayType = UnifiedLibrary.CalendarDayType,
        ValueState = CoreLibrary.ValueState;
    return Basecontroller.extend("cal.as.sap.calendarcustom.controller.Range1", {
        onInit() { },
        YearChangeTablePress(e){
            this.SelectionYearChange( parseInt(e.getParameter("selectedItem").getProperty("text")));
        },
        onAfterRendering() {
            this.SelectionYearChange();
            // this.CreateDialog = undefined;
            // if (!this.CreateDialog) {
            //                                                                                 // ActivityAdd to open
            //     this.CreateDialog = new sap.ui.xmlfragment("cal.as.sap.calendarcustom.Fragments.ActivityAdd", this);
            //     this.getView().addDependent(this.CreateDialog);
            // }
            // this.CreateDialog.open();
            const oLegend = this.byId("legend");
            oLegend.setStandardItems([""])
            var getAlldata = JSON.parse(localStorage.getItem("table"));
            var modelss = this.getView().getModel("TableCalendarSelect");
            modelss.setProperty("/CreateData", false);
            modelss.setProperty("/dayTable", getAlldata);
            modelss.refresh(true);

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

        },
        NavigationPress(e) {
            debugger
            var model = this.getOwnerComponent().getModel("ColumnLayout");
            model.setData({FLayout:"TwoColumnsBeginExpanded"})
            model.refresh(true);
            var ActivytM =this.getView().getModel("ActivityModel");
            ActivytM.setProperty("/ShowFormInput",true);
            var UniquiId = e.getSource().getBindingContext("TableCalendarSelect").getObject().UniqID;
            ActivytM.setProperty("/UniqID",UniquiId);
            ActivytM.refresh(true);
        },
        UiButtonHandler: function (e) {
            debugger
            let modelss =e.getSource().getBindingContext("TableCalendarSelect").getObject()
            let SelectAUniqID = modelss.UniqID
            let stringsIfy = JSON.stringify(modelss);
            let modelssC = JSON.parse(stringsIfy);
            var currentModel= this.getOwnerComponent().getModel("RunTimeModel").getData();
            var seperate = e.getSource().getProperty("fieldGroupIds")[0].split("|");
            if(modelssC.rangeFromS && modelssC.rangeToS && modelssC.setFrom && modelssC.setTo){
                if(currentModel.setFrom){
                    if(currentModel.setTo){
                        let from = parseInt(currentModel.rangeFromS);
                        let to = parseInt(currentModel.rangeToS);
                        while (from <= to) {
                            e.getSource().getParent().getAggregation("cells")[from].setType("Default");
                            from += 1;
                        }
                        modelssC.rangeFromS =parseInt(seperate[0]);
                        modelssC.setFrom =seperate[1]
                        modelssC.setTo=undefined;
                        var model= this.getView().getModel("RunTimeModel");
                        model.setData(modelssC);
                        model.refresh(true);
                        e.getSource().setType("Emphasized");
                        return;
                    }
                    let from = parseInt(currentModel.rangeFromS);
                    let to = parseInt(seperate[0]);
                    let durations = to - from;
                    while (from <= to) {
                        if(durations <=5){
                            e.getSource().getParent().getAggregation("cells")[from].setType("Accept");
                            e.getSource().setType("Accept");
                        }else if(durations <=10){
                            e.getSource().getParent().getAggregation("cells")[from].setType("Reject");
                            e.getSource().setType("Reject");
    
                        }else if(durations >=10){ 
                            e.getSource().getParent().getAggregation("cells")[from].setType("Emphasized");
                            e.getSource().setType("Emphasized");
                        }
                        from += 1;
                    }
                    // final data source
                    currentModel.setTo = seperate[1];
                    currentModel.rangeToS =to;
                    var model= this.getView().getModel("RunTimeModel");
                    model.setData(currentModel);
                    model.refresh(true);

                }else{
                    var rangess = modelssC.rangeFromS; // main model data source
                    while (rangess <= modelssC.rangeToS) {
                        e.getSource().getParent().getAggregation("cells")[rangess].setType("Default");
                        rangess += 1;
                    }
                    delete modelssC.rangeToS;
                    delete modelssC.rangeFromS;
                    delete modelssC.setFrom;
                    delete modelssC.setTo;
                    modelssC.rangeFromS =parseInt(seperate[0]);
                    modelssC.setFrom =seperate[1]
                    modelssC.setTo=undefined;
                    var model= this.getView().getModel("RunTimeModel");
                    model.setData(modelssC);
                    model.refresh(true);
                    e.getSource().setType("Emphasized");
                }
              
                return; 
                // model changes end ---
            }else{
                if (TableSelctObj.MainFrom) {
               
                    if(TableSelctObj.setTo){
                        let from = parseInt(TableSelctObj.rangeFrom);
                        let to = parseInt(TableSelctObj.rangeToS);
                        while (from <= to) {
                            e.getSource().getParent().getAggregation("cells")[from].setType("Default");
                            from += 1;
                        }
                        TableSelctObj.rangeFrom=parseInt(seperate[0]);
                        TableSelctObj.setTo=undefined;
                        TableSelctObj.MainFrom = seperate[1]
                        e.getSource().setType("Emphasized");
                        return;
                    }
                    let from = parseInt(TableSelctObj.rangeFrom);
                    let to = parseInt(seperate[0]);
                    let duration = to - from ;
                    while (from <= to) {
                        if(duration <=5){
                            e.getSource().getParent().getAggregation("cells")[from].setType("Accept");
                            e.getSource().setType("Accept");
                        }else if(duration <=10){
                            e.getSource().getParent().getAggregation("cells")[from].setType("Reject");
                            e.getSource().setType("Reject");
    
                        }else if(duration >=10){ 
                            e.getSource().getParent().getAggregation("cells")[from].setType("Emphasized");
                            e.getSource().setType("Emphasized");
                        }
                        from += 1;
                    }
                    TableSelctObj.setTo = seperate[1];
                    TableSelctObj.UniqIds = SelectAUniqID;
                    TableSelctObj.rangeFromS =parseInt(TableSelctObj.rangeFrom);
                    TableSelctObj.rangeToS =to;
                   
                } else {
                    TableSelctObj.rangeFrom = parseInt(seperate[0]);
                    TableSelctObj.MainFrom = seperate[1]
                    e.getSource().setType("Emphasized");
                }
            }
           
        },
        SubmitDateRangePress() {
            console.log(TableSelctObj);
            debugger
            var modelData = this.getView().getModel("RunTimeModel").getData();
            var currentJson = JSON.parse(localStorage.getItem("table")) || [];
            if(modelData?.setFrom){
                currentJson.forEach((ele, i) => {
                    if (ele.UniqID == modelData.UniqID) {
                        currentJson[i]=modelData;
                    }
                })
                var model = this.getView().getModel("TableCalendarSelect");
                localStorage.setItem("table", JSON.stringify(currentJson));
                model.setProperty('/dayTable', currentJson);
                model.refresh(true);
                var ChangeModel =this.getView().getModel("RunTimeModel");
                ChangeModel.setData({});
                ChangeModel.refresh(true);
                sap.m.MessageToast.show("successfully created");
                this.SelectionYearChange();
                return;

            }
            if (TableSelctObj?.MainFrom) {
                var userLogin = this.getView().getModel("TableCalendarSelect").getData().UserLogin;
                let MainModelTable = this.getView().getModel("TableCalendarSelect").getData().dayTable;
                
                if (this.getView().getModel("TableCalendarSelect").getData().CreateData) {
                    MainModelTable.forEach((item, i) => {
                        if (item.UniqID == TableSelctObj.UniqIds) {         // User is logged  if (item.UserRole == userLogin) {   
                            item.setFrom = TableSelctObj.MainFrom;
                            item.setTo = TableSelctObj.setTo;
                            item.rangeFromS=TableSelctObj.rangeFromS;
                            item.rangeToS=TableSelctObj.rangeToS;
                        }
                        currentJson.push(item);
                    })
                   var s = this.getView().getModel("TableCalendarSelect");
                   s.setProperty("/CreateData",false);
                   s.refresh(true);
                } else {
                    if (currentJson.length > 0) {
                        currentJson.forEach((ele, i) => {
                            if (ele.UniqID == TableSelctObj.UniqIds) {
                                ele.setFrom = TableSelctObj.MainFrom;
                                ele.setTo = TableSelctObj.setTo;
                                ele.rangeFromS=TableSelctObj.rangeFromS;
                                ele.rangeToS=TableSelctObj.rangeToS;
                                currentJson[i]=ele;
                            }
                        })
                    } else {
                        MainModelTable.forEach((item, i) => {
                              if (item.UniqID ==TableSelctObj.UniqIds ) { // compare user if (item.UserRole == userLogin)
                                item.setFrom = TableSelctObj.MainFrom;
                                item.setTo = TableSelctObj.setTo;
                                item.rangeFromS=TableSelctObj.rangeFromS;
                                item.rangeToS=TableSelctObj.rangeToS;
                            }
                            currentJson.push(item);
                        })
                    }
                }
                var model = this.getView().getModel("TableCalendarSelect");
                localStorage.setItem("table", JSON.stringify(currentJson));
                model.setProperty('/dayTable', currentJson);
                model.refresh(true);
                TableSelctObj = {};
                sap.m.MessageToast.show("successfully created");
                this.SelectionYearChange();
            } else {
                sap.m.MessageToast.show("Please select your project durations...");
            }

        },
        UserLoginPress1: function (e) {
            let User = e.getSource().getParent().getContent()[0].getSelectedIndex() == 0 ? 'User1' : 'User2';
            var model = this.getView().getModel("TableCalendarSelect");
            model.setProperty('/UserLogin', User);
            model.refresh(true);
            e.getSource().getParent().close();
        },
        handleCloseSideScreenPress(){
            var model = this.getOwnerComponent().getModel("ColumnLayout");
            model.setData({FLayout:"OneColumn"})
            model.refresh(true);
        },
        AddActivityPress(){
            var model = this.getOwnerComponent().getModel("ActivityModel")
            var arr =model.getData().item;
            arr.push({Label:'Activity '+ActivityAdd++,Value:""})
            model.refresh(true);
        },
        DeleteInputListPress(e){
            var currentInput = parseInt(e.getParameter("listItem").getBindingContext("ActivityModel").getPath().split("/").pop());
            var model = this.getOwnerComponent().getModel("ActivityModel")
        model.getData().item.splice(currentInput,1);
        ActivityAdd--;
          
            model.refresh(true);
        },
        ShowFromInputPress(e){
            const ActivityM = this.getView().getModel("ActivityModel");
            if(e.getParameter("pressed")){
                ActivityM.setProperty("/ShowFormInput",true);
                debugger
                e.getSource().setIcon("sap-icon://less")
            }else{
                ActivityM.setProperty("/ShowFormInput",false);
                e.getSource().setIcon("sap-icon://add")   
            }
            ActivityM.refresh(true);
        },
        ActivitySubItemPress(e){
            debugger
            var se = this.getView().byId("toggleId");
            const ActivityM = this.getView().getModel("ActivityModel");
           let {subtitle,subDesc,sID,subItemAc} = ActivityM.getData();
           if(subtitle.trim() == ""){
            sap.m.MessageToast.show("Please enter a title");
            return;
           }else if(subDesc.trim() ==""){
            sap.m.MessageToast.show("Please enter a description");
            return;
           }else{
            if(sID){
                subItemAc.forEach((item)=>{
                    if(item.sID == sID){
                        item.subtitle =subtitle
                        item.subDesc = subDesc;
                    }
                })
            }else{

                subItemAc.push({MainTaskID:ActivityM.getData().UniqID,subtitle:ActivityM.getData().subtitle, subDesc:ActivityM.getData().subDesc,sID:Math.floor(10000 + Math.random() * 90000)});
            }
se.setIcon("sap-icon://add")
ActivityM.setProperty("/ShowFormInput",false);
se.setPressed(false);
            ActivityM.setProperty("/subtitle","");
            ActivityM.setProperty("/subDesc","");
            ActivityM.setProperty("/sID","");
            ActivityM.refresh(true);
           }


        },
    changeDataSubItemPress(e){
        debugger
        var obj = e.getSource().getBindingContext("ActivityModel").getObject();
        var ActivityM =  this.getView().getModel("ActivityModel");
        ActivityM.setProperty("/subtitle",obj.subtitle);
        ActivityM.setProperty("/ShowFormInput",true);
        ActivityM.setProperty("/subDesc",obj.subDesc);
        ActivityM.setProperty("/sID",obj.sID);
        ActivityM.refresh(true);
    }
    });
});
