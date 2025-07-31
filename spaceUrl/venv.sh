#!/bin/bash

python3.9 -m venv venv

source venv/bin/activate

echo "venv created"

venv/bin/pip install -r requirements.txt