//var WIDTH = 1024,
//    HEIGHT = 720;
var WIDTH = 800,
    HEIGHT = 800;
var counter = 0;


var MainView = Backbone.View.extend({

        initialize: function () {

            var i;

            Math.seedrandom('fish');

            this.state = 0;
            this.dots = [];
            this.animals = [];
            this.trees = [];
            this.treeFaces = [];
            this.s = Snap(document.getElementsByTagName('svg')[1]);

            //trees
            this.trees = this.s.selectAll('.tree');
            for (i = 0; i < this.trees.length; i += 1) {
                var tree = new TreeFace({s: this.s, tree: this.trees[i]});
                this.treeFaces.push(tree);
            }


            setTimeout(this.animate.bind(this), 3000);

            this.model.svg.attr('width', WIDTH)
                .attr('height', HEIGHT)

            function dist(d) {
                return d.distance + 30;
            }

            //(1)创建三种连线的标记
            //各自属性是什么意思？？
            this.model.svg.append("svg:defs").selectAll("marker")
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


            //this.renderDots();
            //d3.select('#icon').on('click', this.renderDots.call(this))
            var self = this;

            //var edgesArray = [];
            //
            //_.each(this.model.questions[counter].edges, function (e, k) {
            //    edgesArray.push(e)
            //})
            //
            //this.root = _.extend({}, this.model.root, {
            //    edges: edgesArray
            //})

            this.generateEdges();
            this.renderNode();
            this.renderText();
            self.renderDots.call(self)

            //d3.select('body').on('click', function () {
            //
            //    self.generateEdges();
            //    self.renderDots.call(self)
            //
            //})


        },
        generateEdges: function(){
            var edgesArray = [];

            //_.each(this.model.questions[counter].edges, function (e, k) {
            _.each(this.model.questions[counter].edges, function (e, k) {
                edgesArray.push(e)
            })

            this.root = _.extend({}, this.model.root, {
                edges: edgesArray
            })
        },

        renderNode: function(){
            var self = this;
            //Define the node
            this.node = this.model.svg.select('#idgtext')
                .attr("class", "nodes")
                .selectAll("circle")
                .data(this.root.nodes)
                .enter().append("circle")
                .attr("r", function (d) {
                    return d.r;
                })
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("fill", function (d) {
                    return d.color || "blue"
                })
                .attr("opacity", 1)
                .call(d3.drag()
                    .on("start", function (d) {
                        self.dragstarted.call(self, d)
                    })
                    .on("drag", function (d) {
                        self.dragged.call(self, d)
                    })
                    .on("end", function(d){
                        self.dragended.call(self, d)
                    }));

        },
        renderText: function(){
            //Define the text
            this.text = this.model.svg.selectAll("text")
                .data(this.root.nodes)
                .enter()
                .append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "yellow");

            this.text.text(function (d) {
                    return d.name;
                })
                .attr("x", function (d, i) {
                    return d.x;
                })
                .attr("dx", "-3.5")
                .attr("dy", "2.5")
                .attr("y", function (d) {
                    return d.y;
                })
        },

        renderDots: function () {
            var self = this;

            console.log(counter)
            d3.selectAll('.links').remove();


            this.simulation = d3.forceSimulation(this.root.nodes).alphaDecay(0.01)
                .force("link", d3.forceLink(this.root.edges)
                    .distance(function (d) {
                        var x1 = d.source.x;
                        var x2 = d.target.x;
                        var y1 = d.source.y;
                        var y2 = d.target.y;

                        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
                    })
                    .strength(1).iterations(10))



            //this.path = this.model.svg.append("g").selectAll("path")
            this.path = this.model.svg.select("#idg").selectAll("path")
                .data(this.root.edges)

            this.path.attr("class", function (d) {
                    return "link " + d.type;
                })
                .attr("marker-end", function (d) {
                    return "url(#" + d.type + ")";
                })
                .attr("strokeWidth", "10")
                .call(function (node) {
                    node.transition().attr("r", 8);
                })
            console.log(this.path)
            this.path.exit()
                .transition()
                .remove();

            this.path = this.path.enter().append("path")
                .attr("class", function (d) {
                    return "link " + d.type;
                })
                .attr("marker-end", function (d) {
                    return "url(#" + d.type + ")";
                })
                .call(function (node) {
                    node.transition().attr("r", 8);
                })
                //.merge(self.node);




            this.simulation.on("tick", function(){
                self.ticked.call(self)
            });
            counter++;


        },
        dragstarted: function (d) {

            if (!d3.event.active) this.simulation.restart();
            this.simulation.alpha(0.7);
            d.fx = d.x;
            d.fy = d.y;

        },
        dragged: function (d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        },
        dragended: function (d) {
            d.fx = null;
            d.fy = null;
            if (!d3.event.active) this.simulation.alphaTarget(0.1);
        },
        ticked: function () {
            this.simulation.force("link", d3.forceLink(this.root.edges)
                .distance(function (d) {
                    var x1 = d.source.x;
                    var x2 = d.target.x;
                    var y1 = d.source.y;
                    var y2 = d.target.y;

                    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
                })
                .strength(1).iterations(10))
            this.node
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })

