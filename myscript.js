var mp = new Map();
var total = 0;
var totalSales = 0;

var lm = new Map();

for (var i = $(".memberList").children().length - 1; i >= 0; i--) {
	var r = $(".memberList").children()[i].childNodes[3].getElementsByClassName("muted")[0];
	var rr = $(".memberList").children()[i].childNodes[3].getElementsByClassName("muted")[1];
	if(rr!=undefined){
		flot = parseFloat(rr.innerHTML.replace(/[^\d.-]/g, ''));
		total+=flot;
		totalSales++;
		console.log(flot);

		if(lm.get(r.innerHTML)==undefined){
			lm.set(r.innerHTML, flot);
		}else{
			lm.set(r.innerHTML, lm.get(r.innerHTML)+flot);
		}

		if(mp.get(r.innerHTML)==undefined){
			mp.set(r.innerHTML, 1);
		}else{
			mp.set(r.innerHTML, mp.get(r.innerHTML)+1);
		}
	}
}

/*document.getElementsByClassName("innerContent")[0].innerHtml = "test"*/

var ll = new Array();
var ld = new Array();
var moneyGainedArray = new Array();

mp.forEach(function(value, key, mp){
	/*console.log(key+" = "+value);*/
	ll[ll.length]=key;
	ld[ld.length]=value;
});

lm.forEach(function(value, key, lm){
	moneyGainedArray[moneyGainedArray.length] = value;
});

$(".innerContent").before('<div style="width:'+$(".mainContent").width()+';height:1000;"><canvas id="myChart" width="100" height="400"></canvas></div>');
$(".innerContent").before('<h2 style="font-size:30px;">Total gains: '+(total.toString().substring(0, Math.min(total.toString().lastIndexOf('.')+3, total.toString().length)))+'</h2>');
$(".innerContent").before('<h2 style="font-size:30px;">Total sales: '+totalSales+'</h2>');
		var ctx = document.getElementById("myChart");
		var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ll,
        datasets: [{
            label: 'Sells',
            data: ld,
            backgroundColor: [
                'rgba(58,101,129, 0.5)'
            ],
            borderColor: [
                'rgba(58,101,129,1)'
            ],
			pointBorderColor: "rgba(58,101,129,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 3,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(58,101,129, 0.5)",
            pointHoverBorderColor: "rgba(58,101,129,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,            
            borderWidth: 1
        },{
            label: 'Gained',
            data: moneyGainedArray,
            backgroundColor: [
                'rgba(239,182,28, 0.5)'
            ],
            borderColor: [
                'rgba(239,182,28,1)'
            ],
			pointBorderColor: "rgba(239,182,28,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 3,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(239,182,28, 0.5)",
            pointHoverBorderColor: "rgba(239,182,28,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,            
            borderWidth: 1
        }]
    },
    options: {
    	hover: {
    		mode: "x-axis"
    	},
    	pan: {
    		enabled: true,
    		mode: 'x'
    	},
    	zoom: {
    		enabled: true,
    		mode: 'x'
    	},
    	tooltips: {
    		enabled: true,
    		mode: 'x-axis',
    		position: 'nearest'
    	},
    	title: {
    		display: true,
    		text: "Plugins sells"
    	},
    	maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
 /*google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Year', 'Sales', 'Expenses'],
          ['2013',  1000,      400],
          ['2014',  1170,      460],
          ['2015',  660,       1120],
          ['2016',  1030,      540]
        ]);

        var options = {
          title: 'Company Performance',
          hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
          vAxis: {minValue: 0}
        };

        var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }*/