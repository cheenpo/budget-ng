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