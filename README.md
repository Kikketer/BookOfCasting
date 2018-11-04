# Book of Casting

The intention of this repo was originally intended to repeat the IR Raspberry Potter project.  It adapted to a simple client/server with sockets, so you don't really NEED to use a raspberry pi.  Here's an idea, just mount a tablet into a book and serve up the webpage.

Check out the blog post at: http://cjweed.com/book-of-casting-rev1/

The rest of this readme is just notes for myself.

## Setting up Raspberry PI

1. Install Stretch via typical methods
2. Use this guide to install openCV: https://www.pyimagesearch.com/2017/09/04/raspbian-stretch-install-opencv-3-python-on-your-raspberry-pi/


## Wiring it up

Adafruit IR LEDS:
part 388
Voltage drop: 1.6V
Current Rating: 100mA
LEDS: 2

Via ledcalculator.net =
+3.3 -- +{led}- +{led}- --- 1ohm --- GND

## Plan
Raspberry Potter script sends a POST to `http://localhost:3001/api/cast?name=[circle]`
Via socket io the output is displayed on the screen
Backdoor commands to send the same messages via a separate screen