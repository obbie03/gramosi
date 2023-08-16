class Client {
    constructor() {
        this.configur_tailwind()
        this.enable_nav_menu_controllers()
        this.total_rows = 0
        this.total_checked_rows = 0
        this.total_unpaid = 0
        this.total_paying = 0
        this.sof = []
        this.banks = []
        this.cc = []
        this.coa = []
        this.baseUrl = 'http://localhost/gramosiBackend'
        this.uid = 1
        this.init_print_format()
    }


    format_amount = (amount, decimals = 2, currency = 'ZMW') => {
        return new Intl.NumberFormat(currency, {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: decimals
        }).format(amount)
    }
    convert_date = (dateString) => {
        var today = new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).split(' ')
        return `${today[0]} ${today[1]}, ${today[2]}`
    }

    configur_tailwind() {
        tailwind.config = {
            theme: {
                extend: {
                    gridTemplateColumns: {
                        '16': 'repeat(16, minmax(0, 1fr))',
                        '17': 'repeat(17, minmax(0, 1fr))',
                    },
                    colors: {
                        default: '#151030',
                        defaulthover: '#1f1847',
                        lightgray: '#eeeeee'
                    },
                    boxShadow: {
                        default: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
                        lighter: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px'
                    }
                }
            }
        }
    }
    // side-bar navigation menu handler
    enable_nav_menu_controllers() {
        $('.nav-menu').click((e) => {
            e.preventDefault();
            $('.nav-menu').parent('a').removeClass('active')
            $(e.target).parent('a').addClass('active')
            this.fetch_page_content()
        })
        this.fetch_page_content()
    }

    //bulk billings
    bulkBilling = ()=>{
        $.getJSON(client.baseUrl+'/bills.php?bulkbills='+1, (response)=>{
            if(response.status == 'done'){
                client.ourAlert('Successful', 1)
            }else{
                client.ourAlert('Something went wrong', 2)
            }
        })
    }

    //show bill
    showBill = (id, amount)=>{
        $('#indet').html(client.loader)
        $('#iid').val(id)
        $('.showBill').css('visibility', 'visible')
        $.getJSON(client.baseUrl+'/bills.php?bill='+id, (response)=>{
                var bill = response.bills
                var recs = response.recs
                var out = `<span class="float-right"> <img class="w-[70px] h-[70px] object-contain mr-2" src = '../img/logo.png'> ${bill[0].date.substring(0,10)}</span>
                <table class="table border-collapse mb-3">
                            <tr>
                                <th class="px-4 py-2 bg-gray-100 border text-left">Customer</th>
                                <td class="px-4 py-2 border">${bill[0].firstname} ${bill[0].lastname}</td>
                            </tr>
                            <tr>
                                <th class="px-4 py-2 bg-gray-100 border text-left">Invoice_no</th>
                                <td class="px-4 py-2 border">${bill[0].invoice_no}</td>
                            </tr>
                            <tr>
                                <th class="px-4 py-2 bg-gray-100 border text-left">Source of fund</th>
                                <td class="px-4 py-2 border">${client.useWanted(client.sof, bill[0].cc_id).source_of_fund}</td>
                            </tr>
                            <tr>
                                <th class="px-4 py-2 bg-gray-100 border text-left">Collection Center</th>
                                <td class="px-4 py-2 border">${client.useWanted(client.cc, bill[0].cc_id).collection_name}</td>
                            </tr>
                            <tr>
                                <th class="px-4 py-2 bg-gray-100 border text-left">Outstanding Balance</th>
                                <td class="px-4 py-2 border">${client.format_amount(amount)}</td>
                            </tr>
                        </table>
                              
                              <table class="table border-collapse w-full">
                    <tr>
                        <th class="px-4 py-2 bg-gray-100 border">Sno</th>
                        <th class="px-4 py-2 bg-gray-100 border">COA</th>
                        <th class="px-4 py-2 bg-gray-100 border">Description</th>
                        <th class="px-4 py-2 bg-gray-100 border">Amount</th>
                    </tr>
                    `
                    var count = 1
                    bill.map((res)=>{
                        out += `<tr class="${count % 2 === 0 ? 'bg-gray-100' : 'bg-white'}">
                            <td class="px-4 py-2 border">${count++}</td>
                            <td class="px-4 py-2 border">${client.useWanted(client.coa, res.coa_id).name}</td>
                            <td class="px-4 py-2 border">${res.description}</td>
                            <td class="px-4 py-2 border">${client.format_amount(res.amount)}</td>
                        </tr>`
                    })
                    out += `<tr>
                        <th class="px-4 py-2 bg-gray-100 border" colspan="3">Total</th>
                        <th class="px-4 py-2 bg-gray-100 border">${client.format_amount(client.sumOfArray(bill.map((res)=>parseFloat(res.amount))))}</th>
                    </tr>
                </table>
                <table class="table border-collapse w-full mt-3">
                    <tr>
                        <th class="px-4 py-2 bg-gray-100 border">Sno</th>
                        <th class="px-4 py-2 bg-gray-100 border">Receipt_no</th>
                        <th class="px-4 py-2 bg-gray-100 border">Description</th>
                        <th class="px-4 py-2 bg-gray-100 border">Date</th>
                        <th class="px-4 py-2 bg-gray-100 border">Amount</th>
                    </tr>
                    `
                    var count = 1
                    recs.map((res)=>{
                        out += `<tr class="${count % 2 === 0 ? 'bg-gray-100' : 'bg-white'}">
                            <td class="px-4 py-2 border">${count++}</td>
                            <td class="px-4 py-2 border">${res.receipt_no}</td>
                            <td class="px-4 py-2 border">${res.description}</td>
                            <td class="px-4 py-2 border">${res.date.substring(0,10)}</td>
                            <td class="px-4 py-2 border">${client.format_amount(res.amount)}</td>
                        </tr>`
                    })
                    out += `<tr>
                        <th class="px-4 py-2 bg-gray-100 border" colspan="4">Total</th>
                        <th class="px-4 py-2 bg-gray-100 border">${client.format_amount(client.sumOfArray(recs.map((res)=>parseFloat(res.amount))))}</th>
                    </tr>
                </table>
                `
                $('#indet').html(out)
            })
    }

        // initialize dashboard
        init_dashboard() {
            const cls = this
            $('.as-at').html(`As At ${new Date().toUTCString()}`)
            this.fetch_data(this.baseUrl + '/bills.php?bills=1').then(resolve => {
                if (resolve?.data?.length > 0) {
                    let total = 0, count = 0
                    $('.outstanding-body').empty() && resolve.data.map((bill, i) => {
                        total += parseFloat(bill.amount)
                        count += 1
                        $('.outstanding-body').append(`
                            <div class="w-full tr border-b h-[50px] grid grid-cols-9 text-[13px] text-slate-800">
                                <div class="td w-full h-full flex items-center justify-center col-span-1">
                                    <div class="w-[20px] h-[20px] rounded-full bg-default text-white flex items-center justify-center">
                                        ${i + 1}
                                    </div>
                                </div>
                                <div class="td w-full h-full flex items-center col-span-2">${bill.invoice_no}</div>
                                <div class="td w-full h-full flex items-center col-span-2 text-red-700">
                                    ${this.format_amount(bill.amount)}
                                </div>
                                <div class="td w-full h-full flex items-center col-span-2">${this.convert_date(bill.date.split(' ')[0])}</div>
                                <div class="td w-full h-full flex items-center col-span-2">
                                    <button id="${bill.id}" title="${bill.amount}" class="pay-bill w-full h-[30px] bg-gray-200 text-slate-700 rounded-md">Pay</button>
                                </div>
                            </div>
                        `)
                    })
                    $('.overrall-outstanding-total').text(this.format_amount(total))
                    $('.overrall-outstanding-count').text(count)
                    $('.view-all-bills').click(function (e) {
                        e.preventDefault()
                        document.querySelector('.nav-menu-link.bills .nav-menu').click()
                    })
                    $('.view-all-receipts').click(function (e) {
                        e.preventDefault()
                        document.querySelector('.nav-menu-link.receipts .nav-menu').click()
                    })
                    $('.pay-bill').click(function () {
                        document.querySelector('.nav-menu-link.bills .nav-menu').click()
                        var billid = $(this).attr('id')
                        var billamount = $(this).attr('title')
                        setTimeout(() => {
                            // $('.showBill').css('visibility', 'visible')
                            cls.showBill(billid, billamount)
                        }, 2000);
                    })
                }
            })
    
            this.fetch_data(this.baseUrl + '/reciepts.php?receipts').then(resolve => {
                if (resolve?.data?.length > 0) {
                    let total = 0, count = 0
                    $('.receipts-body').empty() && resolve?.data.map((rec, i) => {
                        total += parseFloat(rec.amount)
                        count += 1
                        $('.receipts-body').append(`
                            <div class="w-full tr border-b h-[50px] grid grid-cols-9 text-[13px] text-slate-800">
                                <div class="td w-full h-full flex items-center justify-center col-span-1">
                                    <div
                                        class="w-[20px] h-[20px] rounded-full bg-default text-white flex items-center justify-center">
                                        ${i + 1}</div>
                                </div>
                                <div class="td w-full h-full flex items-center col-span-2">${rec.receipt_no}</div>
                                <div class="td w-full h-full flex items-center col-span-2 text-indigo-900">
                                    ${this.format_amount(rec.amount)}
                                </div>
                                <div class="td w-full h-full flex items-center col-span-2">${this.convert_date(rec.date.split(' ')[0])}</div>
                                <div class="td w-full h-full flex items-center col-span-2">
                                    <button id="${rec.id}" class="w-full print-receipt h-[30px] bg-slate-50 border border-gray-400 text-slate-500 rounded-md">
                                        Print Receipt
                                    </button>
                                </div>
                            </div>
                        `)
                    })
                    $('.receipt-total').text(this.format_amount(total))
                    $('.receipt-count').text(count)
                    $('.print-receipt').click(function () {
                        var newTab = window.open(`/gramosi/client/print_formats/receipt.html?rid=${$(this).attr('id')}`, '_blank');
                        newTab.focus();
                    })
                }
            })
        }

    // initialize the reports page
    init_reports() {
        const cls = this
        cls.enable_report_action_buttons()
        // report navigation menu click
        $('.report-menu').click(function (e) {
            e.preventDefault()
            $('.report-menu').removeClass('active')
            $(this).addClass('active')
            const url = $(this).attr('href')
            cls.fetch_data(url, 'text').then(resolve => {
                if (resolve.status) {
                    $('.report-container').html(resolve.data)
                    if (url.includes('general_ledger')) {
                        cls.fetch_gl_report()
                    }
                    else if (url.includes('trial_balance')) {
                        cls.fetch_tb_report()
                    }
                }
            })
        })
        $('.report-menu.active').click()
    }




    //init_settings page
    init_settings() {
        const cls = this
        
        $('.settings-menu').click(function (e) {
            e.preventDefault()
            $('.settings-menu').removeClass('active')
            $(this).addClass('active')
            const url = $(this).attr('href')
            cls.fetch_data(url, 'text').then(resolve => {
                if (resolve.status) {
                    $('.settings-container').html(resolve.data)
                    if (url.includes('uploads')) {
                        
                    }
                   
                }
            })
        })
        $('.settings-menu.active').click()
    }


    // to neable print and export buttons
    enable_report_action_buttons() {
        const cls = this
        $('.report-action-btn').click(function () {
            cls.export_report()

        })
    }

        // initialize print format
        init_print_format() {
            const cur_url = window.location.href
            if (cur_url.includes('print_formats')) {
                if (cur_url.includes('receipt.html')) {
                    var searchParams = new URLSearchParams(window.location.search);
                    const receipt_id = searchParams.get('rid');
                    if (receipt_id) {
                        this.fetch_data(this.baseUrl + `/reciepts.php?get_receipt=${receipt_id}`).then(resolve => {
                            if (resolve?.data) {
                                const d = resolve?.data
                                console.log(d)
                                $('.customer-names').text(d.customer.code)
                                $('.receipt-body').empty();
                                $('.receipt-body').html(`
                                    <div class="thead w-full grid grid-cols-11 border-b text-black h-[60px]">
                                        <div class="w-full h-full flex items-center col-span-1 justify-center">
                                            <div
                                                class="rounded-full bg-default text-white flex items-center justify-center w-[20px] h-[20px]">
                                                1</div>
                                        </div>
                                        <div class="w-full h-full flex items-center col-span-2 justify-start">${d.bill.invoice_no}</div>
                                        <div class="w-full h-full flex items-center col-span-2 justify-start">${d.receipt.description}</div>
                                        <div class="w-full h-full flex items-center col-span-2 justify-start">${this.format_amount(parseFloat(d.total_amount)).substring(3)}</div>
                                        <div class="w-full h-full flex items-center col-span-2 justify-start">${this.format_amount(parseFloat(d.receipt.amount)).substring(3)}</div>
                                        <div class="w-full h-full flex items-center col-span-2 justify-start">${this.format_amount(parseFloat(d.total_amount) - parseFloat(d.receipt.amount)).substring(3)}</div>
                                    </div>
                                `)
                                $('.total-amount').text(this.format_amount(d.total_amount))
                                $('.total-paid').text(this.format_amount(d.receipt.amount))
                                $('.total-outstanding').text(this.format_amount(parseFloat(d.total_amount) - parseFloat(d.receipt.amount)))
                                setTimeout(() => {
                                    $('.loader').addClass('hidden')
                                    $('.print-content').removeClass('hidden')
                                    window.print()
                                }, 1500);
                            }
                        })
                    }
    
                }
            }
    
        }

