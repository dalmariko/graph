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

    static makePolilines(settings){
      let polilines='';
        let points='';

        let color=[];
        for(let key in settings.colors){
            color.push(settings.colors[key]);
        };

        for(let i=0;i<settings.gprapiks;i++) {
                polilines+=
                    `<polyline points="${settings.axis[`Y${i}`]}"
                     style="fill:${settings.fill};stroke:${color[i]};stroke-width:${settings.strokeWidth}" /> \n\n`
      }
      return polilines;
    }

    static template(settings) {
        let charts = Chart.makePolilines(settings);

        return ` 
        <div class="chart">
            <!--<svg  height=${settings.height} width=${settings.width} viewBox="0 0 ${100} ${100}">-->
            <svg  height=${settings.height} width=${settings.width} >
   
              ${charts}
                       
            </svg>
        </div>`;
    }

    static getDefaultsettings() {
        /*
         *Default Settings
         * chartsContainer - insert all chart basic container
         */
        return {
            chartsContainer: '.manyCharts',
            width: '100%',
            height: '100',
            fill: 'transparent',
            axis:'',
            types: {"y0": "line", "y1": "line", "x": "x"},
            names: {"y0": "#0", "y1": "#1"},
            colors: {
                "axisY0":"#cb513a",
                "axisY1":"#73c03a",
                "y2":"#65b9ac",
                "y3":"#4682b4"
            },
            strokeWidth: 1,
        }
    }
}






const getScale=(data)=>{
    let ctn = data.columns[0].length;
    let maxX = parseFloat(getComputedStyle(document.querySelector('.manyCharts')).width);
    let maxY = parseFloat(getComputedStyle(document.querySelector('.manyCharts')).height);
   return {scaleX:maxX/ctn,scaleY:maxY/ctn};
};

const getExtremum=(dataY)=>{
    let ctn = dataY.length;
    let copyDataY=dataY.slice();
    let extr= copyDataY.sort((a,b)=>{return b-a;})[0];
    return extr/ctn;
};

const makeChart=(data)=>{
    let points={Y0:'',Y1:'',Y2:'',Y3:''};

    let axis = 1;
    let ctn = data.columns[0].length;


    let oneYear=31557600000;
    let oneDay=86400000;

    let scales=getScale(data);
    let scaleX=scales.scaleX;
    let scaleY='';
    let x=0;
    let y=0;

    while (axis < ctn) {
        // let year= data.columns[0][axis]/oneYear^0;
        // let day =(data.columns[0][axis]-year*oneYear)/oneDay^0;
        // x = parseFloat( ((0 * day + axis) * scaleX).toFixed(4) );

        x = parseFloat(( (axis) * scaleX).toFixed(4));

            for (let i = 1; i < data.columns.length; i++) {

                scaleY = scales.scaleY / getExtremum(data.columns[i]);
                y = parseFloat((data.columns[i][axis] * scaleY).toFixed(4));

                points[`Y${i-1}`]+=`${x},${y} `;
            }
            axis++;
        };

    let charParameter={};

    for (let props in data) {
        if (props !== 'columns') {
            charParameter[props] = data[props];
            charParameter['axis'] = points;
            charParameter['gprapiks'] = Object.keys(points).length;
        }
    }

    return new Chart(charParameter).init();

};



data.forEach(item=>{
    makeChart(item);
});



