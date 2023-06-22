<div align="center">
<img src="frontend/images/seal.png" width="100">
<h1>Taskmaster Scoreboard OSC</h1>

<h3>OSC-Enabled version of VodBox's Taskmaster Scoreboard. For use with cueing software such as QLab.</h3>
</div>


## Running Locally

Clone the repository. Change directory into the backend folder via `cd backend` and install dependencies with 
`npm install`. The backend server and frontend static site can then be both run via

```bash
$ npm run start
```

The site should then be viewable at http://localhost:8081.

## Node OSC Backend

The backend folder defines a Node server that opens a UDP port on the local machine, listening on port 57121.
Any OSC messages received on this port are forwarded to the frontend using a websocket. The implemented mapping is as
follows:

| OSC Address | Function          |
|-------------|-------------------|
| `/play`     | Update Scoreboard |

In this manner the scoreboard can be updated without visual interruption using a network cue from software such as QLab.

### Usage with QLab

TODO

## Standalone Frontend

The frontend can also be run standalone, simply by loading index.html. In this instance, the frontend websocket will not
connect to the backend websocket server, since it is not running. In this case, a play button is shown in the top right
to update the scores.

-----

Based on [VodBox's tm-scoreboard](https://github.com/VodBox/tm-scoreboard)
