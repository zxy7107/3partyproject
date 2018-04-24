var WIDTH = 1024,
    HEIGHT = 720;
    console.log('oh');
var counter = 0;


var MainView = Backbone.View.extend({
    initialize: function () {
	
		var i,
			dotGroup,
			animal;
			
        Math.seedrandom('fish');

		this.state = 0;
		this.dots = [];
		this.animals = [];
		this.trees = [];
		this.treeFaces = [];
		this.s = Snap(document.getElementsByTagName('svg')[1]);
		
		//dot animals
		dotGroup = this.s.select('#dots');
		this.dots = dotGroup.selectAll('*');
		
		for (i = 0; i < this.dots.length; i += 1) {
			animal = new PathAnimal({s: this.s, dot: this.dots[i]});
			this.animals.push(animal);
		}
		
		//sort depth
		for (i = 0; i < this.animals.length; i += 1) {
			if (i > 0) {
				var a = this.animals[i - 1].el,
					b = this.animals[i].el;
				
				if (a.matrix.split().dy > b.matrix.split().dy) {
					a.before(b);
				}
			}
		}
		
		//trees
		this.trees = this.s.selectAll('.tree');
		for (i = 0; i < this.trees.length; i += 1) {
			var tree = new TreeFace({s: this.s, tree: this.trees[i]});
			this.treeFaces.push(tree);
		}
		

		setTimeout(this.animate.bind(this), 3000);


        var svg = d3.select('#main');


        function dist(d)
        {
            return d.distance+30;
        }



        var questions =[{
            Q: "沟通业务逻辑：刷卡酒店可领券时间段",
            edges:[ {type: "licensing","source":0,"target":14,"distance":10, "relation":"后端"},
                 {type: "suit","source":14,"target":5,"distance":20, "relation":"挚友"},
                 {type: "resolved","source":5,"target":6,"distance":20, "relation":"挚友"},
                 {type: "suit","source":6,"target":9,"distance":20, "relation":"挚友"},
                 {type: "licensing","source":9,"target":2,"distance":20, "relation":"挚友"},
            ],
			style: {
                stroke: "rgb(255,0,0)",
                strokeWidth: "2"
			}
        },{
            Q: "数据库资源",
            edges:[ {type: "licensing","source":0,"target":14,"distance":10, "relation":"后端"},
            ],
			style: {
                stroke: "blue",
                strokeWidth: "2"
			}
        },{
            Q: "去哪儿酒店页面跳转问题",
            edges:[ {type: "licensing","source":0,"target":14,"distance":10, "relation":"后端"},
            ],
			style: {
                stroke: "blue",
                strokeWidth: "2"
			}
        },{
            Q: "前端hysdk",
            edges:[ {type: "licensing","source":0,"target":14,"distance":10, "relation":"后端"},
                 {type: "licensing","source":14,"target":5,"distance":20, "relation":"挚友"},
                 {type: "licensing","source":5,"target":6,"distance":20, "relation":"挚友"},
                 {type: "licensing","source":6,"target":9,"distance":20, "relation":"挚友"},
                 {type: "licensing","source":9,"target":2,"distance":20, "relation":"挚友"},
            ],
			style: {
                stroke: "yellow",
                strokeWidth: "2"
			}
        },{
            Q: "配置offline权限",
            edges:[ {type: "licensing","source":0,"target":14,"distance":10, "relation":"后端"},
                 {type: "licensing","source":14,"target":5,"distance":20, "relation":"挚友"},
                 {type: "licensing","source":5,"target":6,"distance":20, "relation":"挚友"},
                 {type: "licensing","source":6,"target":9,"distance":20, "relation":"挚友"},
                 {type: "licensing","source":9,"target":2,"distance":20, "relation":"挚友"},
            ],
			style: {
                stroke: "pink",
                strokeWidth: "2"
			}
        }
        ]

        //(1)创建三种连线的标记
        //各自属性是什么意思？？
        svg.append("svg:defs").selectAll("marker")
            .data(["suit", "licensing", "resolved"])
            .enter().append("svg:marker")
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");




        d3.json("../relation-qunar-2.0.json",function(error,root){
            d3.select('#icon').on('click', function () {
                console.log(counter)
                d3.selectAll('.links').remove();
                var edges = {};
                var edgesArray = [];

                edges = _.extend({}, edges, questions[counter].edges)
                _.each(edges, function(e,k) {
                    edgesArray.push(e)
                })

                root = _.extend({}, root, {
                    edges: edgesArray
                })


                var simulation = d3.forceSimulation(root.nodes).alphaDecay(0.01)
                    .force("link", d3.forceLink(root.edges)
                        .distance(function(d){
                            console.log(d)
                            var x1 = d.source.x;
                            var x2 = d.target.x;
                            var y1 = d.source.y;
                            var y2 = d.target.y;

                            return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
                        })
                        .strength(1).iterations(10))



                //Define the node
                var node = svg.append("g")
                    .attr("class","nodes")
                    .selectAll("circle")
                    .data(root.nodes)
                    .enter().append("circle")
                    .attr("r",function(d){return d.r;})
                    .attr("cx",function(d){ return d.x;})
                    .attr("cy",function(d){ return d.y;})
                    .attr("fill","blue").attr("opacity",1)
                    .call(d3.drag()
                        .on("start",dragstarted)
                        .on("drag",dragged)
                        .on("end",dragended));

                var arcMinRadius = 20,
                    arcPadding = 10,
                    labelPadding = -5;

                //#引入线条links
                //Define the link
                //虽然此时Link Forces已经存在，但是我们看不到它。因此有时我们需要把它们显示出来，因此引入Links。
                // var link = svg.append("g")
                //     .attr("class", "links")
                //     .selectAll("path")
                //     .data(root.edges)
                //     .enter()
                //     .append("path")
                    // .attr("stroke", questions[counter].style.stroke)
                    // .attr("stroke-width", questions[counter].style.strokeWidth)
                
                var path = svg.append("g").selectAll("path")
                    .data(root.edges)
                path.exit().transition()
                    .remove();
                console.log(path)

                path = path.enter().append("path")
                    .attr("class", function(d) { return "link " + d.type; })
                    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; })
                    .call(function (node) {
                        node.transition().attr("r", 8);
                    })
                    .merge(node);




                //#引入标注
                //此时我们无法分辨节点的id，因此我们引入标注：
                //首先定义标注属性：

                //Define the text
                var text = svg.selectAll("text")
                    .data(root.nodes)
                    .enter()
                    .append("text")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "11px")
                    .attr("fill", "yellow");


                simulation.on("tick",ticked);
                counter++;
                function dragstarted(d)
                {
                    if (!d3.event.active) simulation.restart();
                    simulation.alpha(0.7);
                    d.fx = d.x;
                    d.fy = d.y;

                }

                function dragged(d)
                {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                }

                function dragended(d)
                {
                    d.fx = null;
                    d.fy = null;
                    if (!d3.event.active) simulation.alphaTarget(0.1);
                }

                function ticked(){
                    node
                        .attr("cx", function(d){
                            return d.x;
                        })
                        .attr("cy", function(d){ return d.y;})

//                     link
//                         .attr("x1", function(d) {
// //                    console.log(d)
//                             return d.source.x;
//                         })
//                         .attr("y1", function(d) { return d.source.y; })
//                         .attr("x2", function(d) { return d.target.x; })
//                         .attr("y2", function(d) { return d.target.y; });


                    path.attr("d", function(d) {
                        var dx = d.target.x - d.source.x,//增量
                            dy = d.target.y - d.source.y,
                            dr = Math.sqrt(dx * dx + dy * dy);
                        return "M" + d.source.x + ","
                            + d.source.y + "A" + dr + ","
                            + dr + " 0 0,1 " + d.target.x + ","
                            + d.target.y;
                    });

                    //由于标志也随着节点位置变化而变化，因此在ticked()函数中我们也需要对text实时更新：
                    //同样，需要在ticked()中更新link：
                    text.text(function(d) {
                        return d.name;
                    })
                        .attr("x", function(d, i) {
                            return d.x;
                        })
                        .attr("dx", "-3.5")
                        .attr("dy", "2.5")
                        .attr("y", function(d) {
                            return d.y;
                        })
                }

            })

        })

    },


	trigger: function () {
		this.state += 1;//this.number;
		var animal = this.animals[this.state];
		animal.handle_MOUSEOVER();
		
	},

	animate: function () {
		var tree = this.treeFaces[Math.floor(Math.random() * this.treeFaces.length)];
		tree.handle_MOUSEOVER();
		
		setTimeout(function () {
			tree.handle_MOUSEOUT();
		}.bind(this), 3000);
		
		setTimeout(this.animate.bind(this), 3000);
	}
});


var main = new MainView();