# Team Constitution

*This document records how our team works together on Mage Quest. Fill in every field. Replace the italic guidance with your team's decisions. Changes to this document go through a pull request like any other change.*

---

## 1. Team and Roles

### Team Number

### Team Name

_

### Members

| Name | GitHub username | Preferred contact | Usual availability |
|------|-----------------|-------------------|--------------------|
|Nate         | natehouseknecht                 |                   |                    |
|Z            | wrigh4zx                        |                   |                    |
|Mamadou      | mamadoucth/lab                  |                   |                    |
|Victor       | Victor915187                    |                   |                    |

### Scrum Master

**Sprint 1 Scrum Master:** Victor Zangla

**Does the role rotate?** *(e.g., rotates each sprint in the order listed above; or one person for the whole project)*
Rotates 
_

### Product Owner

*Choose one team member who will interact with the instructor (stakeholder) to clarify and prioritize stories, and to collect new ones.*
Nate Houseknecht

_

### Other Responsibilities

Who is responsible for maintaining the project board / backlog in good order? *(Scrum Master?)* Victor Zangla

Who is responsible for deploying the main branch to production to update GitHub pages? Nate Houseknecht

### Decision Making

*(How do we decide things: consensus, majority vote, Scrum Master decides? What happens if we are deadlocked?)*
Democracy, if we can't agree, Victor Zangla
_

---

## 2. Scrum Process

### Sprint Length and Dates

| Sprint | Start | End | Review / Retro date |
|--------|-------|-----|---------------------|
| 1 | 11/2 | 11/8 | 11/9 |
| 2 | 11/9 | 11/15 | 11/16 |
| 3 | 11/16 | 11/29 | 11/30 |
| 4 | 11/30 | 12/6 | 12/7 |
| 5 | 12/7 | presentation day | presentation day | 

### Meetings

| Meeting | When |
|---------|------|
| Daily standup | Wed/Fri |
| Sprint planning | Mon |
| Sprint review | Mon |
| Sprint retrospective | Mon |


_

### Definition of Ready

*A backlog item may be pulled into a sprint only when:*

- [ ] it is written as a user story
- [ ] it has acceptance criteria
- [ ] it has an estimate

### Definition of Done

*An item is done only when:*

- [ ] code is reviewed and approved by at least one teammate
- [ ] all tests pass in CI
- [ ] merged to `main`
- [ ] works in the deployed build
- [ ] the issue is closed
- [ ]

### Estimation

**Method:** *(story points, t-shirt sizes, hours)*
Story points
**Scale:** *(e.g., 1, 2, 3, 5, 8, 13)*
1, 2, 3, 5, 8, 13, ?
_

### Backlog and Board

**Where the backlog lives:** *(e.g., GitHub Projects board, link here)*
Backlog lives in Projects board

**Board columns:** *(e.g., To Do → In Progress → In Review → Done)*

_

---

## 3. Communication

### Primary Channel

**Channel:** *(Discord, Slack, GroupMe, ...)* Text

**Expected response time:** *(e.g., within 12 hours on weekdays)* 2-3 hours daytime on weekdays, 12 after midnight

### What Goes Where
Scheduling, abstract ideas, or other things in text, more specifics in GitHub issues, specific coding comments in PR comments
*(What is discussed in the chat channel vs. in GitHub issues vs. in PR comments?)*
_

### Reporting Blockers or Falling Behind

*(How and how early does a member tell the team they are stuck or behind?)*
Tell them they're being stupid.
_

### Absences

