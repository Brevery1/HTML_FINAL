(function () {
    
    function hForm(event) {
        let error = false;
        for (let i = this.elements.length - 1; i >= 0; i--) {
            if (!this.elements[i].value) {
                alert('Please, fill all fields');
                error = true;
                break;
            }
        }
        if (!error) alert('You submited the request');
        event.preventDefault();
    }

    function ajaxError(status) {
        alert("Network error with status " + status);
    }

    function parseWeather(text) {
        let result, item;
        try {
            result = JSON.parse(text);
        }
        catch (e) {
            ajaxError('JSON error');
            return;
        }
        if (item = document.getElementById("tnow")) {
            item.innerText = result?.current?.temperature_2m || '-'; /* getting the temrature now */
        }
        if (item = document.getElementById("t1")) {
            item.innerText = result?.hourly?.temperature_2m[30] || '-'; /* getting the temrature tommorow */
        }
        if (item = document.getElementById("t2")) {
            item.innerText = result?.hourly?.temperature_2m[54] || '-'; /* getting the temrature in 2 days */
        }
        if (item = document.getElementById("wnow")) {
            item.innerText = result?.current?.wind_speed_10m || '-'; /* getting the wether now */
        }
        if (item = document.getElementById("w1")) {
            item.innerText = result?.hourly?.wind_speed_10m[30] || '-'; /* getting the wether tommorow */
        }
        if (item = document.getElementById("w2")) {
            item.innerText = result?.hourly?.wind_speed_10m[54] || '-'; /* getting the wether in 2 days */
        }
    }

    window.addEventListener('load', function () {
        let f = document.body.querySelectorAll('form.form');
        if (f.length) {
            for (let i = f.length - 1; i >= 0; i--) {
                f[i].addEventListener('submit', hForm);
            }
        }

        if (f = document.getElementById('weather')) {
            let ajax = new XMLHttpRequest(),
                url = "https://api.open-meteo.com/v1/forecast?latitude=%1&longitude=%2&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m";
            url = url.replace("%1", f.getAttribute('data-latitude')).replace("%2", f.getAttribute('data-longitude')); /* selecting the coordinates for the city */
            ajax.open("GET", url, true);
            ajax.timeout = 3000; /* timeout if api doesnt work */
            ajax.onreadystatechange = function () {
                if (this.readyState !== 4) return;
                if (this.status !== 200) {
                    ajaxError(this.status);
                    return;
                }
                parseWeather(this.responseText);
            };
            ajax.send();
        }
    });

})();
