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
        document.querySelector(settings.chartContainer).insertAdjacentHTML('afterbegin', template);
    }

    static template(settings) {
        return ` <svg height=${settings.height} width=${settings.width}>
   
    <polyline points="${settings.axisY0}" 
  
  style="fill:${settings.fill};stroke:${settings.colors.y0};stroke-width:${settings.strokeWidth}" />
    <polyline points="${settings.axisY1}" 
  
  style="fill:${settings.fill};stroke:${settings.colors.y1};stroke-width:${settings.strokeWidth}" />
  
</svg> `;
    }

    static getDefaultsettings() {
        /*
         *Default Settings
         * chartContainer - insert all chart basic container
         */
        return {
            chartContainer: '.chart',
            width: '100%',
            height: '300',
            fill: 'transparent',
            axisY0: '',
            axisY1: '',
            types: {"y0": "line", "y1": "line", "x": "x"},
            names: {"y0": "#0", "y1": "#1"},
            colors: {"y0": "#3DC23F", "y1": "#F34C44"},
            strokeWidth: 4,
        }
    }
}




let points={Y0:'',Y1:''};

const getDate=(data)=>{
    let axis = 1;
    let ctn = data.columns[0].length;
    let x=0;

    while (axis < ctn) {


        let year = data.columns[0][axis]/31557600000^0;
        let day=((data.columns[0][axis]-year*31557600000)/86400000^0);

        let y0 = data.columns[1][axis];
        let y1 = data.columns[2][axis];

        points.Y0+=`${(x*day+axis)*7.8},${y0} `;
        points.Y1+=`${(x*day+axis)*7.8},${y1} `;

        axis++;
    }

    return points;
};

data.forEach(item=>{
    getDate(item);
});




const myChart = new Chart({
    axisY0: points.Y0,
    axisY1: points.Y1
}).init();