*(How much notice is required? How is the absent member's work covered?)*

Shouldn't have any, but at least the day before for notice, member's work would be done by the member online later


_

---

## 4. Git and GitHub Workflow

### Branch Naming

**Format:** *(e.g., `type/issue-short-description`)*
type/short-desc

**Allowed types:** *(e.g., `feature`, `fix`, `docs`, `refactor`, `test`, `chore`)*
feature, fix, docs, refactor, test, chore
**Examples:**

-
-

### Branch Protection on `main`

- [X] No direct pushes to `main`
- [X] Required approvals before merge: Code review by another member
- [X] CI must pass before merge
- [ ] Same protection on `production`

### Commit Messages

*(Format and style, e.g., imperative mood: "Add rune puzzle validation". Do we follow Conventional Commits?)*
Short description of what was done, informal is fine

_

### Pull Requests

**Maximum size:** *(e.g., aim for under 300 changed lines)* Less than 250 changed lines

**Description template:** *(e.g., What / Why / How to test / Screenshot)*
What/Why/How to test/Screenshot/Any links to other issues

**Linking issues:** *(e.g., every PR includes `Closes #N`)*

_

### Code Review

**Review turnaround:** *(e.g., within 24 hours of being requested)*
Before the next in person session
**Who reviews what:** *(e.g., any teammate; or a rotating assignment)*
Any teammate 
_

### Merging

**Merge style:** *(merge commit, squash and merge, or rebase and merge)*
Squash and merge

**Who merges:** *(the author after approval, or the reviewer)*
Reviewer merges

**After merge:** *(e.g., delete the branch)*
Delete the branch

_

---

## 5. Code Conventions

### Naming

| Kind | Convention | Example |
|------|------------|---------|
| Variables and functions |camelCase | thisVariable|
| Classes |NormalCase |ThisClass |
| Constants |ALL CAPS| THIS_CONSTANT |
| Files | camelCase| thisFile |
| Test files |testCamelCase |testThisFile |

### Formatting

**Indentation:** *(2 spaces, 4 spaces, tabs)*
tabs

**Semicolons:** *(always / never)*
always

**Quotes:** *(single / double)*
double

**Maximum line length:** _ 150

**Tools:** *(e.g., Prettier and ESLint, with config files committed to the repo)*

_

### Project Structure

*(Where does each kind of file live?)*

```
src/
  model/        (e.g., game logic, no p5 drawing calls)
  view/         (e.g., drawing code)
  controller/   (e.g., input handling)
assets/
spec/
```

### Architecture Rules

*(e.g., game logic never calls p5 drawing functions directly, so it can be unit tested)*
All p5js drawing functions are separate, called within a logic function, not a part of it

-
-

### Comments and Documentation

*(When are comments or JSDoc required?)*

_JavaDoc comments for anything over 10 lines

### Assets

**File naming:** *(e.g., all lowercase, hyphens, no spaces)* camelCase, no spaces

**Licensing and attribution:** *(Where do we record the source and license of art, sound, and fonts we did not make?)*
Keep a licensing doc in the assets folder

_

---

## 6. Testing and Quality

**Test framework:** Jasmine

**Where tests live:** _
Separate test folder within src
**What must have tests:** *(e.g., all model code; every bug fix gets a test that reproduces it; combat and puzzle rules)*
All logic code must have unit tests
_

**Coverage expectations:** 95+%

**Continuous integration:** *(What does GitHub Actions run on each PR?)*

_

**Rule for failing CI:** *(e.g., nothing merges while CI is red)*
Code failing CI must be rewritten until it passes CI
_

**Manual playtesting:** *(Who plays the build before each sprint review, and how are bugs reported?)*
Everybody plays the build before the review, bugs are recorded in a community google Doc 
_

---

## 7. Deployment

**Where the game is deployed:** GitHub Pages, URL here

**What triggers a deploy:** *(e.g., a release PR from `main` into `production`, opened by the Scrum Master after each sprint review)*
A finished PR from main into production
**Who checks the deployed build, and when:** _
Scrum Master will check the deployed build preferably directly after deployment
---

## 8. AI Tool Usage

**Allowed tools:** _ Claude, EcoGPT

**Allowed uses:** *(e.g., code generation, tests, documentation, review)*
Code generation(maybe)
Tests
Documentation
_

**Not allowed:** _ Review

**Disclosure:** *(e.g., note AI assistance in the PR description)*
AI disclosure required in comments
_

**Responsibility:** *(e.g., whoever submits AI-generated code must understand it and is accountable for it)*
Any member who submits AI code is responsible for understanding it and explaining it to other members if something is wrong.
_

---

## 9. Working Agreements and Conflict

### Expected Effort

*(Hours per person per week.)*
Working consistently throughout class time, with at least an hour outside per week
_

### Fair Contribution

*(What counts as contributing, and how is it tracked? e.g., PRs merged, reviews done, story points completed.)*
Contributing is counted as writing new code, fixing old code, reviews, and story points completed
_

### Conflict Resolution

*(What steps do we follow when there is a disagreement or a problem with a teammate?)*

1. *(e.g., talk to the person directly)*
2. *(e.g., raise it at the retrospective)*
3. *(e.g., Scrum Master mediates)*
4. *(e.g., escalate to the instructor)*

### Missed Commitments

*(What happens when a member repeatedly misses commitments?)*
The member will be reminded of their responsibilities, and hopefully they will stop missing commitments.
_

### Amending This Constitution

*(How can this document be changed? e.g., proposed by PR, approved by team vote at a retrospective.)*
Proposed in text group chat, discussed among the group
_

---

## 10. Sign-Off

*By signing, each member agrees to follow this constitution.*

| GitHub name | Signature (type your name) | Date |
|------|----------------------------|------|
|      |                            |      |
| Victor915187     |    Victor Zangla                        |10/28/26      |
|houseknc      |Nate Houseknecht                            | 10/18/26     |
|      |                            |      |
