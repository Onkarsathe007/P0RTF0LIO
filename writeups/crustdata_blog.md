---
title: I built the missing layer on top of Crustdata's API
date: 2026-05-30
excerpt: The gap I kept hitting: every existing way to plug Crustdata into an agent is pull-only —> search, enrich, fetch. Nothing turns the real-time data into a *trigger*..
---

# I built the missing layer on top of Crustdata's API

Crustdata is a real-time B2B data company. Their API gives you live company data, job
postings, people profiles, social posts — all fresh, all queryable. Their pitch is that
they're building "the gateway to the internet for agentic apps."

If you want to drive Crustdata from an AI agent today, you reach for one of the existing
integrations — the community MCP server, or a toolkit like Composio, Zapier, or Merge. They
expose Crustdata's endpoints as agent tools. Every one of them is request/response: search,
enrich, fetch. You ask, it answers.

None of them watch anything.

That gap — between *having* real-time data and *acting on* real-time data — is the entire
problem I spent the last few days solving. The result is **Tripwire**: a signal-driven AI
SDR agent that runs natively inside Claude, built as my own MCP server on Crustdata's REST
API.

---

## The problem with outbound sales

Timing is everything in outbound. The moment a company raises a round, the budget is fresh
and the mandate is real. The moment a new VP of Sales joins, they spend their first 90 days
re-evaluating every vendor. The moment a company opens five sales roles at once, they're
scaling a motion that's about to break on data quality.

These windows are short. Most SDR tools miss them entirely because they work static lists on
fixed cadences — a weekly batch, a monthly refresh, a cron that doesn't know what just
changed.

The data that says *"this company is ready right now"* exists. It just isn't wired to
anything.

```mermaid
flowchart LR
    A[Company raises Series A] -->|3 weeks pass| B[SDR batch runs]
    B --> C[Outreach sent]
    C --> D[Budget already allocated]
    style D fill:#ff6b6b,color:#fff

    E[Company raises Series A] -->|minutes pass| F[Tripwire detects signal]
    F --> G[Claude researches account]
    G --> H[Outreach sent in the window]
    H --> I[Budget is fresh]
    style I fill:#51cf66,color:#fff
```

The difference isn't the data. It's whether anything is *watching*.

---

## What the existing tooling gives you

The community MCP server for Crustdata is representative of the whole ecosystem. Wire it
into Claude and you get a set of data tools like these:

```mermaid
mindmap
  root((Existing Crustdata<br/>agent tooling))
    search_companies
    enrich_company
    search_people
    enrich_person
    search_jobs
    get_social_posts
    web_search
```

These are excellent primitives. But they're all pull. You ask, they answer. Nothing
subscribes. Nothing watches. Nothing fires when something changes.

Crustdata's Watcher API *can* push a webhook when a condition fires — that's their real-time
backbone. But none of the agent integrations surface it as a tool. There's no path from "a
condition changed" to "the agent did something." The trigger layer is missing, across the
board.

---

## What Tripwire is

Tripwire is my own MCP server, written directly on Crustdata's REST API, plus a Claude
skill that orchestrates it. I didn't extend anyone else's MCP — I wrote my own so I could
add the one thing the ecosystem lacks.

**The MCP server** exposes the usual data wrappers (search companies, search jobs, search
people, get social posts) — but the two tools that matter are the ones nothing else has:
- `find_buying_signals(icp)` — diffs Crustdata's live data against a stored snapshot,
  returns ranked signals with a score and a *why*. This is the trigger layer.
- `research_account(domain)` — composes four Crustdata calls into one structured brief so
  Claude reasons about the account, not the plumbing.

**The Claude skill** is a playbook that tells Claude how to run the loop: detect → triage →
research → qualify → pick the decision maker → draft outreach tied to the exact trigger.

So the division of credit is honest: Crustdata's API is the eyes — real-time, fresh, theirs.
The reflexes — the signal engine that turns a change in that data into an action — are what
I built.

```mermaid
flowchart TD
    A[ICP input] --> B[find_buying_signals]
    B --> C{Signal score ≥ 60?}
    C -->|No| D[Skip — log reason]
    C -->|Yes| E[research_account]
    E --> F[Claude: qualify + score intent]
    F --> G{Disqualification check}
    G -->|Fails| H[Skip — explain why]
    G -->|Passes| I[Claude: pick decision maker]
    I --> J[Claude: draft outreach]
    J --> K[Prospect card output]

    style B fill:#339af0,color:#fff
    style E fill:#339af0,color:#fff
    style F fill:#7950f2,color:#fff
    style I fill:#7950f2,color:#fff
    style J fill:#7950f2,color:#fff
    style K fill:#51cf66,color:#fff
    style D fill:#868e96,color:#fff
    style H fill:#868e96,color:#fff
```

