let showDataList = [
    'hectare','shift','date','hectare_squirrel_number','age','primary_fur_color','highlight_fur_color','combination_of_primary_and', 'color_notes','location',
    'above_ground_sighter', 'running', 'chasing', 'climbing', 'eating', 'other_activities', 'kuks', 'quaas', 'moans', 'tail_flags', 'tail_wtitches', 'approaches',
    'indifferent', 'runs_form'
]
let rightShowDataList = [
    'hectare','shift','date','hectare_squirrel_number','age','primary_fur_color','highlight_fur_color','combination_of_primary_and_highlight_color', 'color_notes','location',
    'above_ground_sighter_measurement', 'running', 'chasing', 'climbing', 'eating', 'other_activities', 'kuks', 'quaas', 'moans', 'tail_flags', 'tail_wtitches', 'approaches',
    'indifferent', 'runs_form'
]
let toBoolList = [
    'running', 'chasing', 'climbing', 'eating', 'kuks', 'quaas', 'moans', 'tail_flags', 'tail_wtitches', 'approaches',
    'indifferent', 'runs_form'
]
let index = 0
document.addEventListener("DOMContentLoaded", function() {
    const squirrelDataDiv = document.getElementById('squirrelData');

    fetch('vfnx-vebw.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const squirrelIdDiv = document.createElement('div');
            squirrelIdDiv.classList.add('idInfo')
            squirrelIdDiv.classList.add('squirrelId');
            squirrelIdDiv.textContent = item.unique_squirrel_id;
            const form = document.createElement('div');
            for(let index in showDataList){
                key = showDataList[index]
                const columnData = document.createElement('div');
                columnData.classList.add('columnData');
                const keyDom = document.createElement('div');
                keyDom.classList.add('key')
                keyDom.textContent = capitalizeFirstLetter(rightShowDataList[index])
                columnData.appendChild(keyDom)
                const valueDom = document.createElement('div')
                valueDom.classList.add('value')
                if (item[key] == undefined){
                    valueDom.textContent =  '/'
                }else if(toBoolList.includes(key)){
                    const circle = document.createElement('div')
                    circle.classList.add(item[key] ? 'greenCircle' : 'redCircle')
                    valueDom.appendChild(circle)
                }else{
                    valueDom.textContent =  item[key]
                }
                columnData.appendChild(valueDom)
                form.appendChild(columnData)
            }
            form.classList.add('hidden');
            form.classList.add('form');
            // form.innerHTML = `
            //     <pre>${JSON.stringify(item, null, 4)}</pre>
            // `;

            squirrelDataDiv.appendChild(squirrelIdDiv);
            squirrelDataDiv.appendChild(form);
            squirrelIdDiv.addEventListener('click', function() {
                if (form.classList.contains('hidden')) {
                    form.classList.remove('hidden');
                } else {
                    form.classList.add('hidden');
                }
            });
        });
        let canvas = document.getElementById("chartCanvas");
        let ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth * 0.55;
        canvas.height = window.innerHeight;
        let canvasData = [];
        let barWidth = 6;
        let barSpacing = 1;
        let startX = 0;
        let startY = 0;
        let maxSquirrelNumber = 23;
        let currentIndex = 0;
        let isPaused = false; // 标记是否暂停生成和移动
        
        // 创建悬浮框元素
        let tooltip = document.createElement('div');
        tooltip.style.position = 'absolute';
        tooltip.style.display = 'none';
        tooltip.style.backgroundColor = '#b2d08ccc';
        tooltip.style.padding = '5px';
        tooltip.style.border = '1px solid #82b23d';
        tooltip.style.color = '#765548'
        document.body.appendChild(tooltip);
        
        // 监听鼠标移入事件
        canvas.addEventListener('mouseenter', function() {
            isPaused = true; // 暂停生成和移动
        });
        
        // 监听鼠标移出事件
        canvas.addEventListener('mouseleave', function() {
            isPaused = false; // 恢复生成和移动
            tooltip.style.display = 'none'; // 隐藏悬浮框
        });
        
        // 监听鼠标移动事件
        canvas.addEventListener('mousemove', function(e) {
            // if (isPaused) {
            //     return; // 如果暂停了，则不显示悬浮框
            // }
            let mouseX = e.clientX - canvas.getBoundingClientRect().left;
            let mouseY = e.clientY - canvas.getBoundingClientRect().top;
        
            // 寻找鼠标位置下的柱状图
            let hoveredBar = canvasData.find(function(item) {
                return mouseX >= item.x && mouseX <= item.x + barWidth && mouseY >= 0 && mouseY <= canvas.height;
            });
        
            if (hoveredBar) {
                tooltip.style.display = 'block';
                tooltip.style.left = (e.clientX + 10) + 'px';
                tooltip.style.top = (e.clientY + 10) + 'px';
                // console.log(hoveredBar)
                tooltip.innerHTML  = 'Hectare: ' + hoveredBar.hectare+"<br>"+ 'Hectare Squirrel Number: ' + hoveredBar.hectare_squirrel_number;
            } else {
                tooltip.style.display = 'none'; // 鼠标不在柱状图上时隐藏悬浮框
            }
        });
        
        setInterval(function() {
            index += 1
            // console.log(data[index])
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        
            ctx.beginPath();
            ctx.moveTo(startX - 10, startY);
            ctx.stroke();
        
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.stroke();
        
            ctx.fillStyle = "#000";
            ctx.fillRect(startX - 1, startY - 2, 2, 2);
        
        
            if (canvasData.length >= canvas.width / (barWidth + barSpacing)) {
                canvasData.shift();
            }
    
            canvasData.forEach(function(item, index) {
                item.x = startX + index * (barWidth + barSpacing);
                item.y = canvas.height - 20 - item.hectare_squirrel_number / maxSquirrelNumber * (canvas.height - 40);
                item.x -= (barWidth + barSpacing);
                drawBar(item.x, item.y, item.hectare_squirrel_number);
            });
    
            let newY = canvas.height - 20 - Math.floor(Math.random() * maxSquirrelNumber) / maxSquirrelNumber * (canvas.height - 40);
            if (!isPaused) { // 如果没有暂停生成和移动
                canvasData.push({ x: startX + (canvasData.length * (barWidth + barSpacing)), y: newY, hectare_squirrel_number: data[index]['hectare_squirrel_number'], hectare: data[index]['hectare']});
            }
        }, 50);
        
        function drawBar(x, y, height) {
            ctx.fillStyle = "#689F3855";
            ctx.fillRect(x, startY, barWidth, y - startY);
            ctx.strokeStyle = "#AED58188";
            ctx.strokeRect(x, startY, barWidth, y - startY);
            ctx.fillStyle = "#7CB342";
            ctx.fillRect(x, y, 6, 6);
        }
        
    })
    .catch(error => console.error('Error loading squirrel data:', error));
});



function capitalizeFirstLetter(str) {
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

document.getElementById('info').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'block';
});

document.addEventListener('click', function(e) {
    if (e.target.id != 'rectangle' && e.target.id != 'info') {
        document.getElementById('overlay').style.display = 'none';
    }
});