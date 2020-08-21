"""Server for movie ratings app."""

from flask import (Flask, render_template, request, flash, session, jsonify,
                   redirect)
from model import connect_to_db
import crud ##comment out if you want to -i into crud.py
import api

from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


@app.route('/')
def homepage():
	"""view the homepage."""

	

	return render_template('homepage.html')


@app.route('/users')
def all_users():
    """View all users."""

    users = crud.get_users()

    return render_template('all_users.html', users=users)

@app.route('/users', methods=['POST'])
def register_user():
	"""Creates a new user."""

	# gets the email, password, fname and lastname for user
	email = request.form.get('email')
	fname = request.form.get('fname')
	lname = request.form.get('lname')
	password = request.form.get('password')


	# checks if email is already registered
	# if registered, tell them account is already registered
	user = crud.get_user_by_email(email)
	if user:
		flash('This email is already registered. Please try again.')
	#if not registered, create a new instance of user
	else:
	
		crud.create_user(email, fname, lname, password)
		flash('Success! You can now log in.')

	#redirects back to homepage
	return redirect('/')


@app.route('/api/users')
def get_users():
    """View all users."""

    # gets all users and jsonifies it

    top_posts = [
    {"id": 93, "title": "why kiwis are the best fruit, part 9", "body": " body text for p1"},
    {"id": 783, "title": "typsetting in the 19th century", "body": " body text for p2"},
    {"id": 1383, "title": "debugging, a lifes tale", "body": " body text for p3"}
    ]

    #users = crud.get_users()

    return jsonify(top_posts)



@app.route('/profile', methods=['POST'])
def login_user():
	## right now it only lets you log in with existing
	#session['show_login'] == True
	# gets email and password from form
	email = request.form['email']
	password = request.form['password']

	##

	# gets user info based on email
	user = crud.get_user_by_email(email)
	session['user'] = []
	# checks if pasword in db matches form pasword
	if user.password == password:
		#adds user to session
		session['user'] = user.user_id
		flash('you are logged in!')
		artist_prefs = crud.get_user_artist_prefs(user.user_id)
		song_prefs = crud.get_user_song_prefs(user.user_id)
		return render_template('user_profile.html', user=user, artist_prefs=artist_prefs,
			song_prefs=song_prefs)
			## here you would pass in a  jsnonified dict. all the info for this user. make dict with that in it
			# parse json string. use info from that to build out components
			#maybe do request.__.get
	else:
		flash('incorrect login.')
		return redirect('/')

## only one HTML template with Root component
# server routes would no longer render templates. they would all be returning JSON
# be processing this data in javascript

# be using react. fetch function to get things back from .jsx
@app.route('/users/<user_id>')
def show_user(user_id):
    """Show details on a particular user."""

    user = crud.get_user_by_id(user_id)
    artist_prefs = crud.get_user_artist_prefs(user_id)
    song_prefs = crud.get_user_song_prefs(user_id)
    rec_tracks = crud.get_recommended_tracks(user_id)
    x = crud.get_all_song_recs()
    rec_names = []
    for track in rec_tracks:
    	text_format = api.get_song_title(track)
    	rec_names.append(text_format)

    session_user = session['user']
    x = crud.get_user_by_id(session_user)
    fname = x.fname

    # gets attributes of user's recommended tracks

    shared_prefs = crud.get_shared_tracks(user_id,1)
    song_attributes = crud.get_song_attributes(user_id)

    averages = crud.get_average(song_attributes)
    stdev = crud.get_stdev(song_attributes)

    similar_songs = crud.get_all_similar_songs(session['user'], user_id, 10)


    return render_template('user_details.html', user=user, artist_prefs=artist_prefs, song_prefs=song_prefs,
    	rec_names=rec_names, shared_prefs=shared_prefs,
    	song_attributes=song_attributes, averages=averages, stdev=stdev, 
    	similar_songs=similar_songs, fname=fname)

@app.route('/profile/add_prefs')
def show_prefs_form():
	"""Shows form for user to input their preferences."""

	# ## next: how to add this to the table
	user_id = session['user']
	user = crud.get_user_by_id(user_id)

	return render_template('add_prefs.html')

@app.route('/profile/add_prefs', methods=['POST'])
def add_users_prefs():
	"""enables users to add their preferences."""

	#gets artist and songs from input form
	artist = request.form.get('artist')
	song_title = request.form.get('song')

	# Adds song and artist prefs to the User
	user_id = session['user']
	user = crud.get_user_by_id(user_id)
	if artist:
		artist_pref = crud.create_artist_pref(artist, user_id)
	if song_title:
		#gets song id
		song_uri = api.get_song_id(song_title)
		song_pref = crud.create_song_pref(song_title, user_id, song_uri)
	artist_prefs = crud.get_all_artist_prefs()
	song_prefs = crud.get_all_song_prefs()
	song_recs = crud.get_all_song_recs()
	return render_template('updated_profile.html', artist_prefs=artist_prefs, 
		song_prefs=song_prefs, user=user, song_recs=song_recs)


@app.route('/profile/get_recs', methods=['POST'])
def get_recs():
	"""Gets song recommendations for user."""

	# # how to make this so it will update when user updates songs? automatic?
	user_id = session['user']
	user = crud.get_user_by_id(user_id)
	song_recs = crud.get_recommended_tracks(user_id)
	

	# #adds each recommended song to DB
	for song_uri in song_recs:
		#gets song title
		title = api.get_song_title(song_uri)
		## how to get song id
		# create song then get song ID to make rec track
		audio_fx = api.get_audio_features(song_uri)
		tempo = audio_fx['tempo']
		valence = audio_fx['valence']
		danceability = audio_fx['danceability']
		energy = audio_fx['energy']
		loudness = audio_fx['loudness']
		acousticness = audio_fx['acousticness']
		speechiness = audio_fx['speechiness']
		artist = api.get_song_artist(song_uri)
		crud.create_song(title, song_uri, tempo, valence, danceability, 
			energy, loudness, acousticness, speechiness, artist)
		song_id = crud.get_song_id(song_uri) 
		crud.create_recommended_track(user_id, song_uri, title, song_id)
	user_song_recs = crud.get_all_song_recs(user_id)



	return render_template('prof_2.html', user=user, user_song_recs=user_song_recs)




## Jinja displays existing artists. Updated list of Artists. Make an Ajax call to get existing data
## Ajax call can return JSON
## route to take in what user typed in. in the end, return JSON that will be appended to the page
#something similar to 106. passing in artist preferences for the user
#look at crud and see what it does if there isn't any preferred

if __name__ == '__main__':
	connect_to_db(app)
	app.run(host='0.0.0.0', debug=True)
