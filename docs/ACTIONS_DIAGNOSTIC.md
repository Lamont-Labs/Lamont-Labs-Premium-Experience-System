# GitHub Actions diagnostic

## Why this exists
LL-PES workflows were committed successfully, but no passing workflow runs were confirmed. The diagnostic workflow has no path filters or dependency installations. It can be launched manually using **Actions → Actions diagnostic → Run workflow → main**.

## What results mean
- **Workflow appears and manual run succeeds:** Actions execution works; inspect other workflow runs and fix build/test failures.
- **Workflow appears but manual run fails:** inspect the job logs and repository/organization policies.
- **Workflow never appears in Actions:** check repository Settings → Actions → General and organization Actions policy. Also confirm the workflow is on the default branch.
- **Manual run succeeds but connector commits do not start push workflows:** GitHub suppresses most workflows triggered by events generated using `GITHUB_TOKEN`. Determine which credential creates connector commits before attributing missing runs to YAML.
- **Run workflow button absent:** check whether Actions is enabled and whether the account has write permissions.

Do not interpret an empty GitHub connector workflow-run result as proof that no runs exist: the available commit workflow lookup only returns pull-request-triggered runs, and commit statuses are not the same as Actions check runs.

## Limits
The current connected GitHub toolset cannot read or modify Actions repository/organization enablement settings or manually dispatch workflows. A repository administrator must use GitHub's Actions UI or a suitably authorized GitHub API client for those operations.

Do not publish a claim of CI success until an actual run ID, conclusion and logs are recorded.
