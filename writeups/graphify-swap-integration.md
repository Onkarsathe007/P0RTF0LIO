---
title: Graphify × SWAP Integration
date: 2026-05-26
excerpt: Graphify gives SWAP semantic priority, graph-grounded arbitration, and pre-claim coordination across the repo.
---

# Graphify × SWAP Integration

## The Insight

SWAP knows **who is touching what and when**.
Graphify knows **what things mean and why they exist**.

Right now SWAP's dependency graph is runtime-constructed from Tree-sitter parses of files being actively edited. Graphify's graph is a pre-built, semantically rich, multi-modal knowledge graph of the *entire* repo: source, docs, papers, diagrams. The integration is:

> **Graphify becomes SWAP's oracle for semantic priority.**

These are two complementary layers of the same problem:

| Layer | System | What it knows |
|---|---|---|
| Static understanding | Graphify | What symbols mean, why they exist, architectural role |
| Live coordination | SWAP + multi-agent-memo | Who owns what, conflict resolution, shared agent context |

## Three Integration Layers

### Layer 1 - Semantic Symbol Importance

**The problem with the current approach**

`symbolImportanceScore` in `negotiate.ts` counts transitive BFS dependents and normalizes by max. This is purely structural. It knows `createOrder()` has 12 dependents, but it doesn't know that function is the critical path for checkout, mentioned in 3 architecture docs, and cited in the payments design paper.

A shallow internal utility with 20 callers scores the same as an auth entrypoint with 3 callers but referenced in the security architecture doc. That's wrong.

**With Graphify**

Before scoring, query Graphify's knowledge graph for the symbol. Get back:

- **Cross-modal centrality**: how many docs, diagrams, and papers reference this node, not just how many code callers it has
- **WHY it exists**: extracted from inline comments, README sections, research papers Graphify ingested
- **Architectural criticality tags**: "core invariant", "public API boundary", "migration entrypoint", etc.

The updated formula in `negotiate.ts`:

```typescript
symbolImportanceScore = (
  structuralCentrality  * 0.4   // existing BFS transitive dependent count
  + crossModalCentrality  * 0.35  // Graphify: how many docs/diagrams reference this
  + architecturalWeight   * 0.25  // Graphify: role tag (core > boundary > internal)
)
```

This makes the 25% `symbolImportanceScore` weight in the priority formula *semantic*, not just graph-structural.

**Where it slots in:** `symbolImportanceScore()` at `negotiate.ts:20-23` - add a Graphify query call before the BFS, blend the two scores.

### Layer 2 - Graph-Grounded Justification

**The problem with the current approach**

`NegotiateResponse.justification` is a free-text string that agents self-report. The arbitration logic in `arbitrate()` ignores it entirely. It only uses the `priority` number. Justifications are currently unverifiable and unused.

**With Graphify**

When an agent sends `NEGOTIATE_RESPONSE`, it attaches a **graph-grounded justification** pulled from Graphify:

```json
{
  "justification": "Graphify: createOrder() is 2 hops from PaymentGateway (core invariant, referenced in payments-design.pdf §3.2). My task modifies 4 of its 9 transitive dependents.",
  "graphifyEvidence": {
    "symbolRole": "checkout-core-invariant",
    "documentReferences": ["payments-design.pdf §3.2", "README.md #checkout-flow"],
    "hopsFromCoreInvariant": 2
  }
}
```

The server can now *verify* the justification against Graphify rather than trusting self-reported priority scores.

**New tie-break rule**

When priorities fall within `PRIORITY_TIE_THRESHOLD`, instead of falling back to `claimedAt` timestamp, which just rewards whoever was first, fall back to **whose justification is better-grounded in the knowledge graph**: higher `graphifyEvidence.documentReferences` count, lower `hopsFromCoreInvariant`.

### Layer 3 - Pre-Claim Graph Query (new MCP tool)

**The problem with the current approach**

Agents blindly claim symbols. They don't know before claiming that `processPayment()` is semantically coupled to 6 other symbols also under contention, or that they're claiming an edge of a subgraph but not its interior, a structural inconsistency that guarantees future conflicts.

**With Graphify**

Add a new MCP tool: `query_symbol_context`.

Before claiming a symbol, an agent calls this tool and receives:

- All **semantically related symbols** in Graphify's graph, not just direct call-graph neighbors, but multi-modal semantic neighbors: symbols co-mentioned in the same doc, co-appearing in the same diagram
- **Current claim status** of those related symbols across all agents
- Whether the claim creates a **"semantic cluster conflict"**: you're claiming the edge node but the interior of that semantic cluster is owned by another agent

Agents can use this to:

1. **Widen claims proactively**: claim the whole semantic cluster before conflict, rather than cherry-picking symbols and entering negotiation for each one
2. **Yield early**: see that a semantically coupled symbol is already owned by a higher-priority agent and skip the negotiation entirely
3. **Coordinate without conflict**: split the semantic cluster at a natural boundary identified by Graphify

