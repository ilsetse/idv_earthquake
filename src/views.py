from src import app
from flask import Flask, render_template, redirect

@app.route('/')
def index():
  return render_template('index.html')

# For debugging purposes, shows flask errors also on server
@app.errorhandler(500)
def handle_500(exception):
    trace = traceback.format_exc()
    return("<pre>" + trace + "</pre>"), 500
