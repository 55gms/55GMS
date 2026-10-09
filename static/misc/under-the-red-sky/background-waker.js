"use strict";

// Taken straight from C3 source code
var timer_id = -1;
var timer_running = false;
// The MessagePort for communicating with the runtime
var messagePort = null;

function startTimer() {
  if (timer_running) return;
  timer_running = true;
  timer_id = setInterval(tick, 1e3 / 60);
}
function stopTimer() {
  if (!timer_running) return;
  timer_running = false;
  clearInterval(timer_id);
  timer_id = -1;
}
function tick() {
  if (!timer_running) return;
  messagePort.postMessage("tick");
}
// Receive the MessagePort from Construct
self.addEventListener("message", e =>
{
	if (e.data && e.data["type"] === "construct-worker-init")
	{
		messagePort = e.data["port2"];
		messagePort.onmessage = OnMessage;
		OnReady();
	}
});

function OnMessage(e)
{
	var cmd = e.data;
    if (!cmd) return;
    if (cmd === "start") startTimer();
    else if (cmd === "stop") stopTimer();
}

function OnReady()
{
	// Put any startup code in here.
	// Now messages can be posted to the worker with:
	// messagePort.postMessage(...);
}