Blue boxes are Crustdata data calls. Purple boxes are Claude reasoning. The agent decides
what to fetch based on what it finds — that's what makes it agentic rather than a script.

---

## The signal engine

The core of Tripwire is a diff. Every run, it fetches fresh data from Crustdata, compares
it to a snapshot of what it saw last time, and emits a `Signal` for anything that changed.

```mermaid
flowchart LR
    subgraph Now["Live data (Crustdata)"]
        A1[open_sales_jobs: 5]
        A2[last_funding_round: Series A]
        A3[vp_of_sales: Sarah Chen]
    end

    subgraph Before["Snapshot (last run)"]
        B1[open_sales_jobs: 0]
        B2[last_funding_round: null]
        B3[vp_of_sales: null]
    end

    Now -->|diff| C[Signal engine]
    Before -->|diff| C

    C --> D[hiring_surge — score 70]
    C --> E[funding — score 75]
    C --> F[exec_change — score 85]

    style D fill:#fd7e14,color:#fff
    style E fill:#f59f00,color:#fff
    style F fill:#e03131,color:#fff
```

Three signals from one company in a single diff. Each has a score, a type, and a *why*
that Claude uses to decide the email angle.

---

## How signals are scored

Not all buying signals are equal. The score encodes a thesis about what actually predicts
a deal.

```mermaid
flowchart LR
    A[exec_change] -->|score: 85| D[Reason: authority + mandate + 90-day window]
    B[funding] -->|score: 75| E[Reason: budget unlocked — no named buyer yet]
    C[hiring_surge] -->|score: 50 + 4 per role, cap 74| F[Reason: scaling pain — no budget or DM]

    style A fill:#e03131,color:#fff
    style B fill:#f59f00,color:#fff
    style C fill:#fd7e14,color:#fff
    style D fill:#f1f3f5
    style E fill:#f1f3f5
    style F fill:#f1f3f5
```

A new VP of Sales is the strongest signal because she brings three things at once: the
authority to buy, a mandate to change the stack, and a finite window to do it (the first 90
days). Funding only unlocks budget. A hiring surge signals scaling pain, but there's no
decision maker attached.

Stacking — when a company fires multiple signals at once — is the agent's job, not the
score's. Each signal is scored independently. Claude sees the cluster and reasons about the
compounding.

---

## The Signal contract

The architectural decision I'm most pleased with: the `Signal` dataclass is the interface
between *how a signal arrives* and *what the agent does with it*.

```mermaid
flowchart TD
    A[Polling diff\ncurrent path] --> C[Signal\ntype · domain · payload\nscore · why · source]
    B[Crustdata Watcher\nwebhook push\nPhase 5] --> C
    C --> D[research_account]
    D --> E[qualify]
    E --> F[draft outreach]
    F --> G[prospect card]

    style C fill:#339af0,color:#fff
    style A fill:#51cf66,color:#fff
    style B fill:#51cf66,color:#fff
```

Today, signals come from a diff. Tomorrow, they come from a real Crustdata Watcher webhook.
The downstream reasoning — Claude researching the account, picking the contact, drafting the
email — doesn't change. `Signal.source` is the only field that differs.

This is what I mean by decoupled. The agent is written against the contract, not the
delivery mechanism.

---

## Signal-aware branching

The skill doesn't treat all signals the same. The email angle is derived from *why* the
company is hot, not just *that* it is.

```mermaid
flowchart TD
    A[Top signal type?]
    A -->|exec_change| B[Lead with: new leader's mandate\nand the 90-day window]
    A -->|funding| C[Lead with: fresh budget\nand the growth mandate]
    A -->|hiring_surge| D[Read the JDs first\nthen lead with: scaling pain]
    A -->|cluster| E[Lead with strongest\nfold others in as reinforcers]

    B --> F[Draft]
    C --> F
    D --> F
    E --> F

    style A fill:#7950f2,color:#fff
    style F fill:#51cf66,color:#fff
```

