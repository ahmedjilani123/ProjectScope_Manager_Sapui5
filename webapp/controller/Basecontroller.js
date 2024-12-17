sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
   
let formatRange = 0;
    return Controller.extend("cal.as.sap.calendarcustom.controller.Basecontroller", {
        SelectionYearChange(){
            var currentYear = new Date();
            let From_Month = new Date(currentYear.getFullYear(), 0,1);
            let To_Month = new Date(currentYear.getFullYear(),11,1);

            const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            let GetMonthIndex = [];   // Get the index of the selected month
            while (From_Month <= To_Month) {
                let lastDay = new Date(From_Month.getFullYear(), From_Month.getMonth() + 1, 0).getDate();
                GetMonthIndex.push({ month: From_Month.getMonth(), year: From_Month.getFullYear(), lastDay: lastDay });
                From_Month.setMonth(From_Month.getMonth() + 1);
            }
        
            this.TableBindingMethod(GetMonthIndex, this.getView().byId("UiTable"), months); // create the table binding
        },
        SubmitProjectDetailsHandler: function () {
            debugger
            var From_Date = this.getView().getModel("TableCalendarSelect").getData().FromDate;
            var To_Date = this.getView().getModel("TableCalendarSelect").getData().ToDate;
            var projectDetail = this.getView().getModel("TableCalendarSelect").getData().ProjectName;
            let DataOjb ={From_Date,To_Date,projectDetail};
            let InputSource=[this.getView().byId("FromDateID"),this.getView().byId("ToDateID"),this.getView().byId("InpuProjectID")]
             let ValidateAll = this.ValidationsAllInput(InputSource) // validate inputs method to identify the data
            let From_Month = new Date(From_Date);
            let To_Month = new Date(To_Date);
if(ValidateAll){
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    let GetMonthIndex = [];   // Get the index of the selected month
    while (From_Month <= To_Month) {
        let lastDay = new Date(From_Month.getFullYear(), From_Date.getMonth() + 1, 0).getDate();
        GetMonthIndex.push({ month: From_Month.getMonth(), year: From_Month.getFullYear(), lastDay: lastDay });
        From_Month.setMonth(From_Month.getMonth() + 1);
    }
    // -------------------------create a json model ----------------
    const DayArrayValue = []; // Day Array 
    ['User1', 'User2'].forEach((itemUser)=>{
        let count =1;
        let dayObj = { ProjectName: projectDetail +'-'+itemUser };
        GetMonthIndex.forEach((item, i) => {
            let day = 1;
            while (day <= item.lastDay) {
                dayObj["day" + item.year + day + item.month] = day;
                dayObj["fullDay" + item.year + day + item.month] = `${item.year}-${item.month}-${day}`;
                dayObj["FT"+ item.year + day + item.month]=count.toString()
                dayObj.UniqID = Math.floor(10000 + Math.random() * 90000);
                dayObj.UserRole =itemUser;
                count++;
                day += 1;
            }
        })
        DayArrayValue.push(dayObj);
    })
   
    // ---------------------------end json model ----------------
    let getModels = this.getView().getModel("TableCalendarSelect");
    getModels.setSizeLimit(3000);
    getModels.setProperty("/dayTable", DayArrayValue);
    getModels.setProperty("/CreateData",true);
    getModels.refresh(true);
    this.TableBindingMethod(GetMonthIndex, this.getView().byId("UiTable"), months); // create the table binding

}else{
    sap.m.MessageToast.show("please input field....");
}
              },
        TableBindingMethod(data, oUiTable, month) {
            debugger
            oUiTable.removeAllColumns();
            columss = new sap.ui.table.Column({
                width: "8em",
                label: new sap.m.Text({ text: "Project Name" }),
                template: new sap.m.Text({ text: "{TableCalendarSelect>ProjectName}" }),
            });
            oUiTable.addColumn(columss);
            data.forEach((item, i) => {
                let day = 1;
                while (day <= item.lastDay) {
                    columss = new sap.ui.table.Column({
                        width: "6em",
                        headerSpan: item.lastDay,
                        multiLabels: [
                            new sap.m.Text({ text: month[item.month] + ' ' + item.year }),
                            new sap.m.Text({ text: day }),
                        ],
                        template: new sap.m.Button({fieldGroupIds:'{TableCalendarSelect>FT' + item.year + day + item.month + '}'+'|'+'{TableCalendarSelect>fullDay' + item.year + day + item.month + '}',
                            type: {
                            parts: [
                                { path: "TableCalendarSelect>fullDay" + item.year + day + item.month }, // 'current day'
                                { path: "TableCalendarSelect>" }   // get current object
                            ],
                            formatter: this.typeFormatter.bind(this), 
                        },enabled:"{= ${TableCalendarSelect>UserRole} === ${TableCalendarSelect>/UserLogin}}", visible: "{= ${TableCalendarSelect>fullDay" + item.year + day + item.month + "} ? true : false }", press: this.UiButtonHandler.bind(this) }),
                        //if user 1 is selected then is enabled true otherwise false if login user 2 then is enabled second row is editable true
                    });
                    oUiTable.addColumn(columss);
                    day += 1;
                }

            })
            oUiTable.bindRows("TableCalendarSelect>/dayTable");
        },
        getDateRange(from, to) {
            const fromDate = new Date(...from.split("-").map(Number)); // Start date
            const toDate = new Date(...to.split("-").map(Number));     // End date
            const dateArray = [];
        
            // Loop through all dates
            while (fromDate <= toDate) {
                // Format the date as YYYY-MM-DD
                const formattedDate = [
                    fromDate.getFullYear(),
                    String(fromDate.getMonth() + 1).padStart(2, "0"), // Month is 0-indexed
                    String(fromDate.getDate()).padStart(2, "0")
                ].join("-");
                dateArray.push(formattedDate);
        
                // Increment the date by 1 day
                fromDate.setDate(fromDate.getDate() + 1);
            }
        
            return dateArray;
        },
        typeFormatter(data,s){
            if(s?.setFrom){
                let dat = data?.split("-");
                if (dat) {
                    let fromDate = new Date(...s.setFrom.split("-").map(Number),'1','12','11').getTime();
                    let toDate = new Date(...s.setTo.split("-").map(Number),'1','12','11').getTime();
                    let date = new Date(...dat.map(Number),'1','12','11').getTime();
                    var range = this.getDateRange(s.setFrom,s.setTo);
                    if(date>=fromDate && date<=toDate){
                        if(range.length <=5){
                            return 'Accept';
                        }else if(range.length <=10){
                            return 'Reject';
                        }else if(range.length >=10){ 
                            return 'Emphasized';
                        }
                    }
                   
                }
                    
            }
                     
        // }  
            
            return 'Default';
        },
        ValidationsAllInput(source){
            let bool=false;
            let count=1;
            source.forEach(item=>{
                if(item.getValue().trim() == "" ){
                    item.setValueState("Error");
                    count--;
                }else{
                    item.setValueState("None");
    count++;
                }
            })
            if(count ==4){
                bool = true;
            }else{
                bool = false;
            }
            return bool;
        }
    })

})
