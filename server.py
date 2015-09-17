import os
import json
import concurrent
import tornado
import tornado.web
import tornado.websocket
from tornado import gen
import tornado_mysql
import pymysql
import bcrypt
from tornado.options import options, define

define('port', default=3306, help='port to run server on')
define('mysql_host', default='127.0.0.1', help='host value')
define('mysql_database', default='chat', help='database name')
define('mysql_user', default='root', help='database user name')
define('mysql_password', default='homm1994', help='database password value')

executor = concurrent.futures.ThreadPoolExecutor(2)


class Application(tornado.web.Application):

	def __init__(self):
		handlers = [
			(r'/', MainPageHandler),
			(r'/sign-up/', SignUpHandler),
			(r'/sign-in/', SignInHandler),
			(r'/log-out/', LogOutHandler),
			(r'/users/', UsersHandler),
			(r'/users/(?P<pk>[0-9]+)/', CertainUsersHandler),
			(r'/messages/', MessagesListHandler),
			(r'/messages/(?P<pk>[0-9]+)/', CertainMessageHandler),
			(r'/message/', MessageHandler)
		]
		settings = {
			'template_path': os.path.join(os.path.dirname(__file__), 'templates'),
			'static_path': os.path.join(os.path.dirname(__file__), 'static'),
			'cookie_secret': 'xhrfer12443dse23e',
			'login_url': '/sign-in/',
			'debug': True
		}
		super(Application, self).__init__(handlers, **settings)
		self.db = pymysql.connect(
			host=options.mysql_host,
			database=options.mysql_database,
			user=options.mysql_user,
			password=options.mysql_password			
		)
		self.online = {}


class BaseHandler(tornado.web.RequestHandler):

	@property
	def db(self):
		return self.application.db

	def get_current_user(self):
		user_id = self.get_secure_cookie('current_user_id')
		if not user_id:
			return None
		cur = self.db.cursor(pymysql.cursors.DictCursor)
		cur.execute("SELECT * FROM account WHERE account_id = %d" % int(user_id))
		return cur.fetchone()
		cur.close()


class MainPageHandler(BaseHandler):

	def get(self):
		self.render('index.html')


class SignUpHandler(BaseHandler):

	@gen.coroutine
	def post(self):
		data = json.loads(self.request.body.decode('utf-8'))
		nick = data['nickname']
		email = data['email']
		password = data['password']
		if not email:
			self.set_status(400)
			self.write({'error': 'Email is required'})
			return
		if not nick:
			self.set_status(400)
			self.write({'error': 'Nickname is required'})
			return
		if not password:
			self.set_status(400)
			self.write({'error': 'Password is required'})
			return
		hashed_password = yield executor.submit(
			bcrypt.hashpw, tornado.escape.utf8(password), bcrypt.gensalt()
		)
		cur = self.db.cursor(pymysql.cursors.DictCursor)
		string = "INSERT INTO account (nickname, email, hashed_password) VALUES (\'{0}\', \'{1}\', \'{2}\')".format(nick, email, hashed_password.decode('utf-8'))
		cur.execute(string)
		string = "SELECT * FROM account WHERE nickname = \'{0}\'".format(nick)
		cur.execute(string)
		user = cur.fetchone()
		self.db.commit()
		cur.close()
		self.set_secure_cookie('current_user_id', str(user['account_id']))
		self.set_status(201)
		self.write('OK')


class SignInHandler(BaseHandler):

	@gen.coroutine
	def post(self):
		data = json.loads(self.request.body.decode('utf-8'))
		nickname = data.get('nickname', False)
		password = data.get('password', False)
		if not nickname:
			self.set_status(400)
			self.write({'error': 'Nickname is required'})
			return
		if not password:
			self.set_status(400)
			self.write({'error': 'Password is required'})
			return
		cur = self.db.cursor(pymysql.cursors.DictCursor)
		string = "SELECT * FROM account WHERE nickname = \'{0}\'".format(nickname)
		cur.execute(string)
		user = cur.fetchone()
		if not user:
			self.set_status(400)
			self.write({'error': 'No such a nickname'})
			return
		hashed_password = yield executor.submit(
			bcrypt.hashpw, tornado.escape.utf8(password),
			tornado.escape.utf8(user['hashed_password'])
		)
		hashed_password = hashed_password.decode('utf-8')
		if hashed_password == user['hashed_password']:
			self.set_secure_cookie('current_user_id', str(user['account_id']))
			self.set_status(200)
			self.write(user)
		else:
			self.set_status(400)
			self.write({'error': 'Password invalid'})
		cur.close()


