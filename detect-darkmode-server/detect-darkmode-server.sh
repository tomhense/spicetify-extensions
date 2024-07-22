#!/bin/sh
BASEDIR=$(dirname "$0")
source "$BASEDIR/venv/bin/activate"
python "$BASEDIR/main.py"