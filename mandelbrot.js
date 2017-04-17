var a_left = -1 , b_left = 1;
var a_right = 2, b_right = -1;
var w = 1;
var per_w = 0.001;
max_iteration = 50;

function setup() {
    createCanvas(1000, 500);
}

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function getIterationCount(re, im) {
    i = 0;
    z_re = re;
    z_im = im;
    while( i < max_iteration && Math.sqrt(z_re*z_re + z_im*z_im) < 2 ) {
        next_re = z_re * z_re - z_im * z_im + re;
        next_im = 2 * z_re * z_im + im;

        z_re = next_re;
        z_im = next_im;
        i++;
    }

    return i;
}

function setPointColor(re, im) {
    var iterations = getIterationCount(re, im);
    var quotient = ((max_iteration - iterations) / max_iteration);
    
    noStroke();
    var rgb = hslToRgb(quotient, 1, quotient);
    fill(rgb[0], rgb[1], rgb[2]);
}

var isFirst = true;

function draw() {
    if(isFirst) {
        isFirst = false;
        background(255, 0, 0);
        var re = a_left, im = b_left;
        var x = 0, y = 0;
        
        while(y < height) {
            x = 0;
            re = a_left;
            while(x < width) {
                setPointColor(re, im);
                rect(x, y, w, w);

                x += w;
                re += per_w;
            }

            y += w;
            im -= per_w;     
        }
    }
}