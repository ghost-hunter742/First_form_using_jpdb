/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
//fixed variables
const conToken = "90935135|-31949240930407636|90903745";
const empDBName = "form1";
const relName = "employee";
const jpdbBaseUrl = "http://api.login2explore.com:5577";
const jpdbIml = "/api/iml";
const jpdbIrl = "/api/irl";

function executeCommandAtGivenBaseUrl(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        jsonObj = JSON.parse(result.responseText);
    });
    return jsonObj;
}

function createPUTRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = "{\n"
            + "\"token\" : \""
            + connToken
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"PUT\",\n"
            + "\"rel\" : \""
            + relName + "\","
            + "\"jsonStr\": \n"
            + jsonObj
            + "\n"
            + "}";
    return putRequest;
}

function createUpdateRequest(connToken, jsonObj, dbName, relName, recordNo) {
    var updateRequest = "{\n"
        + "\"token\" : \"" + connToken + "\","
        + "\"dbName\": \"" + dbName + "\",\n"
        + "\"cmd\" : \"UPDATE\",\n"
        + "\"rel\" : \"" + relName + "\","
        + "\"jsonStr\": {"
        + "\"" + recordNo + "\": "
        + jsonObj
        + "}"
        + "\n}";
    return updateRequest;
}

function createGetByKeyRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = "{\n"
            + "\"token\" : \""
            + connToken
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"GET_BY_KEY\",\n"
            + "\"rel\" : \""
            + relName + "\","
            + "\"jsonStr\": \n"
            + jsonObj
            + "\n"
            + "}";
    return putRequest;
}


function resetForm() {
    $("#empId").val("");
    $("#empName").val("");
    $("#basicSalary").val("");
    $("#hra").val("");
    $("#da").val("");
    $("#deduction").val("");
    $("#empId").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#empId").focus();
}

// create json object (basically actual data
function getEmpIdAsJsonObject() {
    let empId = $("#empId").val();
    if (empId === "") {
        alert("Employee Id missing");
        $("#empId").focus();
        return "";
    }
    let jsonObjIdVal = {
        "id": empId
    };
    return JSON.stringify(jsonObjIdVal);
}

function validateData() {
    let empId, empName, empSal, hra, da, deduct;
    empId = $("#empId").val();
    empName = $("#empName").val();
    empSal = $("#basicSalary").val();
    hra = $("#hra").val();
    da = $("#da").val();
    deduct = $("#deduction").val();
    if (empId === "") {
        alert("Employee Id missing");
        $("#empId").focus();
        return "";
    }
    if (empName === "") {
        alert("Employee Name missing");
        $("#empName").focus();
        return "";
    }
    if (empSal === "") {
        alert("Employee salary missing");
        $("#basicSalary").focus();
        return "";
    }
    if (hra === "") {
        alert("HRA missing");
        $("#hra").focus();
        return "";
    }
    if (da === "") {
        alert("DA missing");
        $("#da").focus();
        return "";
    }
    if (deduct === "") {
        alert("Deduction missing");
        $("#deduction").focus();
        return "";
    }
    let jsonStrObjVal = {
        "id": empId,
        "name": empName,
        "salary": empSal,
        "hra": hra,
        "da": da,
        "deduction": deduct
    };
    return JSON.stringify(jsonStrObjVal);
    //remains
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(conToken, jsonStrObj, empDBName, relName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseUrl, jpdbIml);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#empId").focus();
}

function saveRecNo2LS(jsonObj) {
    let lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}
function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    let data_obj = JSON.parse(jsonObj.data).record;
    $("#empId").val(data_obj.id);
    $("#empName").val(data_obj.name);
    $("#basicSalary").val(data_obj.salary);
    $("#hra").val(data_obj.hra);
    $("#da").val(data_obj.da);
    $("#deduction").val(data_obj.deduction);
}

function changeData() {
    $("#change").prop("disabled", true);
    let jsonChng = validateData();
    if (jsonChng === "") {
        $("#change").prop("disabled", false);
        return "";
    }
    var updateRequest = createUpdateRequest(conToken, jsonChng, empDBName, relName,localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseUrl, jpdbIml);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#empId").focus();
}

function getEmp() {
    let empIdJsonObj = getEmpIdAsJsonObject();
    if (empIdJsonObj === "") {
        return "";
    }
    let getRequest = createGetByKeyRequest(conToken, empIdJsonObj, empDBName, relName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIrl);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#empName").focus();
    } else if (resJsonObj.status === 200) {
        $("#empId").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#empName").focus();
    }
}
