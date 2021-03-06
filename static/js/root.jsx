const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const Autocomplete = React;
const {Button, Alert, Col, Row, Card, CardColumns, CardGroup, Container, Collapse, 
	Form, FormControl, Nav, Navbar, Spinner, Popover } = ReactBootstrap;

// instance of context
const LoginContext = React.createContext(null);
// handle showing component

function App() {
	const [loggedIn, setLoggedIn] = React.useState(null);

	
	// check in server if there is a logged in user
	React.useEffect(() => {
	fetch('api/check_login')
		.then(res => res.json())
		.then(data => setLoggedIn(data.logged_in))
	}, [loggedIn]);


	// group navbar links into 1) viewable by logged in users only 2) viewable when not logged in
	const Navigation = {
		true: (
		<Navbar id ="topbar-post">
			<Col className="justify-content-start" id="post-logo">
				<Navbar.Brand className="nav-logo">
					<img src='/static/img/wide-logo.png'
					width='100'
					height='30'
					className='d-inline-block align-top'
					id='logo' />
				</Navbar.Brand>
			</Col>
			<Col className="justify-content-end" id="after-login-links">
				<Link to="/">Home </Link>
				<Link to="/your-profile">Your Profile</Link>
				<Link to="/users">View Users</Link>
				<Link to="/view-saved-playlists">Saved Playlists</Link>
				<Link to="/view-similar-users">User Match</Link>
				<Link to="/logout">Log Out</Link>
			</Col>
	   </Navbar>
		
		),
		false: (
			<Navbar id ="topbar-pre">
				 <Col className="justify-content-start" id="pre-logo">
					<Navbar.Brand className="nav-logo">
						<img src='/static/img/wide-logo.png'
						width='100'
						height='30'
						className='d-inline-block align-top'
						id='logo' />
					</Navbar.Brand>
				</Col>
				<Col className="justify-content-end" id="before-login-links">
					<Link to="/">Home </Link>
					<Link to="/login">Log In</Link>
					<Link to="/create-account">Create Account</Link>
				</Col>
			</Navbar>

			
		)
	}

	return (
		<LoginContext.Provider value={{loggedIn, setLoggedIn}}>
			<Router>
				
				{Navigation[loggedIn]}
				<Switch>
				<Route path="/login" component={Login}>
					<Login />
				</Route>
				<Route path="/create-account" component={CreateAccount}>
					<CreateAccount />
				</Route>
				<Route path="/users" component={Users}>
					<Users />
				</Route>
				<Route path="/get-recs" component={GetSongRecs}>
					<GetSongRecs />
				</Route>
				<Route path="/your-profile">
					<YourProfile />
				</Route>
				<Route path="/add-song-pref" component={AddSongPref}>
					<AddSongPref />
				</Route>
				<Route path="/about" component={About}>
					<About />
				</Route>
				<Route path="/add-artist-pref" component={AddArtistPref}>
					<AddArtistPref />
				</Route>
				<Route path="/logout" component={Login}>
					<Logout />
				</Route>
				<Route path="/view-similar-users">
					<SimilarUsers />
					</Route>
				<Route path="/combined-playlist/:user_id">
					<CombinedPlaylist />
					</Route>
				<Route path="/user-detail/:user_id" component={UserDetail}>
					<UserDetail />
				</Route>
				<Route path="/playlist-detail/:playlist_id" component={PlaylistDetail}>
					<PlaylistDetail />
				</Route>
				<Route path="/view-saved-playlists" component={ViewSavedPlaylists}>
					<ViewSavedPlaylists />
				</Route>
				<Route path="/save-playlist/:user_id" component={SavePlaylist}>
					<SavePlaylist />
				</Route>
				<Route path="/">
					<Homepage />
				</Route>
				</Switch>
			</Router>

		</LoginContext.Provider>
	    
  )
}

function Homepage() {
	// updates the background for just this page
	document.body.style.background="url('/static/img/radio.png')";
	document.body.style.backgroundSize='cover';
	return(
		<Container fluid="md" id="homepage">
			<Row>
				<Col>
					<img src={'static/img/transparent-logo.png'}
							width='100%'
							id='site-logo' />
				</Col>	
			</Row>
			<Row>
				<Col>
					<h2 id="homepage-caption"> Curate a Custom Playlist with a Friend <span className="icon music"></span> </h2>				
				</Col>
				
			</Row>
		</Container> 
	)
}
function About() {
	return <h1>About</h1>
}