//                     link
//                         .attr("x1", function(d) {
//                             return d.source.x;
//                         })
//                         .attr("y1", function(d) { return d.source.y; })
//                         .attr("x2", function(d) { return d.target.x; })
//                         .attr("y2", function(d) { return d.target.y; });


            this.path.attr("d", function (d) {
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
            this.text.text(function (d) {
                    return d.name;
                })
                .attr("x", function (d, i) {
                    return d.x;
                })
                .attr("dx", "-3.5")
                .attr("dy", "2.5")
                .attr("y", function (d) {
                    return d.y;
                })
        },
        animate: function () {
            var tree = this.treeFaces[Math.floor(Math.random() * this.treeFaces.length)];
            tree.handle_MOUSEOVER();

            setTimeout(function () {
                tree.handle_MOUSEOUT();
            }.bind(this), 3000);

            setTimeout(this.animate.bind(this), 3000);
        }
    })
    ;


var main = new MainView({
    model: {
        svg: d3.select('#main'),
        root: {
            "nodes": [
                {
                    "x": 104,
                    "y": 516,
                    "r": 15,
                    "id": 1,
                    "name": "me",
                    "image": "tianhe.png",
                    "color": "#EBC755"
                },
                {
                    "x": 17,
                    "y": 499,
                    "r": 15,
                    "id": 1,
                    "name": "丁",
                    "image": "lingsha.png",
                    "department": "携程金融信用卡",
                    "position": "JAVA开发",
                    "color": "#50728C"
                },                {
                    "x": 45,
                    "y": 520,
                    "r": 15,
                    "id": 2,
                    "name": "钟",
                    "image": "lingsha.png",
                    "department": "携程金融信用卡",
                    "position": "JAVA开发",
                    "color": "#50728C"
                },
                {
                    "x": 423,
                    "y": 128,
                    "r": 15,
                    "id": 3,
                    "name": "林",
                    "image": "mengli.png",
                    "department": "QUNAR/金融事业部/消费金融/消费分期",
                    "position": "产品经理",
                    "color": "#E2584C"
                },
                {
                    "x": 477,
                    "y": 123,
                    "r": 15,
                    "id": 4,
                    "name": "崔",
                    "image": "ziying.png",
                    "department": "QUNAR/金融事业部/消费金融/业务技术/信用创新",
                    "position": "JAVA开发",
                    "color": "#50728C"

                },
                {
                    "x": 373,
                    "y": 88,
                    "r": 15,
                    "id": 5,
                    "name": "浩",
                    "image": "ziying.png",
                    "department": "QUNAR/金融事业部/消费金融/业务技术/信用创新",
                    "position": "前端开发",
                    "color": "#DA813E"

                },
                {
                    "x": 615,
                    "y": 291,
                    "r": 15,
                    "id": 6,
                    "name": "昊",
                    "image": "ziying.png",
                    "department": "QUNAR/大住宿事业部/技术部",
                    "position": "JAVA开发",
                    "color": "#50728C"

                },
                {
                    "x": 627,
                    "y": 322,
                    "r": 15,
                    "id": 7,
                    "name": "夏日",
                    "image": "ziying.png",
                    "department": "QUNAR/大住宿事业部/技术部",
                    "position": "产品经理",
                    "color": "#E2584C"

                },
                {
                    "x": 671,
                    "y": 253,
                    "r": 15,
                    "id": 8,
                    "name": "云",
                    "image": "ziying.png",
                    "department": "QUNAR/大住宿事业部/技术部",
                    "position": "前端大神",
                    "color": "#DA813E"

                },
                {
                    "x": 119,
                    "y": 458,
                    "r": 15,
                    "id": 9,
                    "name": "晗",
                    "image": "ziying.png",
                    "department": "携程金融信用卡",
                    "position": "产品经理",
                    "color": "#E2584C"

                },
                {
                    "x": 47,
                    "y": 439,
                    "r": 15,
                    "id": 10,
                    "name": "君",
                    "image": "ziying.png",
                    "department": "携程金融信用卡",
                    "position": "产品经理",
                    "color": "#E2584C"

                },
                {
                    "x": 281,
                    "y": 602,
                    "r": 15,
                    "id": 11,
                    "name": "媛",
                    "image": "ziying.png",
                    "department": "携程金融信用卡",
                    "position": "业务",
                    "color": "#7970B3"
                },
                {
                    "x": 99,
                    "y": 592,
                    "r": 15,
                    "id": 12,
                    "name": "璟",
                    "image": "ziying.png",
                    "department": "携程金融信用卡",
                    "position": "JAVA开发",
                    "color": "#50728C"

                },
                {
                    "x": 155,
                    "y": 612,
                    "r": 15,
                    "id": 13,
                    "name": "沙",
                    "image": "ziying.png",
                    "department": "携程金融信用卡",
                    "position": "测试Leader",
                    "color": "#42B19D"
                },
                {
                    "x": 166,
                    "y": 527,
                    "r": 15,
                    "id": 14,
                    "name": "洋",
                    "image": "ziying.png",
                    "department": "携程金融信用卡",
                    "position": "前端开发",
                    "color": "#DA813E"
                },
                {
                    "x": 40,
                    "y": 588,
                    "r": 15,
                    "id": 15,
                    "name": "莎",
                    "image": "ziying.png",
                    "department": "携程金融信用卡",
                    "position": "测试",
                    "color": "#42B19D"

                },
                {
                    "x": 655,
                    "y": 78,
                    "r": 15,
                    "id": 16,
                    "name": "玉",
                    "image": "ziying.png",
                    "department": "QUNAR/金融事业部/消费金融/基础架构/贷款平台",
                    "position": "JAVA开发",
                    "color": "#50728C"

                },
                {
                    "x": 450,
                    "y": 63,
                    "r": 15,
                    "id": 17,
                    "name": "余",
                    "image": "ziying.png",
                    "department": "QUNAR/金融事业部/消费金融/业务技术/渠道",
                    "position": "JAVA",
                    "color": "#50728C"

                },
                {
                    "x": 18,
                    "y": 440,
                    "r": 16,
                    "id": 18,
                    "name": "helpDesk",
                    "image": "ziying.png",
                    "department": "QUNAR/金融事业部/消费金融/业务技术/渠道",
                    "color": "#BADA8B"

                },
                {
                    "x": 130,
                    "y": 385,
                    "r": 16,
                    "id": 19,
                    "name": "旭",
                    "image": "ziying.png",
                    "department": "QUNAR/金融事业部/消费金融/业务技术/渠道",
                    "position": "产品经理",
                    "color": "#E2584C"

                },
                {
                    "x": 160,
                    "y": 367,
                    "r": 15,
                    "id": 20,
                    "name": "x",
                    "image": "ziying.png",
                    "department": "QUNAR/金融事业部/消费金融/业务技术/渠道",
                    "position": "JAVA",
                    "color": "#50728C"

                }
            ]

        },
        "questions": [{
            Q: "配置offline权限",
            edges: [{type: "suit", "source": 0, "target": 2, "distance": 9, "relation": "后端"},
                {type: "suit", "source": 2, "target": 9, "distance": 20, "relation": "挚友"},
                {type: "suit", "source": 9, "target": 2, "distance": 20, "relation": "挚友"},
                {type: "suit", "source": 2, "target": 18, "distance": 20, "relation": "挚友"},
                {type: "suit", "source": 18, "target": 19, "distance": 20, "relation": "挚友"},
                {type: "suit", "source": 19, "target": 20, "distance": 20, "relation": "挚友"},
                {type: "suit", "source": 20, "target": 19, "distance": 20, "relation": "挚友"},
                {type: "suit", "source": 19, "target": 10, "distance": 20, "relation": "挚友"},
                {type: "suit", "source": 10, "target": 11, "distance": 20, "relation": "挚友"},
                {type: "suit", "source": 11, "target": 12, "distance": 20, "relation": "挚友"},
                {type: "suit", "source": 12, "target": 17, "distance": 20, "relation": "挚友"},
                {type: "resolved", "source": 0, "target": 15, "distance": 10, "relation": "后端"},
                {type: "resolved", "source": 15, "target": 6, "distance": 20, "relation": "挚友"},
                {type: "resolved", "source": 6, "target": 7, "distance": 20, "relation": "挚友"},
                {type: "resolved", "source": 7, "target": 10, "distance": 20, "relation": "挚友"},
                {type: "resolved", "source": 10, "target": 3, "distance": 20, "relation": "挚友"}
            ],
            style: {
                stroke: "pink",
                strokeWidth: "10"
            }
        },{
            Q: "沟通业务逻辑：刷卡酒店可领券时间段",
            edges: [{type: "resolved", "source": 0, "target": 15, "distance": 10, "relation": "后端"},
                {type: "resolved", "source": 15, "target": 6, "distance": 20, "relation": "挚友"},
                {type: "resolved", "source": 6, "target": 7, "distance": 20, "relation": "挚友"},
                {type: "resolved", "source": 7, "target": 10, "distance": 20, "relation": "挚友"},
                {type: "resolved", "source": 10, "target": 3, "distance": 20, "relation": "挚友"},
            ],
            style: {
                stroke: "rgb(255,0,0)",
                strokeWidth: "2"
            }
        }, {
            Q: "去哪儿酒店页面跳转问题",
            edges: [{type: "licensing", "source": 0, "target": 14, "distance": 10, "relation": "后端"},
            ],
            style: {
                stroke: "blue",
                strokeWidth: "2"
            }
        }
            //    ,{
            //    Q: "数据库资源",
            //    edges: [{type: "licensing", "source": 0, "target": 14, "distance": 10, "relation": "后端"},
            //    ],
            //    style: {
            //        stroke: "blue",
            //        strokeWidth: "2"
            //    }
            //},  {
            //    Q: "前端hysdk",
            //    edges: [{type: "licensing", "source": 0, "target": 14, "distance": 10, "relation": "后端"},
            //        {type: "licensing", "source": 14, "target": 5, "distance": 20, "relation": "挚友"},
            //        {type: "licensing", "source": 5, "target": 6, "distance": 20, "relation": "挚友"},
            //        {type: "licensing", "source": 6, "target": 9, "distance": 20, "relation": "挚友"},
            //        {type: "licensing", "source": 9, "target": 2, "distance": 20, "relation": "挚友"},
            //    ],
            //    style: {
            //        stroke: "yellow",
            //        strokeWidth: "2"
            //    }
            //},
        ]
    }
});

