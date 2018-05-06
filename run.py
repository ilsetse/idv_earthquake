import os 
from src import app
import logging



if __name__ == '__main__':
  logger = logging.getLogger(__name__)
  logger.setLevel(logging.DEBUG)

  app.jinja_env.auto_reload = True
  app.config['TEMPLATES_AUTO_RELOAD'] = True

  #app.run(host='localhost', port=8000, debug=True)
  port = int(os.environ.get('PORT', 8000)) 
  app.run(host='0.0.0.0', port=port)