class LogOutHandler(BaseHandler):

	def get(self):
		print(self.get_cookie('current_user_id'))
		self.clear_cookie('current_user_id')
		self.set_status(200)
		self.write({'status': 'OK'})


class UsersHandler(BaseHandler):

	@tornado.web.authenticated
	def get(self):
		user_id = int(self.get_secure_cookie('current_user_id'))
		cur = self.db.cursor(pymysql.cursors.DictCursor)
		string = 'SELECT * FROM account WHERE NOT account_id = %d' % user_id
		cur.execute(string)
		users = cur.fetchall()
		self.set_status(200)
		self.write(json.dumps(users))
		cur.close()


class CertainUsersHandler(BaseHandler):

	@tornado.web.authenticated
	def patch(self, pk):
		cur = self.db.cursor(pymysql.cursors.DictCursor)
		string = 'UPDATE message SET alr_read = 1 WHERE from_account_id = %d AND to_account_id = %d' \
		% (int(pk), int(self.get_secure_cookie('current_user_id')))
		print(string)
		cur.execute(string)
		self.set_status(200)
		self.write('OK')


class MessagesListHandler(BaseHandler):

	@tornado.web.authenticated
	def get(self):
		user_id = int(self.get_secure_cookie('current_user_id'))
		cur = self.db.cursor(pymysql.cursors.DictCursor)
		string = 'SELECT message_id, from_account_id, to_account_id, content, alr_read FROM message WHERE (to_account_id = {id} AND removed_to = 0) OR (from_account_id = {id} AND removed_from = 0) ORDER BY sent_at'.format(id=user_id)
		cur.execute(string)
		messages = cur.fetchall()
		self.set_status(200)
		self.write(json.dumps(messages))
		cur.close()


class CertainMessageHandler(BaseHandler):

	@tornado.web.authenticated
	def delete(self, pk):
		cur = self.db.cursor(pymysql.cursors.DictCursor)
		string = 'SELECT * FROM message WHERE message_id = %d' % int(pk)
		cur.execute(string)
		message = cur.fetchone()
		if message['from_account_id'] == self.current_user['account_id']:
			word = 'from'
		if message['to_account_id'] == self.current_user['account_id']:
			word = 'to'
		string = 'UPDATE message SET removed_%s = 1 WHERE message_id = %d' % (word, int(pk))
		cur.execute(string)
		string = 'DELETE FROM message WHERE removed_to = 1 AND removed_from = 1'
		cur.execute(string)
		self.db.commit()
		cur.close()
		self.set_status(204)
		self.write('OK')


class MessageHandler(tornado.websocket.WebSocketHandler):

	def open(self):
		# Set anon user case here
		self.user_id = self.get_secure_cookie('current_user_id')
		self.application.online[self.user_id.decode('utf-8')] = self

	def on_message(self, mes):
		db = self.application.db
		if self.user_id:
			message = json.loads(mes)
			cur = db.cursor(pymysql.cursors.DictCursor)
			string = 'INSERT INTO message (from_account_id, to_account_id, content) VALUES (%d, %s, \'%s\')' % (int(self.user_id), message['to_account_id'], tornado.escape.xhtml_escape(message['content'])) 
			cur.execute(string)
			message_id = cur.lastrowid
			db.commit()
			message['from_account_id'] = int(self.user_id)
			message['message_id'] = message_id
			message['alr_read'] = 0
			if self.application.online.get(str(message['to_account_id']), False):
				self.application.online[str(message['to_account_id'])].write_message(message)
				self.application.online[self.user_id.decode('utf-8')].write_message(message)
			cur.close()
		else:
			self.ws_connection.write_message({
				'error': 'Please, authenticate yourself.'
			})

	def on_close(self):
		del self.application.online[self.user_id.decode('utf-8')]


if __name__ == '__main__':
	application = Application()
	application.listen(8888)
	tornado.ioloop.IOLoop.instance().start()