function Logout() {
	const {loggedIn, setLoggedIn} = React.useContext(LoginContext);
	React.useEffect(() => {
		fetch('/api/logout', {
			
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(response => response.json())
		.then(data => {
			// arrays to store the song/artists prefs in HTML
			console.log(data);
			setLoggedIn(false);
			console.log(loggedIn);
		})
		
	},[]);
		
	 

	return <Redirect to='/' />
}

function CreateAccount(props) {

	// inputs for name, email, password
	const[fname, setFname] = React.useState("");
	const[lname, setLname] = React.useState("");
	const[email, setEmail] = React.useState("");
	const[password, setPassword] = React.useState("");


	// registers user
	const createUser = (evt) => {

		evt.preventDefault();
		const user = {"fname": fname, "lname": lname,
					"email": email, "password": password}
		fetch('/api/register', {
			method: 'POST',
			body: JSON.stringify(user),
			headers: {
				'Content-Type': 'application/json'
			},

		})
		.then(res => res.json())
		.then(data => {
			if(data.status === 'email already exists') {
				alert('This email is already registered.');
			} else {
				alert('Success! Account created');
			}
		})
	}
	
	// returns create account form
	return(
		<Container fluid="md" id="create-account-form">
			<Form>
			<h4>Create an Account</h4>
			<Form.Group controlid="createFName">
				<Form.Label>First Name</Form.Label>
				<Form.Control type="text" placeholder="First Name"
								onChange= {e => setFname(e.target.value)}
							 	value={fname}/>
			</Form.Group>
			<Form.Group controlid="createLName">
				<Form.Label>Last Name</Form.Label>
				<Form.Control type="text" placeholder="Last Name"
								onChange= {e => setLname(e.target.value)}
								value={lname}
								 />
			</Form.Group>
			<Form.Group controlid="createEmail">
				<Form.Label>Username</Form.Label>
				<Form.Control type="text" placeholder="Username"
								onChange= {e => setEmail(e.target.value)}
								value={email}
								 />
			</Form.Group>
			<Form.Group controlid="createPassword">
				<Form.Label>Password</Form.Label>
				<Form.Control type="password" placeholder="Password"
								onChange= {e => setPassword(e.target.value)}
								value={password}
								 />
			</Form.Group>
			<Button className="btn" type="submit" onClick={createUser}>Create Account</Button>
		</Form>
		</Container>
		
	
	)
}

function Login() {
	
	// tracks the user response for email/password

	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');

	// tracks if user is logged in. Defaults to false.
	const {loggedIn, setLoggedIn} = React.useContext(LoginContext);

	// verifies if login input is correct
	const loginUser = (evt) => {
		evt.preventDefault();

		// formats the user input so we can send it to server
		const user_input = {'email': email, 'password': password};

		// validates from server
		fetch('/api/login', {method: 'POST',
							body: JSON.stringify(user_input),
							credentials: 'include',
							headers: {
								'Content-Type': 'application/json'
							},
					})
		
		.then(res => res.json())
		.then(data => {
		        if (data.status === "correct") {
		            setLoggedIn(true);
		        } else if(data.status === "email error") {

		        	alert('Error: Email not registered');

		        } else {
		            alert('Error: Incorrect password');

		    	}
		});
		}
	// if login is successful, redirect them to ** users page**
	if (loggedIn === true) {
		return <Redirect to='/your-profile' />
	}

	// renders login form
	return (
		<Container fluid="md" id="login-form">
			<h4>Log In</h4>
			<Form>
				<Form.Group controlid="formEmail">
					<Form.Label>Username</Form.Label>
					<Form.Control type="text" placeholder="Username"
									onChange= {e => setEmail(e.target.value)}
									value={email}/>
				</Form.Group>
				<Form.Group controlid="formPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control type="password" placeholder="Password"
									onChange= {e => setPassword(e.target.value)}
									value={password}
									/>
				</Form.Group>
				<Button className="btn" type="submit" onClick={loginUser}>Submit</Button>
			</Form>
		
		</Container>
		);
	}

function YourProfile(props) {
	// return their info
	const profile_info = {'user': props.user, 'song_pref': props.song_pref,
						'artist_pref': props.artist_pref}

	// stores the current user details (to be displayed in HTMl)
	const[favSongs, setFavSongs] = React.useState([]);
	const[favArtists, setFavArtists] = React.useState([]);
	const[fname, setFname] = React.useState([]);

	const history = ReactRouterDOM.useHistory();
	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";
	const createSongRecs = () => {
	
		fetch('/api/get_song_recs', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
		})
	}
	// buildFaveSongs, buildFave artists as functions
	// can declare function in the component
	React.useEffect(() => {
		fetch('/api/profile', {
			
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(response => response.json())
		.then(data => {
			// arrays to store the song/artists prefs in HTML
			const fav_songs = []
			const fav_artists = []

			// get the song pref, name, and artist pref data
			const song_prefs = data.song_pref;
			const artist_prefs = data.artist_pref;
			const f_name = data.user.fname;

			// add each song pref and artist pref to a li
			for (const item of song_prefs) {
				fav_songs.push(
					<li key={item.song_pref_id}>{item.song_title}</li>
				);
			}
			for (const item of artist_prefs) {
				fav_artists.push(
					<li key={item.artist_pref_id}>{item.artist_name}</li>
				);
			}
			setFavSongs(fav_songs);
			setFavArtists(fav_artists);
			setFname(f_name);
		})
		// reset to avoid infinite loop
	}, [props.user, props.song_pref, props.artist_pref])

	return(


		<Container fluid="md" id="your-prof-container">
			<h2>{fname}'s Profile<span className="icon music"></span></h2>
			<Row>
				<Col>
					<Button onClick={createSongRecs}>Update Song Recs</Button>
					 
				</Col>			
			</Row>
			<Row>
				<Col>
					<h6>Input at least 3 songs and 3 artists to generate song recs</h6>
					<h6>Once you have clicked this, you can create shared playlists with other users.</h6>
				</Col>
			</Row>
			<Row>
				<Col>
					<h4>Favorite Songs<span className="icon cd"></span></h4>
					<Button onClick={()=>{history.push(`/add-song-pref`)}}>Add Favorite Songs</Button>
					<div>{favSongs}</div>				
				</Col>
				<Col>
					<h4>Favorite Artists<span className="icon mic"></span></h4>
					<Button onClick={()=>{history.push(`/add-artist-pref`)}}>Add Favorite Artists</Button>
					<div>{favArtists}</div>				
				</Col>
			</Row>
			
		</Container>

	) 
}

function GetSongRecs() {

	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";

	console.log('test');
	return <h2>hi</h2>
}

function Users(props) {

	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";
	// formats the data 
	const user_details = {'email': props.email, 'user_id': props.user_id, 
	'fname': props.fname, 'lname': props.lname};

	// this will store the user details (displayed in HTML)
	const [users, setUsers] = React.useState([]);

	const history = ReactRouterDOM.useHistory();

	// get the user data from server
	React.useEffect(() => {
		fetch('/api/users', {
		
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(response => response.json())
		.then(data => {
			const users_info = []

			// adds list of links for each user. handle each click
			for (const idx in data) {
				users_info.push(
					
					<Card style={{ width: '18rem' }} className="user-card">
						<Card.Body>
						<Card.Title>
							{data[idx]['email']}
							</Card.Title>
						<Card.Text>
							<span className="icon users"></span>
						</Card.Text>
						<Button variant="primary" 
						onClick={()=>{history.push(`/user-detail/${data[idx]['user_id']}`)}}>View Profile</Button>
						</Card.Body>
					</Card>
				
					
					);
			}
			setUsers(users_info);
			
		})
		// reset to avoid infinite loop
	}, [props.email, props.user_id, props.fname, props.lname])

	return(
		<Container fluid="md" id="all-users-container">
			<Row>
				<Col id="users-col">
					<h3>All Users</h3>
				</Col>
			</Row>
			<Row>
				<CardColumns>
					{users}
				</CardColumns>
			</Row>
		</Container>
			
			
		) 
}
function CombinedPlaylist(props) {
	// pulls the user ID from the "route"
	const {user_id} = ReactRouterDOM.useParams();
	const[playlist, setPlaylist] = React.useState([]);
	const[fname, setFname] = React.useState([]);
	const[playlistSongs, setPlaylistSongs] = React.useState([]);
	const[playlistName, setPlaylistName] = React.useState([]);
	
	$('#save-success').hide();

	const history = ReactRouterDOM.useHistory();
	console.log(playlistName);
	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";
	
	// save playlist function
	const savePlaylist = (evt) => {

		evt.preventDefault();
		
		const user_input = {"playlistName": playlistName}
		console.log(playlistName);
		console.log('testingxx');
		fetch(`/api/save_playlist/${user_id}`, {
			method: 'POST',
			body: JSON.stringify(user_input),
			headers: {
				'Content-Type': 'application/json'
			},

		})
		.then(res => res.json())
		.then(data => {
		
		})
		$("#save-success").delay(50).fadeIn(500);
		$('#save-success').hide();
		
	}
	React.useEffect(() => {
		fetch(`/api/combined_playlist/${user_id}`, {
			
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(res => res.json())
		.then(data => {
			const f_name = data.user.fname;
			const playlist = data.playlist;
			
	
			// array to store the songs in playlist
			const playlistItems = [];
			
			for (const item of playlist) {
				playlistItems.push(
					<div>
						<li key={item[1]}>{item[0]}</li>
							<iframe src= {`https://open.spotify.com/embed/track/${item[1]}`}
								
								width="300" height="50" frameBorder="0" allowtransparency="true" 
								allow="encrypted-media"></iframe>
					</div>
				);
			}
			setPlaylistSongs(playlistItems);
			setFname(f_name);
			
			//**** need to find a way to pass the playlist name in and send to server */
			})
		// reset to avoid infinite loop
	}, [props.user, props.playlist])

	return (
		<React.Fragment>
			<Container fluid="md" id="shared-playlist-container">
				<h2>Shared Playlist with {fname}<span className="icon music"></span></h2>
				<Row>
					<Col id="playlist-songs-col">
						{playlistSongs}
					</Col>
				</Row>
				
			</Container>
			<Container fluid="md" id="playlist-form">
				<Row>
					<Col>
						<Form >
							<Form.Group controlid="playlistName">
								<Form.Label>Save Playlist</Form.Label>
								<Form.Control type="text" placeholder="Playlist Name"
												onChange= {e => setPlaylistName(e.target.value)}
												value={playlistName}/>
							<Button id="save-playlist" className="btn"
							onClick={savePlaylist}>Save Playlist</Button>
							</Form.Group>
						</Form>
					</Col>
				</Row>
				<div id="save-success">Saved!</div>
			</Container>
		</React.Fragment>
		
		
	)
}

function SavePlaylist(props) {
	// get the songs and users in the playlist and pass it to server. then server commits it
	const {user_id} = ReactRouterDOM.useParams();
	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";
	// make a form to store the playlist name. update the state of it ***
	React.useEffect(() => {
		fetch(`/api/save_playlist/${user_id}`, { // playlist name?
			
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(res => res.json())
		.then(data => {
		
			// array to store the songs in playlist
			console.log(data)
			})
		// reset to avoid infinite loop
	})
	return <Redirect to='/users' />
}
function ViewSavedPlaylists(props){
	const[playlistList, setPlaylistList] = React.useState([]);
	const history = ReactRouterDOM.useHistory();
	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";
	React.useEffect(() => {
		fetch(`/api/saved-playlists`, {
			
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(res => res.json())
		.then(data => {
			const allPlaylists = []

			// adds list of links for each user. handle each click
			for (const item in data['playlists']) {
				
				console.log(data['playlists'][item][0]);
				//history.push(`/user-detail/${data[idx]['user_id']}`);
				allPlaylists.push(
						<li key={data['playlists'][item][0]}>
							<Link onClick={()=>{history.push(`/playlist-detail/${data['playlists'][item][0]}`)}}>{data['playlists'][item][1]}</Link>
						</li>
					);
			}
			
		setPlaylistList(allPlaylists);
		})
		// reset to avoid infinite loop
	}, [props.playlistList])
	return(
		<Container fluid="md" id="saved-playlist-container">
			<h2>Saved Playlists</h2>
			<Row>
				<Col>
					{playlistList}
				</Col>
			</Row>
		</Container>
	)
}
function UserDetail(props) {
	// pulls the user ID from the "route"
	const {user_id} = ReactRouterDOM.useParams();
	const profile_info = {'user': props.user, 'song_pref': props.song_pref,
						'artist_pref': props.artist_pref, 'playlist': props.playlist}

	// stores the current user details (to be displayed in HTMl)
	const[favSongs, setFavSongs] = React.useState([]);
	const[favArtists, setFavArtists] = React.useState([]);
	const[fname, setFname] = React.useState([]);
	
	
	const user = {"user_id": {user_id}}
	const history = ReactRouterDOM.useHistory();
	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";
	
	// call another function to do the loop
	React.useEffect(() => {
		fetch(`/api/user-detail/${user_id}`, {
			
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(res => res.json())
		.then(data => {
			// arrays to store the song/artists prefs in HTML
			const fav_songs = []
			const fav_artists = []

			// get the song pref, name, and artist pref data
			const song_prefs = data.song_pref;
			const artist_prefs = data.artist_pref;
			const f_name = data.user.fname;

			// add each song pref and artist pref to a li
			for (const item of song_prefs) {
				fav_songs.push(
					<div>
						<li key={item.song_pref_id}>{item.song_title}</li>
						<iframe src= {`https://open.spotify.com/embed/track/${item.song_uri}`}
						width="300" height="60" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
					</div>
				);
			}
			for (const item of artist_prefs) {
				fav_artists.push(
					<li key={item.artist_pref_id}>{item.artist_name}</li>
				);
		}
		setFavSongs(fav_songs);
		setFavArtists(fav_artists);
		setFname(f_name);
			
		})
		// reset to avoid infinite loop
	}, [props.user, props.song_pref, props.artist_pref])

	return(

		<Container fluid="md" id="user-detail-container">
			<h2>{fname}'s Profile<span className="icon music"></span></h2>
			<Row>
				<Col>
					<Button id="generate-playlist" onClick={()=>{history.push(`/combined-playlist/${user_id}`)}}>Generate Shared Playlist with {fname}</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					<h4>Favorite Songs<span className="icon cd"></span></h4>
					<div>{favSongs}</div>				
				</Col>
				<Col id="profile-artists" className="align-top">
					<h4>Favorite Artists<span className="icon mic"></span></h4>
					<div>{favArtists}</div>				
				</Col>
			</Row>
			
		</Container>

		) 
}
function PlaylistDetail(props) {
	// pulls the user ID from the "route"
	const {playlist_id} = ReactRouterDOM.useParams();
	const[playlistSongs, setPlaylistSongs] = React.useState([]);
	const[songTitles, setSongTitles] = React.useState([]);
	const [playlistName, setPlaylistName] = React.useState([]);

	// stores the current user details (to be displayed in HTMl)
	console.log(playlist_id);
	
	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";
	// call another function to do the loop
	React.useEffect(() => {
		fetch(`/api/playlist-detail/${playlist_id}`, {
			
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(res => res.json())
		.then(data => {
		
			const songs = data.songs;
			console.log(songs);
			const playlist_name = data.playlist_name;
	
			// array to store the songs in playlist
			const playlistItems = [];
			
			for (const item in songs) {
				console.log(data['songs'][item]['song_title']);
				
				playlistItems.push(
					<div>
						<li key={item}data-toggle="tooltip" data-html="true"
						title={`Loudness: ${data['songs'][item]['song_loudness']}           
								Danceability: ${data['songs'][item]['song_danceability']}         
								Valence:${data['songs'][item]['song_valence']}       
								Tempo:${data['songs'][item]['song_tempo']}        
								Energy:${data['songs'][item]['song_energy']}       
								Acousticness:${data['songs'][item]['song_acousticness']}        
								`}
						>
									{data['songs'][item]['song_title']}</li>
						<iframe src= {`https://open.spotify.com/embed/track/${data['songs'][item]['song_uri']}`}
						width="300" height="60" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
					</div>
				);
			}
			setPlaylistSongs(playlistItems);
			setPlaylistName(playlist_name);
			
			})
		// reset to avoid infinite loop
	}, [props.playlistSongs], [props.playlistName])
	return(
		<Container fluid="md" id="playlist-details-container">
			<h2>{playlistName}</h2>
			<Row>
				<Col id="saved-playlist-col">
					{playlistSongs}
				</Col>
			</Row>
		</Container>
		) 
}

function SimilarUsers() {
	// get session user and pull the most similar
	const[similarUser, setSimilarUser] = React.useState([]);

	// variables to store current user attributes
	const[currentUserValence, setCurrentUserValence] = React.useState([]);
	const[currentUserSpeechiness, setCurrentUserSpeechiness] = React.useState([]);
	const[currentUserAcousticness, setCurrentUserAcousticness] = React.useState([]);
	const[currentUserEnergy, setCurrentUserEnergy] = React.useState([]);
	const[currentUserDanceability, setCurrentUserDanceability] = React.useState([]);
	const[currentUserLoudness, setCurrentUserLoudness] = React.useState([]);
	// variables to store similar user attributes
	const[similarUserValence, setSimilarUserValence] = React.useState([]);
	const[similarUserSpeechiness, setSimilarUserSpeechiness] = React.useState([]);
	const[similarUserAcousticness, setSimilarUserAcousticness] = React.useState([]);
	const[similarUserEnergy, setSimilarUserEnergy] = React.useState([]);
	const[similarUserDanceability, setSimilarUserDanceability] = React.useState([]);
	const[similarUserLoudness, setSimilarUserLoudness] = React.useState([]);
	
	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";

	React.useEffect(() => {

		fetch('/api/similar-users', {

			headers: {
				'Content-Type': 'application/json'
			},
		})
		
		.then(response => response.json())
		.then(data => {
			// set current user attributes
			setSimilarUser(data.similar_user);
			setCurrentUserValence(data.current_user_info[0]);
			setCurrentUserSpeechiness(data.current_user_info[1]);
			setCurrentUserAcousticness(data.current_user_info[2]);
			setCurrentUserEnergy(data.current_user_info[3]);
			setCurrentUserDanceability(data.current_user_info[4]);
			setCurrentUserLoudness(data.current_user_info[5]);

			// set similar user attributes
			setSimilarUserValence(data.similar_user_info[0]);
			setSimilarUserSpeechiness(data.similar_user_info[1]);
			setSimilarUserAcousticness(data.similar_user_info[2]);
			setSimilarUserEnergy(data.similar_user_info[3]);
			setSimilarUserDanceability(data.similar_user_info[4]);
			setSimilarUserLoudness(data.similar_user_info[5]);


		})
	})
	// stores the style
	const chartStyle = {height: '50%'};
	const makeGraph = () => {

		// add a graph comparing each of their songs for each attr?
		var ctx = document.getElementById('myChart').getContext('2d');
		var chart = new Chart(ctx, {
			// The type of chart we want to create
			type: 'radar',
			
			// The data for our dataset
			data: {
				
				labels: ["Valence", "Speechiness", "Acousticness", "Energy", "Danceability", "Loudness"],
				datasets: [{
					label: "You",
					backgroundColor: "rgba(200,0,50,0.8)",
					data: [`${currentUserValence}`, `${currentUserSpeechiness}`, `${currentUserAcousticness}`,
					`${currentUserEnergy}`, `${currentUserDanceability}`, `${currentUserLoudness}`]
				}, {
					label: `${similarUser}`,
					backgroundColor: "rgba(0,50,200,0.8)",
					data: [`${similarUserValence}`, `${similarUserSpeechiness}`, `${similarUserAcousticness}`,
					`${similarUserEnergy}`, `${similarUserDanceability}`, `${similarUserLoudness}`]
				}]
			},

		});
	
	}
	return(
		<Container fluid="md" id="similar-container">
			<Row>
				<Col>
					<h3>Music Taste Match <span className="icon music"></span></h3>
					<li>{similarUser}<span className="icon similar-user"></span></li>
				<Button id="user-graph" onClick={makeGraph}>See Graph</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					
					<canvas id="myChart" style={chartStyle} ></canvas>
					
				</Col>
			</Row>
	
		</Container>
		
	)
}


function AddSongPref(props) {
	// lets user add song pref to profile

	// updates background
	document.body.style.background="url('/static/img/moroccan-flower.png')";
	// input for song pref title
	const[songPref, setSongPref] = React.useState("");
	const[addedPref, setAddedPref] = React.useState(false);
	
	// default
	$('#song-success').hide();
	var autocompleteInfo = '';

	const[token, setToken] = React.useState("");
	// get the token from server
	fetch('/api/token', {
	
		headers: {
			'Content-Type': 'application/json'
		},

	})
	.then(res => res.json())
	.then(data => {
		const token_info = data.token;
		setToken(token_info);
		console.log(token_info);
		console.log('xx')
	})

	$(document).ready(function() {
		$("#song-input").autocomplete({
			
			source: function(request, response) {
				$.ajax({
					type: "GET",
					url: "https://api.spotify.com/v1/search",
					dataType: "json",
					headers: {
						'Authorization' : 'Bearer ' + token,
					},
					data: {
						type: "track",
						limit: 3,
						contentType: "application/json; charset=utf-8",
						format: "json",
						q: request.term
					},
					success: function(data) {
						response($.map(data.tracks.items, function(item) {
							console.log(item);
							return {
								label: item.name,
								value: item.name,
								id: item.id
							}
						}));
					}
				});
			},
			minLength: 3,
			select: function(event, ui) {
				$("#song-input").val(ui.item.value);
				autocompleteInfo = ui.item.value;
				setSongPref(autocompleteInfo);
			},
		});
		
		});
	
	
	const user_input = {"songPref": songPref};

	const addSong = (evt) => {
		evt.preventDefault();
		

		fetch('/api/add_song_pref', {
			method: 'POST',
			body: JSON.stringify(user_input),
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
		})

		.then(res => res.json())
		.then(data => {
			if(data.status === "song pref added") {
				setAddedPref(true);
				console.log('song added');
				$("#song-success").delay(100).fadeIn(300);
				$('#song-success').hide();
			}
			else{
				alert('error');
			}		
	});
	}
		// renders song pref form
	return (
		<Container fluid="md" id="song-pref-form">
			<Form>
				<Form.Group controlid="song-input-form">
					<Form.Label>Song Title:</Form.Label>
					<Form.Control type="text"
									id="song-input" 
									onChange= {e => setSongPref(autocompleteInfo)}/>
				</Form.Group>
				<Button variant="primary" onClick={addSong}>Add Song Preference</Button>
			</Form>
			<div id="song-success">Added!</div>
		</Container>
		);
}


function AddArtistPref(props) {
	// lets user add artist pref to profile

	// updates background
	document.body.style.background="url('static/img/moroccan-flower.png')";
	// input for artist pref title
	const[artistPref, setArtistPref] = React.useState("");
	const[addedPref, setAddedPref] = React.useState(false);
	const[token, setToken] = React.useState("");
	var autocompleteInfo = '';
	// default
	$('#alert-success').hide();

	// get the token from server
	fetch('/api/token', {
	
		headers: {
			'Content-Type': 'application/json'
		},

	})
	.then(res => res.json())
	.then(data => {
		const token_info = data.token;
		setToken(token_info);
	})

	$(document).ready(function() {
		$("#artist-input").autocomplete({
			
			source: function(request, response) {
				$.ajax({
					type: "GET",
					url: "https://api.spotify.com/v1/search",
					dataType: "json",
					headers: {
						'Authorization' : 'Bearer ' + token,
					},
					data: {
						type: "artist",
						limit: 3,
						contentType: "application/json; charset=utf-8",
						format: "json",
						q: request.term
					},
					success: function(data) {
						response($.map(data.artists.items, function(item) {
							console.log(item);
							return {
								label: item.name,
								value: item.name,
								id: item.id
							}
						}));
					}
				});
			},
			minLength: 3,
			select: function(event, ui) {
				$("#artist-input").val(ui.item.value);
				autocompleteInfo = ui.item.value;
				setArtistPref(autocompleteInfo);
			},
		});
		
		});

	
	// formats the user input
	const user_input = {"artistPref": artistPref};
	console.log(user_input);
	const addArtist = (evt) => {
		evt.preventDefault();

		fetch('/api/add_artist_pref', {
			method: 'POST',
			body: JSON.stringify(user_input),
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			if(data.status === "artist pref added") {
				setAddedPref(true);
				$("#alert-success").delay(50).fadeIn(500);
				$('#alert-success').hide();
			}
			else{
				alert('error');
			}
			
	});
	
	}

	// can replace line 472 to true with history.push(/your-profile)

		// renders song pref form
	return (

		<Container fluid="md" id="artist-pref-form">
			<Form>
				<Form.Group controlid="artist-input-form">
					<Form.Label>Artist Name:</Form.Label>
					<Form.Control type="text"
									id="artist-input" 
									onChange= {e => setArtistPref(autocompleteInfo)}/>
				</Form.Group>
				<Button variant="primary" onClick={addArtist}>Add Artist Preference</Button>
			</Form>
			<div id="alert-success">Added!</div>
		</Container>

		);
}


ReactDOM.render(<App />, document.getElementById('root'))