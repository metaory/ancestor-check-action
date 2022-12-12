const core = require('@actions/core');
const wait = require('./wait');


// most @actions toolkit packages have async methods
async function run() {
  try {
    core.debug('=============')
    core.info('<< Starting >>')
    const ms = core.getInput('milliseconds');
    core.info(`xorging ${ms} milliseconds ...`);

    core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    await wait(parseInt(ms));
    core.info((new Date()).toTimeString());

    const owner = 'metaory'
    const repo = 'git-playground'
    const pull_number = 1
    const getFiles = async (page = 1, list = []) => {
      const files = await octokit.request(`GET /repos/${owner}/${repo}/pulls/${pull_number}/files?per_page=100&page=${page}`)
      if (!files.data.length) {
        return list
      } else {
        list.push(...files.data)
        return getFiles(page + 1, list)
      }
    }
    const files = await getFiles()

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
