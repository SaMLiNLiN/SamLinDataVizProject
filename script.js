function assignment6() {
    let filePath1 = "nba_2011_2012_season_player.csv";
    let filePath2 = "nba_2014_2015_season_player.csv";
    let filePath3 = "gsw_2022_2023_season_salary.csv";
    let filePath4 = "nba_2011_2023_champs.csv"
    question0(filePath1);
    question1(filePath2);
    question2(filePath3);
    question3(filePath4);
}

let new_data; // Define new_data as a global variable

let question0 = function (filePath1) {
    //preprocess data
    d3.csv(filePath1).then(function (data) {
        data.forEach(d => {
            d.Pos = d.Pos.split("-")[0]
            d.MP = parseFloat(d.MP);
        })
        plot1_1(data);
    });
    
}

let question1 = function (filePath2) {
    d3.csv(filePath2)
    .then(function (data) {
        data.forEach(d => {
            d.Pos = d.Pos.split("-")[0]
            d.MP = parseFloat(d.MP);
        })
        plot1_2(data);
    });
}

let plot1_1 = function (data) {
    // getting needed
    const needed_data = data.map((d) => {
        return { Pos: d.Pos, MP: d.MP, player: d.Player, Tm: d.Tm}
    })

    // getting team GSW
    const needed_data2 = needed_data.filter((d) => d.Tm == "GSW")

    // group the data
    const grouped_data = d3.flatRollup(needed_data2,
        (group) => ({
            MP: d3.mean(group, (d) => d.MP)
        }), (d) => d.Pos)

    // make it pretty :)
    const flattenedData = grouped_data.map((d) => ({
        Pos: d[0],
        MP: d[1].MP
    }));

    // sorting position
    const short_to_tall = ['PG', 'SG', 'SF', 'PF', 'C'];
    const new_data = flattenedData.sort((a, b) => {
        return short_to_tall.indexOf(a.Pos) - short_to_tall.indexOf(b.Pos);
      });

    console.log(new_data)

    // set dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 50, left: 50},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // svg object for plot1
    var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

    //define scaling
    let groups = d3.map(new_data, function (d) { return (d.Pos) })
    let xScale = d3.scaleBand()
        .domain(groups)
        .range([margin.left, width])
        .padding([0.6]);
    svg.append("g")
        .attr("transform", "translate(" + (margin.left) + "," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "center")
        .style("font-size", "15px")
        .style("font-weight", "bold");
        
        
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(new_data, (d => d.MP)) + 3])
        .range([height, margin.top*2]);
    svg.append("g")
        .attr("transform", "translate(" + margin.left * 2 + ", 0)")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("text-anchor", "center")
        .style("font-size", "15px")
        .style("font-weight", "bold");

    // generate graph
    svg.selectAll("rect")
        .data(new_data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.Pos) + xScale.bandwidth())
        .attr("y", d => yScale(d.MP))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.MP))
        .attr("fill", "#0072bc")
        .attr("stroke", "black")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    // interactivity
    var tooltip = d3.select('#q1_plot')
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("border-style", "solid")
      .style("border-color", "red")
      .style("border-width", "1.5px")
      .style("font-size", "10px")
      .style("background-color", "white");

    function handleMouseOver(d){
        d3.select(this)
            .style("stroke", "red")
            .style("stroke-width", "3px")

        tooltip
            .style("opacity", 1)
            .style("position", "absolute")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px")
            .text("Avg play time: " + String(parseFloat(d3.select(this).datum().MP).toFixed(2)) + "mins")
    }

    function handleMouseOut(d){
        d3.select(this)
            .style("stroke-width", null)
            .style("stroke", null)

        tooltip
            .style("opacity", 0)
    }
}

