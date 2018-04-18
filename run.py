from src import app
import logging

if __name__ == '__main__':
  # API AUTH
  #app.config.from_object('config.DevelopmentConfig')
  logger = logging.getLogger(__name__)
  logger.setLevel(logging.DEBUG)

  app.jinja_env.auto_reload = True
  app.config['TEMPLATES_AUTO_RELOAD'] = True
  app.run(host='localhost', port=8000, debug=True)
