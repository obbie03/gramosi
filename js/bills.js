
$('#submitPay').click(function(){
  $(this).attr('disabled', true)

  if($('#recAmount').val().length == 0){
    client.ourAlert('Please ensure to enter amount')
    return
  }

  var data = {
    billID:$('#iid').val(),
    recUser:client.uid,
    recAmount:$('#recAmount').val(),
    recDesc:$('#recDesc').val()
  }
  client.postData(client.baseUrl+'/reciepts.php', data, (response)=>{
      if(response.status == 'done'){
          client.ourAlert('Successully added', 1)
          client.populate_bills_rows()
          $('#recAmount').val('')
          $('#recDesc').val('')
          $('.showBill').css('visibility', 'hidden')

      }else{
        client.ourAlert('Something went wrong', 2)
      }
      $(this).attr('disabled', false)
  })
})
   
function selCust(id, name){
  $('#custDet').html(name)
  $('#uniId').slideDown()
  $('#custIdzz').val(id)
  $('.custNameResp').slideUp()
}
 
$('#custName').keyup(function(){
$('.custNameResp').slideDown()
var name = $(this).val()
var out = ``
$.getJSON(client.baseUrl+'/general.php?custName='+name, (response)=>{
    response.map((res)=>{
        out += `<button class="btn w-100" title="${res.u_id}" id="${res.firstname} ${res.lastname}: ${res.account_no}" onclick="selCust(this.title, this.id)">${res.firstname} ${res.lastname}: ${res.account_no}</button><br>`
    })
    $('.custNameResp').html(out)
})
})

  $('#sof').html(client.makeSels(client.sof, 'source of funds', 0, 2))
  $('#banks').html(client.makeSels(client.banks, 'cash book', 0, 4))
  $('#colce').html(client.makeSels(client.cc, 'collection center', 0, 1))


function disArr(arr){
  var out = `
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sno.</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
          <th scope="col" class="relative px-6 py-3"></th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
  `;
  var count = 0;
  var total = 0.0;
  arr.map((res) => {
    count++;
    out += `
      <tr>
        <td class="px-6 py-4 whitespace-nowrap">${count}</td>
        <td class="px-6 py-4 whitespace-nowrap">${res.actDesc}</td>
        <td class="px-6 py-4 whitespace-nowrap">${res.amount}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <i onclick="deletearr(this.title)" title="${count}" class="fa fa-trash text-danger cursor-pointer"></i>
        </td>
      </tr>
    `;
    total += parseFloat(res.amount);
  });
  out += `
      <tr>
        <td colspan="2" class="px-6 py-3 text-right text-sm font-medium text-gray-900">Total</td>
        <td class="px-6 py-3 text-left text-sm text-gray-900">${total}</td>
        <td class="px-6 py-3"></td>
      </tr>
      </tbody>
    </table>
  `;
  return out;
};


var arr = []
var finOut = ''
function addToList(){
  var cashbook = $('#banks').val()
  var sof = $('#sof').val()
  var cc = $('#colce').val()
  var amount = $('#amount').val()
  var desc = $('#desc').val()
  var act = $('#codeResp').text().split('~')[2]
  var actDesc = $('#codeResp').text().split('~')[0]
  var data = {
      amount:amount,
      act:act,
      actDesc:actDesc
  }
  arr.push(data)
   var out = disArr(arr)
  $('#listOfPay').html(out)
finOut = out
if(arr.length > 0){
  $('#submitBtn').prop('disabled', false)
}
$('#amount').val()
}

function deletearr(index){
  arr.splice(index-1,1)
  var out = disArr(arr)
  $('#listOfPay').html(out)
finOut = out
if(arr.length > 0){
  $('#submitBtn').prop('disabled', false)
}
$('#amount').val()
}
$('#uniId').keyup(function(){
  var val = $(this).val()
  if(val.length == 6){
      $.getJSON(client.baseUrl+'/general.php?uniqueId='+val,(response)=>{
          if(response.length > 0){
            console.log(response)
              var out =`${response[0].name}~${response[0].account}~${response[0].id}`
              $('#codeResp').html(out)
              $('#codeRespDiv').html(response[0].name)
              $('#Prog').html(response[0].programme)
              $('#codeResp').slideDown()
              $('#form').slideDown()
          }else{
            client.ourAlert('Code entered is not valid', 2)
              $('#codeResp').slideUp()
              $('#form').slideUp()
          }
      })
  }
})