This is the thing that makes the output unreplicable by a template. A model generating
generic cold email will say "congrats on your Series A" and pivot to a pitch. Naming the
*implication* — the specific problem that event creates right now — requires reasoning over
fresh, multi-source data. Which is the entire Crustdata + Claude thesis.

---

## The real-time path: Watcher webhooks

Phase 5 of the build wires in Crustdata's Watcher API — the true real-time path. Instead
of polling on a schedule, Crustdata pushes a webhook the moment a condition fires.

```mermaid
sequenceDiagram
    participant C as Crustdata Watcher
    participant W as Tripwire webhook receiver
    participant S as Signal engine
    participant R as research_account
    participant Claude

    C->>W: POST /webhook/crustdata\n{event_type: exec_change, company: Acme, person: Sarah Chen}
    W->>W: verify HMAC signature
    W->>S: parse_payload() → Signal(source=watcher, score=85)
    S->>R: research_account(acme.com)
    R-->>Claude: account brief
    Claude->>Claude: qualify + pick DM + draft
    Claude-->>W: prospect card
    W-->>C: 200 OK {status: processed}
```

The webhook receiver (`FastAPI`) parses the payload, validates the signature, maps it to
our `Signal` contract, and hands off to the same research → qualify → draft loop. Nothing
in Claude's reasoning layer knows or cares whether the signal came from a poll or a push.

---

## What the output looks like

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Acme Corp  ·  120 ppl  ·  B2B SaaS  ·  SF
  Why now (85/100): New VP Sales 1mo ago,
  Series A 3wks ago, 5 open AE roles.
  Contact: Sarah Chen — VP of Sales
  Signals: exec_change(85) · funding(75) · hiring_surge(70)

  > Hi Sarah — saw you joined Acme as VP of Sales
  > 1 month ago, right as the Series A closed and
  > the team started scaling. That 0→1 outbound
  > phase with 5 AEs ramping is exactly when data
  > quality decides whether the motion holds...

  Reasoning: called find_buying_signals → 3-signal
  cluster → research_account confirmed exec_change
  within intent window (tenure 1mo); led with
  exec_change framing.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

The reasoning line is the most important part. It makes the agentic behavior *visible* — a
reviewer can see which tools fired and why the email took the angle it did. It's not a black
box.

---

## Architecture in one diagram

```mermaid
flowchart TD
    subgraph Input
        A[ICP definition]
        B[Crustdata Watcher push]
    end

    subgraph Tripwire MCP["Tripwire MCP (ours)"]
        C[find_buying_signals\ndiff engine + snapshot store]
        D[research_account\n4-call composition]
    end

    subgraph CrustdataMCP["Crustdata REST API"]
        E[Company API]
        F[Job API]
        G[Person API]
        H[Social Post API]
    end

    subgraph Claude["Claude (IDE's model — no API key)"]
        I[Orchestrate]
        J[Qualify + score intent]
        K[Pick decision maker]
        L[Draft outreach]
    end

    subgraph Output
        M[Prospect card\nwhy now · contact · email draft · reasoning trace]
    end

    A --> C
    B --> C
    C --> D
    D --> E & F & G & H
    C --> I
    D --> I
    I --> J --> K --> L --> M

    style Tripwire fill:#e7f5ff
    style Claude fill:#f3f0ff
    style CrustdataMCP fill:#fff9db
    style Output fill:#ebfbee
```

---

## What I'd build next

The agent is one instance of a broader pattern: **signal → research → action**. The signal
and the action are domain-specific (sales here), but the architecture isn't.

The next thing I'd build at Crustdata is a generic "signal → action" framework that other
customers can configure without writing code — point it at a Watcher subscription, describe
the action in plain language, and Claude figures out the rest. The data layer is already
there. The reasoning layer is already there. The missing piece is the configuration surface.

That's the product the tweet is pointing at when it says "you will define and build this
new category of software."

---

## Running it yourself

```bash
git clone https://github.com/kedarvartak/tripwire
cd tripwire
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Full demo — no keys needed:
rm -f tripwire/fixtures/snapshot_state.json
python -m tripwire.server --demo

# Test suite:
python -m pytest tests/ -v
```

Set `CRUSTDATA_API_TOKEN` to run on live data. Everything else stays the same.

---

*Built in a few days. 67 tests. Zero keys to try.*
*Crustdata's API is the eyes. I built the reflexes.*
