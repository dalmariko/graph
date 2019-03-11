class Chart {
    constructor(settings) {
        this._settings = Object.assign(Chart.getDefaultsettings(), settings);
    }

    init(){
        Chart.addTemplate(this._settings);
    return this;
    }

    static addTemplate(settings){
        let template=Chart.template(settings);
        document.querySelector(settings.chartContainer).insertAdjacentHTML('afterbegin',template);
    }

    static template(settings){
let template = ` <svg height=${settings.height} width=${settings.width}>
  <polyline points="0,40 40,40 40,80 80,80 80,120 120,120 120,160" 
  
  style="fill:${settings.fill};stroke:${settings.strokeColors};stroke-width:${settings.strokeWidth}" />
</svg> `;
return template;
    }

    static getDefaultsettings() {
        /*
         *Default Settings
         * chartContainer - insert all chart basic container
         */
        return {
            chartContainer:'.chart',
            width:'100%',
            height:'230',
            fill:'transparent',
            strokeColors:'#0e10cb',
            strokeWidth:4,
        }
    }
}


const myChart=new Chart().init();