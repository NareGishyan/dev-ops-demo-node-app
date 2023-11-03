var http = require('http')
const os = require('os');

// Get the network interfaces
const networkInterfaces = os.networkInterfaces();
let ip

// Loop through the network interfaces to find the IPv4 address
for (const interfaceName in networkInterfaces) {
  const interfaces = networkInterfaces[interfaceName];
  for (const iface of interfaces) {
    if (iface.family === 'IPv4' && !iface.internal) {
      ip = iface.address;
      console.log(`IP address of ${interfaceName}: ${ip}`);
    }
  }
}
var port = 80

var server = http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'})
  response.end(`<html>
      <body bgcolor="black">
      <h2><font color="gold">Build by Power of Terraform <font color="red"> v0.12</font></h2><br><p>
        <font color="white">Server IP: ${ip}</font><br><p>
  <b>Version 1.0</b>
</body>
</html>`)
})

server.listen(port)

console.log('Server running at http://localhost:' + port)
