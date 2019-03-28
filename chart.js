'use strict';

class Chart {
    constructor(chart,indexChar,settings) {
        this._chart=chart;
        this._indexChar=indexChar;
        this._settings = Object.assign(Chart.getDefaultsettings(),settings);
    }

    init() {
        Chart.getIndex(this._indexChar);
        Chart.getScale(this._chart);
        Chart.makeChart(this._chart);
        Chart.makePolilines(this._chart);
        Chart.getX(this._chart.columns[0]);
        Chart.makeDataXPoints();
        Chart.addTemplate(this._settings);
        return this;
    }

    static getIndex(indexChar){
        return this._indexChar=indexChar;
    }
    static getX(chart){
        this._xPoints=[];
        chart.forEach((i,index)=>{index>0?this._xPoints.push(i):''});
        return this._xPoints;
    }

    static getScale(chart){
        let ctn = chart.columns[0].length;
        let maxX = window.innerWidth;
        let maxY = window.innerHeight;
        return this._scale = {scaleX: maxX / ctn, scaleY: maxY / ctn, maxX: maxX, maxY: maxY};
    }

    static getExtremum(chart){
        return ( (chart.slice().filter(Number).sort((a, b) => (a < b) - (a > b))[0]) / chart.length );
    }

    static round(number){
        return Math.round((number * 100).toFixed(2)) / 100;
    }

    static makePoint(chart, scale, {type = true} = {}){
        let rez = [];
        let item = 1;
        let ctn = chart.length;

        while (item !== ctn) {
            rez[item - 1] = Chart.round((type ? chart[item] : item) * scale);
            item++;
        }

        return rez;
    }

    static makeChart(chart){
        this._points = {};
        let scales = this._scale;
        let scaleX = scales.scaleX;
        let x = Chart.makePoint(chart.columns[0], scaleX, {type: false});
        let ctn = x.length;
        let a = 1;
        let actn = chart.columns.length;
        while (a !== actn) {
            let scaleY = scales.scaleY / Chart.getExtremum(chart.columns[a]);

            let y = Chart.makePoint(chart.columns[a], scaleY);
            let str = '';
            let i = 0;
            while (i !== ctn) {
                str += `${x[i]},${y[i]} `;
                i++;
            }
            this._points[chart.columns[a][0]] = str;
            a++;
        }
    return this._points;
    }

    static addTemplate(settings) {
        let template = Chart.template(settings);
        document.querySelector(settings.chartsContainer).insertAdjacentHTML('beforeend', template);
    }

    static makePolilines(chart) {
       this._polilines = '';

        let color = [];
        for (let key in chart.colors) {
            color.push(chart.colors[key]);
        }

        for (let i = 0; i < chart.columns.length-1; i++) {
            this._polilines +=
                `<polyline points="${this._points[`y${i}`]}"
                     style="fill:transparent;stroke:${color[i]};" />`
        }
        return this;
    }

    static makeDataXPoints() {
        this._datePoints = '';
        this._xPoints.sort((a,b)=>{return b-a});
         let i=this._xPoints.length;
        let multiple=2;
        let maxDataElements=multiple*4;
        while(i+1!==0) {
            if (i % multiple == 0 && i<=maxDataElements) {
                let date = new Date(this._xPoints[i]);
                this._datePoints += `
               <div class="monthandDay">
                    <p>${date.toLocaleString('en-US', {month: 'short'})},</p>
                    <p>${date.toLocaleString('en-US', {day: 'numeric'})}</p>
                </div>
            `;
            }
           i--;
        }
        return this._datePoints;
    }

    static makeValueYPoints(settings) {

    }

    static template(settings) {

        // let datapoints=Chart.makeDataXPoints(settings);

        return ` 
        <div class="chart" data-id="${this._indexChar}">
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
        <g id="polilineChars${this._indexChar}">
            ${this._polilines}
        </g>

        <g id="progressBar${this._indexChar}">

            <symbol id="progresDistrict${this._indexChar}" width="100%" height="100%" >
                <rect class="area" width="100%" height="100%"/>
            </symbol>

            <symbol id="progresHidden${this._indexChar}" width="100%" height="100%">
                <rect class="progresCovered" width="100%" height="100%" />
            </symbol>


            <use xlink:href="#progresDistrict${this._indexChar}" width="200" height="100%" x="800"/>
            <use xlink:href="#progresHidden${this._indexChar}" width="800" height="100%" x="0"/>
            <use xlink:href="#progresHidden${this._indexChar}" width="280" height="100%" x="1000"/>
        </g>

    </defs>

    <symbol id="topChar${this._indexChar}" width="${settings.wTopChar}" height="${settings.hTopChar}"
            x="0" y="0" viewBox="1080 0 ${200} ${this._scale.maxY}" preserveAspectRatio="none" vector-effect="non-scaling-stroke">


        <use xlink:href="#polilineChars${this._indexChar}" stroke-width="${settings.strokeWidth}"/>

    </symbol>

    <symbol id="bottomChar${this._indexChar}" width="${settings.wbottomChar}" height="${settings.hbottomChar}"
            x="0" y="${settings.hTopChar}" viewBox="0 0 ${this._scale.maxX} ${this._scale.maxY}" preserveAspectRatio="none" vector-effect="non-scaling-stroke">

        <use xlink:href="#polilineChars${this._indexChar}" stroke-width="${settings.strokeWidth * 2}"/>
        <use xlink:href="#progressBar${this._indexChar}" />

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
            ${this._datePoints}
        </div>
    </foreignObject>



    <use xlink:href="#topChar${this._indexChar}" width="${settings.wTopChar}" height="${settings.hTopChar}"/>
    <use xlink:href="#bottomChar${this._indexChar}" width="${settings.wbottomChar}" height="${settings.hbottomChar}"/>





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
            types: {
                y0: "line",
                y1: "line",
                x: "x"
            },
            names: {
                y0: "#0",
                y1: "#1"
            },
            colors: {
                axisY0: "#ED685F",
                axisY1: "#76D672",},
            strokeWidth: 1,
        }
    }
}


// let item=data[0];
// let index = 0;

data.forEach((item,index)=>{
    new Chart(item,index).init();
});
