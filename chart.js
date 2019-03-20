'use strict';

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
        <div class="chart" data-id="${settings.SVGindex}">
   <svg width='${settings.w}' height='${settings.hTopChar * 1 + settings.hbottomChar * 1}'>
        <style>
            /*todo тут все цвета будут*/
            
            .progresCovered{
                fill: #F5F9FB;
                fill-opacity: .7;
            }
            .area{
                fill: transparent;
                fill-opacity: .3;               

                stroke: #5dbbff; 
                stroke-opacity: .5;
                stroke-width: 21px;
            }
            
          .round{
              stroke-width: 3;
          }
          
            .map{
                fill: red;
            }
        </style>

        <defs>
            <g id="polilineChars${settings.SVGindex}">
                ${charts}
            </g>

            <g id="progressBar${settings.SVGindex}">
                                
                <symbol id="progresDistrict${settings.SVGindex}" width="100%" height="100%" >
                    <rect class="area" width="100%" height="100%"/>
                </symbol>
                
                <symbol id="progresHidden${settings.SVGindex}" width="100%" height="100%">
                        <rect class="progresCovered" width="100%" height="100%" />
                </symbol> 
     
                                
                <use xlink:href="#progresDistrict${settings.SVGindex}" width="200" height="100%" x="800"/>
                <use xlink:href="#progresHidden${settings.SVGindex}" width="800" height="100%" x="0"/>
                <use xlink:href="#progresHidden${settings.SVGindex}" width="280" height="100%" x="1000"/>
            </g>

        </defs>

        <symbol id="topChar${settings.SVGindex}" width="${settings.wTopChar}" height="${settings.hTopChar}" 
        x="0" y="0" viewBox="1080 0 ${200} ${settings.innerHeigth}" preserveAspectRatio="none" vector-effect="non-scaling-stroke">
        
            
            <use xlink:href="#polilineChars${settings.SVGindex}" stroke-width="${settings.strokeWidth}"/>
        
        </symbol>

        <symbol id="bottomChar${settings.SVGindex}" width="${settings.wbottomChar}" height="${settings.hbottomChar}"  
        x="0" y="${settings.hTopChar}" viewBox="0 0 ${settings.innerWidth} ${settings.innerHeigth}" preserveAspectRatio="none" vector-effect="non-scaling-stroke">
            
            <use xlink:href="#polilineChars${settings.SVGindex}" stroke-width="${settings.strokeWidth * 2}"/>
            <use xlink:href="#progressBar${settings.SVGindex}" />
        
        </symbol>
                
                                
                
            <g id="infoTable${settings.SVGindex}">
            
                <rect class='map' x="0" y="0" width="135" height="80" font-family="Verdana" font-size="14px" rx="10" ry="10"/>
                
                <text dx="67.5" dy="20"  fill="blue" font-size="1rem" text-anchor="middle" >
                    SET, FEBR 24
                </text>
                
                <text dx="10" dy="40" font-size=".9rem"  fill="blue" >
                   <tspan x="5" y="0">
                        1352
                    </tspan>
                    <tspan x="5" dy="20">
                        Joined
                    </tspan>
                </text>
                
                <text dx="50" dy="40" font-size=".9rem"  fill="blue">
                    <tspan x="30" y="0">
                        60
                    </tspan>
                    <tspan x="80" dy="20">
                        Left
                    </tspan>
                </text>
                                
            </g>
            
      
      <use xlink:href="#topChar${settings.SVGindex}" width="${settings.wTopChar}" height="${settings.hTopChar}"/>
      <use xlink:href="#bottomChar${settings.SVGindex}" width="${settings.wbottomChar}" height="${settings.hbottomChar}"/>
                
                <circle class="round" r="7" cx="345" cy="185" stroke="green" fill="#000000" />
                <circle class="round"  r="7" cx="345" cy="282" stroke="red" fill="#000000" />

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
            w: '100%',
            wTopChar: '100%',
            hTopChar: '500',
            wbottomChar: '100%',
            hbottomChar: '100',
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

    // let maxX = window.innerWidth;
    // let maxY = window.innerHeight;

    let maxX = window.innerWidth;
    let maxY = window.innerHeight;

    // let maxX = Math.max(
    //     document.body.scrollWidth,
    //     document.documentElement.scrollWidth,
    //     document.body.offsetWidth,
    //     document.documentElement.offsetWidth,
    //     document.body.clientWidth,
    //     document.documentElement.clientWidth
    // );
    //
    // let maxY = Math.max(
    //     document.body.scrollHeight,
    //     document.documentElement.scrollHeight,
    //     document.body.offsetHeight,
    //     document.documentElement.offsetHeight,
    //     document.body.clientHeight,
    //     document.documentElement.clientHeight
    // );

    console.log('w =', maxX, ' h =', maxY);
    return {scaleX: maxX / ctn, scaleY: maxY / ctn};
};
const getExtremum = (data) => {
    return ( (data.slice().filter(Number).sort((a, b) => (a < b) - (a > b))[0]) / data.length );
};
const round = (number) => {
    return Math.round((number * 100).toFixed(2)) / 100;
};
const makePoint = (data, scale, {type = true} = {}) => {
    let rez = [];
    let item = 1;
    let ctn = data.length;

    while (item !== ctn) {
        rez[item - 1] = round(type ? data[item] : item) * scale;
        item++;
    }

    return rez;
};
const makeChart = (data, index) => {
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
            charParameter['SVGindex'] = index;
            charParameter['gprapiks'] = Object.keys(points).length;
            charParameter['innerWidth'] = window.innerWidth;
            charParameter['innerHeigth'] = window.innerHeight;
        }
    }
    return new Chart(charParameter).init();

};

// data.forEach((item,index) => {
//     makeChart(item,index);
// });
makeChart(data[0], 0);


// todo Сделать ползунок на маленьком графике с размером 300px ширины и 100% высоты
// todo где будет меняться ширина, добавить органы управления, навесить события на него
