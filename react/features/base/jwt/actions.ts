import { SET_JWT } from './actionTypes';

/**
 * Stores a specific JSON Web Token (JWT) into the redux store.
 *
 * @param {string} [jwt] - The JSON Web Token (JWT) to store.
 * @returns {{
 *     type: SET_TOKEN_DATA,
 *     jwt: (string|undefined)
 * }}
 */
export function setJWT(jwt?: string) {
    return {
        type: SET_JWT,
        jwt
        //video
        // jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6InBvbHl0b2siLCJzdWIiOiJwb2x5dG9rIiwicm9vbSI6IioiLCJzZWxmaWUiOiJWIiwibmJmIjoxNjYyMDk1MTQ2LCJleHAiOjE2NjIwOTg4NjZ9.ZmoPW-s44QaFV7LfezThl9NClDY3xFEf5IMlBb0nUjw'
        //audio
        // jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6InBvbHl0b2siLCJzdWIiOiJwb2x5dG9rIiwicm9vbSI6IioiLCJzZWxmaWUiOiJBIiwiY2VsZWJyaXR5IjoiWSIsIm5iZiI6MTY4NTk2MzA1NywiZXhwIjoxNjg1OTY2Nzc3fQ.jFvJizOuKoipTOphWNjJ6BZ30QnWT68W3xvzPD3a4nc'
        //picture
        // jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6InBvbHl0b2siLCJzdWIiOiJwb2x5dG9rIiwicm9vbSI6IioiLCJzZWxmaWUiOiJQIiwibmJmIjoxNjYyMDk1MTQ2LCJleHAiOjE2NjIwOTg4NjZ9.RBPk5Oi0t3MK1kzQtI03WPX8YnmoQjYjgDI9kfiqxFw'
        //N
        // jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6InBvbHl0b2siLCJzdWIiOiJwb2x5dG9rIiwicm9vbSI6IioiLCJzZWxmaWUiOiJOIiwibmJmIjoxNjYyNDYwMzUzLCJleHAiOjE2NjI0NjQwNzN9.31wUQGLpKlkF_ThBM7jmGMlYewQ9zaouBH1oe_s9N8s'
        //celebrity
        // jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6InBvbHl0b2siLCJzdWIiOiJwb2x5dG9rIiwicm9vbSI6IioiLCJzZWxmaWUiOiJBIiwiY2VsZWJyaXR5IjoiTiIsIm5iZiI6MTY2MzIzNDg0OCwiZXhwIjoxNjYzMjM4NTY4fQ.hU1fUIqLwz8ZsIi9_NqMsQ_-l1Wqww6Q7AwT4QCGp-g'
        //host
        // jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6InBvbHl0b2siLCJzdWIiOiJwb2x5dG9rIiwicm9vbSI6IioiLCJzZWxmaWUiOiJOIiwibmJmIjoxNjc0ODAwOTIzLCJleHAiOjE2NzQ4MDQ2NDMsImhvc3QiOjU0fQ.fUnSctgo5qBc13p6jciMGdGvursJOscpEh6EtVu9kLM'
        //role
        // jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6InBvbHl0b2siLCJzdWIiOiJwb2x5dG9rIiwicm9vbSI6IioiLCJzZWxmaWUiOiJOIiwibmJmIjoxNjc1OTIzODE0LCJleHAiOjE2NzU5Mjc1MzQsImhvc3QiOjU0LCJyb2xlIjoiSE9TVCIsInVzZXIiOjksInJvb21fbmFtZSI6IjE1MDNfUFRfVGVjaG5vbG9neV9pbl9Gb2N1cyJ9.mT5mK6dZL0JP029McSk6U2NLYkK31xTFJQVpCFv4Hxg'
        //role1
        // jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6InBvbHl0b2siLCJzdWIiOiJwb2x5dG9rIiwicm9vbSI6IioiLCJzZWxmaWUiOiJOIiwibmJmIjoxNjc1OTIzODE0LCJleHAiOjE2NzU5Mjc1MzQsImhvc3QiOjU0LCJyb2xlIjoiUEFSVElDSVBBTlQiLCJ1c2VyIjo5LCJyb29tX25hbWUiOiIxNTAzX1BUX1RlY2hub2xvZ3lfaW5fRm9jdXMifQ.KXOmFuzUyekABWn-ZI4e76C1a8YG8g7iNQNKnGVGAj0'
        //userId
        // jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6InBvbHl0b2siLCJzdWIiOiJwb2x5dG9rIiwicm9vbSI6IioiLCJzZWxmaWUiOiJOIiwibmJmIjoxNjc2MjgyODQzLCJleHAiOjE2NzYyODY1NjMsImhvc3QiOjksInJvbGUiOiJQQVJUSUNJUEFOVCIsInVzZXIiOjcsInJvb21fbmFtZSI6IjE1MzBfUFRfQ3JpY2tldCJ9.bAheYyr2PmjLAx3W-rCj59p9Um3HbSf69SsTTGPMUN4'
        //Guest
        // jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6InBvbHl0b2siLCJzdWIiOiJwb2x5dG9rIiwicm9vbSI6IioiLCJzZWxmaWUiOiJOIiwibmJmIjoxNjc2MjgyODQzLCJleHAiOjE2NzYyODY1NjMsImhvc3QiOjksInJvbGUiOiJQQVJUSUNJUEFOVCIsInVzZXIiOiJHVUVTVCIsInJvb21fbmFtZSI6IjE1MzBfUFRfQ3JpY2tldCJ9.rfVxoj2h65T5kGW36JBwY8-dlCvosYyd8VBRhI8oRck'
    };
}
