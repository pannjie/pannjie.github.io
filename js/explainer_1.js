import * as d3 from 'https://esm.sh/d3@7.9.0';
import { gsap } from 'https://esm.sh/gsap@3.15.0';

// [100% Vibecoded]

const width = 1500;
const height = 500; // sized to fit the bar + position text below it, not the full screen
// const marginTop = 80;
const marginTop = 180;
const marginRight = 20;
const marginBottom = 40;
const marginLeft = 60;

const data = [
    {label: 'Will President Donald Trump criticize the UK at his next public speech?', yes: 0.2, no: 0.8},
]

const initial = { yes: data[0].yes, no: data[0].no };

const x = d3.scaleLinear()
    .domain([0, 1])
    .range([marginLeft, width - marginRight]);

const y = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([marginTop, height - marginBottom])
    .padding(0.1);

const color = d3.scaleOrdinal()
    .domain(['yes', 'no'])
    .range(['#2CFF05', 'grey']);

const svg = d3.create('svg')
        .attr('viewBox', [0, 0, width, height]);

const seriesKeys = ['yes', 'no'];
const barY = y(data[0].label);
const barCenterY = barY + 100;

// one <g> per key (yes/no), each holding its bar rect, label background, and label text.
// everything starts collapsed at x(0)/0% - render() below animates it to the real values.
const series = svg.selectAll('g.series')
    .data(seriesKeys)
    .join('g')
      .attr('class', d => `series series-${d}`)
      .attr('fill', d => color(d));

series.append('rect')
    .attr('class', 'bar')
    .attr('x', x(0))
    .attr('y', barY)
    .attr('width', 0)
    .attr('height', 200);

// label-bg removed

series.append('text')
    .attr('class', 'label')
    .attr('x', x(0))
    .attr('y', barCenterY)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('fill', d => d === 'yes' ? '#262a33' : 'white')
    .attr('font-size', '20px')
    .attr('font-weight', 'normal')
    .text(d => `${d.toUpperCase()} 0%`);

const titleY = (marginTop / 2) + 30;

svg.append('text')
    .attr('x', width / 2)
    .attr('y', titleY)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .attr('font-size', '24px')
    .attr('font-weight', 'bold')
    .text(data[0].label);

document.getElementById('explainer_1').appendChild(svg.node());

// Animates the bars/labels to match the current data[0].yes/no split.
function render(d) {
    const stacked = d3.stack().keys(seriesKeys)([d]);

    seriesKeys.forEach((key, i) => {
        const [v0, v1] = stacked[i][0];
        const x0 = x(v0);
        const x1 = x(v1);
        const midX = (x0 + x1) / 2;
        const percent = Math.round((v1 - v0) * 100);

        const g = svg.select(`.series-${key}`);

        gsap.to(g.select('rect.bar').node(), {
            attr: { x: x0, width: x1 - x0 },
            duration: 1,
            ease: 'power2.inOut'
        });

        // label-bg removed

        const textNode = g.select('text.label').node();
        gsap.to(textNode, {
            attr: { x: midX },
            opacity: percent === 0 ? 0 : 1,
            duration: 1,
            ease: 'power2.inOut'
        });

        // GSAP can't tween a string directly - tween a numeric proxy and
        // write the formatted text on every frame instead.
        const counter = { val: parseInt(textNode.textContent) || 0 };
        gsap.to(counter, {
            val: percent,
            duration: 1,
            ease: 'power2.inOut',
            onUpdate: () => { textNode.textContent = `${key.toUpperCase()} ${Math.round(counter.val)}%`; }
        });
    });
}

render(data[0]); // initial reveal, animating in from 0%/0%

// buttons live inside the SVG (via foreignObject) so they sit in the same
// row as the title, right-aligned at the row's end, sized to match it.
// const controlsFO = svg.append('foreignObject')
//     .attr('x', width - marginRight - 160)
//     .attr('y', titleY - 20)
//     .attr('width', 160)
//     .attr('height', 28);
const controlsFO = svg.append('foreignObject')
    .attr('x', width / 2 - 100)
    .attr('y', barY + 220)
    .attr('width', 200)
    .attr('height', 42);

const controls = controlsFO.append('xhtml:div')
    .attr('class', 'flex gap-2 justify-end items-center h-full');

// position summary, as SVG text below the bar, updated on resolve/reset.
// each line is a group of tspans - highlighted ones get a neon-green
// background rect measured with getBBox() (safe since svg is already in the DOM).
const shares = 5000;
// const positionY = barY + 300;
const positionY = barY + 230;

