# Premium experience verification checklist

| Gate | Required evidence |
| --- | --- |
| Architecture | Dependency graph and documented boundary review |
| Design | Screenshots, approved brand comparison, text hierarchy and component states |
| Accessibility | Contrast checks, screen reader walkthrough, scalable text, target sizes, reduced motion |
| Functionality | Executed primary journeys, persistence, interruption and back navigation |
| Visual regression | Reviewed baseline/diff images across supported sizes |
| Performance | Startup and interaction measurements on identified devices |
| Integration | Existing data and behavior regression tests |
| Release | Commit SHA, build artifact checksum, signing and install checks where applicable |

For each gate record PASS, FAIL, BLOCKED or UNVERIFIED. PASS requires actual evidence. Required FAIL/BLOCKED/UNVERIFIED gates prevent a release-ready claim.
