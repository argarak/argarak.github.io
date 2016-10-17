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
 * YAHG.pde - yet another hexagonal grid.
 * ripoff of the xscreensaver program "Hexadrop"
 */


int counter;
 
Hex[] hexagons; 
 
static final int X_HEXAGONS = 17; 
static final int Y_HEXAGONS = 17;

void setup() {
  hexagons = new Hex[X_HEXAGONS * Y_HEXAGONS];
  int count = 0;
  
  for(int y = 0; y < Y_HEXAGONS; y++) {
    for(int x = 0; x < X_HEXAGONS; x++) {
       hexagons[count++] = new Hex((-85 * y) + 170 * x, 150 * y, 100); 
    }
  }
  
  size(1920, 1080); 
  background(0);
}
 
void draw() {
  for (Hex mod : hexagons) {
    mod.drawHexagon();
    mod.update();
  }
}
 