$('#submitBtn').click(function(){ 
  $(this).prop('disabled', true)

  if(arr.length == 0){
      client.ourAlert('Please ensure activity',2)
      $(this).prop('disabled', false)
      return
  }
  if($('#sof').val().length == 0 || $('#colce').val().length == 0 || $('#banks').val().length == 0){
    $(this).prop('disabled', false)
    client.ourAlert('Please fill in all fields',2)
    return
  }
  var toSend = {
    uidsingle:client.uid,
    data:arr,
    custID:$('#custIdzz').val(),
    // sof:$('#sof').val(),
    // cc:$('#colce').val(),
    // bank:$('#banks').val()
    sof:1,
    cc:21,
    bank:2
  }
  client.postData(client.baseUrl+'/bills.php', toSend, (response)=>{
      if(response.status = 'done'){
        client.ourAlert('Successfully added', 1);
        client.populate_bills_rows()
          arr = []
          var out = disArr(arr)
          $('#listOfPay').html(out)
          $('#recModo').fadeIn()
          // $('#finOut').html(finOut)
          // $('#recNum').html(`No:${response.data}`)
          // $('#dateRec').html(`Date:${today()}`)
          // $('#custZina').html(`Customer:${$('#custDet').html().split('-')[0]}`)
          $('.billModal').css('visibility', 'hidden')
      }else{
        client.ourAlert('Something went wrong',2);
      }
      $(this).prop('disabled', false)
  })
})



/////////////////////////receipts////////////////////


function getCash(){
  $.getJSON(client.baseUrl+'/cash.php?cash', (response)=>{
      var cash = client.mergeArr(response.expenses, response.payments).sort((a,b)=> new Date(a.date) - new Date(b.date))
      var out = ``
      var debs = 0.0
      var creds = 0.0
      var count = 1
      cash.map((res)=>{
          debs += res.coa_id == undefined || res.type == 'income'?parseFloat(res.amount):0
          creds += res.type!=undefined && res.type == 'expense'?parseFloat(res.amount):0
          out += ` <div class="w-full tr grid grid-cols-16 h-[60px] border-b text-slate-700 gap-x-4">
              <span class="row_object hidden" row="${JSON.stringify(res)}"></span>
              <div class="th flex items-center justify-center h-full w-full col-span-1">
                  <input type="checkbox" name="" id="" class="accent-default">
              </div>
              <div class="th flex items-center h-full w-full col-span-1">
                  <div class="flex items-center justify-center bg-default rounded-full text-white w-5 h-5 font-bold"> ${count++}</div>
              </div>
              <div class="th flex items-center h-full w-full col-span-2">${res.cheque}</div>
              <div class="th flex items-center h-full w-full col-span-2">${res.date.substring(0,10)}</div>
              <div class="th flex items-center h-full w-full col-span-2">${res.description}</div>
              <div class="th flex items-center h-full w-full col-span-2">${client.format_amount(res.coa_id == undefined || res.type == 'income'?parseFloat(res.amount):0)}</div>
              <div class="th flex items-center h-full w-full col-span-2">${client.format_amount(res.type!=undefined && res.type == 'expense'?parseFloat(res.amount):0)}</div>
              <div class="th flex items-center h-full w-full col-span-2">
                  <button
                  title="${res.id}" id="${res.chq}"
                      class="wanaShowBill flex items-center justify-center border border-gray-300 w-full h-[30px] rounded-md text-[12px]">
                      <i class="fa fa-eye mr-2" aria-hidden="true"></i>
                      View
                  </button>
              </div>
          </div>`
      })
      $('.bills_rows').html(out)
      $('.total_bill_rows').text(count)
      $('.total_bill_outstanding').text(client.format_amount(debs))
      $('.total_bill_paying').text(client.format_amount(creds))
      $('.total_bill_cash').text(client.format_amount(debs-creds))
  })
}
getCash()
var jets = '<option value="">Select budget</option>'
client.budget.map((res) => {
jets += `<option value="${res.id}">${res.subprogram}: ${client.useWanted(client.dept, res.dept)?.name}: ${client.useWanted(client.coa, res.coa)?.account}: ${res.toy}</option>`
})
$('#budget').html(jets)
$('#cashBook').html(client.makeSels(client.banks, 'cashbook', 'id', 'name'))
$('#cashSof').html(client.makeSels(client.sof, 'source of fund', 'id', 'name'))
$('#budget').change(function(){
var coa = client.budget.filter(a=>a.id == $(this).val())[0].coa
var acc = client.useWanted(client.coa, coa)?.account
if(parseInt(acc[0]) == 1){
  var cust = '<option value="">Select customer</option>'
  client.cust.map((res) => {
  cust += `<option value="${res.id}">${res.firstname} ${res.lastname}</option>`
      })
  $('#Expaye').html(cust)
  $('#cashType').val('income')
}else{
  $('#Expaye').html(client.makeSels(client.suppliers, 'supplier', 'id', 'name'))

  $('#cashType').val('expense')
}
$.getJSON(client.baseUrl + '/cash.php?proj=' + $(this).val(), (response) => {
  $('#exType').html(client.makeSels(response, 'project', 'id', 'name'))
})
})
$('#submitPayBtn').click(function(e){
e.preventDefault()
$(this).prop('disabled', true)
if($('#exType').val().length == 0 || $('#Examount').val().length == 0 || $('#cashType').val().length == 0 || $('#Expaye').val().length == 0 
|| $('#cashBook').val().length == 0
|| $('#cashSof').val().length == 0
|| $('#chequeno').val().length == 0
){
  ourAlert('Ensure to enter required fields',2)
  return
}
var data = {
  exType:$('#exType').val(),
  Examount:$('#Examount').val(),
  Exdesc:$('#Exdesc').val(),
  cashType:$('#cashType').val(),
  Expaye:$('#Expaye').val(),
  cashBook:$('#cashBook').val(),
  chequeno:$('#chequeno').val(),
  cashSof:$('#cashSof').val(),
  exDate:$('#exDate').val()
}
client.postData(client.baseUrl+'/cash.php', data, (response)=>{
  if(response.status == 200){
      client.ourAlert(response.msg, 1)
      $('#exType').val('')
      $('#Examount').val('')
      $('#Exdesc').val('')
      $('#cashType').val('')
      $('#Expaye').val('')
      getCash()
  }else{
      client.ourAlert(response.msg, 2)
  }
  $(this).prop('disabled', false)
})  
})



