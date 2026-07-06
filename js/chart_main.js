import * as d3 from 'https://esm.sh/d3@7.9.0';
import {gsap} from 'https://esm.sh/gsap@3.15.0';
import {ScrollTrigger} from 'https://esm.sh/gsap@3.15.0/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

        const parseTime = d3.utcParse("%Y-%m-%d %H:%M:%S.%L UTC");
        const data = (await d3.csv("data/D3_HIGHLIGHTED_TRACKED_WALLETS_us_strike_iran_28_Feb.csv", d => {
          const t = parseTime(d.block_time);
          return t ? { time: t, amount: +d.amount, knowledge_window: /^true$/i.test(d.knowledge_window), wallet: d.wallet, tracked_wallet: /^true$/i.test(d.tracked_wallet),
            potential_profit: d.potential_profit ? +d.potential_profit : null
          } : null;
        }))
          .filter(d => d)
          .sort((a, b) => d3.ascending(a.time, b.time));

        const width = window.innerWidth;
        const height = window.innerHeight;
        const marginTop = 80;
        const marginRight = 20;
        const marginBottom = 80;
        const marginLeft = 60;

       // your chosen colour


        

        const x = d3.scaleUtc()
            .domain([d3.min(data, d => d.time), d3.max(data, d => d.time)])
            .range([marginLeft, width - marginRight]);

        const y = d3.scaleLinear()
            .domain([0, (d3.max(data, d => d.amount)/8)]).nice()
            .range([height - marginBottom, marginTop]);

        const xAxis = (g) => g
            .call(d3.axisBottom(x).ticks(width / 100).tickSizeOuter(0))
            .attr('color', 'white')


        const yAxis = (g) => g
            .call(d3.axisLeft(y).ticks(height / 50).tickSizeOuter(0))
            .attr('color', 'white');

        const svg = d3.create('svg')
            .attr('viewBox', [0, 0, width, height])
            .attr('style', 'display: block; width: 100%; height: 100%;');

          svg.append('rect')
        .attr('width', width)
        .attr('height', height )
        .attr('fill', '#262f40');

        svg.append('defs').append('clipPath')
        .attr('id', 'chart-area')
        .append('rect')
        .attr('x', marginLeft)
        .attr('y', marginTop)
        .attr('width', width)
        .attr('height', height);

        const y0 = y(0);
        // const muted = data.filter(d =>!d.knowledge_window && !d.tracked_wallet);
        const tracked = data.filter(d => d.tracked_wallet);
        const tracked_window =data.filter(d => d.knowledge_window && d.tracked_wallet);
        const ddf = data.filter(d => d.wallet == "0xa4eb52229991c074bc560f825bf2776d77acd010");
        const anon_0x1caa = data.filter(d => d.wallet == "0x1caa3e7f5b8a2e9f4c6b1e5f3d2a1b0c9d8e7f6a");
        const anon_0x456 = data.filter(d => d.wallet == "0x45647817f1e2f706748da27ed717ecae9b674a11");
        const luckyaugust = data.filter(d => d.wallet == "0x0e00ce71d933fd3ad48928911ef95c7327c8d1ff");
        const rrrrrgb = data.filter(d => d.wallet == "0xe756468f0869e27d6c1c51a10993fd7ce4627866");
        const dicedicedice = data.filter(d => d.wallet == '0xdde15ebd95330ce69136dc0ccd810d22382e02c5')
        const aaamsaasa = data.filter(d => d.wallet == '0x0a142164f48dab6448872f0abac310d03e305316')
        const semiconductorIT = data.filter(d => d.wallet == '0xd36fa21eb3fa7b1aaf97c8499253f76f82a16d48')
        const dji = data.filter(d => d.wallet == '0xa4eb52229991c074bc560f825bf2776d77acd010');

      const annotationTime_2 = parseTime("2026-02-28 06:15:00.000 UTC");
      const annotationTime_1 = parseTime("2026-02-27 20:38:00.000 UTC");
      const annotationTime_DJI = parseTime("2026-02-28 00:56:59.000 UTC");
      const annotationTime_dicedicedice = parseTime("2026-02-28 00:02:28.000 UTC");
      const annotationTime_aaamsaasa = parseTime("2026-02-28 05:20:00.000 UTC");
      const annotationTime_semiconductorIT = parseTime("2026-02-28 05:30:00.000 UTC");

      const annotationLine_dicedicedice = svg.append('line')
        .attr('x1', x(annotationTime_dicedicedice))
        .attr('x2', x(annotationTime_dicedicedice))
        .attr('y1', marginTop)
        .attr('y2', height - marginBottom)
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4');
      
      const annotationText_dicedicedice = svg.append('text')
        .attr('x', x(annotationTime_dicedicedice) + 5)
        .attr('y', marginTop + 15)
        .attr('fill', 'white')
        .attr('font-size', '12px');


       const annotationLine_2 = svg.append('line')
        .attr('x1', x(annotationTime_2))
        .attr('x2', x(annotationTime_2))
        .attr('y1', marginTop)
        .attr('y2', height - marginBottom)
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4');

       const annotationText_2 = svg.append('text')
        .attr('x', x(annotationTime_2) + 5)
        .attr('y', marginTop + 15)
        .attr('fill', 'white')
        .attr('font-size', '12px');

    


        // const grow_aamsaasaLayer = growBars(aaamsaasa, '#f0fb29');
        // const grow_semiconductorITLayer = growBars(semiconductorIT, '#C8AB83');

       annotationText_2.append('tspan')
        .attr('x', x(annotationTime_2) + 5)
        .attr('dy', 0)
        .text('Combat Operations Begin');

       annotationText_2.append('tspan')
        .attr('x', x(annotationTime_2) + 5)
        .attr('dy', '1.5em')
        .text('(28 Feb, 06:15 UTC)');

        annotationText_dicedicedice.append('tspan')
        .attr('x', x(annotationTime_dicedicedice) + 5)
        .attr('dy', 0)
        .text('Dicedicedice funded');
        
        annotationText_dicedicedice.append('tspan')
        .attr('x', x(annotationTime_dicedicedice) + 5)
        .attr('dy', '1.5em')
        .text('(28 Feb, 00:02 UTC)');

      const annotationLine_DJI = svg.append('line')
        .attr('x1', x(annotationTime_DJI))
        .attr('x2', x(annotationTime_DJI))
        .attr('y1', marginTop + 350)
        .attr('y2', height - marginBottom)
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4');

      const annotationText_DJI = svg.append('text')
        .attr('x', x(annotationTime_DJI) + 5)
        .attr('y', marginTop + 365)
        .attr('fill', 'white')
        .attr('font-size', '12px');

        annotationText_DJI.append('tspan')
        .attr('x', x(annotationTime_DJI) + 5)
        .attr('dy', 0)
        .text('Djijaij83jdo4jdlwjflsg created and funded');

        annotationText_DJI.append('tspan')
        .attr('x', x(annotationTime_DJI) + 5)
        .attr('dy', '1.5em')
        .text('(28 Feb, 00:56 UTC)');






        function drawBars(values, fill) {
        const layer = svg.append('g').attr('fill', fill).attr('clip-path', 'url(#chart-area)');
          layer.selectAll('rect')
            .data(values)
            .join('rect')
              .attr('x', d => x(d.time))
              .attr('y', d => y(d.amount))
              .attr('height', d => y0 - y(d.amount))
              .attr('width', 4);
           return layer;
        }

        function growBars(values, fill) {
        const layer = svg.append('g').attr('fill', fill).attr('clip-path', 'url(#chart-area)');
          layer.selectAll('rect')
            .data(values)
            .join('rect')
              .attr('x', d => x(d.time))
              .attr('y', d => y(d.amount + d.potential_profit))
              .attr('height', d => y(d.amount) - y(d.amount + d.potential_profit))
              .attr('width', 4);
           return layer;
        }

        const baseLayer = svg.append('g')
        .attr('fill','darkgrey')
        .attr('clip-path', 'url(#chart-area)');

        baseLayer.selectAll('rect')
            .data(data)
            .join('rect')
              .attr('x', d => x(d.time))
              .attr('y', d => y(d.amount))
              .attr('height', d => y0 - y(d.amount))
              .attr('width', 2);


        const trackedLayer = drawBars(tracked, '#39FF14');
        // const grow_trackedLayer = growBars(tracked, '#39FF14');
        const dicedicediceLayer = drawBars(dicedicedice, '#EA526F');
        const grow_dicedicediceLayer = growBars(dicedicedice, '#EA526F');
        const anon_0x456Layer = drawBars(anon_0x456, '#F5B841');
        const grow_anon_0x456Layer = growBars(anon_0x456, '#F5B841');
        const djiLayer = growBars(dji, '#2EC4B6');
        const aamsaasaLayer = drawBars(aaamsaasa, '#636940');
        const semiconductorITLayer = drawBars(semiconductorIT, '#C8AB83');
        const grow_aamsaasaLayer = growBars(aaamsaasa, '#636940');
        const grow_semiconductorITLayer = growBars(semiconductorIT, '#C8AB83');

         // these bars represent the trades which are ....
         // how many of them took place within the knowledge window?

        const fullExtent = d3.extent(data, d => d.time);
        const start = +fullExtent[0];
        const end = +fullExtent[1];
        const DAY = 86400000;
        const HALF_DAY = 43200000;
        const steps = [
            {domain: [start, end]},
            {domain: [end - HALF_DAY, end]},
            {domain: [end - DAY, end]}
        ]
        const finalPairData = [...aaamsaasa, ...semiconductorIT]
        const finalExtent = d3.extent(finalPairData, d => d.time);
        const pad = (finalExtent[1] - finalExtent[0]) * 0.15;
        const finalDomain = [new Date(+finalExtent[0] - pad), new Date(+finalExtent[1] + pad)];

        // const annotationBox_aaamsaasa = svg.append('rect')
        // .attr('x', x(annotationTime_aaamsaasa))
        // .attr('y', marginTop + 365)
        // .attr('width', 140)
        // .attr('height', 18)
        // .attr('fill', '#f0fb29');

        // const annotationText_aaamsaasa = svg.append('text')
        // .attr('x', x(annotationTime_aaamsaasa) + 4)
        // .attr('y', marginTop + 380)
        // .attr('fill', '#262a33')
        // .attr('font-size', '12px')
        // .attr('font-weight', 'normal')
        // .text('$40,000 USDC withdrawn');

        // const annotationBox_semiconductorIT = svg.append('rect')
        // .attr('x', x(annotationTime_semiconductorIT))
        // .attr('y', marginTop + 485)
        // .attr('width', 140)
        // .attr('height', 18)
        // .attr('fill', '#C8AB83');

        // const annotationText_semiconductorIT = svg.append('text')
        // .attr('x', x(annotationTime_semiconductorIT) + 4)
        // .attr('y', marginTop + 500)
        // .attr('fill', '#262a33')
        // .attr('font-size', '12px')
        // .attr('font-weight', 'normal')
        // .text('$40,000 USDC withdrawn');
        


        function domainToView(domain){
          const a = +domain [0], b = +domain[1];
          return [(a + b)/2, 0, b - a];
        }

        // Grabs GSAP's "power2.inOut" easing curve as a reusable function.
        // (Currently unused directly - kept for the commented-out applyDomain()
        // experiment further down, which eases between zoom steps.)
        const segEase = gsap.parseEase('power2.inOut');

        function updatePosition(){
          baseLayer.selectAll('rect').attr('x', d => x(d.time));
            trackedLayer.selectAll('rect').attr('x', d => x(d.time));
            anon_0x456Layer.selectAll('rect').attr('x', d => x(d.time));
            grow_anon_0x456Layer.selectAll('rect').attr('x', d => x(d.time));
            dicedicediceLayer.selectAll('rect').attr('x', d => x(d.time));
            grow_dicedicediceLayer.selectAll('rect').attr('x', d => x(d.time));
            djiLayer.selectAll('rect').attr('x', d => x(d.time));
            aamsaasaLayer.selectAll('rect').attr('x', d => x(d.time));
            semiconductorITLayer.selectAll('rect').attr('x', d => x(d.time));
            grow_aamsaasaLayer.selectAll('rect').attr('x', d => x(d.time));
            grow_semiconductorITLayer.selectAll('rect').attr('x', d => x(d.time));

            gx.call(xAxis);
            // annotationLine_1.attr('x1', x(annotationTime_1)).attr('x2', x(annotationTime_1));
            // annotationText_1.selectAll('tspan').attr('x', x(annotationTime_1) + 5);
            annotationLine_2.attr('x1', x(annotationTime_2)).attr('x2', x(annotationTime_2));
            annotationText_2.selectAll('tspan').attr('x', x(annotationTime_2) + 5);
            annotationLine_dicedicedice.attr('x1', x(annotationTime_dicedicedice)).attr('x2', x(annotationTime_dicedicedice));
            annotationText_dicedicedice.selectAll('tspan').attr('x', x(annotationTime_dicedicedice) + 5);
            annotationLine_DJI.attr('x1', x(annotationTime_DJI)).attr('x2', x(annotationTime_DJI));
            annotationText_DJI.selectAll('tspan').attr('x', x(annotationTime_DJI) + 5);
            // annotationBox_aaamsaasa.attr('x', x(annotationTime_aaamsaasa));
            // annotationBox_aaamsaasa.attr('x', x(annotationTime_aaamsaasa));
            // annotationBox_semiconductorIT.attr('x', x(annotationTime_semiconductorIT));
            // annotationText_aaamsaasa.attr('x', x(annotationTime_aaamsaasa) + 4);
            // annotationText_semiconductorIT.attr('x', x(annotationTime_semiconductorIT) + 4);
        }

        function redraw(domain){
            const i = d3.interpolate(x.domain(), domain);
            d3.transition()
              .duration(750)
              .tween("zoom", () => t => {
            x.domain(i(t));
            updatePosition();
            });
        }

        function redrawSmooth(targetDomain){
          const view0 = domainToView(x.domain());
          const view1 = domainToView(targetDomain);
          const i = d3.interpolateZoom(view0, view1);
          d3.transition()
            .duration(750)
            .tween("zoom", () => t => {
              const [cx, ,w] = i(t);
              x.domain([new Date(cx - w/2), new Date(cx + w/2)]);
              updatePosition();
            });
        }

  
         

        const gx =svg.append('g')
        .attr('transform', `translate(0,${height - marginBottom})`)
        .call(xAxis);

        svg.append('g')
        .attr('transform', `translate(${marginLeft},0)`)
        .call(yAxis);

         svg.append('text')
        .attr('x', marginLeft - 40)
        .attr('y', marginTop - 30)
        .attr('fill', 'white')
        .attr('font-size', '12px')
        .attr('font-weight', 'normal')
        .attr('text-anchor', 'start')
        .text('USD Amount');

       

        // sources info
        // svg.append('text')
        // .attr('x', width/2)
        // .attr('y', height - marginBottom + 60)
        // .attr('fill', 'lightgrey')
        // .attr('font-size', '12px')
        // .attr('font-weight', 'normal')
        // .attr('text-anchor', 'middle')
        // .text('Polymarket transactions for the market "US strikes Iran by February 28, 2026?" Sources: Dune Analytics, Polygonscan, Polymarket API');



        // Activates the ScrollTrigger plugin - required before any
        // scrollTrigger: {...} config (below) will do anything.
        gsap.registerPlugin(ScrollTrigger);

        // For every element with class "step": animate FROM {opacity: 1, y: 40}
        // back to its normal CSS state, tied to scroll position.
        // scrub: true means the animation has no timeline of its own - its
        // progress is driven directly by how far you've scrolled between
        // "start" (el's top hits viewport center) and "end" (el's bottom
        // hits viewport center), with zero lag.
        gsap.utils.toArray('.step').forEach((el) => {
         gsap.from(el,{
            opacity: 1,
            y: 40,
            duration: 1,
            scrollTrigger: {
              trigger: el,
              start: 'top center',
              end: 'bottom center',
              scrub: true,
            }
         })
        });

        // For every element with class "zoom": fire one-off callbacks (not
        // a scrubbed animation) when it crosses the trigger points.
        // onEnter  -> scrolling DOWN past the trigger: zoom the chart's x-axis
        //             to the last 12 hours (steps[2].domain).
        // onLeaveBack -> scrolling back UP past the trigger: reset the x-axis
        //             to the full time range (steps[0].domain).
        // redraw() (defined above) handles the actual D3 transition between domains.
        gsap.utils.toArray('.zoom').forEach((el) => {
         ScrollTrigger.create({
            trigger: el,
            start: 'top center',
            end: 'bottom center',
            onEnter:     () => redraw(steps[2].domain),
            onLeaveBack: () => redraw(steps[0].domain),
          });
        });

        // A single GSAP timeline whose overall progress (0 -> 1) is scrubbed
        // by scrolling from the top of ".draw" all the way to the bottom of
        // ".fade-456". Using one timeline (instead of separate tl/tlFadeout/
        // tlFade456 timelines, each with their own ScrollTrigger) means each
        // layer's opacity is driven by a single, continuous progress value -
        // no two ScrollTriggers can fight over the same property when
        // scrolling back up.
        const master = gsap.timeline({
            scrollTrigger: {
              trigger: '.draw',
              start: 'top center',
              endTrigger: '.withdraw',
              end: 'bottom center',
              scrub: 0.5,
            }
        })

        // Initial state: hide the "potential profit growth" bars (orange/blue)
        // immediately on load, before any scrolling happens.
        gsap.to(grow_anon_0x456Layer.node(), {opacity: 0, duration: 1});

        // For the ".grow_456" section: fade grow_anon_0x456Layer in when
        // scrolling down into it, and back out when scrolling back up past
        // it. These are one-shot tweens (not scrubbed) fired once per
        // crossing - independent of the master timeline above.

        // ScrollTrigger.create({
        //     trigger: '.grow_456',
        //     start: 'top center',
        //     end: 'bottom center',
        //     onEnter:     () => gsap.to(grow_anon_0x456Layer.node(), {opacity: 1, duration: 1}),
        //     onLeaveBack: () => gsap.to(grow_anon_0x456Layer.node(), {opacity: 0, duration: 1}),
        //   });

          ScrollTrigger.create({
            trigger: '.solana',
            start: 'top center',
            end: 'bottom center',
              onEnter:     () => redrawSmooth(finalDomain),
              onLeaveBack: () => redrawSmooth(steps[0].domain),  
          });

        // Chapter 1 (~.draw, unit 0-1): fade the grey baseLayer down to
        // almost invisible (0.05 opacity) while trackedLayer (green) fades in.
        master.to(baseLayer.node(), {opacity: 0.05, duration: 1}, 0)
        .from(trackedLayer.node(), {opacity: 0, duration: 0.3}, 0)

        // Chapter 2 (~.fade-tracked, unit 2-3): trackedLayer (green) fades
        // out while anon_0x456Layer (magenta) fades in.
        master.to(trackedLayer.node(), {opacity: 0, duration: 1}, 2)
        .from(anon_0x456Layer.node(), {opacity: 0, duration: 0.3}, 2)

        master.from(grow_anon_0x456Layer.node(), {opacity: 0, duration: 0.3}, 3)

        // Chapter 3 (~.fade-456, unit 4-5): anon_0x456Layer and its growth
        // bars fade out while dicedicediceLayer fades in.
        master.to(anon_0x456Layer.node(), {opacity: 0, duration: 1}, 4)
        .to(grow_anon_0x456Layer.node(), {opacity: 0, duration: 1}, 4)
        .from(dicedicediceLayer.node(), {opacity: 0, duration: 1}, 4)

        // Chapter 3.5 (~.grow_dicedicedice, unit 5-6): dicedicedice's
        // profit-growth bars fade in.
        master.from(grow_dicedicediceLayer.node(), {opacity: 0, duration: 1}, 5)

        // Chapter 4 (~.annotate_dicedicedice, unit 6-7): the dicedicedice
        // funding annotation fades in.
        master.from(annotationLine_dicedicedice.node(), {opacity: 0, duration: 1}, 6)
        .from(annotationText_dicedicedice.node(), {opacity: 0, duration: 1}, 6)

        master.to(annotationLine_dicedicedice.node(), {opacity: 0, duration: 0.5}, 7)
          .to(annotationText_dicedicedice.node(), {opacity: 0, duration: 0.5}, 7)
          .to(dicedicediceLayer.node(), {opacity: 0, duration: 0.5}, 7)
          .to(grow_dicedicediceLayer.node(), {opacity: 0, duration: 0.5}, 7)

        // Chapter 5 (~.dji, unit 7.5-8): djiLayer and its funding annotation
        // fade in only once dicedicedice's has finished fading out, then
        // fade out again on the way into the pause step.
        master.from(djiLayer.node(), {opacity: 0, duration: 0.5}, 7.25)
        .from(annotationLine_DJI.node(), {opacity: 0, duration: 0.5}, 7.25)
        .from(annotationText_DJI.node(), {opacity: 0, duration: 0.5}, 7.25)

        master.to(djiLayer.node(), {opacity: 0, duration: 1}, 8)
          .to(annotationLine_DJI.node(), {opacity: 0, duration: 1}, 8)
          .to(annotationText_DJI.node(), {opacity: 0, duration: 1}, 8)

        master.from(aamsaasaLayer.node(), {opacity: 0, duration: 1}, 9)
        .from(semiconductorITLayer.node(), {opacity: 0, duration: 1}, 9)

        master.from(grow_aamsaasaLayer.node(), {opacity: 0, duration: 1}, 10)
        .from(grow_semiconductorITLayer.node(), {opacity: 0, duration: 1}, 10)
        .from('#label-aaamsaasa', {opacity: 0, duration: 1}, 10)
        .from('#label-semiconductorIT', {opacity: 0, duration: 1}, 10)
        // .from(annotationBox_aaamsaasa.node(), {opacity: 0, duration: 1}, 9)
        // .from(annotationBox_semiconductorIT.node(), {opacity: 0, duration: 1}, 9)
        // .from(annotationText_aaamsaasa.node(), {opacity: 0, duration: 1}, 9)
        // .from(annotationText_semiconductorIT.node(), {opacity: 0, duration: 1}, 9);
      
        document.querySelectorAll('.hover-animate').forEach(el => {
          gsap.set(el, { backgroundColor: 'rgba(10, 228, 72, 0)', padding: '0 3px' });

          el.addEventListener('mouseenter', () => {
            gsap.to(el, { backgroundColor: 'rgba(10, 228, 72, 1)', color: '#262a33', duration: 0.3, ease: 'power2.out' });
          });
          el.addEventListener('mouseleave', () => {
            gsap.to(el, { backgroundColor: 'rgba(10, 228, 72, 0)', color: 'white', duration: 0.3, ease: 'power2.inOut' });
          });
        });


        document.getElementById('chart').appendChild(svg.node());