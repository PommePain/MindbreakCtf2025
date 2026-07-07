#!/bin/bash

rm -rf build

if [ -e "gotmail" ]; then
  rm gotmail
fi

mkdir build && cd build || exit

cmake ..
make
mv gotmail ../gotmail && cd ..
patchelf --set-interpreter ./ld-linux-x86-64.so.2 ./gotmail
patchelf --set-rpath ./ ./gotmail