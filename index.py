import os
import webapp2
import jinja2

from google.appengine.ext import db
from google.appengine.api import mail

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
								autoescape = True)

class Handler(webapp2.RequestHandler):
	def write(self, *a, **kw):
		self.response.out.write(*a, **kw)
	
	def render_str(self, template, **params):
		t = jinja_env.get_template(template)
		return t.render(params)
		
	def render(self, template, **kw):
		self.write(self.render_str(template, **kw))
				
class MainPage(Handler):
    def get(self):
		self.render("front.html")

class TestHandler(webapp2.RequestHandler):
	def post(self):
		q = self.request.get('q')
		self.redirect('/canvasGen/index.html')

class QueryHandler(Handler):
    def post(self):
	    name = self.request.get('name')
	    email = self.request.get('email')
	    phone = self.request.get('phone')
	    message = self.request.get('message')
	    mailBody = 'Name : ' + name + '\n' + 'Email : ' + email + '\n' + 'Phone : ' + phone + '\n Message : ' + message + '\n'
	    mailToSend = mail.EmailMessage(sender="nitishsab@gmail.com",subject="New Query")
	    mailToSend.to = "CE CON <sssaaabbb@gmail.com>"
	    mailToSend.body = mailBody;
	    mailToSend.send();

	    self.response.out.write('valid')

application = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/query', QueryHandler),
	('/testform', TestHandler)
], debug=True)