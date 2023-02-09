/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    return context.octokit.issues.createComment(issueComment);
  });

  app.on(["pull_request.opened", "pull_request.edited", "pull_request.synchronize"], async (context) => {
    context.log("The PR was updated recently.");

    // const prUser = context.payload.issue.user.login;
    // context.log(context.payload);
    if (context.isBot) {
      // Ignore update if this issue was created by the bot
      context.log("This push was created by the bot");
      context.log("Execution finished\n\n");
      return;
    }

    context.log("Reacted with -1");
    // const issueComment = context.issue({
    //   body: "Your PR was dismissed due to recent update/s.",
    // });
    // await context.octokit.issues.createComment(issueComment);

    //Approve the PR
    dismissPullRequest(context);
    context.log("PR dismissed");

  });

};


async function dismissPullRequest (context) {
  // Dismiss the PR
  // const prParams = context.pullRequest({ reviewers: ['influscopeTu']})
  // await context.octokit.pulls.requestReviewers(prParams)

  let allReviews = await context.octokit.pulls.listReviews(context.pullRequest());
  let reviewData = allReviews?.data;
  if (reviewData?.length > 0) {
    for (let i = 0; i < reviewData.length; i++) {
      // let reviewParams = context.pullRequest({ review_id: reviewData[i].id })
      context.log(reviewData[i]);
      // const issueComment = context.issue({
      //   body: 'this is a test'+i,
      // });
      // await context.octokit.issues.createComment(issueComment);

      // await context.octokit.pulls.dismissReview(reviewParams)
    }
  }

}

async function approvePullRequest (context) {
  // Approve the PR
  const prParams = context.pullRequest({ event: 'APPROVE' })
  await context.octokit.pulls.createReview(prParams)
}
