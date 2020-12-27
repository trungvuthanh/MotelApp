// Load menu, footer
var typeAcc;
// Load menu, footer
fetch('/information-account')
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    typeAcc = data.typeAccount
                    $('#menu').load('/static/page/menu-' + data.typeAccount + '.html');
                }
            )
        }
    }
)
$('#footer').load('/static/page/footer.html');
///////////////////////////////////////////////////////////////////////////////////////////////

fetch('/adminGetTop3Post')
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    // Top 1
                    document.getElementById('nameGold').firstElementChild.innerHTML = data[0].titlePost;
                    document.getElementsByClassName('top-info')[0].firstElementChild.lastElementChild.innerHTML = data[0].address;
                    document.getElementsByClassName('top-info')[0].children[1].firstElementChild.innerHTML = data[0].totalView + ' Lượt xem <i class="fas fa-eye"></i>';
                    document.getElementsByClassName('top-info')[0].children[1].lastElementChild.innerHTML = data[0].totalFavorite + ' Yêu thích <i class="fas fa-heart"></i>';
                    document.getElementById('slide1').children[0].src = data[0].images.images[0];
                    document.getElementById('slide2').children[0].src = data[0].images.images[1];
                    document.getElementById('slide3').children[0].src = data[0].images.images[2];
                    document.getElementById('slide4').children[0].src = data[0].images.images[3];
                    document.getElementById('slide5').children[0].src = data[0].images.images[4];

                    // Top 2
                    document.getElementById('nameSilver').firstElementChild.innerHTML = data[1].titlePost;
                    document.getElementById('nameSilver').parentElement.nextElementSibling.src = data[1].image.image;

                    // Top 3
                    document.getElementById('nameBronze').firstElementChild.innerHTML = data[2].titlePost;
                    document.getElementById('nameBronze').parentElement.nextElementSibling.src = data[2].image.image;
                }
            )
        }
    }
)

var ctx1 = document.getElementById('chart1');
var myChart1 = new Chart(ctx1, {
    type: 'horizontalBar',
    data: {
        labels: [],
        datasets: [{
            label: 'Từ khóa',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 2
        }]
    },
    options: {
        legend: {
            labels: {
                fontColor: "#ffffff",
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: "#ffffff",
                }
            }],
            xAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: "#ffffff",
                }
            }]
        }
    }
});
fetch('/adminThongKeTuKhoaVaThongKeViewNhanh')
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    for (var each of data.searchs) {
                        myChart1.data.labels.push(each.addressSeach);
                        myChart1.data.datasets[0].data.push(each.count);
                    }
                    myChart1.update();
                }
            )
        }
    }
)

var ctx2 = document.getElementById('chart2');
var myChart2 = new Chart(ctx2, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            label: '# of Votes',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(0, 128, 0, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(0, 128, 0, 1)',
            ],
            borderWidth: 2
        }]
    },
    options: {
        legend: {
            labels: {
                fontColor: "#ffffff",
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: "#ffffff",
                }
            }]
        }
    }
});
fetch('/adminThongKeCoCauTrangThaiBaiDang')
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    for (var i = 0; i < data.length - 1; i++) {
                        myChart2.data.labels.push(data[i].statusPost);
                        myChart2.data.datasets[0].data.push(data[i].count);
                    }
                    myChart2.data.labels.push('report');
                    myChart2.data.datasets[0].data.push(data[data.length - 1].report_post);
                    myChart2.data.labels.push('review');
                    myChart2.data.datasets[0].data.push(data[data.length - 1].review)
                    myChart2.update();
                }
            )
        }
    }
)

var ctx3 = document.getElementById('chart3');
var myChart3 = new Chart(ctx3, {
    type: 'line',
    data: {
        labels: [], // Tên cột
        datasets: [{
            label: '', // Tên đồ thị
            data: [], // Số view
            borderColor: [ // Màu đường kẻ (const)
                'rgba(255, 159, 64, 1)' 
            ],
            pointBackgroundColor: [ // Màu nền điểm []
            
            ],
            pointBorderColor: [ // Màu viền điểm []
            
            ],
            pointBorderWidth: 3, // Độ dày điểm (const)
            borderWidth: 2, // Độ dày đường kẻ (const)
        }]
    },
    options: {
        legend: {
            labels: {
                fontColor: "#ffffff",
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: "#ffffff",
                }
            }],
            xAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: "#ffffff",
                }
            }]
        }
    }
});

var sort = document.getElementById('sortBy').value;
var start = document.getElementById('startDay');
var end = document.getElementById('endDay');
var month = document.getElementById('month');

end.style.display = 'none';
month.style.display = 'none';

today = new Date();
start.children[1].value = '' + today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
end.children[1].value = start.children[1].value;
fetch('/adminThongKeView/inDay/' + start.children[1].value + '/' + end.children[1].value)
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    myChart3.data.datasets[0].label = 'Lượt xem trong ngày';
                    myChart3.data.labels = [];
                    myChart3.data.datasets[0].data = []
                    for (var each of data) {
                        addData(myChart3, each.hour + 'h', each.viewInHour)
                    }
                    myChart3.update();
                }
            )
        }
    }
)

