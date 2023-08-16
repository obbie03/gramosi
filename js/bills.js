
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
        out += `<button class="btn w-100" title="${res.u_id}" id="${res.firstname} ${res.lastname}: ${res.nrc}" onclick="selCust(this.title, this.id)">${res.firstname} ${res.lastname}: ${res.nrc}</button><br>`
    })
    $('.custNameResp').html(out)
})
})

  $('#sof').html(client.makeSels(client.sof, 'source of funds', 0, 2))
  $('#banks').html(client.makeSels(client.banks, 'cash book', 0, 3))
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
    sof:$('#sof').val(),
    cc:$('#colce').val(),
    bank:$('#banks').val()
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

