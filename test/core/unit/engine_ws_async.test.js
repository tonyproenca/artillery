/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const WS = require("jest-websocket-mock").WS;
const runner = require("../../../core").runner;
const WebSocketEngine = require("../../../core/lib/engine_ws");
const EventEmitter = require("events");
const sleep = require('util').promisify(setTimeout)

let ws;
beforeEach(async () => {
  ws = new WS("ws://localhost:8080");
});
afterEach(() => {
  WS.clean();
});

test("the server keeps track of received messages, and yields them as they come in", async (done) => {
  const ee = new EventEmitter();
  const initialContext = {
    vars: {},
  };

  //TODO export to a separate file
  const script = {
    config: {
      target: "ws://localhost:8080",
      phases: [{ duration: 1, arrivalCount: 1 }],
    },
    scenarios: [
      {
        name: "Nevermind",
        engine: "ws",
        flow: [
          { send: "Hello" },
          // { listen: { timeout: 1000 } },
          // { assert: { that: "name", equals: "test" } },
          // { assert: { that: "id", equals: "123" } },
        ],
      },
    ],
  };

  ws.on('open', function open() {
    console.log('open baber')
  });

  const engine = new WebSocketEngine(script);
  const runScenario = engine.createScenario(script.scenarios[0], ee);

  setImmediate(() => {
    runScenario(initialContext, (err) => {
      console.log(err);
    });
    done();
  });
});
