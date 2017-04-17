var a_left = -2 , b_left = 1;
var prev_a_left = -2, prev_b_left = 1;
pixel_step_x = 1;
pixel_step_y = 1;
pixel_w = 400;
pixel_h = 200;
w = 4;
h = 2;
var per_w = w / pixel_w;
var per_h = h / pixel_h;
max_iteration = 1000;

function setup() {
    createCanvas(pixel_w, pixel_h);
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

var shouldRender = true;

function draw() {
    if(shouldRender) {
        shouldRender = false;
        
        background(255, 0, 0);
        
        var re = a_left, im = b_left;
        var x = 0, y = 0;
        
        while(y < height) {
            x = 0;
            re = a_left;
            while(x < width) {
                setPointColor(re, im);
                rect(x, y, w, w);

                x += pixel_step_x;
                re += per_w;
            }

            y += pixel_step_y;
            im -= per_h;     
        }
    }
}

function mousePressed() {
    console.log("Mouse pressed");
    
    a_left = a_left + mouseX * per_w;
    b_left = b_left - mouseY * per_h; 
}

function mouseReleased() {
    console.log("Mouse released");

    var a_right = prev_a_left + mouseX * per_w;
    var b_right = prev_b_left - mouseY * per_h;

    w = a_right - a_left;
    h = b_left - b_right;

    console.log(w, h);

    prev_a_left = a_left;
    prev_b_left = b_left;

    per_w = w / pixel_w;
    per_h = h / pixel_h;

    shouldRender = true; 
}
