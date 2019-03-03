/**
 * License: MIT https://opensource.org/licenses/MIT
 * Plot based on http://bl.ocks.org/bbest/2de0e25d4840c68f2db1
 *
 * Cleaning: removed time, degree, expectations
 */

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

var theme = getQueryVariable("theme");
console.log(theme);

var members = [];

if (theme == "vibrant")
{
	var colors = [
		"#ff3333",
		"#ff6633",
		"#ff9933",
		"#ffcc33",
		// "#ffff33",
		// "#ccff33",
		"#99ff33",
		// "#66ff33",
		// "#33ff33",
		// "#33ff66",
		// "#33ff99",
		"#33ffcc",
		// "#33ffff",
		// "#33ccff",
		"#3399ff",
		// "#3366ff",
		"#3333ff",
		// "#6633ff",
		"#9933ff",
		// "#cc33ff",
		// "#ff33ff",
		// "#ff33cc",
		"#ff3399",
		// "#ff3366",
	]
}
else
{
	var colors = [
		"#800040",
		"#C32F4B",
		"#E1514B",
		"#F47245",
		"#FEC574",
		// "#EAF195",
		"#9CD6A4",
		"#4D9DB4",
		"#4776B4",
		"#5E4EA1",
		"#802369",
		"#802369",
	];
}


var groupMembers = 0;

var skills = [
	{"label": "Mathematics skills",					"value":function(d){return d.skills_maths}},
	{"label": "Statistical skills",					"value":function(d){return d.skills_statistics}},
	{"label": "Programming skills",					"value":function(d){return d.skills_programming}},
	{"label": "Computer usage skills",				"value":function(d){return d.skills_computer}},
	{"label": "Drawing and artistic skills",		"value":function(d){return d.skills_art}},
	{"label": "Information visualization skills",	"value":function(d){return d.skills_infovis}},
	{"label": "User experience evaluation skills",	"value":function(d){return d.skills_evaluation}},
	{"label": "Communication skills",				"value":function(d){return d.skills_communication}},
	{"label": "Collaboration skills",				"value":function(d){return d.skills_collaboration}},
	{"label": "Code repository skills",				"value":function(d){return d.skills_repository}},
];


var svg = d3.select(".labels").append("svg")
	.attr("width", 260)
	.attr("height", 540)
	.append("g")

var textPosition = 20;
skills.forEach(function(d, i)
{
	svg.append("svg:circle")
		.attr("r", 8)
		.attr("fill", colors[i])
		.attr("cy", textPosition)
		.attr("cx", 10)
	svg.append("svg:text")
		.text(d.label)
		.attr("class","svg-text")
		.attr("text-anchor", "left")
		.attr("y", textPosition + 5)
		.attr("x", 30)
	textPosition += 30;
});

textPosition += 20;

var membersText = svg.append("svg:text")
	.attr("font-size", 18)
	.attr("font-weight", "normal")
	.attr("y", textPosition + 10)


var updateMembers = function()
{
	var full = (groupMembers >= 6);
	membersText.attr("fill", full? "#00ff11" : "yellow");
	membersText.text(groupMembers + "/6 members selected");
	var memberPosition = textPosition + 40;
	svg.selectAll(".member").remove();
	members.forEach(function(d)
	{
		svg.append("svg:text")
			.text(" ‣ " + d.name)
			.attr("class", "member")
			.attr("y", memberPosition)
			.attr("x", 10)
			.attr("fill", "white")
		memberPosition += 30;
	});
}

updateMembers();

d3.csv('data.csv', function(error, data) {
	data.forEach(function(student)
	{
		var width = 200,
		height = width + 50,
		outerRadius = Math.min(width, height) / 2 * 0.90,
		innerRadius = 0.3 * outerRadius;
		var majors = student.major.split(",");
		firstMajor = majors[0].match(/\b(\w)/g).join('');
		if(majors.length > 1)
		{
			firstMajor += "*";
		}

		var pie = d3.layout.pie()
			.sort(null)
			.value(function(d) { return 1; });

		var skillTip = d3.tip()
			.attr('class', 'd3-tip')
			.attr('width', 0)
			.offset([0, 0])
			.html(function(d, i) {
				return skills[i].label + ": <span style='color:lightgreen'>" + skills[i].value(student) + "</span>";
		});

		var maxAboutLength = 500;
		if (student.about.length > maxAboutLength)
		{
			var about = student.about.substring(0, maxAboutLength) + " (...)";
		}
		else
		{
			about = student.about;
		}
		if (about === "") {
			about = "N/A";
		}

		var majorTip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([0, 0])
			.html("<span style='color:lightgreen'>Major: </span>" + student.major + "" + "<div><span style='color:lightgreen'>Interests:</span> " + about + "</div><div><span style='color:#f14758'>(Press to toggle member)</div>")

		var arc = d3.svg.arc()
		.innerRadius(innerRadius)
		.outerRadius(function (d, i) {
			return (outerRadius - innerRadius) * (skills[i].value(student) / 10.0) + innerRadius;
		});

		var svg = d3.select("#chart").append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		svg.call(skillTip);
		svg.call(majorTip);

		var outerCircle = svg.append("svg:circle")
			.attr("class", "outerCircle")
			.attr("stroke-width", 3)
			.attr("r", outerRadius + 5)
			.attr("fill", "none")

		var path = svg.selectAll(".solidArc")
				.data(pie(skills))
			.enter().append("path")
				.attr("fill", function(d, i) { return colors[i]; })
				.attr("class", "solidArc")
				.attr("stroke", "none")
				.attr("d", arc)
				.on('mouseover', skillTip.show)
				.on('mouseout', skillTip.hide);

		svg.append("svg:text")
			.attr("text-anchor", "middle")
			.attr("class","svg-text")
			.text(student.name)
			.attr("font-size", 16)
			.attr("y", function(d){return -outerRadius - 10});

		var toggleColor = ['none', '#3a3a3a'];
		var selected = false;
		svg.append("svg:circle")
			.attr("class", "midCircle")
			.attr("r", innerRadius)
			.attr("fill", "#191919")
			.on('mouseover', majorTip.show)
			.on('mouseout', majorTip.hide)
			.on('click', function()
			{
				if (selected || groupMembers < 6)
				{
					selected = !selected;
					if (selected)
					{
						groupMembers++;
						members.push(student);
					}
					else
					{
						groupMembers--;
						members = members.filter(e => e !== student);
					}
					toggleColor = [toggleColor[1], toggleColor[0]];
					outerCircle.style("fill", toggleColor[0]);
					updateMembers();
				}
			});

		svg.append("svg:text")
			.attr("text-anchor", "middle")
			.attr("font-size", 16)
			.attr("fill", "white")
			.attr("y", 4)
			.text(firstMajor)
			.attr("pointer-events", "none")
		;
	});
});