const positionGroup1 = svg.append('g');
const positionGroup2 = svg.append('g');

function renderHighlightedLine(group, yPos, parts) {
    group.selectAll('*').remove();

    const textEl = group.append('text')
        .attr('x', width / 2)
        .attr('y', yPos)
        .attr('text-anchor', 'middle')
        .attr('font-size', '20px')
        .attr('font-weight', 'normal')
        .attr('fill', 'white');

    parts.forEach(part => {
        textEl.append('tspan')
            .attr('class', part.highlight ? 'hl' : null)
            .attr('fill', part.highlight ? '#262a33' : (part.fill ?? null))
            .text(part.text);
    });

    textEl.selectAll('tspan.hl').each(function() {
        const bbox = this.getBBox();
        group.insert('rect', ':first-child')
            .attr('x', bbox.x - 4)
            .attr('y', bbox.y - 1)
            .attr('width', bbox.width + 8)
            .attr('height', bbox.height + 2)
            .attr('fill', '#39FF14');
    });

    textEl.raise(); // keep text on top of the backgrounds just inserted
}

// function updatePosition() {
//     // renderHighlightedLine(positionGroup1, positionY, [  // was below the bar
//     renderHighlightedLine(positionGroup1, titleY + 40 , [
//         { text: shares.toLocaleString(), highlight: true },
//         { text: ' shares at ' },
//         { text: `$${initial.yes.toFixed(2)}`, highlight: true },
//         { text: 'each' }
//     ]);

//     const cost = shares * initial.yes;
//     const finalProfitText = data[0].yes === 1
//         ? `+$${Math.round(shares - cost).toLocaleString()}`
//         : data[0].yes === initial.yes
//             ? 'pending'
//             : `-$${Math.round(cost).toLocaleString()}`;

//     renderHighlightedLine(positionGroup2, positionY + 40, [
//         { text: 'Final profit: ' },
//         { text: finalProfitText, highlight: true }
//     ]);
// }

function updatePosition() {
    const cost = shares * initial.yes;
    const finalProfitText = data[0].yes === 1
        ? `+$${Math.round(shares - cost).toLocaleString()}`
        : data[0].yes === initial.yes
            ? 'pending'
            : `-$${Math.round(cost).toLocaleString()}`;

    renderHighlightedLine(positionGroup1, titleY + 50, [
        { text: shares.toLocaleString(), fill: '#39FF14' },
        { text: ' shares at ' },
        { text: `$${initial.yes.toFixed(2)}`, fill: '#39FF14' },
        { text: '/each  —  Final profit: ' },
        { text: finalProfitText, highlight: true }
    ]);
}

const resolveBtn = document.createElement('button');
resolveBtn.textContent = 'Resolve';
resolveBtn.className = 'px-3 py-1 bg-white text-[#262a33] text-[16px] font-bold cursor-pointer';
resolveBtn.addEventListener('click', () => {
    data[0].yes = 1;
    data[0].no = 0;
    render(data[0]);

    const cost = shares * initial.yes;
    const targetProfit = Math.round(shares - cost);
    const counter = { val: 0 };
    gsap.to(counter, {
        val: targetProfit,
        duration: 1,
        ease: 'power2.inOut',
        onUpdate: () => {
            renderHighlightedLine(positionGroup1, titleY + 50, [
                { text: shares.toLocaleString(), fill: '#39FF14' },
                { text: ' shares at ' },
                { text: `$${initial.yes.toFixed(2)}`, fill: '#39FF14' },
                { text: '/each  —  Final profit: ' },
                { text: `+$${Math.round(counter.val).toLocaleString()}`, highlight: true }
            ]);
        },
        onComplete: () => updatePosition()
    });

    resolveBtn.disabled = true;
    resolveBtn.classList.add('opacity-50');
});

const resetBtn = document.createElement('button');
resetBtn.textContent = 'Reset';
resetBtn.className = 'px-3 py-1 bg-white text-[#262a33] text-[16px] font-bold cursor-pointer';
resetBtn.addEventListener('click', () => {
    data[0].yes = initial.yes;
    data[0].no = initial.no;
    render(data[0]);
    updatePosition();
    resolveBtn.disabled = false;
    resolveBtn.classList.remove('opacity-50');
});

controls.node().appendChild(resolveBtn);
controls.node().appendChild(resetBtn);

updatePosition(); // initial state
