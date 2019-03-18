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
                     style="fill:${settings.fill};stroke:${color[i]};" />`
        }
        return polilines;
    }

    static template(settings) {
        let charts = Chart.makePolilines(settings);

        return ` 
        <div class="chart">
   <svg width='${settings.w}' height='${settings.hTopChar*1+settings.hbottomChar*1}'>
        <style>
            /*todo тут все цвета будут*/
        </style>

        <defs>
            <!--/*todo тут будут все элементы поделенные по ID*/-->
            <g id="polilineChars">
                ${charts}
            </g>

        </defs>

        <symbol id="topChar" width="${settings.wTopChar}" height="${settings.hTopChar}" x="0" y="0" viewBox="1080 0 ${200} ${settings.innerHeigth}" preserveAspectRatio="none" vector-effect="non-scaling-stroke">
            <use xlink:href="#polilineChars" stroke-width="${settings.strokeWidth}"/>
        </symbol>

        <symbol id="bottomChar" width="${settings.wbottomChar}" height="${settings.hbottomChar}"  x="0" y="${settings.hTopChar}"
        viewBox="0 0 ${settings.innerWidth} ${settings.innerHeigth}" preserveAspectRatio="none" vector-effect="non-scaling-stroke">
            <use xlink:href="#polilineChars" stroke-width="${settings.strokeWidth*2}"/>
        </symbol>

       <use xlink:href="#topChar"/>
       <use xlink:href="#bottomChar"/>

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
            w:'100%',
            wTopChar: '100%',
            hTopChar: '300',
            wbottomChar: '100%',
            hbottomChar: '80',
            fill: 'transparent',
            axis: '',
            types: {"y0": "line", "y1": "line", "x": "x"},
            names: {"y0": "#0", "y1": "#1"},
            colors: {
                "axisY0": "#cb513a",
                "axisY1": "#73c03a",
                "y2": "#ff35e3",
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
console.log('w =',maxX,' h =',maxY);
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

// data.forEach(item => {
//     makeChart(item);
// });

    makeChart(data[0]);


 //todo Сделать ползунок на маленьком графике с размером 300px ширины и 100% высоты
 //todo   где будет меняться ширина, добавить органы управления, навесить события на него
