"use strict";

// TEST LIBS
const assert = require("assert");
const Rx = require("rxjs");
const { getToken, refreshToken } = require("../index");

// GLOBVAL VARS
let token;

/*
NOTES:
before run please start docker-compose:
  cd deployment/compose/
  docker-compose up
*/

describe("Keyclok token", function() {
  describe("Getting token", function() {

    it("Access token - Failed login ", done => {
      const baseUrl = "http://127.0.0.1:8080/auth";
      const settings = {
        username: "keycloak",
        password: "wrong",
        grant_type: "password",
        client_id: "admin-cli"
      };

      Rx.defer(() => getToken(baseUrl, settings)).subscribe(
        tokenResponse => {
          token = tokenResponse;
          //console.log('Obtained token: ', token);
          assert.ok(false, 'A token cannot be obtained when invalid info is used to authenticate');
        },
        error => {
          console.log('Error getting token: ', error);
          assert.equal(error.error, 'invalid_grant');
          return done();
        },
        () => {
          console.log('Token request completed: ');
          return done();
        }
      );
    });

    it("Access token - Wrong base Url", done => {
      const baseUrl = "http://127.0.0.1:8080/noauth";
      const settings = {
        username: "keycloak",
        password: "wrong",
        grant_type: "password",
        client_id: "admin-cli"
      };

      Rx.defer(() => getToken(baseUrl, settings)).subscribe(
        tokenResponse => {
          token = tokenResponse;
          //console.log('Obtained token: ', token);
          assert.ok(false, 'A token cannot be obtained when the base url is invalid');
        },
        error => {
          console.log('Error getting token: ', error);
          return done();
        },
        () => {
          console.log('Token request completed: ');
          return done();
        }
      );
    });


    it("Getting Access token", done => {
      const baseUrl = "http://127.0.0.1:8080/auth";
      const settings = {
        username: "keycloak",
        password: "keycloak",
        grant_type: "password",
        client_id: "admin-cli"
      };

      Rx.defer(() => getToken(baseUrl, settings)).subscribe(
        tokenResponse => {
          token = tokenResponse;
          //console.log('Obtained token: ', token);
        },
        error => {
          console.log('Error getting token: ', error);
          return done(error);
        },
        () => {
          console.log('Token request completed: ');
          return done();
        }
      );
    });

    it("Refresh token - Invalid refresh token", done => {
      const baseUrl = "http://127.0.0.1:8080/auth";
      const settings = {
        refresh_token: token.refresh_token+'1',
        grant_type: "refresh_token",
        client_id: "admin-cli"
      };

      Rx.defer(() => refreshToken(baseUrl, settings)).subscribe(
        tokenResponse => {
          token = tokenResponse;
          assert.ok(false, 'A token cannot be obtained with an invalid refresh token');
        },
        error => {
          console.log('Error refreshing token: ', error);
          return done();
        },
        () => {
          console.log('Token refresh completed: ');
          return done();
        }
      );
    });

    it("Refresh token", done => {
      const baseUrl = "http://127.0.0.1:8080/auth";
      const settings = {
        refresh_token: token.refresh_token,
        grant_type: "refresh_token",
        client_id: "admin-cli"
      };

      Rx.defer(() => refreshToken(baseUrl, settings)).subscribe(
        tokenResponse => {
          token = tokenResponse;
          // console.log('New token obtained: ', token);
        },
        error => {
          console.log('Error refreshing token: ', error);
          return done(error);
        },
        () => {
          console.log('Token refresh completed: ');
          return done();
        }
      );
    });
  });
});
