class Chart {
    constructor(settings) {
        this._settings = Object.assign(Chart.getDefaultsettings(), settings);
    }

    init() {
        Chart.addTemplate(this._settings);
        return this;
    }

    static addTemplate(settings) {
        let template = Chart.template(settings);
        document.querySelector(settings.chartsContainer).insertAdjacentHTML('beforeend', template);
    }

    static template(settings) {
        return ` 
 <div class="chart">
 <svg height=${settings.height} width=${settings.width}>
   
    <polyline points="${settings.axisY0}" 

  style="fill:${settings.fill};stroke:${settings.colors.y0};stroke-width:${settings.strokeWidth}" />
    <polyline points="${settings.axisY1}" 

  style="fill:${settings.fill};stroke:${settings.colors.y1};stroke-width:${settings.strokeWidth}" />
    <polyline points="${settings.axisY2}" 
  
  style="fill:${settings.fill};stroke:${settings.colors.y0};stroke-width:${settings.strokeWidth}" />
    <polyline points="${settings.axisY3}" 
  
  style="fill:${settings.fill};stroke:${settings.colors.y1};stroke-width:${settings.strokeWidth}" />
  
</svg>
</div>
`;
    }

    static getDefaultsettings() {
        /*
         *Default Settings
         * chartsContainer - insert all chart basic container
         */
        return {
            chartsContainer: '.manyCharts',
            width: '100%',
            height: '500',
            fill: 'transparent',
            axisY0: '',
            axisY1: '',
            axisY2: '',
            axisY3: '',
            types: {"y0": "line", "y1": "line", "x": "x"},
            names: {"y0": "#0", "y1": "#1"},
            colors: {"y0": "#3DC23F", "y1": "#F34C44"},
            strokeWidth: 4,
        }
    }
}







const makeChart=(data)=>{
    let points={Y0:'',Y1:'',Y2:'',Y3:''};

    let axis = 1;
    let ctn = data.columns[0].length;
    let x=0;

    while (axis < ctn) {


        let year = data.columns[0][axis]/31557600000^0;
        let day=((data.columns[0][axis]-year*31557600000)/86400000^0);

        let y0 = data.columns[1][axis];
        let y1 = data.columns[2][axis];

        points.Y0+=`${(x*day+axis)*5},${y0*0.01} `;
        points.Y1+=`${(x*day+axis)*5},${y1*0.01} `;

        axis++;
    }


    return new Chart({
        axisY0: points.Y0,
        axisY1: points.Y1,
        axisY2: points.Y2,
        axisY3: points.Y3
    }).init();
};

data.forEach(item=>{
    makeChart(item);
});






//todo Найти максимумы для осей с помощью сотрировки и привязать этот максимум к размеру экрана

