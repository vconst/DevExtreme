import React from 'react';
import DataGrid from '../artifacts/react/renovation/data_grid/data_grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = "https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi";
const store = createStore({
  key: "OrderID",
  loadUrl: url + "/Orders",
  insertUrl: url + "/InsertOrder",
  updateUrl: url + "/UpdateOrder",
  deleteUrl: url + "/DeleteOrder",
  onBeforeSend: function(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  }
});
const columns = [{
        dataField: "CustomerID",
        caption: "Customer",
        validationRules: [{
            type: "stringLength",
            message: "The field Customer must be a string with a maximum length of 5.",
            max: 5
        }],
        lookup: {
            dataSource: { store: createStore({
                key: "Value",
                loadUrl: url + "/CustomersLookup",
                onBeforeSend: function(method, ajaxOptions) {
                    ajaxOptions.xhrFields = { withCredentials: true };
                }
            })},
            valueExpr: "Value",
            displayExpr: "Text"
        }
    }, {
        dataField: "OrderDate",
        dataType: "date",
        validationRules: [{
            type: "required",
            message: "The OrderDate field is required."
        }]
    }, {
        dataField: "Freight",
        headerFilter: {
            groupInterval: 100
        },
        validationRules: [{
            type: "range",
            message: "The field Freight must be between 0 and 2000.",
            min: 0,
            max: 2000
        }]
    }, {
        dataField: "ShipCountry",
        validationRules: [{
            type: "stringLength",
            message: "The field ShipCountry must be a string with a maximum length of 15.",
            max: 15
        }]
    }, {
        dataField: "ShipVia",
        caption: "Shipping Company",
        dataType: "number",
        lookup: {
            dataSource: { store: createStore({
                key: "Value",
                loadUrl: url + "/ShippersLookup",
                onBeforeSend: function(method, ajaxOptions) {
                    ajaxOptions.xhrFields = { withCredentials: true };
                }
            })},
            valueExpr: "Value",
            displayExpr: "Text"
        }
    }
];

export default function pagerExample() {
  return (
    <DataGrid
      export={{ enabled: false }}
      showBorders={true}
      pager={{ visible: true, showInfo: true }}
      dataSource={{ store }}
      remoteOperations={true}
      columns={columns}
    >
    </DataGrid>
  )
}
