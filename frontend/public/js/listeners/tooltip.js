export const tooltipListener = () => {
    const toolTips = document.querySelectorAll('[data-tooltip]');
    console.log(toolTips);
    if(innerWidth > 992) {
        toolTips.forEach(toolTip => {
            const tooltipText = toolTip.getAttribute('data-tooltip');
            let tooltip;
            toolTip.addEventListener('mouseenter', () => {
                tooltip = document.createElement('div');
                tooltip.classList.add('tooltip');
                tooltip.innerText = tooltipText;
                toolTip.appendChild(tooltip);
            });
    
            toolTip.addEventListener('mouseleave', () => {
                tooltip.remove();
            })
    
        })
    }
}