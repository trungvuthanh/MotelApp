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
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
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

var ctx2 = document.getElementById('chart2');
var myChart2 = new Chart(ctx2, {
    type: 'pie',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
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

var ctx3 = document.getElementById('chart3');
var myChart3 = new Chart(ctx3, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'transparent',
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
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

if ($('#sortBy').val() == 'day') {
    $('label[for="startDay"]').css('display', 'block');
    $('#startDay').css('display', 'block');
    $('label[for="endDay"]').css('display', 'block');
    $('#endDay').css('display', 'block');

    $('label[for="month"]').css('display', 'none');
    $('#month').css('display', 'none');
}
$('#sortBy').click(function() {
    if ($(this).val() == 'day') {
        $('label[for="startDay"]').css('display', 'block');
        $('#startDay').css('display', 'block');
        $('label[for="endDay"]').css('display', 'block');
        $('#endDay').css('display', 'block');

        $('label[for="month"]').css('display', 'none');
        $('#month').css('display', 'none');
    } else if ($(this).val() == 'month') {
        $('label[for="startDay"]').css('display', 'none');
        $('#startDay').css('display', 'none');
        $('label[for="endDay"]').css('display', 'none');
        $('#endDay').css('display', 'none');

        $('label[for="month"]').css('display', 'block');
        $('#month').css('display', 'block');
    } else {
        $('label[for="startDay"]').css('display', 'none');
        $('#startDay').css('display', 'none');
        $('label[for="endDay"]').css('display', 'none');
        $('#endDay').css('display', 'none');
        
        $('label[for="month"]').css('display', 'none');
        $('#month').css('display', 'none');
    }
});