start.children[1].onchange = function(){
    end.children[1].value = start.children[1].value;
    fetch('/adminThongKeView/inDay/' + start.children[1].value + '/' + end.children[1].value)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                        myChart3.data.datasets[0].label = 'Lượt xem trong ngày';
                        myChart3.data.labels = [];
                        myChart3.data.datasets[0].data = []
                        for (var each of data) {
                            addData(myChart3, each.hour + 'h', each.viewInHour)
                        }
                        myChart3.update();
                    }
                )
            }
        }
    )
};

function view() {
    sort = document.getElementById('sortBy').value;
    start = document.getElementById('startDay');
    end = document.getElementById('endDay');
    month = document.getElementById('month');
    if (sort == 'inDay') {
        start.style.display = 'block';
        start.children[0].innerHTML = 'Chọn ngày'
        end.style.display = 'none';
        month.style.display = 'none';
        start.children[1].onchange = function(){
            end.children[1].value = start.children[1].value;
            fetch('/adminThongKeView/inDay/' + start.children[1].value + '/' + end.children[1].value)
            .then(
                resp => {
                    if (resp.status == 200) {
                        resp.json()
                        .then(
                            data => {
                                myChart3.data.datasets[0].label = 'Lượt xem trong ngày';
                                myChart3.data.labels = [];
                                myChart3.data.datasets[0].data = []
                                for (var each of data) {
                                    addData(myChart3, each.hour + 'h', each.viewInHour)
                                }
                                myChart3.update();
                            }
                        )
                    }
                }
            )
        };
    } else if (sort == 'inMonth') {
        start.style.display = 'none';
        end.style.display = 'none';
        month.style.display = 'block';
        date = new Date();
        month.children[1].value = '' + date.getFullYear() + '-' + (date.getMonth()+1);
        fetch('/adminThongKeView/inMonth/' + month.children[1].value.split('-')[0] + '/' + month.children[1].value.split('-')[1])
        .then(
            resp => {
                if (resp.status == 200) {
                    resp.json()
                    .then(
                        data => {
                            myChart3.data.datasets[0].label = 'Lượt xem trong tháng';
                            myChart3.data.labels = [];
                            myChart3.data.datasets[0].data = []
                            for (var each of data) {
                                addData(myChart3, each.day.split('-').reverse().join('-'), each.viewInDay)
                            }
                            myChart3.update();
                        }
                    )
                }
            }
        )
        month.children[1].onchange = function() {
            fetch('/adminThongKeView/inMonth/' + month.children[1].value.split('-')[0] + '/' + month.children[1].value.split('-')[1])
            .then(
                resp => {
                    if (resp.status == 200) {
                        resp.json()
                        .then(
                            data => {
                                myChart3.data.datasets[0].label = 'Lượt xem trong tháng';
                                myChart3.data.labels = [];
                                myChart3.data.datasets[0].data = []
                                for (var each of data) {
                                    addData(myChart3, each.day.split('-').reverse().join('-'), each.viewInDay)
                                }
                                myChart3.update();
                            }
                        )
                    }
                }
            )
        }
    } else if (sort == 'inWeek') {
        date = new Date();
        start.children[1].value = '' + date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
        end.children[1].value = start.children[1].value;
        start.style.display = 'none';
        end.style.display = 'none';
        month.style.display = 'none';
        fetch('/adminThongKeView/inWeek/' + start.children[1].value + '/' + end.children[1].value)
        .then(
            resp => {
                if (resp.status == 200) {
                    resp.json()
                    .then(
                        data => {
                            myChart3.data.datasets[0].label = 'Lượt xem trong tuần';
                            myChart3.data.labels = [];
                            myChart3.data.datasets[0].data = []
                            for (var each of data) {
                                addData(myChart3, each.day.split('-').reverse().join('-'), each.viewInDay);
                            }
                            myChart3.update();
                        }
                    )
                }
            }
        )
    } else if (sort == 'dayToDay') {
        start.style.display = 'block';
        start.children[0].innerHTML = 'Ngày bắt đầu';
        end.style.display = 'block';
        month.style.display = 'none';

        date = new Date();
        end.children[1].value = '' + date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
        oneLastWeek = new Date(date.setDate(date.getDate() - 7));
        start.children[1].value = '' + oneLastWeek.getFullYear() + '-' + (oneLastWeek.getMonth()+1) + '-' + oneLastWeek.getDate();
        viewDayToDay();

        start.children[1].onchange = function() {
            if (end.children[1].value) {
                viewDayToDay();
            }
        }
        end.children[1].onchange = function() {
            if (start.children[1].value) {
                viewDayToDay();
            }
        }
    }
}
function viewDayToDay() {
    (end.children[1].value >= start.children[1].value) ? 
    fetch('/adminThongKeView/dayToDay/' + start.children[1].value + '/' + end.children[1].value)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                        myChart3.data.datasets[0].label = 'Lượt xem từ ngày ' + start.children[1].value.split('-').reverse().join('-') + ' đến ngày ' + end.children[1].value.split('-').reverse().join('-');
                        myChart3.data.labels = [];
                        myChart3.data.datasets[0].data = []
                        for (var each of data) {
                            addData(myChart3, each.day.split('-').reverse().join('-'), each.viewInDay);
                        }
                        myChart3.update();
                    }
                )
            }
        }
    )
    : alert('Ngày bắt đầu không lớn hơn ngày kết thúc');
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data);
    chart.data.datasets[0].pointBackgroundColor.push('rgba(255, 255, 255, 255)');
    chart.data.datasets[0].pointBorderColor.push('rgba(255, 255, 255, 255)');
}