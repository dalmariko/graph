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

    static makeDataPoints(settings) {
        let datePoints = '';

        // settings.x.forEach(i=>{
        //    let date=new Date(i);
        //    console.log(date.toLocaleString('en-US', {month: 'short'}),date.toLocaleString('en-US', {day: 'numeric'}));
        // });

        settings.x.sort((a,b)=>{return b-a});
         let i=settings['x'].length;

        while(i+1!==0) {
            if (i % 2 == 0 && i<=10) {
                let date = new Date(settings['x'][i]);
                datePoints += `
               <div class="monthandDay">
                    <p>${date.toLocaleString('en-US', {month: 'short'})},</p>
                    <p>${date.toLocaleString('en-US', {day: 'numeric'})}</p>
                </div>
            `;
            }
           i--;
        }
        return datePoints;
    }

    static template(settings) {
        let charts = Chart.makePolilines(settings);

        let datapoints=Chart.makeDataPoints(settings);

        return ` 
        <div class="chart" data-id="${settings.SVGindex}">
   <svg width='${settings.w}' height='${settings.hTopChar * 1 + settings.hbottomChar * 1}'>
        <style>
           
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
              fill:#242F3E;
          }
          
            .map{
                fill: #253241;
            }
            
            
        .infoContainer {
            width: 80%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            background-color: #253241;
            border-radius: 8px;
            font-size: 20px;
            padding: 4px 10px;
            border-color: #212C3A;
            border-style: solid;
            border-width: 1px;
            box-shadow: 0px 1px 1px #253241;
        }

        .infoContainer p{
            padding: .1rem;
            margin: .1rem;
        }
        
        .tableValue{
           font-size:1.15rem;
            font-weight:700;
        }
        .dateDay{
            margin: .1rem auto;
            padding: .1rem;
            background-color: transparent;
            color: #FFFFFF;
            font-size: 1rem;
            font-weight:700;
        }

        .numbersContainer{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
        }

        .leftInfo,.rigthInfo {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            background-color: transparent;
            font-size: 1rem;
             font-weight:600;
        }

        .leftInfo {
            color: #76D672;
        }

        .rigthInfo {
            color: #F1685F;
        }

        .axixLine{
            stroke:#293544;
            stroke-width:1
        }
        .asixDivision {
            fill:#4A5C6C;
            font-size: .95rem;
        }
        .asixToTableLine{
            stroke:#344252;
            stroke-width:2
        }
            
       .daysContainer {
            display: flex;
            width: 100%;
            flex-direction: row;
            justify-content: space-around;
            font-size: 20px;
            color: #4A5C6C;
            margin: 0;
            padding: 0;
        }

        .monthandDay {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
        }

        .monthandDay p {
            margin: .1rem;
            padding: .1rem;
            font-size: .95rem;
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
                
    
    
           
       <g >
       <text class="asixDivision"x="0" y="70">250</text>
       <line class="axixLine" x1="0" y1="75" x2="100%" y2="75" /> 
       </g>                       
      
       <g >
       <text class="asixDivision"x="0" y="145">200</text>
       <line class="axixLine" x1="0" y1="150" x2="100%" y2="150" /> 
       </g>
       
       <g >
       <text class="asixDivision" x="0" y="220">150</text>
       <line class="axixLine" x1="0" y1="225" x2="100%" y2="225" /> 
       </g>                       
      
       <g >
       <text class="asixDivision"x="0" y="295">100</text>
       <line class="axixLine" x1="0" y1="300" x2="100%" y2="300" /> 
       </g>                       
      
       <g >
       <text class="asixDivision"x="0" y="370">50</text>
       <line class="axixLine" x1="0" y1="375" x2="100%" y2="375" /> 
       </g>                       
      
       <g >
       <text class="asixDivision"x="0" y="445">0</text>
       <line class="axixLine" x1="0" y1="450" x2="100%" y2="450" /> 
       </g>             
                 
                 
      <foreignObject x="0" y="460" width="100%" height="180">
        <div class="daysContainer" xmlns="http://www.w3.org/1999/xhtml">
            ${datapoints}
        </div>
     </foreignObject>
      
     
    
      <use xlink:href="#topChar${settings.SVGindex}" width="${settings.wTopChar}" height="${settings.hTopChar}"/>
      <use xlink:href="#bottomChar${settings.SVGindex}" width="${settings.wbottomChar}" height="${settings.hbottomChar}"/>
        
 
      
      
      
      <line class="axixLine asixToTableLine" x1="345" y1="100" x2="345" y2="450" />
      
      
      
        <foreignObject x="325" y="30" width="165" height="180">

            <div class="infoContainer" xmlns="http://www.w3.org/1999/xhtml">
                <div class="dateDay">Sat, Feb 24</div>
                <div class="numbersContainer">
                    <div class="leftInfo"><p class="tableValue">142</p><p>Joint</p></div>
                    <div class="rigthInfo"><p class="tableValue">67</p><p>Left</p></div>
                </div>
            </div>
            
        </foreignObject>
        
         
                <circle class="round" r="7" cx="345" cy="185" stroke="green"  />
                <circle class="round"  r="7" cx="345" cy="282" stroke="red" />
             

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
            x: '',
            y: '',
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
    let charParameters = {};
    let xTime=[];
        data['columns'][0].forEach((i,index)=>index>0?xTime.push(i):'');

    for (let props in data) {
        if (props !== 'columns') {
            charParameters[props] = data[props];
            charParameters['axis'] = points;
            charParameters['x'] = xTime;
            charParameters['y'] = '';
            charParameters['SVGindex'] = index;
            charParameters['gprapiks'] = Object.keys(points).length;
            charParameters['innerWidth'] = window.innerWidth;
            charParameters['innerHeigth'] = window.innerHeight;
        }
    }
    return new Chart(charParameters).init();

};

// data.forEach((item,index) => {
//     makeChart(item,index);
// });
makeChart(data[0], 0);


//TODO Сделать метод который будет вычислять значения по оси У кратные 50 и он должен меняться с движением ползунка причем по высоте тоже
//TODO Сделать метод который будет менять колличество ДНЕЙ в зависимости от движения ползунка