# BrilliantSole.js

Web SDK for BrilliantSole insoles

## License

This project is source-available under the [Business Source License 1.1](./LICENSE) starting with version 0.1.0.

**Free to use, modify, and ship:**
- on BrilliantWear devices and any device on the [authorized devices list](https://brilliantwear.com/authorized-devices), including with your own modified firmware;
- in apps, services, and tools that talk to those devices, on any phone, computer, or server;
- for personal, academic, and non-profit purposes on any hardware;
- for development, testing, evaluation, and prototyping on any hardware.

**Needs a commercial license:** running this code in a shipping product on hardware that is not an authorized device. Email licensing@brilliantwear.com.

Each version converts to GPL v2 or later four years after it is published. Releases before 0.1.0 remain under the MIT License. The `examples` directory remains MIT (see `examples/LICENSE`). Plain-language summary: https://brilliantwear.com/license


## Installation

__To insall via npm:__
```javascript
npm install brilliantsole
```

__to add in a webpage:__
```html
<script src="https://unpkg.com/brilliantsole@latest/build/brilliantsole.js"></script>
```

## Running the Node.js server for WebSocket/UDP stuff

On macOS:  
for the security stuff, run the command in the terminal:  
`sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./sec/key.pem -out ./sec/cert.pem`
Windows is the same but without `sudo`, if you have openssl installed

install https://code.visualstudio.com/ & https://nodejs.org/en/  
install npm in terminal: sudo npm install  
install yarn in VS Code terminal: yarn install  
start localhost: yarn start (try sudo yarn start if that doesn't work)  
open https://localhost/ in chrome

if it doesn't work, try turning the firewall off

if you have issues saving or running stuff on mac, try:  
`sudo chown -R username directory_name`

afterward, you can install using yarn:  
`yarn install`

and then run `start`:  
`yarn start`
