var activity_chart = dc.pieChart("#activity");
var country_chart = dc.pieChart("#country");
var organisation_chart = dc.rowChart("#organisation");
var region_chart = dc.geoChoroplethChart("#map");

var cf = crossfilter(data);

cf.activity = cf.dimension(function(d){ return d.Activity; });
cf.country = cf.dimension(function(d){ return d.Country; });
cf.organisation = cf.dimension(function(d){ return d.Organisation; });
cf.region = cf.dimension(function(d){ return d.Region; });


var activity = cf.activity.group();
var country = cf.country.group();
var organisation = cf.organisation.group();
var region = cf.region.group();
var all = cf.groupAll();

activity_chart.width(200).height(200)
        .dimension(cf.activity)
        .group(activity)
        .colors(['#ffe082',
                 '#ffd54f',
                 '#ffca28',
                 '#ffc107',
                 '#ffb300',
                 '#ffa000',
                 '#ff8f00',
                 '#ff6f00'
            ])
        .colorDomain([1,8])
        .colorAccessor(function(d, i){return i%7+1;});

country_chart.width(200).height(200)
        .dimension(cf.country)
        .group(country)
        .colors(['#0d5302',
                 '#0a7e07',
                 '#259b24',
                 '#42bd41'
            ])
        .colorDomain([0,4])
        .colorAccessor(function(d, i){return i%4;});


organisation_chart.width(350).height(600)
        .dimension(cf.organisation)
        .group(organisation)
        .elasticX(true)
        .data(function(group) {
            return group.top(20);
        })
        .colors(['#81d4fa',
                 '#4fc3f7',
                 '#29b6f6',
                 '#03a9f4',
                 '#039be5',
                 '#0288d1',
                 '#0277bd',
                 '#01579b'
            ])
        .colorDomain([0,8])
        .colorAccessor(function(d, i){return i%8;});
        
region_chart.width(750).height(330)
        .dimension(cf.region)
        .group(region)
        .colors(['#DDDDDD', '#e51c23'])
        .colorDomain([0, 1])
        .colorAccessor(function (d) {
            if(d>0){
                return 1;
            } else {
                return 0;
            }
        })
        .overlayGeoJson(regions.features, "Regions", function (d) {
            return d.properties.NAME_REF;
        })
        .projection(d3.geo.mercator().center([4,4]).scale(1400))
        .title(function(d){
            return d.key;
        });
dc.renderAll();  

var projection = d3.geo.mercator()
    .center([4,4])
    .scale(1400);

var path = d3.geo.path()
    .projection(projection);

var g = d3.selectAll("#map").select("svg").append("g");
        
g.selectAll("path")
    .data(westafrica.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke",'#999999')
    .attr("stroke-width",'2px')
    .attr("fill",'none')
    .attr("class","country");
    
var mapLabels = d3.selectAll("#map").select("svg").append("g");
mapLabels.selectAll('text')
    .data(westafrica.features)
    .enter()
    .append("text")
    .attr("x", function(d,i){
                return path.centroid(d)[0]-20;})
    .attr("y", function(d,i){
                return path.centroid(d)[1];})
    .attr("dy", ".55em")
    .attr("class","maplabel")
    .style("font-size","12px")
    .attr("opacity",0.4)
    .text(function(d,i){
        return d.properties.NAME;
    });

