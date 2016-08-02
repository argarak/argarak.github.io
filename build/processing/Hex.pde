/**
 * Copyright 2016 Jakub Kukiełka
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Hex.pde - initialises the Hex class.
 * part of YAHG.pde
 */

class Hex {
  float x, y;
  float radius;
  float shrinkSpeed = random(200) / 100;
  color fillColor;

  // Contructor
  Hex(float xTemp, float yTemp, float tmpradius) {
    x = xTemp;
    y = yTemp;
    radius = tmpradius;
    fillColor = color(noise(x, y) * 100);
  }

  boolean reverse = false;
  boolean first = true;

  void update() {
    if (!reverse) {
      if (first) {
        fillColor = color(random(0, 256));  
        first = false;
      }
      radius = radius - shrinkSpeed;
    } else {
      radius = radius + shrinkSpeed;
    }
    if (radius < 1) {
      fillColor = color(random(0, 256));  
      reverse = true;
    } else if (radius > 99) {
      fillColor = color(random(0, 256));  
      reverse = false;
    }
  }

  // Thank you to Tiago Martins for this snippet
  // http://www.openprocessing.org/sketch/117535
  void drawHexagon() {
    noStroke();
    fill(fillColor);
    pushMatrix();
    translate(x, y);
    rotate(PI/6.0);
    beginShape();
    for (int i = 0; i < 6; i++) {
      pushMatrix();
      float angle = PI*i/3;
      vertex(cos(angle) * radius, sin(angle) * radius);
      popMatrix();
    }
    endShape(CLOSE);
    popMatrix();
  }
  // end snippet
}
