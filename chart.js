'use strict';

class Chart {
    constructor(chart,indexChat,settings) {
        this._settings = Object.assign(Chart.getDefaultsettings(),chart,indexChat,settings);
    }

    init() {
        Chart.getX(this._settings.columns[0]);
        Chart.getScale(this._settings.columns[0]);
        Chart.makeChart(this._settings);
        Chart.makePolilines(this._settings);
        Chart.makeDataXPoints();
        Chart.addTemplate(this._settings);
        return this;
    }
    static addTemplate(settings) {
        let template = Chart.template(settings);
        document.querySelector(settings.chartsContainer).insertAdjacentHTML('beforeend', template);
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



    static getX(chart){
        this._xPoints=[];
        chart.forEach((i,index)=>{index>0?this._xPoints.push(i):''});
        return this._xPoints;
    }

    static getScale(chart){
        let ctn = chart.length;
        let maxX = window.innerWidth;
        let maxY = window.innerHeight;
        return  this._scale = {scaleX: maxX / ctn, scaleY: maxY / ctn, maxX: maxX, maxY: maxY};
    }


    static makeChart(chart){
        this._points = {};
        let scaleX = this._scale.scaleX;
        let x = Chart.makePoint(chart.columns[0], scaleX, {type: false});
        let ctn = x.length;
        let a = 1;
        let actn = chart.columns.length;
        while (a !== actn) {
            let scaleY = this._scale.scaleY / Chart.getExtremum(chart.columns[a]);

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
        return this._polilines;
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



    static template(chartSettings) {

        return ` 
        <div class="chart" data-id="${chartSettings.indexChat}">
         <svg width='${chartSettings.w}' height='${chartSettings.hTopChar * 1 + chartSettings.hbottomChar * 1}'>
    
    <style></style>

    <defs>
        <g id="polilineChars${chartSettings.indexChat}">
            ${this._polilines}
        </g>

        <g id="progressBar${chartSettings.indexChat}">

            <symbol id="progresDistrict${chartSettings.indexChat}" width="100%" height="100%" >
                <rect class="area" width="100%" height="100%"/>
            </symbol>

            <symbol id="progresHidden${chartSettings.indexChat}" width="100%" height="100%">
                <rect class="progresCovered" width="100%" height="100%" />
            </symbol>


            <use xlink:href="#progresDistrict${chartSettings.indexChat}" width="200" height="100%" x="800"/>
            <use xlink:href="#progresHidden${chartSettings.indexChat}" width="800" height="100%" x="0"/>
            <use xlink:href="#progresHidden${chartSettings.indexChat}" width="280" height="100%" x="1000"/>
        </g>

    </defs>

    <symbol id="topChar${chartSettings.indexChat}" width="${chartSettings.wTopChar}" height="${chartSettings.hTopChar}"
            x="0" y="0" viewBox="1080 0 ${200} ${this._scale.maxY}" preserveAspectRatio="none" vector-effect="non-scaling-stroke">


        <use xlink:href="#polilineChars${chartSettings.indexChat}" stroke-width="${chartSettings.strokeWidth}"/>

    </symbol>

    <symbol id="bottomChar${chartSettings.indexChat}" width="${chartSettings.wbottomChar}" height="${chartSettings.hbottomChar}"
            x="0" y="${chartSettings.hTopChar}" viewBox="0 0 ${this._scale.maxX} ${this._scale.maxY}" preserveAspectRatio="none" vector-effect="non-scaling-stroke">

        <use xlink:href="#polilineChars${chartSettings.indexChat}" stroke-width="${chartSettings.strokeWidth * 2}"/>
        <use xlink:href="#progressBar${chartSettings.indexChat}" />

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

    <use xlink:href="#topChar${chartSettings.indexChat}" width="${chartSettings.wTopChar}" height="${chartSettings.hTopChar}"/>
    <use xlink:href="#bottomChar${chartSettings.indexChat}" width="${chartSettings.wbottomChar}" height="${chartSettings.hbottomChar}"/>


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
            indexChat:100,
        }
    }
}


// let item=data[0];
// let indexChat = 0;

console.time("walkIn");

data.forEach((item,indexChat)=>{
    new Chart(item,indexChat).init();
});

console.timeEnd("walkIn");