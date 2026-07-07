cmake_minimum_required(VERSION 3.28)
project(gotmail C)

set(CMAKE_C_STANDARD 11)

include_directories(.)
include_directories(src)
file(GLOB SOURCES "src/*.c")
file(GLOB HEADERS "src/includes.h")

add_executable(gotmail ${SOURCES} ${HEADERS})
target_compile_options(gotmail PRIVATE)
target_link_options(gotmail PRIVATE -Wl,-z,lazy -Wl,-z,relro)
