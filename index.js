const github = require('@actions/github');
const core = require('@actions/core');

const wait = require('./wait');

async function run() {
  try {
    core.debug('#############')
    core.info('<- Starting ->')

    // const ghToken = core.getInput('ghToken');
    // const octokit = new GitHub(ghToken, {});
    const ghToken = process.env['SECRET_TOKEN'] // core.getInput('ghToken');
    core.info(`>>>>>>> ${ghToken}`);
    const octokit = github.getOctokit(ghToken)

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
    core.info('>>>>>>>>>')
    core.info(JSON.stringify(files, null, 2))

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
