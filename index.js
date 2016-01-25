module.exports = function (work) {
  var pending = null
  var callback = null
  var callbacks = null
  var next = null

  return function (val, cb) {
    next = val
    update(cb || noop)
  }

  function update (cb) {
    if (callback) {
      if (!pending) pending = []
      pending.push(cb)
      return
    }

    var val = next
    next = null
    callback = cb
    work(val, done)
  }

  function callAll (err) {
    var cbs = callbacks
    callbacks = null
    if (!cbs) return
    for (var i = 0; i < cbs.length; i++) cbs[i](err)
  }

  function done (err) {
    var cb = callback
    callback = null

    if (pending) {
      callbacks = pending
      pending = null
      update(callAll)
    }

    cb(err)
  }
}

function noop () {}
