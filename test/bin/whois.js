
var t = require('assert')
var fs = require('fs')
var path = require('path')
var os = require('os')
var cp = require('child_process')

var fpath = path.resolve(os.homedir(), '.varnalab-cli')

var spawn = ((index) => (args, env) => {
  var fpath = path.resolve(__dirname, '../spawn.js')
  var dpath = path.resolve(__dirname, '../../coverage/whois' + index++)
  return cp.spawn('istanbul', ['cover', '--dir', dpath, fpath]
    .concat(args ? ['--'].concat(args) : []),
    {env: process.env}
  )
})(0)


describe('whois', () => {
  var whois

  before(() => {
    fs.writeFileSync(path.resolve(__dirname, '../spawn.js'),
      'console.log(JSON.stringify(require(\'../bin/whois\')))'
    )
  })

  describe('coverage', () => {
    before(() => {
      whois = spawn()
    })

    it('dummy', (done) => {
      whois.stdout.once('data', () => done())
    })

    after((done) => setTimeout(() => {
      whois.kill()
      done()
    }, 100))
  })

  after(() => {
    fs.unlinkSync(path.resolve(__dirname, '../spawn.js'))
  })
})
