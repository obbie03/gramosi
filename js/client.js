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
        this.budget = []
        this.dept = []
        this.project = []
        this.suppliers = []
        this.sub = []
        this.prog = []
        this.cust = []
        this.baseUrl = 'http://localhost/gramosiBackend'
        this.uid = 1
        this.init_print_format()
        this.getGen()  
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
                        '14': 'repeat(14, minmax(0, 1fr))',
                        '15': 'repeat(15, minmax(0, 1fr))',
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
    get_keys(obj) {

        return obj ? Object.keys(obj) : false
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
    bulkBilling = () => {
        $.getJSON(this.baseUrl + '/bills.php?bulkbills=' + 1, (response) => {
            if (response.status == 'done') {
                this.ourAlert('Successful', 1)

            } else {
                this.ourAlert('Something went wrong', 2)
            }
        })
    }

    //show bill
    showBill = (id, amount) => {
        $('#indet').html(this.loader)
        $('#iid').val(id)
        $('.showBill').css('visibility', 'visible')
        $.getJSON(this.baseUrl + '/bills.php?bill=' + id, (response) => {
            var bill = response.bills
            var recs = response.recs
            var out = `<span class="float-right"> <img class="w-[70px] h-[70px] object-contain mr-2" src = '../img/logo.png'> ${bill[0].date.substring(0, 10)}</span>
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
                                <td class="px-4 py-2 border">${this.useWanted(this.sof, bill[0].sof_id).source_of_fund}</td>
                            </tr>
                            <tr>
                                <th class="px-4 py-2 bg-gray-100 border text-left">Collection Center</th>
                                <td class="px-4 py-2 border">${this.useWanted(this.cc, bill[0].cc_id).collection_name}</td>
                            </tr>
                            <tr>
                            <th class="px-4 py-2 bg-gray-100 border text-left">Collection Center</th>
                            <td class="px-4 py-2 border">${this.useWanted(this.banks, bill[0].bank).name}</td>
                        </tr>
                            <tr>
                                <th class="px-4 py-2 bg-gray-100 border text-left">Invoice Balance</th>
                                <td class="px-4 py-2 border">${this.format_amount(amount)}</td>
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
            bill.map((res) => {

                out += `<tr class="${count % 2 === 0 ? 'bg-gray-100' : 'bg-white'}">
                            <td class="px-4 py-2 border">${count++}</td>
                            <td class="px-4 py-2 border">${this.useWanted(this.coa, res.coa_id).name}</td>
                            <td class="px-4 py-2 border">${res.description}</td>
                            <td class="px-4 py-2 border">${this.format_amount(res.amount)}</td>
                        </tr>`
            })
            out += `<tr>
                        <th class="px-4 py-2 bg-gray-100 border" colspan="3">Total</th>
                        <th class="px-4 py-2 bg-gray-100 border">${this.format_amount(this.sumOfArray(bill.map((res) => parseFloat(res.amount))))}</th>
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
            recs.map((res) => {
                out += `<tr class="${count % 2 === 0 ? 'bg-gray-100' : 'bg-white'}">
                            <td class="px-4 py-2 border">${count++}</td>
                            <td class="px-4 py-2 border">${res.receipt_no}</td>
                            <td class="px-4 py-2 border">${res.description}</td>
                            <td class="px-4 py-2 border">${res.date.substring(0, 10)}</td>
                            <td class="px-4 py-2 border">${this.format_amount(res.amount)}</td>
                        </tr>`
            })
            out += `<tr>
                        <th class="px-4 py-2 bg-gray-100 border" colspan="4">Total</th>
                        <th class="px-4 py-2 bg-gray-100 border">${this.format_amount(this.sumOfArray(recs.map((res) => parseFloat(res.amount))))}</th>
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
                    if (i < 6) {
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
                    }
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
                    if (i < 6) {
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
                    }
                })
                $('.receipt-total').text(this.format_amount(total))
                $('.receipt-count').text(count)
                $('.print-receipt').click(function () {
                    var newTab = window.open(`/client/print_formats/receipt.html?rid=${$(this).attr('id')}`, '_blank');
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
            // if (cur_url.includes('receipt.html')) {
            var searchParams = new URLSearchParams(window.location.search);
            const
                receipt_id = searchParams.get('rid'),
                bill_id = searchParams.get('bid');
            if (receipt_id) {
                this.fetch_data(this.baseUrl + `/reciepts.php?get_receipt=${receipt_id}`).then(resolve => {
                    if (resolve?.data) {
                        const d = resolve?.data
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
            else if (bill_id) {
                const cls = this
                cls.getGen()
                $.getJSON(this.baseUrl + '/bills.php?bill=' + bill_id, (response) => {
                    let bill = response.bills[0],
                        receipts = response.recs,
                        paid = 0
                    receipts?.length > 0 && receipts.map(rec => {
                        paid += parseFloat(rec.amount)
                    })
                    if (bill) {
                        const items = cls.useWanted(cls.coa, bill.coa_id)?.name
                        $('.bill-no').html(bill.invoice_no)
                        $('.bill-date').html(this.convert_date(bill.date.split(' ')[0]))
                        $('.customer-names').html(`${bill.firstname} ${bill.lastname}`)
                        $('.bill-body').empty();
                        $('.bill-body').html(`
                                    <div class="thead w-full grid grid-cols-11 border-b text-black h-[60px]">
                                        <div class="w-full h-full flex items-center col-span-1 justify-center">
                                            <div
                                                class="rounded-full bg-default text-white flex items-center justify-center w-[20px] h-[20px]">
                                                1</div>
                                        </div>
                                        <div class="w-full h-full flex items-center col-span-2 justify-start">${items}</div>
                                        <div class="w-full h-full flex items-center col-span-2 justify-start">${bill.description}</div>
                                        <div class="w-full h-full flex items-center col-span-2 justify-start">${this.format_amount(parseFloat(bill.amount)).substring(3)}</div>
                                        <div class="w-full h-full flex items-center col-span-2 justify-start">${this.format_amount(paid)}</div>
                                        <div class="w-full h-full flex items-center col-span-2 justify-start">${this.format_amount(parseFloat(bill.amount) - paid).substring(3)}</div>
                                    </div>
                                `)
                        $('.total-amount').text(this.format_amount(bill.amount))
                        $('.total-paid').text(this.format_amount(paid))
                        $('.total-outstanding').text(this.format_amount(parseFloat(bill.amount) - paid))
                        setTimeout(() => {
                            $('.loader').addClass('hidden')
                            $('.print-content').removeClass('hidden')
                            window.print()
                        }, 100);
                    }
                    else {
                        alert("Something went wrong")
                    }
                })
            }

            // }
        }

    }
    //select option
    makeSels = (arr, name, key, item) => {
        var out = '<option value="">Select ' + name + '</option>'
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
        this.fetch_data(url, 'text').then(resolve => {
            if (resolve.status) {
                $('.inner-content').html(resolve.data)
                if (url.includes('dashboard.html')) {
                    this.init_dashboard()
                }
                if (url.includes('bills.html')) {
                    this.populate_bills_rows()
                }
                if (url.includes('customer.html')) {
                    this.init_customer()
                }
                if (url.includes('property.html')) {
                    this.init_property()
                }
                if (url.includes('receipts.html')) {
                    this.populate_receipt_table()
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
        return this.fetch_data(this.baseUrl + '/reports.php?gl=' + this.uid).then(res => {
            if (res.status) {
                var data = this.mergeArr(res.data.bills, res.data.recs).sort((a, b) => new Date(a.date) - new Date(b.date))
                let debits = 0, credits = 0

                data.map((r, i) => {
                    debits += (r[1][0] == 'R' ? parseFloat(r.amount) : 0)
                    credits += (r[1][0] == 'I' ? parseFloat(r.amount) : 0)
                    var balance = debits - credits
                    var obj = {
                        date: r.date.substring(0, 10),
                        voucher: r[1][0] == 'R' ? r.receipt_no : r.invoice_no,
                        credit: r[1][0] == 'R' ? r.amount : 0,
                        debit: r[1][0] == 'I' ? r.amount : 0,
                        balance: balance,
                        coa: r.coa_id != undefined ? this.useWanted(this.coa, r.coa_id).account : r.invoice_no,
                        customer: `${r.firstname} ${r.lastname}`,
                        description: r.description
                    }
                    $('.gl-body').append(`
                        <div class="w-full tr  grid grid-cols-17 h-[37px] border-b rounded-t-md overflow-hidden text-[12px] gap-x-4">
                            <span row='${JSON.stringify(obj)}' class="row_object hidden"></span>
                            <div val=${i + 1} class="td flex bg-gray-100 items-center h-full w-full col-span-1 pl-3 border-r font-bold">
                                <div class="w-full h-full flex items-center justify-center">${i + 1}</div>
                            </div>
                            <div val="${r.date}" class="td flex border-r items-center h-full w-full col-span-2">${obj.date}</div>
                            <div val=${obj.voucher} class="td flex border-r items-center h-full w-full col-span-2">
                            <a href="#" class="text-indigo-800 text-[11px] font-bold">${obj.voucher}</a>
                            </div>
                            <div val=${obj.debit} class="td flex border-r items-center h-full w-full col-span-2">${this.format_amount(obj.debit)}</div>
                            <div val=${obj.credit} class="td flex border-r items-center h-full w-full col-span-2">${this.format_amount(obj.credit)}</div>
                            <div val=${obj.debit - obj.credit} class="td flex border-r items-center h-full w-full col-span-2">${this.format_amount(obj.debit - obj.credit)}</div>
                            <div val=${obj.coa} class="td flex border-r items-center h-full w-full col-span-2">${obj.coa}</div>
                            <div val="${obj.customer}" class="td flex border-r items-center h-full w-full col-span-2">${obj.customer}</div>
                            <div val=${obj.description} class="td flex items-center h-full w-full col-span-2">${obj.description}</div>
                        </div>
                   `)
                })
                $('.gl-table').append(`
                    <div class="w-full tr grid grid-cols-17 h-[50px] bg-gray-100 overflow-hidden text-[13px] gap-x-4 border-t border-t-gray-300">
                        <div val="" class="td flex items-center h-full w-full col-span-1 border-r pl-3"></div>
                        <div val="" class="td flex items-center h-full w-full col-span-2  border-r "></div>
                        <div val="Total" class="td flex items-center h-full w-full col-span-2  border-r font-bold">Total</div>
                        <div val="${debits}" class="td debits flex  items-center h-full w-full col-span-2  border-r font-bold">${this.format_amount(debits)}</div>
                        <div val="${credits}" class="td credits flex items-center h-full w-full col-span-2  border-r font-bold">${this.format_amount(credits)}</div>
                        <div val="${debits - credits}"  class="td difference flex items-center h-full w-full col-span-2  border-r font-bold">${this.format_amount(debits - credits)}</div>
                    </div>
                `)
                // enable report filters
                this.enabl_filters(".gl-table", "report")
            }

        })
    }

    // fetching trial balance information
    async fetch_tb_report() {
        return this.fetch_data(this.baseUrl + '/reports.php?cs=' + this.uid).then(res => {
            if (res.status) {
                let debits = 0, credits = 0
                var customer = this.makeUniq(res.data.bills.map((res) => res.customer))
                customer.map((t, i) => {
                    let d = t.type == 'debit' ? t.amount : 0
                    let c = t.type == 'credit' ? t.amount : 0
                    var data = this.filterArr(res.data.bills, 'customer', t)
                    var data2 = this.filterArr(res.data.recs, 'customer', t)
                    debits += this.sumOfArray(data2.map(res => parseFloat(res.amount)))
                    credits += this.sumOfArray(data.map(res => parseFloat(res.total_amount)))
                    let obj = {
                        customer: `${data[0].firstname} ${data[0].lastname}`,
                        debit: this.sumOfArray(data2.map(res => parseFloat(res.amount))),
                        credit: this.sumOfArray(data.map(res => parseFloat(res.total_amount))),
                        balance: this.sumOfArray(data.map(res => parseFloat(res.balance)))
                    }

                    $('.tb-body').append(`
                        <div class="w-full tr grid grid-cols-16 h-[40px] border-b rounded-t-md overflow-hidden text-[13px] gap-x-4">
                        <span row='${JSON.stringify(obj)}' class="row_object hidden"></span>
                            <div val="${i + 1}" class="td flex items-center h-full w-full col-span-1 border-r pl-3 flex items-center justify-center">
                                <div class="w-full col-span-1 h-full flex items-center justify-center">
                                    <div class="w-[23px] h-[23px] rounded-full bg-indigo-100 flex items-center justify-center">
                                        ${i + 1}
                                    </div>
                                </div>
                            </div>
                            <div val="${obj.customer}" class="td flex items-center h-full w-full col-span-4  border-r text-[12px]">${obj.customer}</div>
                            <div val="${obj.balance}" class="td flex items-center h-full w-full col-span-2 text-red-600  border-r font-bold text-[11px]">
                                ${this.format_amount(obj.balance)}
                            </div>
                            <div val="${obj.credit}" class="td flex items-center h-full w-full col-span-2  border-rs font-bold text-[11px]">
                                ${this.format_amount(obj.debit)}
                            </div>
                            <div val="${obj.credit}" class="td flex items-center h-full w-full col-span-2  border-rs text-red-600 font-bold text-[11px]">
                                ${this.format_amount(obj.credit)}
                            </div>
                            <div val="${obj.debit - obj.balance - obj.credit}" class="td flex items-center h-full w-full col-span-2  border-rs text-red-600 font-bold text-[11px]">
                            ${this.format_amount(obj.debit - obj.balance - obj.credit)}
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
                        <div val="${debits}" class="td debits flex items-center h-full w-full col-span-2  border-r tb-debit-total">${this.format_amount(debits)}</div>
                        <div val="${credits}" class="td credits flex items-center h-full w-full col-span-2  border-r tb-credit-total">${this.format_amount(credits)}</div>
                    </div>
                    <div class="w-full tb-totals tr grid grid-cols-11 h-[40px] border-t border-t-gray-300 bg-gray-100 overflow-hidden text-[11px] gap-x-4 font-semibold">
                        <div val="" class="td flex items-center h-full w-full col-span-1 border-r pl-3 flex items-center justify-center"></div>
                        <div val="Difference" class="td flex items-center h-full w-full col-span-4  border-r flex justify-end pr-2">Difference</div>
                        <div val="" class="td flex items-center h-full w-full col-span-2 "></div>
                        <div val="${debits - credits}" class="td difference flex items-center h-full w-full col-span-2  border-r tb-difference-total">${this.format_amount(debits - credits)}</div>
                        <div class="td flex items-center h-full w-full col-span-2  border-r tb-difference-total"></div>
                    </div>
                `)
                this.enabl_filters('.tb-table', 'report')
            }

        })
    }
    // init customer page
    init_customer() {
        const cls = this
        $('#new-customer-btn').click(function (e) {
            e.preventDefault();
            $(this).attr('submission_type', 'new-addition')
            $('.customer-modal').css('visibility', 'visible')
            $('.form-title').text("Add New Customer")
            $('#customer-form').trigger('reset')
        })
        $('.close-customer-modal').click(function (e) {
            e.preventDefault();
            $('.customer-modal').css('visibility', 'hidden')
        })
        $('#customer-form').submit(function (e) {
            e.preventDefault()
            let data = { submission_type: $(this).attr('submission_type') }
            $(this).find('input, select').map((i, row) => {
                data[$(row).attr('id')] = $(row).val()
            })
            $('.loader-cover').removeClass('hidden').addClass('flex')
            $('.submission-text').removeClass('text-red-700')
            cls.postData(`${cls.baseUrl}/customer.php`, data, (response) => {
                let res_text = response.msg
                $('.submission-loader').addClass('hidden')
                if (response.status == true) {
                    $('#customer-form').trigger('reset')
                    cls.populate_customer_rows()
                }
                else {
                    res_text = response.error
                    $('.submission-text').addClass('text-red-700')
                }
                $('.submission-text').text(res_text)
                setTimeout(() => {
                    $('.loader-cover').addClass('hidden')
                    $('.submission-loader').removeClass('hidden')
                    $('.submission-text').text("Submitting!")
                }, 3000);
            })
        })
        // populate the customer table
        this.populate_customer_rows()
    }
    // populate customer rows
    // fetching bills table
    async populate_customer_rows() {
        const cls = this
        this.fetch_data(this.baseUrl + '/customer.php?allcustomers=1').then(resolve => {
            let total_rows = 0
            if (resolve.status) {
                let rows = ''
                $('.customer_rows').empty()
                $('.fetch-loader').remove('flex').addClass('hidden')
                resolve.data.length > 0 && resolve.data.map((row, i) => {
                    total_rows += 1
                    rows += `
                        <div class="w-full tr grid grid-cols-16 h-[50px] border-b text-[13px] gap-x-4">
                            <span class="row_object hidden" row='${JSON.stringify(row)}'></span>
                                <div class="th flex items-center justify-start justify-center h-full w-full">
                                    <input type="checkbox" name="" id="all_bills_selector" class="accent-default ml-3">
                                </div>
                                <div class="th flex items-center h-full w-full col-span-1">${i + 1}</div>
                                <div class="th flex items-center h-full w-full col-span-2">${row.code}</div>
                                <div class="th flex items-center h-full w-full col-span-2">${row.account_no}</div>
                                <div class="th flex items-center h-full w-full col-span-2">${row.firstname}</div>
                                <div class="th flex items-center h-full w-full col-span-2">${row.middlename}</div>
                                <div class="th flex items-center h-full w-full col-span-2">${row.lastname}</div>
                                <div class="th flex items-center h-full w-full col-span-2">${row.phonenumber}</div>
                                <div class="th flex items-center h-full w-full col-span-2 w-full">
                                    <button class="view-customer text-[12px] w-[150px] h-[30px] border rounded-md flex items-center justify-center">
                                        <i class="fa fa-eye mr-2" aria-hidden="true"></i>
                                        View Customer
                                    </button>
                                </div>
                            </div>
                    
                    `
                })
                $('.customer_rows').html(rows)
                $('.total_customer_rows').text(total_rows)
                $('.view-customer').click(function () {
                    const row = JSON.parse($(this).parents('.tr').find('.row_object').attr('row'))
                    $('.form-title').text("Customer Information")
                    $('#customer-form').attr('submission_type', 'update')
                    $('.customer-modal').css({ visibility: 'visible' })
                    $('.customer-modal form').find('input').map((i, inp) => {
                        $(inp).val(row[$(inp).attr('id')])
                    })
                    $('#submit-customer-btn span').text('Update Info')
                })
                // enable filters
                this.enabl_filters('.customer-table', 'table')
            }
            else {
                console.log("An error occurred")
            }
        })

        // TO SUBMIT THE CUSTOMER DETAILS
    }

    // initialize property
    init_property() {
        const cls = this
        $('#new-property-btn').click(function (e) {
            e.preventDefault();
            $(this).attr('submission_type', 'new-addition')
            $('.property-modal').css('visibility', 'visible')
            $('.form-title').text("Add New property")
            $('#property-form').trigger('reset')
        })
        $('.close-property-modal').click(function (e) {
            e.preventDefault();
            $('.property-modal').css('visibility', 'hidden')
        })
        $('#property-form').submit(function (e) {
            e.preventDefault()
            let data = { submission_type: $(this).attr('submission_type') }
            $(this).find('input,select').map((i, row) => {
                data[$(row).attr('id')] = $(row).val()
            })
            $('.loader-cover').removeClass('hidden').addClass('flex')
            $('.submission-text').removeClass('text-red-700')
            cls.postData(`${cls.baseUrl}/property.php`, data, (response) => {
                let res_text = response.msg
                $('.submission-loader').addClass('hidden')
                if (response.status == true) {
                    $('#property-form').trigger('reset')
                    cls.populate_property_rows()
                }
                else {
                    res_text = response.error
                    $('.submission-text').addClass('text-red-700')
                }
                $('.submission-text').text(res_text)
                setTimeout(() => {
                    $('.loader-cover').addClass('hidden')
                    $('.submission-loader').removeClass('hidden')
                    $('.submission-text').text("Submitting!")
                }, 3000);
            })
        })
        this.populate_property_rows()
    }

    //fetching property table
    async populate_property_rows() {
        const cls = this
        this.fetch_data(this.baseUrl + '/property.php?property=1').then(resolve => {
            this.total_unpaid = 0
            this.total_rows = 0
            $('.fetch-loader').remove('flex').addClass('hidden')
            if (resolve.status) {
                let rows = ''
                const
                    types = resolve.data?.property_type,
                    coas = resolve.data?.coa,
                    property = resolve.data?.property,
                    customers = resolve.data?.customers?.sort();
                $('#coa_id').empty().html('<option value="">Select COA</option>')
                $('#type_id').empty().html('<option value="">Select Customer</option>')
                types?.length > 0 && types.map(pt => $('#type_id').append(`<option value="${pt.id}">${pt.name}</option>`))
                coas?.length > 0 && coas.map(acc => $('#coa_id').append(`<option value="${acc.id}">${acc.name}</option>`))
                customers?.length > 0 && customers.map(c => $('#c_id').append(`<option value="${c.id}">${c.firstname} ${c.lastname}</option>`))
                property?.length > 0 && property.map((row, i) => {
                    this.total_rows += 1
                    this.total_unpaid += parseFloat(row.amount)
                    const r = { "full_names": `${row.firstname} ${row.lastname}`, ...row }
                    rows += `
                        <div class="w-full tr grid grid-cols-16 h-[50px] border-b text-[12px] gap-x-4">
                            <span class="row_object hidden" row='${JSON.stringify(r)}'></span>
                                <div class="th flex items-center justify-start justify-center h-full w-full">
                                    <input type="checkbox" name="" id="all_bills_selector" class="accent-default ml-3">
                                </div>
                                <div class="th flex items-center h-full w-full col-span-1">${i + 1}</div>
                                <div class="th flex items-center h-full w-full col-span-2">${row.name}</div>
                                <div class="th flex items-center h-full w-full col-span-2">${r.full_names}</div>
                                <div class="th flex items-center h-full w-full col-span-2">${row.property_type}</div>
                                <div class="th flex items-center h-full w-full col-span-2">${row.plot}</div>
                                <div class="th flex items-center h-full w-full col-span-2">${row.location}</div>
                                <div class="th flex items-center h-full w-full col-span-2">${row.town}</div>
                                <div class="th flex items-center h-full w-full col-span-2 w-full">
                                    <button class="view-property text-[12px] w-[150px] h-[30px] border rounded-md flex items-center justify-center">
                                        <i class="fa fa-eye mr-2" aria-hidden="true"></i>
                                        View Property
                                    </button>
                                </div>
                            </div>
                    
                    `
                })
                $('.property_rows').html(rows)
                $('.total_property_rows').text(this.total_rows)
                $('.view-property').click(function () {
                    const row = JSON.parse($(this).parents('.tr').find('.row_object').attr('row'))
                    $('.form-title').text("Property Information")
                    $('#property-form').attr('submission_type', 'update')
                    $('.property-modal').css({ visibility: 'visible' })
                    $('.property-modal form').find('input').map((i, inp) => {
                        $(inp).val(row[$(inp).attr('id')])
                    })
                    $('#type_id').val(row.type_id)
                    $('#coa_id').val(row.coa_id)
                    $('#c_id').val(row.owner_id)
                    $('#submit-property-btn span').text('Update Info')
                })
                // enable filters
                this.enabl_filters('.property-table', 'table')
            }
            else {
                console.log("An error occurred")
            }
        })
    }

    // fetching bills table
    async populate_bills_rows() {
        const cls = this
        this.fetch_data(this.baseUrl + '/bills.php?bills=1').then(resolve => {
            console.log(resolve.data)
            this.total_unpaid = 0
            this.total_rows = 0
            if (resolve.status) {
                let rows = ''
                resolve.data.length > 0 && resolve.data.map((row, i) => {
                    this.total_rows += 1
                    this.total_unpaid += parseFloat(row.amount)
                    rows += `
                        <div class="w-full tr grid grid-cols-14 h-[60px] border-b text-slate-700 gap-x-4">
                            <span class="row_object hidden" row='${JSON.stringify(row)}'></span>
                            <div class="th flex items-center justify-center h-full w-full col-span-1">
                                <input type="checkbox" name="" id="" class="accent-default">
                            </div>
                            <div class="th flex items-center h-full w-full col-span-1">
                                <div class="flex items-center justify-center bg-default rounded-full text-white w-5 h-5 font-bold"> ${i + 1}</div>
                            </div>
                            <div class="th flex items-center h-full w-full col-span-2">${row.invoice_no}</div>
                            <div class="th flex items-center h-full w-full col-span-2">${this.convert_date(row.date.substring(0, 10))}</div>
                            <div class="th flex items-center h-full w-full col-span-2">${row.firstname} ${row.lastname}</div>
                            <div class="th flex items-center h-full w-full col-span-2">${this.format_amount(row.amount, 2)}</div>
                            <div class="th flex items-center h-full w-full col-span-2">
                                <button
                                title="${row.id}" id="${row.amount}"
                                    class="wanaShowBill flex items-center justify-center border border-gray-300 w-full h-[30px] rounded-md text-[12px]">
                                    <i class="fa fa-eye mr-2" aria-hidden="true"></i>
                                    View
                                </button>
                            </div>
                            <div class="th flex items-center h-full w-full col-span-2">
                                <button id="${row.id}" class="print-bill w-[120px] h-[35px] border rounded-md flex items-center justify-center">
                                    <i class="fa fa-print mr-2 text-indigo-800" aria-hidden="true"></i>
                                    Print
                                </button>
                            </div>
                        </div>
                    `
                })
                $('.bills_rows').html(rows)
                $('.total_bill_rows').text(this.total_rows)
                $('.total_bill_outstanding').text(this.format_amount(this.total_unpaid))
                // $('.total_bill_paying').text(this.format_amount(this.total_paying))
                $('.wanaShowBill').click(function () {
                    cls.showBill($(this).attr('title'), $(this).attr('id'))
                })

                // to print the bill
                // $('.receipt-total').text(this.format_amount(total))
                // $('.bill-count').text(count)
                $('.print-bill').click(function () {
                    var newTab = window.open(`/client/print_formats/bill.html?bid=${$(this).attr('id')}`, '_blank');
                    newTab.focus();
                })
                // enable filters
                this.enabl_filters('.bills-table', 'table')
            }
            else {
                console.log("An error occurred")
            }
        })
    }

    // fetc receipt data
    async populate_receipt_table() {
        this.fetch_data(this.baseUrl + '/reciepts.php?receipts').then(resolve => {
            if (resolve?.data?.length > 0) {
                let total = 0, count = 0
                $('.receipts-body').empty() && resolve?.data.map((rec, i) => {
                    total += parseFloat(rec.amount)
                    count += 1
                    const obj = {
                        id: rec.id,
                        date: rec.date.split(' ')[0],
                        receipt_no: rec.receipt_no,
                        amount: parseFloat(rec.amount)
                    }
                    $('.receipts-body').append(`
                        <div class="w-full tr grid grid-cols-9 h-[40px] border-b rounded-t-md overflow-hidden text-[13px] gap-x-4">
                        <span row='${JSON.stringify(obj)}' class="row_object hidden"></span>
                            <div class="th flex items-center justify-start justify-center h-full w-full col-span-1">
                                <input type="checkbox" name="" id="all_bills_selector" class="accent-default ml-3">
                                <div val="${i + 1}" class="td flex items-center h-full w-full col-span-1 border-r flex justify-start ml-4">
                                    <div class="w-[23px] h-[23px] rounded-full bg-indigo-100 flex items-center justify-center">
                                        ${i + 1}
                                    </div>
                            </div>
                            </div>
                            
                            <div val="${obj.receipt_no}" class="td flex items-center justify-start h-full w-full col-span-2  border-rs font-bold text-[11px]">
                                ${obj.receipt_no}
                            </div>
                            <div val="${obj.date}" class="td flex items-center justify-start h-full w-full col-span-2  border-rs font-bold text-[11px]">
                                ${this.convert_date(obj.date)}
                            </div>
                            <div val="${obj.amount}" class="td flex items-center justify-start h-full w-full col-span-2  border-rs font-bold text-[11px]">
                                ${this.format_amount(obj.amount)}
                            </div>
                            <div class="td flex items-center justify-start h-full w-full col-span-2  border-rs font-bold text-[11px]">
                            <button id="${rec.id}" class="w-[120px] print-receipt h-[30px] bg-slate-50 border border-gray-400 text-slate-500 rounded-md">
                                Print Receipt
                            </button>
                            </div>
                        </div>
                   `)
                })
                $('.receipt-total').text(this.format_amount(total))
                $('.receipt-count').text(count)
                $('.total_receipt_rows').html(count)
                $('.print-receipt').click(function () {
                    var newTab = window.open(`/client/print_formats/receipt.html?rid=${$(this).attr('id')}`, '_blank');
                    newTab.focus();
                })
                this.enabl_filters('.receipts-table', 'table')
            }
        })
    }

    enabl_filters(page, page_type) {
        const cls = this
        $('.from-date, .to-date').change(function (e) {
            cls.run_filters(page, page_type, $('.from-date').val(), $('.to-date').val(), $('.search-field').val())
        })
        $('.search-field, .from-date, .to-date').keyup(function (e) {
            cls.run_filters(page, page_type, $('.from-date').val(), $('.to-date').val(), $('.search-field').val())
        })
    }
    run_filters(page, page_type, from_date, to_date, search_field) {
        let
            total_rows = 0, total_amount = 0,
            credit = 0, debit = 0
        const rows = $(page).find('.tbody').find('.tr')
        if (rows?.length > 0) {
            if (from_date || to_date || search_field) {
                $(page).find('.tbody').find('.tr').addClass('hidden')
                rows.map((_, row) => {
                    let allow_row = false
                    const row_data = JSON.parse($(row).find('.row_object').attr('row'))
                    const posting_date = row_data?.date ? new Date(row_data.date.split(' ')[0]) : ''
                    if (search_field) {
                        const keys = this.get_keys(row_data)
                        keys?.map(key => {
                            if (row_data[key]?.toString().toLowerCase()?.trim()?.includes(search_field?.toLowerCase()?.trim())) {
                                allow_row = true
                            }
                        })
                    }
                    else allow_row = true
                    if (allow_row) {
                        if (from_date) {
                            const d = new Date(from_date)
                            allow_row = posting_date >= d ? true : false
                        }
                        if (allow_row && to_date) {
                            const d = new Date(to_date)
                            allow_row = posting_date <= d ? true : false
                        }
                    }
                    if (allow_row) {
                        total_rows += 1
                        total_amount += parseFloat(row_data.amount)
                        $(row).removeClass('hidden')
                        if (page == '.gl-table' || page == '.tb-table') {
                            debit += parseFloat(row_data.debit)
                            credit += parseFloat(row_data.credit)
                        }
                    }
                })
                if (page_type === 'table') {
                    $('.total_bill_rows').text(total_rows)
                    $('.total_bill_outstanding').text(this.format_amount(total_amount))
                }
                else if (page_type == 'report') {
                    $('.debits').html(this.format_amount(debit))
                    $('.credits').html(this.format_amount(credit))
                    $('.difference').html(this.format_amount(debit - credit))
                }
            }
            else {
                $(page).find('.tbody').find('.tr').removeClass('hidden')
                if (page_type == 'report') {
                    $('.debits').html(this.format_amount(parseFloat($('.debits').attr('val'))))
                    $('.credits').html(this.format_amount(parseFloat($('.credits').attr('val'))))
                    $('.difference').html(this.format_amount(parseFloat($('.debits').attr('val') - parseFloat($('.credits').attr('val')))))
                }
            }

        }
    }


    ourAlert = (text, status) => {
        status == 1 ? $('#alert').css('color', 'green') : $('#alert').css('color', 'red')
        $('#alert').text(text)
        $('#alert').slideDown()
        setTimeout(function () {
            $('#alert').slideUp()
        }, 5000)
    }
    postData(url, data, success) {
        $.ajax({
            type: "post",
            url: url,
            data: data,
            dataType: "json",
            success: function (response) {
                success(response);
            }
        });
    }
    async getGen() {
        $.getJSON(this.baseUrl + '/general.php?getgen=1', (response) => {
            this.sof = response.sof
            this.banks = response.banks
            this.cc = response.cc
            this.coa = response.coa
            this.budget = response.budget
            this.dept = response.dept
            this.prog = response.prog
            this.project = response.head
            this.sub = response.sub
            this.suppliers = response.suppliers
            this.cust = response.cust
        })
    }
    makeUniq = (arr) => {
        return [...new Set(arr)]
    }
    mergeArr = (arr, arr2) => {
        return [...arr, ...arr2]
    }
    filterArr = (arr, index, key) => {
        return arr.filter(a => a[index] == key)
    }
    getAttr = (arr, index) => {
        return arr.map(res => res[index])
    }
    useWanted = (arr, id) => {
        return arr.filter(a => a.id == id)[0]
    }
    sumOfArray = (arr) => {
        return arr.reduce((a, b) => a + b, 0)
    }
    loader = () => {
        return `<div class="flex justify-center"><i class=" text-default fa fa-spinner fa-3x fa-spin"></i></div>`
    }

    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Calculate expiration date
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    checkCookie(name) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.indexOf(name + '=') === 0) {
                return true;
            }
        }
        return false;
    }

    getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.indexOf(name + '=') === 0) {
                return cookie.substring(name.length + 1);
            }
        }
        return null;
    }
    

    checkLoggedIn(){
        this.checkCookie('sysuid')?this.uid = this.getCookie('sysuid'):location.href='/auth'
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
