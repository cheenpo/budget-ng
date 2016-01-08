// globals
var macro_plot = null;
// functions
function togglePlot(plot, label) {
 var someData = plot.getData();
 for(var i=0; i < someData.length; i++) {
  if(label == someData[i].label) {
    someData.splice(i, 1);
  }
 }
 plot.setData(someData);
 plot.setupGrid();
 plot.draw();
}

function showTransactionDetail(hash) {
 populateModal(hash);
 showModal();
}

function populateModal(hash) {
 document.getElementById("myModalTitle").innerHTML = "details around transaction <small>"+hash+"</small>";
 $.getJSON("/transactions/api/?hash="+hash, function(data) {
  var trx = data.transactions[0];
  var result="";
  result += "<h2 style='display:inline;'>date: <small>"+trx.year+"-"+trx.month+"-"+trx.day+"</small></h2>";
  result += "<br />";
  result += "<h2 style='display:inline;'>amount: <small>"+trx.amount+"</small></h2>";
  result += "<br />";
  result += "<h2 style='display:inline;'>macro: <small>"+trx.macro+"</small></h2>";
  result += "<br />";
  result += "<h2 style='display:inline;'>micro: <small>"+trx.micro+"</small></h2>";
  result += "<br />";
  result += "<h2 style='display:inline;'>account: <small>"+trx.account+"</small></h2>";
  result += "<br />";
  result += "<h2 style='display:inline;'>description: <small>"+trx.description+"</small></h2>";
  result += "<br />";
  if(trx.ignore) {
   result += "<h2 style='display:inline;'>ignore: <small>true</small></h2>";
  } else {
   result += "<h2 style='display:inline;'>ignore: <small>false</small></h2>";
  }
  result += "<br />";
  result += "<h2 style='display:inline;'>hash: <small>"+trx.hash+"</small></h2>";
  result += "<br />";
  result += "<br />";
  document.getElementById("myModalBody").innerHTML = result;
 });
}

function showModal() {
 $("#myModal").modal("show");
}

function ignoreTransaction(hash, ignore) {
 $.ajax({
  url: "/transactions/api/?hash="+hash+"&ignore="+ignore,
  type: "PUT",
  success: function(data) {
   location.reload();
  }
 });
}

function populateDropDown(ul,where) {
 $.ajax({
  url: "/api/months",
  success: function(json) {
   for(var i=0; i<json.length; i++) {
    var entry = json[i];
    $("#"+ul+" ul").append("<li><a href='/"+where+"/?year="+entry.year+"&month="+entry.month+"'>"+entry.year+" - "+entry.monthName+"</a></li>");
   }
  }
 });
}

function formatAmountStyle(amount) {
 var color = "";
 if(amount >= 0) {
  color = "53D769";
 } else {
  color = "FC3D39";
 }
 return "text-align: right; position:relative; right:5px; color: #"+color;
}
function formatAmount(amount) {
 return "$"+Math.abs(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