let plot1_2 = function (data, data2) {
    // getting needed
    const needed_data = data.map((d) => {
        return { Pos: d.Pos, MP: d.MP, Tm: d.Tm}
    })

    // get team GSW
    const needed_data2 = needed_data.filter((d) => d.Tm == "GSW")

    // group the data
    const grouped_data = d3.flatRollup(needed_data2,
        (group) => ({
            MP: d3.mean(group, (d) => d.MP)
        }), (d) => d.Pos)

    // make it pretty :)
    const flattenedData = grouped_data.map((d) => ({
        Pos: d[0],
        MP: d[1].MP
    }));

    // sorting position
    const short_to_tall = ['PG', 'SG', 'SF', 'PF', 'C'];
    const new_data = flattenedData.sort((a, b) => {
        return short_to_tall.indexOf(a.Pos) - short_to_tall.indexOf(b.Pos);
      });

    // set dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 50, left: 50},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // svg object for plot1
    var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

    // xScale
    let groups = d3.map(new_data, function (d) { return (d.Pos) })
    let xScale = d3.scaleBand()
        .domain(groups)
        .range([margin.left, width])
        .padding([0.6]);

    // yScale
    let yScale = d3.scaleLinear()
        .domain([0, 30.65 + 3])
        .range([height, margin.top * 2]);

    // bars
    svg.selectAll(".bars")
        .data(new_data)
        .enter()
        .append("rect")
        .attr("class", "bars")
        .attr("x", d => xScale(d.Pos) + xScale.bandwidth()*2 + 2)
        .attr("y", d => yScale(d.MP))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.MP))
        .attr("fill", "#FFF380")
        .style("font-weight", "bold")
        .attr("stroke", "black")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    // interactivity
    var tooltip = d3.select('#q1_plot')
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("border-style", "solid")
      .style("border-color", "red")
      .style("border-width", "1.5px")
      .style("font-size", "10px")
      .style("background-color", "white");

      function handleMouseOver(d){
        d3.select(this)
            .style("stroke", "red")
            .style("stroke-width", "3px")

        tooltip
            .style("opacity", 1)
            .style("position", "absolute")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px")
            .text("Avg play time: " + String(parseFloat(d3.select(this).datum().MP).toFixed(2)) + "mins")
    }

    function handleMouseOut(d){
        d3.select(this)
            .style("stroke-width", null)
            .style("stroke", null)

        tooltip
            .style("opacity", 0)
    }

    // final touches axis, title, legend
    svg.append("text")
        .attr("class", "x-axis-title")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Positions");

    svg.append("text")
        .attr("class", "y-axis-title")
        .attr("transform", "translate(0, " + ((height + margin.top + margin.bottom) / 2) + ") rotate(-90)")
        .attr("x", margin.left)
        .attr("y", height / 2)
        .attr("dy", -margin.left * 2)
        .attr("dx", -margin.top)
        .style("font-size", "18px")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("Minutes Played");

    svg.append("text")
        .attr("class", "plot-title")
        .attr("x", ((width + margin.left + margin.right) / 2))
        .attr("y", margin.top - 5)
        .style("font-size", "17px")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("GSW Significantly Increased Playing time For PG & SF in Season 2014-2015");

    svg.append("text")
        .attr("class", "index")
        .attr("x", ((width + margin.left + margin.right) / 2))
        .attr("y", height + margin.bottom * 1.5)
        .style("font-size", "12px")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("INDEX: PG: point guard, SG: shooting guard, SF: small forward, PF: power forward, C: center");

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width - margin.right * 1.5) + "," + margin.top * 3 + ")");

    legend.append("text")
        .attr("class", "legend-title")
        .attr("x", 0)
        .attr("y", 0)
        .style("font-size", "15px")
        .style("font-weight", "bold")
        .text("Legend");

    legend.append("circle")
        .attr("class", "season1")
        .attr("r", 4)
        .attr("cx", 4)
        .attr("cy", 15)
        .style("stroke", "black")
        .style("fill", "#0072bc");

    legend.append("text")
        .attr("class", "first-item")
        .attr("x", 10)
        .attr("y", 18)
        .style("font-size", "12px")
        .text("Season 2011-2012");

    legend.append("circle")
        .attr("class", "season2")
        .attr("r", 4)
        .attr("cx", 4)
        .attr("cy", 30)
        .style("fill", "#FFF380")
        .style("stroke", "black");

    legend.append("text")
        .attr("class", "first-item")
        .attr("x", 10)
        .attr("y", 33)
        .style("font-size", "12px")
        .text("Season 2014-2015")
}









