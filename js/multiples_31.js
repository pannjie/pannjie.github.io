import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

        const data =  (await d3.csv("data/d3_df_31.csv", d => ({
        time: new Date(d.block_time),
        value: +d.shares,
        wallet_action: d.wallet_action,
        direction: d.direction
        }))).filter(d => d.time <= new Date("2026-02-28T07:00:00Z"));
        // .filter(d => d.direction === "YES");

        const margin = {top: 40, right: 30, bottom: 30, left: 80};
        const totalWidth = d3.select('.standard_2').node().getBoundingClientRect().width;
        const totalHeight = d3.select('.standard_2').node().getBoundingClientRect().height;
        const width = totalWidth - margin.left - margin.right;
        const height =  450 - margin.top - margin.bottom;

       const thresholds = d3.timeMinute.every(5)
       .range(d3.min(data, d => d.time), d3.max(data, d => d.time));

       const bins = d3.bin()
        .value(d => d.time)
        .thresholds(thresholds)
        .domain([d3.min(data, d => d.time), d3.max(data, d => d.time)])        
        (data);

        const keys = ["BUY Yes", "SELL No", "BUY No", "SELL Yes"];

        const binRows = bins.map(b => {
        const row = { time: b.x0 };
        keys.forEach(k => {
            row[k] = d3.sum(b.filter(d => d.wallet_action === k), d => d.value);
        });
        return row;
        });

        const stack = d3.stack().keys(keys)(binRows);

        

        const x = d3.scaleUtc()
        .domain([d3.min(binRows, d => d.time), d3.max(binRows, d => d.time)])
        .range([margin.left, totalWidth - margin.right]);

        const y = d3.scaleLinear()
        .domain([0, 50000])
        .range([height - margin.bottom, margin.top]);

       const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'absolute pointer-events-none bg-gray-800 text-white text-sm rounded px-2 py-1 opacity-0 transition-opacity duration-150')

        const area = d3.area()
        .x(d => x(d.data.time))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))
        .curve(d3.curveMonotoneX)


        const color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#0ae448", "#88cd87", "rgb(222, 222, 222, 0.3)", "rgb(241, 241,241, 0.3)"]);

        // ["#f7fcf5","#e6f5e1","#cdebc7","#addea7","#88cd87","#5db96b","#38a055","#1b843f","#04672b","#00441b"]

        const svg = d3.select('.standard_2').append('svg')
        .attr('width', totalWidth).attr('height', height);

        svg.selectAll('path')
        .data(stack)
        .join('path')
            .attr('fill', d => color(d.key))
            .attr('d', area)
            .on('mouseenter', function(event, d) {
                d3.selectAll('path').attr('opacity', 0.3);
                d3.select(this).attr('opacity', 1);
                tooltip.style('opacity', 1).text(d.key)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px');
            })
            .on('mousemove', function(event) {
                tooltip.style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px');
            })
            .on('mouseleave', function(event, d) {
                d3.selectAll('path').attr('opacity', 1);
                tooltip.style('opacity', 0);
            });

        svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

        svg.append('g').attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select('.domain').remove());

        svg.append('line')
        .attr('x1', x(new Date("2026-02-28T06:15:00Z")))
        .attr('x2', x(new Date("2026-02-28T06:15:00Z")))
        .attr('y1', margin.top + 28)
        .attr('y2', height - margin.bottom)
        .attr('stroke', 'white')
        .attr('stroke-width', 1);

        svg.append('line')
        .attr('x1', x(new Date("2026-02-28T05:20:00Z")))
        .attr('x2', x(new Date("2026-02-28T05:20:00Z")))
        .attr('y1', margin.top + 100)
        .attr('y2', height - margin.bottom)
        .attr('stroke', 'white')
        .attr('stroke-width', 1);

        svg.append('text')
        .attr('x', x(new Date("2026-02-28T05:20:00Z")))
        .attr('y', margin.top + 95)
        .attr('fill', 'white')
        .attr('font-size', '8px')
        .attr('text-anchor', 'middle')
        .text('Trading spikes');

        svg.append('text')
        .attr('x', x(new Date("2026-02-28T06:15:00Z")))
        .attr('y', margin.top + 15)
        .attr('fill', 'white')
        .attr('font-size', '8px')
        .attr('text-anchor', 'middle')
        .text('CENTCOM strikes begin');

        
        svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line')
            .clone()
            .attr('x2', totalWidth - margin.left - margin.right)
            .attr('stroke', 'white')
            .attr('stroke-opacity', 0.15)
            .attr('stroke-dasharray', '3,3'));


    svg.append('text')
        .attr('x', totalWidth/2)
        .attr('y', margin.top - 20)
        .attr('fill', 'white')
        .attr('font-size', '8px')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .text('Will the US Strike Iran by 31st March?');

        svg.append('text')
        .attr('x', margin.left - 40)
        .attr('y', margin.top - 20)
        .attr('fill', 'white')
        .attr('font-size', '8px')
        .attr('font-weight', 'normal')
        .attr('text-anchor', 'start')
        .text('Volume of shares traded');
        