///////////////////////////budgeting/////////////////////////////////
var budId = 0
$('#projhead').html(client.makeSels(client.project, 'project head', 'id', 'name'))
$('#projhead').change(function(){
    var id = $(this).val()
    $('#projsub').html(client.makeSels(client.sub.filter(a=>a.pid == id), 'project sub', 'id', 'name')) 
})
$('#submitBudBtn').click(function(){
    if($('#projname').val().length == 0 || $('#projdesc').val().length == 0 || $('#projamount').val().length == 0 || $('#projsub').val().length == 0){
        client.ourAlert('Fill in all fields', 2)
        return
    }  
    var data = {
        budId:budId,
        projname:$('#projname').val(),
        projdesc:$('#projdesc').val(),
        projamount:$('#projamount').val(),
        projsub:$('#projsub').val()
    }
    client.postData(client.baseUrl+'/cash.php', data, (response)=>{
        if(response.status == 200){
            client.ourAlert('Successful', 1)
            $('#projname').val(''),
            $('#projdesc').val(''),
            $('#projamount').val('  ')
            $('.budgetModal').css('visibility', 'hidden')
        }else{
            client.ourAlert('Something went wrong', 2)
        }
    })
})
function viewBudget(id){
    budId = id
    $('.budgetModal').css('visibility', 'visible')
    var res = client.budget.filter(a=>a.id == id)[0]
        var out = `<div class="bg-white rounded-lg shadow-md p-4">
                <h2 class="text-2xl font-semibold mb-4">Details</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-start">
                        <div class="w-1/3 font-semibold">Amount:</div>
                        <div class="w-2/3">${client.format_amount(parseFloat(res.amount))}</div>
                    </div>
                    <div class="flex items-start">
                        <div class="w-1/3 font-semibold">COA:</div>
                        <div class="w-2/3">${client.useWanted(client.coa, res.coa)?.name}</div>
                    </div>
                    <div class="flex items-start">
                        <div class="w-1/3 font-semibold">Department:</div>
                        <div class="w-2/3">${client.useWanted(client.dept, res.dept)?.name}</div>
                    </div>
                    <div class="flex items-start">
                        <div class="w-1/3 font-semibold">Program:</div>
                        <div class="w-2/3">${client.useWanted(client.prog, res.program)?.name.substring(0, 40)}</div>
                    </div>
                    <div class="flex items-start">
                        <div class="w-1/3 font-semibold">Sub Program:</div>
                        <div class="w-2/3">${res.subprogram}</div>
                    </div>
                    <div class="flex items-start">
                        <div class="w-1/3 font-semibold">TOY:</div>
                        <div class="w-2/3">${res.toy}</div>
                    </div>
                </div>
            </div>
                `
                var table = `
<table class="table-auto w-full">
<thead>
  <tr>
    <th class="px-4 py-2">Sno</th>
    <th class="px-4 py-2">Head</th>
    <th class="px-4 py-2">Sub</th>
    <th class="px-4 py-2">Name</th>
    <th class="px-4 py-2">Description</th>
    <th class="px-4 py-2">Amount</th>
  </tr>
</thead>
<tbody>
`;
    $.getJSON(client.baseUrl + '/cash.php?proj=' + id, (response) => {
    response.forEach((res, index) => {
        table += `
        <tr>
            <td class="border px-4 py-2">${index + 1}</td>
            <td class="border px-4 py-2">${client.useWanted(client.project ,client.sub.filter(a=>a.id == res.head)[0].pid)?.name}</td>
            <td class="border px-4 py-2">${client.useWanted(client.sub, res.head)?.name}</td>
            <td class="border px-4 py-2">${res.name}</td>
            <td class="border px-4 py-2">${res.description}</td>
            <td class="border px-4 py-2">${client.format_amount(parseFloat(res.amount))}</td>
        </tr>
        `;
    });
    const totalAmount = client.sumOfArray(response.map((res) => parseFloat(res.amount)));
    table += `
        </tbody>
        <tfoot>
        <tr>
            <th class="border px-4 py-2" colspan="5">Total</th>
            <th class="border px-4 py-2">${client.format_amount(totalAmount)}</th>
        </tr>
        </tfoot>
    </table>`;
    $('#budDetails').html(out+table)
    });
}
var out = ``

