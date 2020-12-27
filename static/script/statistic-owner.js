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

var ctx1 = document.getElementById('chart1');
var myChart1 = new Chart(ctx1, {
    type: 'horizontalBar',
    data: {
        labels: ['Đã đăng', 'Chờ duyệt', 'Báo cáo', 'Bị chặn', 'Tổng'],
        datasets: [{
            label: 'Bài đăng',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
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

fetch('/ownerThongKeCoCauPost')
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    myChart1.data.datasets[0].data.push(data.actives);
                    myChart1.data.datasets[0].data.push(data.handlings);
                    myChart1.data.datasets[0].data.push(data.reports);
                    myChart1.data.datasets[0].data.push(data.blocks);
                    myChart1.data.datasets[0].data.push(data.posts);
                    myChart1.update();

                    document.getElementsByClassName('top-day-view')[0].children[0].innerHTML = data.totalViews + ' lượt xem';
                    document.getElementsByClassName('top-day-view')[0].children[1].innerHTML = data.totalFavorites + ' yêu thích';
                }
            )
        }
    }
)

fetch('/ownerThongKeNhanhView')
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    document.getElementsByClassName('top-day-view')[0].children[2].innerHTML = 'Ngày có lượt xem cao nhất: ' + data.day.split('-').reverse().join('-');
                    document.getElementsByClassName('top-day-view')[0].children[3].innerHTML = 'với ' + data.maxView + ' lượt xem';
                }
            )
        }
    }
)

var ctx2 = document.getElementById('chart2');
var myChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: [], // Tên cột
        datasets: [{
            label: 'Views in week', // Tên đồ thị
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

fetch('/ownerThongKeViewInWeek')
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    for (var i = data.length - 1; i >= 0; i--) {
                        addData(myChart2, data[i].day, data[i].viewInDay);
                    }
                    myChart2.update();
                }
            )
        }
    }
)

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data);
    chart.data.datasets[0].pointBackgroundColor.push('rgba(255, 255, 255, 255)');
    chart.data.datasets[0].pointBorderColor.push('rgba(255, 255, 255, 255)');
}