//select option
makeSels = (arr, name, key, item) => {
    var out = '<option value="">Select '+name+'</option>'
    arr.map((res) => {
        out += '<option value="' + res[key] + '">' + res[item] + '</option>'
    })
    return out;
}

    // to export the active report
    export_report() {
        const report_table = $(`.${$('.report-menu.active').attr('for')}`)
        const head = report_table.find('.table-head')?.children()
        if (head?.length > 0) {
            let rows = []
            let cols = []
            head.map((_, h) => { cols.push($(h).attr('col')) })
            const body = report_table.find('.tr')
            if (body?.length > 0) {
                body.map((i, r) => {
                    let row = []
                    r && $(r).children().each((_, cell) => {
                        row.push($(cell).attr('val'))
                    })
                    rows.push(row)
                })
                rows.unshift(cols)
                this.export_excel(rows, report_table.attr('title'))
            }
            else {
                alert("This report has no data to export!")
            }
        }
    }
    export_excel(rows, title) {
        const ws = XLSX.utils.aoa_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, title);
        const blob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const link = $('<a>');
        link.attr('href', URL.createObjectURL(blob));
        link.attr('download', `${title}.xlsx`);
        $('body').append(link);
        link[0].click();
        URL.revokeObjectURL(link.attr('href'));
        link.remove();
    }
    export_csv(rows, title) {
        const csvContent = rows.map(r => r.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${title}.csv`;
        document.body.appendChild(link);
        link.click();
    }

    // fetching both html and json data
    async fetch_data(url, content_type = 'json') {
        if (content_type === 'json') {
            return fetch(url).then(resolve => resolve.json()).then(res => {
                return { status: true, data: res }
            }).catch(err => {
                return { status: false, error: err }
            })
        } else {
            return fetch(url).then(resolve => resolve.text()).then(res => {
                return { status: true, data: res }
            }).catch(err => {
                return { status: false, error: err }
            })
        }
    }

    // fetching html 
    async fetch_page_content() {
        const url = $('.nav-menu-link.active').attr('href') || ''
        console.log(url)
        this.fetch_data(url, 'text').then(resolve => {
            if (resolve.status) {
                $('.inner-content').html(resolve.data)
                if (url.includes('dashboard.html')) {
                    this.init_dashboard()
                }
                if (url.includes('bills.html')) {
                    this.populate_bills_rows()
                }
                if (url.includes('./reports/wrapper.html')) {
                    this.init_reports()
                }
                if (url.includes('settings/settings.html')) {
                    this.init_settings()
                }
                
            }
        })
    }
    // fetching general ledger report information
    async fetch_gl_report() {
        return this.fetch_data(this.baseUrl+'/reports.php?gl='+this.uid).then(res => {
            if (res.status) {
                var data = this.mergeArr(res.data.bills, res.data.recs).sort((a,b)=> new Date(a.date) - new Date(b.date))
                let debits = 0, credits = 0
                console.log(data)
                console.log(this.coa)
                data.map((r, i) => {
                    debits += (r[1][0] == 'R'?parseFloat(r.amount):0)
                    credits += (r[1][0] == 'I'?parseFloat(r.amount):0)
                    var balance = debits - credits
                    $('.gl-body').append(`
                        <div class="w-full tr  grid grid-cols-17 h-[37px] border-b rounded-t-md overflow-hidden text-[12px] gap-x-4">
                            <div val=${i + 1} class="td flex bg-gray-100 items-center h-full w-full col-span-1 pl-3 border-r font-bold">
                                <div class="w-full h-full flex items-center justify-center">${i + 1}</div>
                            </div>
                            <div val="${r.date}" class="td flex border-r items-center h-full w-full col-span-2">${r.date.substring(0,10)}</div>
                            <div val=${r[1][0] == 'R'?r.receipt_no:r.invoice_no} class="td flex border-r items-center h-full w-full col-span-2">
                            <a href="#" class="text-indigo-800 text-[11px] font-bold">${r[1][0] == 'R'?r.receipt_no:r.invoice_no}</a>
                            </div>
                            <div val=${r[1][0] == 'R'?this.format_amount(r.amount):0} class="td flex border-r items-center h-full w-full col-span-2">${r[1][0] == 'R'?this.format_amount(r.amount):0}</div>
                            <div val=${r[1][0] == 'I'?this.format_amount(r.amount):0} class="td flex border-r items-center h-full w-full col-span-2">${r[1][0] == 'I'?this.format_amount(r.amount):0}</div>
                            <div val=${balance} class="td flex border-r items-center h-full w-full col-span-2">${this.format_amount(balance)}</div>
                            <div val=${r.coa_id!=undefined?this.useWanted(this.coa, r.coa_id).account:r.invoice_no} class="td flex border-r items-center h-full w-full col-span-2">${r.coa_id!=undefined?this.useWanted(this.coa, r.coa_id).account:r.invoice_no}</div>
                            <div val=${r.firstname} ${r.lastname} class="td flex border-r items-center h-full w-full col-span-2">${r.firstname} ${r.lastname}</div>
                            <div val=${r.description} class="td flex items-center h-full w-full col-span-2">${r.description}</div>
                        </div>
                   `)
                })
                $('.gl-table').append(`
                    <div class="w-full tr grid grid-cols-17 h-[50px] bg-gray-100 overflow-hidden text-[13px] gap-x-4 border-t border-t-gray-300">
                        <div val="" class="td flex items-center h-full w-full col-span-1 border-r pl-3"></div>
                        <div val="" class="td flex items-center h-full w-full col-span-2  border-r "></div>
                        <div val="Total" class="td flex items-center h-full w-full col-span-2  border-r font-bold">Total</div>
                        <div val="${debits}" class="td flex items-center h-full w-full col-span-2  border-r font-bold">${this.format_amount(debits)}</div>
                        <div val="${credits}" class="td flex items-center h-full w-full col-span-2  border-r font-bold">${this.format_amount(credits)}</div>
                        <div val="${debits - credits}" class="td flex items-center h-full w-full col-span-2  border-r font-bold">${this.format_amount(debits - credits)}</div>
                    </div>
                    <div class="w-full tr grid grid-cols-17 h-[50px] bg-gray-100 overflow-hidden text-[13px] gap-x-4 border-t border-t-gray-300 rounded-b-md">
                        <div val="" class="td flex items-center h-full w-full col-span-1 border-r pl-3"></div>
                        <div val="" class="td flex items-center h-full w-full col-span-2  border-r "></div>
                        <div val="Closing" class="td flex items-center h-full w-full col-span-2  border-r font-bold">Closing
                        </div>
                        <div val="" class="td flex items-center h-full w-full col-span-2  border-r font-bold">0.00</div>
                        <div val="" class="td flex items-center h-full w-full col-span-2  border-r font-bold">0.00</div>
                        <div val="" class="td flex items-center h-full w-full col-span-2  border-r font-bold">0.00</div>
                    </div>
                `)
            }

        })
    }

    // fetching trial balance information
    async fetch_tb_report() {
        return this.fetch_data(this.baseUrl+'/reports.php?cs='+this.uid).then(res => {
            if (res.status) {
                let debits = 0, credits = 0
                var customer = this.makeUniq(res.data.bills.map((res)=>res.customer))
                customer.map((t, i) => {
                    let d = t.type == 'debit' ? t.amount : 0
                    let c = t.type == 'credit' ? t.amount : 0
                    var data = this.filterArr(res.data.bills, 'customer', t)
                    var data2 = this.filterArr(res.data.recs, 'customer', t)
                    debits += this.sumOfArray(data2.map(res=>parseFloat(res.amount)))
                    credits += this.sumOfArray(data.map(res=>parseFloat(res.total_amount)))
                    $('.tb-body').append(`
                        <div class="w-full tr grid grid-cols-17 h-[40px] border-b rounded-t-md overflow-hidden text-[13px] gap-x-4">
                            <div val="${i + 1}" class="td flex items-center h-full w-full col-span-1 border-r pl-3 flex items-center justify-center">
                                <div class="w-full col-span-1 h-full flex items-center justify-center">
                                    <div class="w-[23px] h-[23px] rounded-full bg-indigo-100 flex items-center justify-center">
                                        ${i + 1}
                                    </div>
                                </div>
                            </div>
                            <div val="${data[0].firstname} ${data[0].firstname}" class="td flex items-center h-full w-full col-span-4  border-r text-[12px]">${data[0].firstname} ${data[0].firstname}</div>
                            <div val="${data[0].firstname} ${data[0].firstname}" class="td flex items-center h-full w-full col-span-2  border-r text-[12px]">${data[0].firstname} ${data[0].firstname}</div>
                            <div val="${this.sumOfArray(data2.map(res=>parseFloat(res.amount)))}" class="td flex items-center h-full w-full col-span-2  border-r font-bold text-[11px]">
                                ${this.format_amount(this.sumOfArray(data2.map(res=>parseFloat(res.amount))))}
                            </div>
                            <div val="${this.sumOfArray(data.map(res=>parseFloat(res.total_amount)))}" class="td flex items-center h-full w-full col-span-2  border-rs text-red-600 font-bold text-[11px]">
                                ${this.format_amount(this.sumOfArray(data.map(res=>parseFloat(res.total_amount))))}
                            </div>
                            <div val="${this.sumOfArray(data.map(res=>parseFloat(res.total_amount)))}" class="td flex items-center h-full w-full col-span-2  border-rs text-red-600 font-bold text-[11px]">
                                ${this.format_amount(this.sumOfArray(data.map(res=>parseFloat(res.total_amount))))}
                            </div>
                            <div class="td flex items-center h-full w-full col-span-2  border-rs font-bold text-[11px]">
                            <button
                            title="${t}"
                            onclick="showStatement(this.title)"
                                class="flex items-center justify-center border border-gray-300 w-full h-[30px] rounded-md text-[12px]">
                                <i class="fa fa-eye mr-2" aria-hidden="true"></i>
                                View
                            </button>
                            </div>
                        </div>
                   `)
                })
                $('.tb-table').append(`
                    <div class="w-full tb-totals tr grid grid-cols-11 h-[40px] border-t-1 bg-gray-100 overflow-hidden text-[11px] gap-x-4 font-semibold">
                        <div val="" class="td flex items-center h-full w-full col-span-1 border-r pl-3 flex items-center justify-center"></div>
                        <div val="Total" class="td flex items-center h-full w-full col-span-4  border-r flex justify-end pr-2">Total</div>
                        <div val="${debits}" class="td flex items-center h-full w-full col-span-2  border-r tb-debit-total">${this.format_amount(debits)}</div>
                        <div val="${credits}" class="td flex items-center h-full w-full col-span-2  border-r tb-credit-total">${this.format_amount(credits)}</div>
                    </div>
                    <div class="w-full tb-totals tr grid grid-cols-11 h-[40px] border-t border-t-gray-300 bg-gray-100 overflow-hidden text-[11px] gap-x-4 font-semibold">
                        <div val="" class="td flex items-center h-full w-full col-span-1 border-r pl-3 flex items-center justify-center"></div>
                        <div val="Difference" class="td flex items-center h-full w-full col-span-4  border-r flex justify-end pr-2">Difference</div>
                        <div val="" class="td flex items-center h-full w-full col-span-2 "></div>
                        <div val="${debits - credits}" class="td flex items-center h-full w-full col-span-2  border-r tb-difference-total">${this.format_amount(debits - credits)}</div>
                        <div class="td flex items-center h-full w-full col-span-2  border-r tb-difference-total"></div>
                    </div>
                `)
            }

        })
    }

    // fetching bills table
    async populate_bills_rows() {
        const cls = this
        this.fetch_data(client.baseUrl+'/bills.php?bills=1').then(resolve => {
            this.total_unpaid = 0
            this.total_rows = 0
            if (resolve.status) {
                let rows = ''
                resolve.data.length > 0 && resolve.data.map((row, i) => {
                    this.total_rows += 1
                    this.total_unpaid += parseFloat(row.amount)
                    rows += `
                        <div class="w-full tr grid grid-cols-16 h-[60px] border-b text-slate-700 gap-x-4">
                            <span class="row_object hidden" row="${JSON.stringify(row)}"></span>
                            <div class="th flex items-center justify-center h-full w-full col-span-1">
                                <input type="checkbox" name="" id="" class="accent-default">
                            </div>
                            <div class="th flex items-center h-full w-full col-span-1">
                                <div class="flex items-center justify-center bg-default rounded-full text-white w-5 h-5 font-bold"> ${i + 1}</div>
                            </div>
                            <div class="th flex items-center h-full w-full col-span-2">${row.invoice_no}</div>
                            <div class="th flex items-center h-full w-full col-span-2">${row.date.substring(0,10)}</div>
                            <div class="th flex items-center h-full w-full col-span-2">${this.format_amount(row.amount, 2)}</div>
                            <div class="th flex items-center h-full w-full col-span-2">
                                <button
                                title="${row.id}" id="${row.amount}"
                                    class="wanaShowBill flex items-center justify-center border border-gray-300 w-full h-[30px] rounded-md text-[12px]">
                                    <i class="fa fa-eye mr-2" aria-hidden="true"></i>
                                    View
                                </button>
                            </div>
                        </div>
                    `
                })
                $('.bills_rows').html(rows)
                $('.total_bill_rows').text(this.total_rows)
                $('.total_bill_outstanding').text(this.format_amount(this.total_unpaid))
                $('.total_bill_paying').text(this.format_amount(this.total_paying))
                
                $('.wanaShowBill').click(function(){
                    cls.showBill($(this).attr('title'), $(this).attr('id'))
                })
            }
            else {
                console.log("An error occurred")
            }
        })
    }

    calculate_selected_bills() {
        // console.log("hello world")
    }

    ourAlert = (text, status)=>{
        status == 1?$('#alert').css('color','green'):$('#alert').css('color','red')
        $('#alert').text(text)
        $('#alert').slideDown()
        setTimeout(function(){
            $('#alert').slideUp()
        },5000)
    }
    postData(url, data, success) {
        $.ajax({
            type: "post",
            url: url,
            data: data,
            dataType: "json",
            success: function(response) {
                    success(response);
            }
        });
    }
    getGen = ()=>{
        $.getJSON(client.baseUrl+'/general.php?getgen=1', (response)=>{
            this.sof = response.sof
            this.banks = response.banks
            this.cc = response.cc
            this.coa = response.coa
    })
    }
    makeUniq = (arr) => {
        return [...new Set(arr)]
    }
    mergeArr = (arr, arr2)=>{
        return [...arr, ...arr2]
    }
    filterArr = (arr, index, key)=>{
        return arr.filter(a => a[index] == key)
    }
    getAttr = (arr, index)=>{
        return arr.map(res=>res[index])
    }
    useWanted = (arr, id)=>{
        return arr.filter(a=>a.id == id)[0]
    }
    sumOfArray=(arr)=>{
        return arr.reduce((a,b)=>a+b,0)
    }
    loader = () => {
        return `<div class="flex justify-center"><i class=" text-default fa fa-spinner fa-3x fa-spin"></i></div>`
    }

    readExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                resolve(jsonData);
            };
            reader.onerror = function (error) {
                reject(error);
            };
            reader.readAsBinaryString(file);
        });
    }
    
}
const client = new Client()
client.getGen()