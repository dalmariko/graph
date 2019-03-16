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
                `<polyline points="${settings.axis[`Y${i}`]}"
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
            heightBig: '400',
            widthMini: '100%',
            heightMini: '85',
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
            strokeWidth: 2,
        }
    }
}


const getScale = (data) => {

    let ctn = data.columns[0].length;

    // let maxX = parseFloat(getComputedStyle(document.querySelector('.manyCharts')).width);
    // let maxY = parseFloat(getComputedStyle(document.querySelector('.manyCharts')).height);

    // отвечают за размеры экрана

    // let maxX = window.screen.width;
    // let maxY = window.screen.height;

    // отвечают за размер окна браузера

    let maxX = window.innerWidth;
    let maxY = window.innerHeight;
console.log(maxX,maxY);
    //отвечают за непосредственный размер области отвечающей за вывод информации (очень полезно в мобильных браузерах)

    // let maxX = window.screen.availWidth;
    // let maxY = window.screen.availHeight;

    return {scaleX: maxX / ctn, scaleY: maxY / ctn};
};

const getExtremum = (dataY) => {
    let ctn = dataY.length;
    let copyDataY = dataY.slice();
    let extr = copyDataY.sort((a, b) => {
        return b - a;
    })[0];
    return extr / ctn;
};

const makeChart = (data) => {
    let points = {Y0: '', Y1: '', Y2: '', Y3: ''};

    let axis = 1;
    let ctn = data.columns[0].length;

    let scales = getScale(data);
    let scaleX = scales.scaleX;
    let scaleY = '';
    let x = 0;
    let y = 0;


    while (axis < ctn) {

        x = parseFloat(( axis * scaleX).toFixed(4));

        for (let i = 1; i < data.columns.length; i++) {

            scaleY = scales.scaleY / getExtremum(data.columns[i]);
            y = parseFloat((data.columns[i][axis] * scaleY).toFixed(4));

            points[`Y${i - 1}`] += `${x},${y} `;
        }
        axis++;
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