This is the genuinely novel contribution: **graph-aware preemptive coordination**. Conflicts are resolved before they happen, at the semantic boundary level rather than the symbol level.

**MCP tool signature:**

```typescript
tool: "query_symbol_context"
input: {
  symbolName: string;
  filePath: string;
}
output: {
  graphifyRole: string;
  semanticNeighbors: { key: SymbolKey; similarity: number; currentOwner?: string }[];
  clusterConflict: boolean;
  suggestedClaimBoundary: SymbolKey[];
}
```

## The Poincare Ball Connection

The founder referenced the **Poincare ball model**. This is directly relevant, not as a mathematical curiosity but as a practical embedding technique for code graphs.

### Why hyperbolic geometry fits code dependency trees

Code dependency trees have *exponential branching*. The number of nodes at depth `d` grows as roughly `branching_factor^d`. Euclidean space is fundamentally bad at representing this: to faithfully embed a tree with branching factor `b` and depth `d` in Euclidean space you need `O(b^d)` dimensions.

Hyperbolic space, modeled as the Poincare ball, solves this. The volume of a hyperbolic ball grows exponentially with its radius, matching the exponential growth of the tree. The entire branching structure embeds naturally in 2D or 3D hyperbolic space without distortion.

```text
Euclidean: volume grows as r²  (2D) or r³  (3D)
Hyperbolic: volume grows as e^r           <- matches tree branching
```

### The concrete feature 

Graphify embeds every symbol as a point in the Poincare ball. Distance in this space captures *both* structural, call-graph, and semantic, doc-derived, similarity simultaneously.

Key property: **nodes near the center of the Poincare ball are high-level abstractions; nodes near the boundary are leaves.** The center/periphery axis naturally encodes architectural level.

Two new signals SWAP can derive from Poincare ball embeddings:

**1. Hyperbolic centrality as importance**

A symbol's distance from the ball's center is a continuous, geometry-grounded measure of its architectural importance. This replaces the normalized BFS count in `symbolImportanceScore` with a single float from Graphify. More accurate and cheaper to compute once the graph is built.

**2. Semantic coherence score for agent claims**

Compute the **centroid of all symbols an agent currently holds** in Poincare ball space. When the agent tries to claim a new symbol, measure the hyperbolic distance from that symbol to the agent's centroid.

- **Small distance**: the new claim is semantically coherent with what the agent already owns, likely legitimate
- **Large distance**: the agent is reaching into an unrelated part of the semantic graph, flag as potential overreach, reduce `agentLoadScore`

This feeds into the priority formula as a new `semanticCoherenceScore` dimension.

```typescript
// New signal: how semantically coherent is this agent's claim portfolio?
function semanticCoherenceScore(agent: AgentRecord, newClaim: SymbolClaim): number {
  const agentCentroid = graphify.getPoincareCentroid(agent.claims.map(c => c.key));
  const claimEmbedding = graphify.getPoincareEmbedding(newClaim.key);
  const dist = hyperbolicDistance(agentCentroid, claimEmbedding);
  // Closer to centroid = more coherent = higher score
  return Math.exp(-dist);
}
```

## Demo Flow

This is the full picture of what the demo looks like end-to-end:

```text
Agent A wants to claim createOrder()
  |
  |- query_symbol_context("createOrder")
  |    Graphify returns:
  |      hyperbolicCentrality: 0.82
  |      architecturalRole: "checkout-core-invariant"
  |      semanticNeighbors: [processPayment (owned: Agent B), validateCart (free)]
  |      clusterConflict: true  <- processPayment is in the same semantic cluster
  |
  |- Agent A sees clusterConflict: true
  |    Option A: claim validateCart instead (avoids conflict entirely)
  |    Option B: proceed with createOrder(), prepare strong justification
  |
  |- Agent A claims createOrder()
  |    NEGOTIATE_REQUEST triggers
  |
  |- Both agents compute priority
  |    symbolImportanceScore now includes Graphify's cross-modal centrality
  |    semanticCoherenceScore measures Poincare distance from each agent's centroid
  |
  |- NEGOTIATE_RESPONSE includes graphifyEvidence
  |    Server verifies claims against Graphify graph
  |    Tie-break uses document reference count, not claimedAt
  |
  '- Winner takes claim with graph-grounded justification logged to multi-agent-memo
```

## Why This Is a Genuine Technical Contribution

Most integrations between tools at this level are surface-level wrappers. This is different:

- SWAP's negotiation protocol becomes **semantics-aware**, not just syntax-aware or structure-aware
- The Poincare ball coherence score is a **new primitive** for multi-agent coordination. It doesn't exist anywhere today
- Pre-claim conflict avoidance via semantic cluster detection reduces negotiation churn in a way that scales: as the codebase grows, structural graphs get noisier, but semantic graphs stay meaningful
- The `graphifyEvidence` on justifications makes agent decisions **auditable and debuggable**. You can replay any negotiation and understand why the winner won

This is complementary stack, not competing stack.
