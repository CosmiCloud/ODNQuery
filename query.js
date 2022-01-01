const prompts = require('prompts');
const util = require('util');

const exec = util.promisify(require('child_process').exec);
const DKGClient = require('dkg-client');

const OT_NODE_HOSTNAME = '0.0.0.0';
const OT_NODE_PORT = '8900';

module.exports ={
  query: async function query(){
  try{
    (async () => {
	  // initialize connection to your DKG Node
      let options = { endpoint: OT_NODE_HOSTNAME, port: OT_NODE_PORT, useSSL: false, loglevel: 'info' };
      const dkg = new DKGClient(options);
	  
	  // get info about endpoint that you are connected to
      await dkg.nodeInfo().then((result) => {
        console.log('\x1b[35mDisable SSL as self signed certs cannot be used with V6 Beta.')
        console.log('\x1b[35mCurrently running OT Node version: \x1b[32m'+result.version)
        console.log(' ')
      });
	  
      var response = await prompts({
        type: 'text',
        name: 'response',
        message: '\x1b[35mWhat query would you like to run? Enter nothing to run a default query'
      });

		  if(response.response){
			options = {
				query: response.response
			};
		  }else{
			options = {
				query: `PREFIX schema: <http://schema.org/>
						CONSTRUCT { ?s ?p ?o }
						WHERE {
							GRAPH ?g {
							?s ?p ?o .
							?s schema:hasVisibility ?v
						}
					}`
			};
		  }
		  
		  console.log('\x1b[35mRunning query against the ODN..')
		  await dkg.query(options).then((result) => {
				if(result.status == 'FAILED'){
				console.log('\x1b[31mQuery Failed!')
				console.log('\x1b[35m',result.error)
				return;
				}
				console.log('\x1b[32mQuery Completed!')
				console.log(' ')
				console.log('\x1b[35mHeres the query result!')
				console.log('\x1b[32m',JSON.stringify(result));
				console.log(' ')
				console.log('\x1b[35mCheck out your node logs to see your node working!')
			});
        })();
      }catch(e){
        console.log('\x1b[31m',e);
      }
  }
}
module.exports.query();
