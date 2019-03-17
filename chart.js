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

    static makePolilines(settings) {
        let polilines = '';

        let color = [];
        for (let key in settings.colors) {
            color.push(settings.colors[key]);
        }

        for (let i = 0; i < settings.gprapiks; i++) {
            polilines +=
                `<polyline points="${settings.axis[`y${i}`]}"
                     style="fill:${settings.fill};stroke:${color[i]};stroke-width:${settings.strokeWidth}" />`
        }
        return polilines;
    }

    static template(settings) {
        let charts = Chart.makePolilines(settings);

        return ` 
        <div class="chart">
        
        <!--500 это область показа, 780  это settings.innerWidth - 500-->
        
            <svg width='${settings.widthBig}' height='${settings.heightBig}'
              viewBox="780 0 ${'500'} ${settings.innerHeigth}" preserveAspectRatio="none" 
              vector-effect="non-scaling-stroke" >
              ${charts}
            </svg>
            
            <svg width='${settings.widthMini}' height='${settings.heightMini}'
              viewBox="0 0 ${settings.innerWidth} ${settings.innerHeigth}" preserveAspectRatio="none"
             vector-effect="non-scaling-stroke" >
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
            widthBig: '100%',
            heightBig: '200',
            widthMini: '100%',
            heightMini: '50',
            fill: 'transparent',
            axis: '',
            types: {"y0": "line", "y1": "line", "x": "x"},
            names: {"y0": "#0", "y1": "#1"},
            colors: {
                "axisY0": "#cb513a",
                "axisY1": "#73c03a",
                "y2": "#65b9ac",
                "y3": "#4682b4"
            },
            strokeWidth: 1,
        }
    }
}

const getScale = (data) => {

    let ctn = data.columns[0].length;

    let maxX = window.innerWidth;
    let maxY = window.innerHeight;

    return {scaleX: maxX / ctn, scaleY: maxY / ctn};
};
const getExtremum = (data) => {
    return ( (data.slice().filter(Number).sort((a, b) => (a<b) - (a>b) )[0]) / data.length );
};
const round=(number)=>{
    return  Math.round((number * 100).toFixed(2)) / 100;
};
const makePoint = (data, scale, {type = true} = {}) => {
    let rez = [];
    let item = 1;
    let ctn = data.length;

    while (item !== ctn) {
        rez[item - 1] =  round(type ? data[item] : item)  * scale   ;
        item++;
    }

    return rez;
};
const makeChart = (data) => {
    let points = {};
    let scales = getScale(data);
    let scaleX = scales.scaleX;
    let x = makePoint(data.columns[0], scaleX, {type: false});
    let ctn = x.length;
    let a = 1;
    let actn = data.columns.length;
    while (a !== actn) {
        let scaleY = scales.scaleY / getExtremum(data.columns[a]);

        let y = makePoint(data.columns[a], scaleY);
        let str = '';
        let i = 0;
        while (i !== ctn) {
            str += `${x[i]},${y[i]} `;
            i++;
        }
        points[data.columns[a][0]] = str;
        a++;
    }
    let charParameter = {};
    for (let props in data) {
        if (props !== 'columns') {
            charParameter[props] = data[props];
            charParameter['axis'] = points;
            charParameter['gprapiks'] = Object.keys(points).length;
            charParameter['innerWidth'] = window.innerWidth;
            charParameter['innerHeigth'] = window.innerHeight;
        }
    }
    return new Chart(charParameter).init();

};

data.forEach(item => {
    makeChart(item);
});