let question2 = function (filePath3) {
    // preprocess data
    d3.csv(filePath3).then(function (data) {

        const attribute_names = data.columns.map((attribute) => {
            attribute = attribute.replace(" ", '_');
            attribute = attribute.replace("-", "_");
            attribute = attribute.replace("2022_23", "wanted_salary");
            return attribute
        });

        const new_data = data.map((row) => {
            const modifiedAttribute = {};
            attribute_names.forEach((attribute, index) => {
                modifiedAttribute[attribute] = row[data.columns[index]];
            });
            return modifiedAttribute;
        });

        const needed_data = new_data.map((d) => {
            return { Player: d.Player, Team: d.Tm, Salary: d.wanted_salary, position: d.Pos, ID: d.id}
        })

        const cleanMoney = needed_data.map((d) =>{
            const transformSalary = parseInt(d.Salary.replace(/\$|,|\s/g, ''), 10);
            const salary = isNaN(transformSalary) ? 0 : transformSalary;
            return {
                Player: d.Player,
                Team: d.Team,
                Salary: salary,
                Position: d.position,
                ID: d.ID
            }
        })

        // add svg
        const svg = d3.select('#q2_plot');
        const margin = { top: 15, right: 15, bottom: 35, left: 15},
        width = 200 - margin.left - margin.right,
        height = 223 - margin.top - margin.bottom;

        d3.select('#title').append("text")
            .attr("class", "plot-title")
            .style("font-size", "17px")
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .text("PG, SG, and SF Contains Top Paid Player in Season 2021-2022");

        d3.select("#index").append("text")
            .attr("class", "index")
            .style("font-size", "12px")
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .text("INDEX: PG: point guard, SG: shooting guard, SF: small forward, PF: power forward, C: center");

        // group by position
        const pos_nodes = d3.group(cleanMoney, d => d.Position);

        // charts for each pos
        pos_nodes.forEach((PosData, Position) => {
            const positionSvg = svg.append('svg')
                .attr('width', width)
                .attr('height', height)
                .attr('class', 'position_chart')
                .style('transform', `scale(2.1)`);

            const nodes = PosData.map(d => ({
                Player: d.Player,
                Salary: d.Salary,
                Position: d.Position
                }));

            // create links
            const links = nodes.flatMap(d => {
                return PosData.filter(x => x !== d && x.Position == d.Position)
                    .map(x => ({ source: d.Player, target: x.Player}));
            });

            // edge thickness
            const thickness = d3.scaleLinear()
                .domain(d3.extent(cleanMoney, d => d.Salary))
                .range([1, 3]);

            // create edges
            const edges = positionSvg.selectAll('line')
                .data(links)
                .enter()
                .append('line')
                .attr("stroke", "#FDBD01");

            // create nodes
            const node = positionSvg.selectAll('circle')
                .data(nodes)
                .enter()
                .append('circle')
                .attr("class", "chart_nodes")
                .attr("fill", "#2554C7")
                .attr("stroke", "black")
                .attr('r', 5);

            // create labels :)
            const label = positionSvg.append("g")
                .attr("class", "labels")
                .selectAll("text")
                .data(nodes)
                .join("text")
                .attr("class", "label")
                .text(d => d.Player.split(" ")[1])
                .style("font-size", "3.5pt");

            // add titles
            const titles = positionSvg.append('text')
                .attr('class', 'chart-title')
                .attr('x', (width - margin.left) / 2)
                .attr('y', (margin.top * 4))
                .text(Position)
                .style("font-size", "6pt")
                .style("font-weight", "bold");

        // force simu
        const force = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.Player))
            .force('charge', d3.forceManyBody().strength(-15))
            .force('center', d3.forceCenter(width/2, height/2));

        // simulation "ticks", execute call back function
        force.on("tick", function() {
            edges
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y)
                .attr('stroke-width', d => thickness(d.source.Salary));;

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)

            label
                .attr("x", d => d.x + 5)
                .attr("y", d => d.y + 5)
        })
    });
    // interactivity
    var button_click = d3.select("#mybutton");
    button_click.on("click", function() {
        if (d3.select("#mybutton").text() == "Table view") {
            d3.select("#mybutton").text("Click to Close Table");
            var table = d3.select("#q2_plot").append("table");
            var thead = table.append("thead");
            var attributes = thead.append("tr");
            attributes.append("th").text("Name");
            attributes.append("th").text("Position");
            attributes.append("th").text("Salary");
            var prev_table = table.append("tbody");
            var rows = prev_table.selectAll("tr")
                .data(needed_data)
                .enter()
                .append("tr");
            rows.append("td").text(function(d) {return d.Player;});
            rows.append("td").text(function(d) {return d.position;});
            rows.append("td").text(function(d) {return d.Salary;});
            console.log("Element clicked!");
        } else {
            d3.select("#mybutton").text("Table view");
           d3.select("table").remove("table")
        }
      });     
});
}




