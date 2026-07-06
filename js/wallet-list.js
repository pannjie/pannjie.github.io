import * as d3 from 'https://esm.sh/d3@7.9.0';

const wallets = await d3.csv('data/d3_wallets.csv', d => {
    const pnlMatch = d.pnl.match(/\$([\d,]+\.?\d*)\s*\(([-\d,]+\.?\d*)%\)/);
    return {
        wallet: d.wallet,
        name: d.name,
        amount: +d.usdc_amount,
        pnl: pnlMatch ? parseFloat(pnlMatch[1].replace(/,/g, '')) : 0,
        pnlPercent: pnlMatch ? parseFloat(pnlMatch[2].replace(/,/g, '')) : 0,
        link: d.link
    };
});

const colors = d3.scaleQuantize()
    .domain([0, 200000])
    .range(d3.schemeGreens[8]);

const cards = d3.select('.wallet-list')
    .selectAll('.wallet-card')
    .data(wallets)
    .join('a')
    .attr('class', 'wallet-card block relative bg-[#262f40] px-[3px] pt-[5px] pb-[5px] cursor-pointer pointer-events-auto')
    .attr('href', d => d.link)
    .attr('target', '_blank')
    

cards.append('div')
    .attr('class', 'w-fit text-[15px] leading-none font-normal text-[#17382A] px-1')
    .style('font-family', 'Arial, Helvetica, sans-serif')
    .text(d => `[${d.wallet.slice(0, 6)}...]`)
    .style('background-color', d => colors(d.pnl));

cards.append('div')
    .attr('class', 'w-fit text-[35px] leading-[1] tracking-[-0.04em] font-normal text-[#17382A] px-1')
    .style('font-family', 'Arial, Helvetica, sans-serif')
    .text(d => `${d.name.slice(0, 12)}`)
    .style('background-color', d => colors(d.pnl));

cards.append('div')
    .attr('class', 'w-fit text-[35px] leading-[1] tracking-[-0.04em] font-normal text-[#17382A] px-1')
    .style('font-family', 'Arial, Helvetica, sans-serif')
    .text(d => `$${d.pnl.toLocaleString()}`)
    .style('background-color', d => colors(d.pnl));