client.budget.map((res, i)=>{
       out += `<div class="w-full tr grid grid-cols-16 h-[50px] border-b text-[13px] gap-x-4">
                        <span class="row_object hidden" row='${JSON.stringify(res)}'></span>
                            <div class="th flex items-center justify-start justify-center h-full w-full">
                                <input type="checkbox" name="" id="all_bills_selector" class="accent-default ml-3">
                            </div>
                            <div class="th flex items-center h-full w-full col-span-1">${i+1}</div>
                            <div class="th flex items-center h-full w-full col-span-2">${client.useWanted(client.dept, res.dept)?.name}</div>
                            <div class="th flex items-center h-full w-full col-span-2">${client.useWanted(client.coa, res.coa)?.name}</div>
                            <div class="th flex items-center h-full w-full col-span-2">${client.useWanted(client.prog, res.program)?.name.substring(0,40)}</div>
                            <div class="th flex items-center h-full w-full col-span-2">${client.format_amount(parseFloat(res.amount))}</div>
                            <div class="th flex items-center h-full w-full col-span-2">${res.toy.substring(0,40)}</div>
                            <div class="th flex items-center h-full w-full col-span-2 w-full">
                                <button onclick="viewBudget(this.title)" title="${res.id}" class="view-customer text-[12px] w-[150px] h-[30px] border rounded-md flex items-center justify-center">
                                    <i class="fa fa-eye mr-2" aria-hidden="true"></i>
                                    View
                                </button>
                            </div>
                        </div>`
})
$('.budget_rows').html(out)
$('.total_budget_rows').html(client.budget.length)
// $('.total_budget_amount').html(client.format_amount(client.sumOfArray(client.budget.map(res=>parseFloat(res.amount)))))
// out += `<div class="w-full tr grid grid-cols-16 h-[50px] border-b text-[13px] gap-x-4">
//                         <span class="row_object hidden" row='${JSON.stringify(res)}'></span>
//                             <div class="th flex items-center justify-start justify-center h-full w-full">
//                                 <input type="checkbox" name="" id="all_bills_selector" class="accent-default ml-3">
//                             </div>
//                             <div class="th flex items-center h-full w-full col-span-1">${i+1}</div>
//                             <div class="th flex items-center h-full w-full col-span-2">${client.useWanted(client.dept, res.dept)?.name}</div>
//                             <div class="th flex items-center h-full w-full col-span-2">${client.useWanted(client.coa, res.coa)?.name}</div>
//                             <div class="th flex items-center h-full w-full col-span-2">${client.useWanted(client.prog, res.program)?.name.substring(0,40)}</div>
//                             <div class="th flex items-center h-full w-full col-span-2">${client.format_amount(parseFloat(res.amount))}</div>
//                             <div class="th flex items-center h-full w-full col-span-2">${res.toy.substring(0,40)}</div>
//                             <div class="th flex items-center h-full w-full col-span-2 w-full">
//                                 <button class="view-customer text-[12px] w-[150px] h-[30px] border rounded-md flex items-center justify-center">
//                                     <i class="fa fa-eye mr-2" aria-hidden="true"></i>
//                                     View
//                                 </button>
//                             </div>
//                         </div>`