let question3 = function (filePath4) {
    // State Symbol dictionary for conversion of names and symbols.
    let stateSym = {
        AZ: 'Arizona',
        AL: 'Alabama',
        AK: 'Alaska',
        AR: 'Arkansas',
        CA: 'California',
        CO: 'Colorado',
        CT: 'Connecticut',
        DC: 'District of Columbia',
        DE: 'Delaware',
        FL: 'Florida',
        GA: 'Georgia',
        HI: 'Hawaii',
        ID: 'Idaho',
        IL: 'Illinois',
        IN: 'Indiana',
        IA: 'Iowa',
        KS: 'Kansas',
        KY: 'Kentucky',
        LA: 'Louisiana',
        ME: 'Maine',
        MD: 'Maryland',
        MA: 'Massachusetts',
        MI: 'Michigan',
        MN: 'Minnesota',
        MS: 'Mississippi',
        MO: 'Missouri',
        MT: 'Montana',
        NE: 'Nebraska',
        NV: 'Nevada',
        NH: 'New Hampshire',
        NJ: 'New Jersey',
        NM: 'New Mexico',
        NY: 'New York',
        NC: 'North Carolina',
        ND: 'North Dakota',
        OH: 'Ohio',
        OK: 'Oklahoma',
        OR: 'Oregon',
        PA: 'Pennsylvania',
        RI: 'Rhode Island',
        SC: 'South Carolina',
        SD: 'South Dakota',
        TN: 'Tennessee',
        TX: 'Texas',
        UT: 'Utah',
        VT: 'Vermont',
        VA: 'Virginia',
        WA: 'Washington',
        WV: 'West Virginia',
        WI: 'Wisconsin',
        WY: 'Wyoming'
    };
    

    d3.csv(filePath4).then(function (data) {
        // add svg
        // set dimensions and margins of the graph
        const margin = { top: 30, right: 30, bottom: 30, left: 30 },
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        // append the svg object to the div "q3_plot" of the page
        var svg = d3.select("#q3_plot").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height);

        // projection
        const projection = d3.geoAlbersUsa().scale(650).translate([width/2, height/2]);
        const pathgeo = d3.geoPath().projection(projection);

        // clean data for total champ per state
        const needed_data = data.map((d) => {
            return { Year: d.Year, 
                State: d.State,
                Champ: d.Champion }
        })
        console.log(needed_data)

        const counted = d3.flatRollup(needed_data, v => v.length, d => d.State)
        console.log(counted)

        const flattenedData = Object.fromEntries(counted)
        console.log(flattenedData)

        // clean data for tooltip
        const group_state = d3.group(needed_data, d => d.State)
        console.log("here")
        console.log(group_state)

        // getting champ num
        const champNum = counted.map(d => d[1])
        console.log(champNum)

        // colors
        const colorScale = d3.scaleSequential()
            .domain([(d3.min(champNum)), (d3.max(champNum))])
            .interpolator(d3.interpolateYlGnBu);

        // legend
        const legendContainer = document.getElementById('legend');
        const ColorBar = document.createElement('div');
        ColorBar.style.backgroundImage = `linear-gradient(to right, ${colorScale.range().join(',')})`;
        ColorBar.style.border = '1px solid black';
        ColorBar.style.width = '200px';
        ColorBar.style.height = '20px';

        const legend = document.createElement('div');
        
        const minNum = document.createElement('span');
        minNum.textContent = d3.min(champNum);
        minNum.style.marginBottom = '40px';
        legend.appendChild(minNum);
        
        legend.appendChild(ColorBar);

        const maxNum = document.createElement('span');
        maxNum.textContent = d3.max(champNum);
        maxNum.style.marginBottom = '40px';
        legend.appendChild(maxNum);

        legend.style.display = 'flex';
        legend.style.alignItems = 'center';
        legend.style.justifyContent = 'center';

        legendContainer.appendChild(legend);
        // legendContainer.style.marginLeft = '450px';

        // load file
        const statesmap = d3.json("./us-states.json");
        statesmap.then(function (map){
            svg.selectAll("path")
            .data(map.features)
            .enter()
            .append("path")
            .attr("d", pathgeo)
            .attr("fill", function(d) {
                if ((flattenedData[d.properties.name]) == undefined) {
                    return "White"
                }
                console.log(flattenedData[d.properties.name])
                return colorScale((flattenedData[d.properties.name]))
            })
            .attr("stroke-width", "1pt")
            .attr("stroke", "black")
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);
        })

        var tooltip = d3.select('#q3_plot')
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("border-style", "solid")
            .style("border-color", "red")
            .style("border-width", "1.5px")
            .style("font-size", "10px")
            .style("background-color", "white")
            .style("white-space", "pre-line");

        function handleMouseOver(d){
            const yearChamps = group_state.get(d3.select(this).datum().properties.name).map(entry => `Year: ${entry.Year}, Champ: ${entry.Champ}`).join("<br>");
            d3.select(this)
                .style("stroke", "red")
                .style("stroke-width", "3px")

            tooltip
                .style("opacity", 1)
                .style("position", "absolute")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px")
                .html("STATE: " + d3.select(this).datum().properties.name + "<br>" + "<br>"
                + "LIST OF CHAMPS: " + "<br>" + yearChamps);
            }

        function handleMouseOut(d){
            d3.select(this)
                .style("stroke-width", null)
                .style("stroke", null)

            tooltip
                .style("opacity", 0)
            }
       
    // title
    svg.append("text")
        .attr("class", "plot-title")
        .attr("x", (width + margin.left + margin.right) / 2)
        .attr("y", margin.top / 2.5)
        .style("font-size", "17px")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("Teams in CA (Especially GSW) Has Won the Most Championships From Season 2011 - 2022");
    })

}


