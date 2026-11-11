# Sprint Planning Report: Sprint _

*Copy this file into `scrum/planning/` using your team's naming format. Fill in every field. Replace the italic guidance with your team's information.*

---

## 1. Meeting Details

**Date:**  11/02/2026

**Scrum Master:**  Nate Houseknecht

**Attendees:**  Victor, Nate, Mamadou, Z

**Absent:** _

---

## 2. Sprint Goal

*One or two sentences describing a playable outcome, not a list of tickets. e.g., "A player can create a character and enter the first dungeon."*

A player can choose their character class (i.e. ice, fire, earth), and begin to attack enemies with basic spells

---

## 3. Capacity and Velocity

**Sprint dates:** 11/11/2026 to 11/18/2026

**Velocity last sprint (points completed):** 9

**Average velocity so far:** 9

**Known absences or reduced availability this sprint:** NONE

**Points committed this sprint:** 
-Player Health and Permadeath keep loop 3
-Enemy Defeated 3
-Enemy Creation 3
-Basic Spells 3

**Why this commitment is realistic:** *(Compare it to your velocity and capacity. If you are committing more than last sprint's velocity, explain why.)*

Last sprint, we underestimated our abilities, and shot too low, so this time we are committing to slightly more in hopes that we fill out our time. 

---

## 4. Committed Backlog Items
-Player Health and Permadeath Keep Loop
-Enemy Defeated
-Enemy Creation
-Basic Spells

*Every item listed here must meet the Definition of Ready in your constitution. Items should be taken from the top of the product backlog in priority order. If you skipped a higher-priority item, explain why under "Notes".*

| Issue # | User story | Estimate | Owner | Ready? |
|---------|------------|----------|-------|--------|
|  #3    | As a player, I want my run to end immediately when my health reaches zero, so that dungeon runs carry high stakes. |1 day| Z | [Y]    |
|  #5    |As a player, I want enemies to die when I defeat them, so that they are not in the way and I know I have defeated them| 1 day | Victor | [Y]    |
|  #60   | As a player, I want to have enemies that attack me so that the game feels difficult and has a purpose|3 days| Victor | [Y]    |
|  #61   | As a player, I want to be able to cast spells, so that I can damage enemies and progress in the game |  3 days  | Mamadou      | [Y]    |
|         |            |          |       | [ ]    |

**Total points:** _
12
**Notes:** _
Nate will be doing art to facilitate all four of these points
---

## 5. Task Breakdown

*Break each story into tasks. Include tasks for writing tests and reviewing PRs, not only coding.*

### Issue #1: *Permadeath and Dungeon Keep Loop*

- [Players should have a visible health bar]
- [The player's health bar should decrease when they are hit by an enemy]
- [When the health bar is empty, the player should die and have to restart from the last village]
- [Draw death screen]

### Issue #19: *Enemy Defeated*

- [Enemies should have health bars that appear above them the first time they are hit]
- [When the enemy's health bar reaches zero, it should die and disappear]
- [When the enemy dies, they should drop some kind of loot]
- [Draw enemy death animation]

### Issue #23: *Enemy Creation*

- [Enemies should attempt to follow the player]
- [Enemies should attempt to attack the player]
- [Enemies should be able to do damage to the player]
- [Draw enemies]

### Issue #61: *Basic Spells*
- [Players should be able to choose a class]
- [Players should be able to commit a melee attack]
- [Players should be able to do a ranged attack]
- [Players should be able to create a blockade]
- [A player's blockade should inflict a status effect upon the enemy]
- [Draw all spells and melee attacks]

---

## 6. Work Distribution

| Member | Stories owned | Points |
|--------|---------------|--------|
| Mamadou Cissoko|Basic Spells         |    3   |
| Z wright      |Enemy Creation and Enemy Defeated      |   6    |
| Victor       | Permadeath and Keep Loop         |    3   |
| Nate      | Art for all four points    |   3    |

*If the work is not balanced, explain why:*

_The enemy creation and defeated animation is more complicated, but Victor is the strongest programmer among us so we believe he will be able to handle this.

---

## 7. Stories Split or Deferred

*Did you split any stories that were too large for one sprint, or move stories back to the backlog? List them and say why.*

_We did not split any stories for this current sprint.

---

## 8. Retrospective Follow-Through

*Which action items from last sprint's retrospective are part of this sprint's plan, and how? (Sprint 1: write "n/a")*

| Action item | How it shows up in this sprint |
|-------------|--------------------------------|
|      Communication of all non explicit work    |  Any time someone works on something that was not specifically assigned to them, they will inform the group            |
|             |                                |

---

## 9. Risks and Dependencies

*What might stop the team from meeting the sprint goal? Which stories depend on others being finished first?*

The only thing tha tmight stop our team from meeting the sprint goal is if something is more complicated than we orginally expected. We believe that we have all of the items and skills we needto complete all of these goals on time. As of now, only the player's health and the enemies' attacks are dependent on each other, with player health needing to be finished first.

---

## 10. Checklist

- [X] Sprint goal written
- [X] Every committed story meets the Definition of Ready
- [X] Every story has an owner
- [X] Board updated: committed stories in the sprint, tasks created
- [X] Commitment compared to velocity
- [X] Report committed to `scrum/planning/` via pull request
